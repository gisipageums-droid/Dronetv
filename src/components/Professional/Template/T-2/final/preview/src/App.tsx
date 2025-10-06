import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTemplate } from "../../../../../../context/context";
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Testimonials } from './components/SimpleTestimonials';
import { Skills } from './components/Skills';
import { Toaster } from "./components/ui/sonner";
import { Services } from './components/services';

// Define types for the component states
interface ComponentStates {
  heroContent?: any;
  aboutContent?: any;
  certificationsContent?: any;
  clientsContent?: any;
  skillContent?: any;
  projectContent?: any;
  testimonialContent?: any;
  contactContent?: any;
  footerContent?: any;
  headerContent?: any; // Added missing header property
  serviceContent?: any; // Added missing serviceContent property
}

interface AIGenData {
  professionalId: string;
  userId: string;
  submissionId: string;
  templateSelection: string;
  content?: ComponentStates;
}

export default function EditTemp_2() {
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData, publishProfessionalTemplate } = useTemplate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [componentStates, setComponentStates] = useState<ComponentStates>({});
  const [isLoading, setIsLoading] = useState(true);

  const { professionalId, userId } = useParams();

  // Memoize the collectComponentState function with proper dependencies
  const collectComponentState = useCallback((componentName: keyof ComponentStates, state: any) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []); // Empty dependency array since we're using functional update

  // Memoize callback creators to prevent recreation on every render
  const createStateChangeHandler = useCallback((componentName: keyof ComponentStates) => {
    return (state: any) => collectComponentState(componentName, state);
  }, [collectComponentState]);

  // Update finalTemplate whenever componentStates changes
  useEffect(() => {
    setFinalTemplate((prev: any) => ({
      ...prev,
      professionalId: AIGenData.professionalId,
      userId: AIGenData.userId,
      submissionId: AIGenData.submissionId,
      templateSelection: AIGenData.templateSelection,
      content: {
        ...prev.content,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, AIGenData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch template data
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://xgnw16tgpi.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}?template=template2`);

        if (response.ok) {
          const data = await response.json();

          setFinalTemplate(data);
          setAIGenData(data);
          
          if (data.content) {
            setComponentStates(data.content);
          } else {
            toast.error("No content found in response");
            setComponentStates({});
          }
        } else {
          console.error('Failed to fetch template data:', response.status);
          toast.error('Failed to load template data');
        }
      } catch (error) {
        console.error('Error fetching template data:', error);
        toast.error('Error loading template data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId && professionalId) {
      fetchTemplateData();
    }
  }, [userId, professionalId, setFinalTemplate, setAIGenData]);

  const handleDarkModeToggle = useCallback((isDark: boolean) => {
    setIsDarkMode(isDark);
  }, []);

  const handlePublish = useCallback(() => {
    if (Object.keys(componentStates).length === 0) {
      toast.error("No content to publish");
      return;
    }
    publishProfessionalTemplate();
  }, [componentStates, publishProfessionalTemplate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading template data...</p>
        </div>
      </div>
    );
  }

  // console.log('Current component states:', componentStates);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header 
        onDarkModeToggle={handleDarkModeToggle}
        headerData={componentStates.headerContent}
        onStateChange={createStateChangeHandler('headerContent')}
        userId={AIGenData.userId}
        publishedId={AIGenData.professionalId}
        templateSelection={AIGenData.templateSelection}
      />

      {/* Publish Button */}
      <div className="fixed top-[9.5rem] left-4 z-50">
        <button
          onClick={handlePublish}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Publish Changes
        </button>
      </div>

      <main>
        <Hero
          heroData={componentStates.heroContent}
          onStateChange={createStateChangeHandler('heroContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* About Section */}
        <About
          aboutData={componentStates.aboutContent}
          onStateChange={createStateChangeHandler('aboutContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        <Skills 
          skillsData={componentStates.skillContent}
          onStateChange={createStateChangeHandler('skillContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />
<Services
          servicesData={componentStates.serviceContent}
          onStateChange={createStateChangeHandler('serviceContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />
        <Projects 
          projectsData={componentStates.projectContent}
          onStateChange={createStateChangeHandler('projectContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />
        
        {/* Certifications Section */}
        <Certifications
          certData={componentStates.certificationsContent}
          onStateChange={createStateChangeHandler('certificationsContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* Clients Section */}
        <section id="clients">
          <Clients
            clientsData={componentStates.clientsContent}
            onStateChange={createStateChangeHandler('clientsContent')}
            userId={AIGenData.userId}
            publishedId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <Testimonials
            testimonialsData={componentStates.testimonialContent}
            onStateChange={createStateChangeHandler('testimonialContent')}
            userId={AIGenData.userId}
            publishedId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Contact Section */}
        <Contact 
          contactData={componentStates.contactContent}
          onStateChange={createStateChangeHandler('contactContent')}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />
      </main>

      {/* Footer */}
      <Footer 
        footerData={componentStates.footerContent}
        onStateChange={createStateChangeHandler('footerContent')}
        userId={AIGenData.userId}
        publishedId={AIGenData.professionalId}
        templateSelection={AIGenData.templateSelection}
      />
      
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </div>
  );
}