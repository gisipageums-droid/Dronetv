import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTemplate } from "../../../../../context/context";
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Services } from './components/services';
import { Testimonials } from './components/SimpleTestimonials';
import { Skills } from './components/Skills';
import { Toaster } from "./components/ui/sonner";
import Publish from './components/Publish';

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
  headerContent?: any;
  serviceContent?: any; // Added missing service property
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

  const { userId, draftId } = useParams();

  // Memoize the collectComponentState function with proper dependencies
  const collectComponentState = useCallback((componentName: keyof ComponentStates, state: any) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  // Memoize callback creators to prevent recreation on every render
  const createStateChangeHandler = useCallback((componentName: keyof ComponentStates) => {
    return (state: any) => collectComponentState(componentName, state);
  }, [collectComponentState]);
console.log("user name", AIGenData.user_name);

  // Update finalTemplate whenever componentStates changes
  useEffect(() => {
    setFinalTemplate((prev: any) => ({
      ...prev,
      professionalId: AIGenData.professionalId,
      userId: AIGenData.userId,
      user_name: AIGenData.user_name,
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

  // Fetch template data - UPDATED to handle object response properly
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod/api/professional/${userId}/${draftId}?template=template-2`);

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched template data:', data); // Debug log
          console.log('Clients content from API:', data.content?.clientsContent); // Debug log for clients data

          // Your API returns a single object, not an array
          setFinalTemplate(data);
          setAIGenData(data);

          if (data.content) {
            console.log('Setting component states:', data.content); // Debug log
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

    if (userId && draftId) {
      fetchTemplateData();
    }
  }, [userId, draftId, setFinalTemplate, setAIGenData]);

  const handleDarkModeToggle = useCallback((isDark: boolean) => {
    setIsDarkMode(isDark);
  }, []);

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

  console.log('Current component states:', componentStates); // Debug log
  console.log('Clients content in App.tsx:', componentStates.clientsContent); // Specific debug for clients

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header
        onDarkModeToggle={handleDarkModeToggle}
        headerData={componentStates.headerContent}
        onStateChange={createStateChangeHandler('headerContent')}
      />

      <main>
        <Hero
          heroData={componentStates.heroContent}
          onStateChange={createStateChangeHandler('heroContent')}
          userId={AIGenData.userId}
          professionalId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* About Section */}
        <About
          aboutData={componentStates.aboutContent}
          onStateChange={createStateChangeHandler('aboutContent')}
          userId={AIGenData.userId}
          professionalId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        <Skills
          skillsData={componentStates.skillContent}
          onStateChange={createStateChangeHandler('skillContent')}
          userId={AIGenData.userId}
          professionalId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        
                <Projects
                  projectsData={componentStates.projectContent}
                  onStateChange={createStateChangeHandler('projectContent')}
                  userId={AIGenData.userId}
                  professionalId={AIGenData.professionalId}
                  templateSelection={AIGenData.templateSelection}
                />
        {/* Services Section */}
        <Services
          servicesData={componentStates.serviceContent}
          onStateChange={createStateChangeHandler('serviceContent')}
          userId={AIGenData.userId}
          professionalId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* Certifications Section */}
        <Certifications
          certData={componentStates.certificationsContent}
          onStateChange={createStateChangeHandler('certificationsContent')}
          userId={AIGenData.userId}
          professionalId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* Clients Section */}
        <section id="clients">
          <Clients
            clientsData={componentStates.clientsContent}
            onStateChange={createStateChangeHandler('clientsContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <Testimonials
            testimonialsData={componentStates.testimonialContent}
            onStateChange={createStateChangeHandler('testimonialContent')}
          />
        </section>

        {/* Contact Section */}
        <Contact
          contactData={componentStates.contactContent}
          onStateChange={createStateChangeHandler('contactContent')}
        />
      </main>
      <Publish />

      {/* Footer */}
      <Footer
        footerData={componentStates.footerContent}
        onStateChange={createStateChangeHandler('footerContent')}
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