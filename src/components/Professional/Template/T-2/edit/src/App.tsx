import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { SimpleTestimonials } from './components/SimpleTestimonials';
import { Skills } from './components/Skills';
import { Toaster } from "./components/ui/sonner";
import { useTemplate } from "../../../../../context/context"

// Define types for the component states
interface ComponentStates {
  hero?: any;
  about?: any;
  certifications?: any;
  clients?: any;
  experience?: any;
  // Add other component states as needed
}

interface AIGenData {
  publishedId: string;
  userId: string;
  draftId: string;
  templateSelection: string;
  content?: ComponentStates;
}

export default function EditTemp_2() {
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData, publishProfessionalTemplate } = useTemplate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [componentStates, setComponentStates] = useState<ComponentStates>({});

  const { userId, draftId } = useParams();

  // Memoize the collectComponentState function - same as App2.tsx
  const collectComponentState = useCallback((componentName: keyof ComponentStates, state: any) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  // Update finalTemplate whenever componentStates changes - same as App2.tsx
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
    // Apply or remove dark class on document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keep the original fetchTemplateData function from App.tsx
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod/api/professional/${userId}/${draftId}?template=template-2`);
        if (response.ok) {
          const data = await response.json();

          setFinalTemplate(data)
          setAIGenData(data);
          // Set initial component states from fetched data
          if (data.content) {
            setComponentStates(data.content);
            console.log("Fetched content:", data.content);
          }
        }
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };
    
    fetchTemplateData();
  }, [userId, draftId, setFinalTemplate, setAIGenData]);

  const handleDarkModeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Use the publishTemplate function from context - same pattern as App2.tsx
  const handlePublish = () => {
    if (Object.keys(componentStates).length === 0) {
      toast.error("No content to publish");
      return;
    }
    publishProfessionalTemplate()
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onDarkModeToggle={handleDarkModeToggle} />

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
          heroData={componentStates.hero}
          onStateChange={(state) => collectComponentState('heroContent', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* About Section with State Management */}
        <About
          aboutData={componentStates.about}
          onStateChange={(state) => collectComponentState('aboutContent', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        <Skills 
          skillsData={componentStates.skills}
          onStateChange={(state) => collectComponentState('skillContent', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        <Projects 
          projectsData={componentStates.projects}
          onStateChange={(state) => collectComponentState('projectContent', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* Certifications Section with State Management */}
        <Certifications
          certData={componentStates.certifications}
          onStateChange={(state) => collectComponentState('certificationsContent', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* Clients Section with State Management */}
        <section id="clients">
          <Clients
            clientsData={componentStates.clients}
            onStateChange={(state) => collectComponentState('clientsContent', state)}
            userId={AIGenData.userId}
            publishedId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        <section id="testimonials">
          <SimpleTestimonials 
            testimonialsData={componentStates.testimonials}
            onStateChange={(state) => collectComponentState('testimonialContent', state)}
            userId={AIGenData.userId}
            publishedId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        <Contact 
          contactData={componentStates.contact}
          onStateChange={(state) => collectComponentState('contactContent', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        />
      </main>

      <Footer 
        footerData={componentStates.footer}
        onStateChange={(state) => collectComponentState('footerContent', state)}
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