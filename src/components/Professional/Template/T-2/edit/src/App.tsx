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

// Define types for the component states
interface ComponentStates {
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [AIGenData, setAIGenData] = useState<AIGenData>({
  publishedId: "",
  userId: "",
  draftId: "",
  templateSelection: "",
  content: {}
});

  const [componentStates, setComponentStates] = useState<ComponentStates>({});

  const { userId, draftId } = useParams();
  // Memoize the collectComponentState function
  const collectComponentState = useCallback((componentName: keyof ComponentStates, state: any) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  useEffect(() => {
    // Apply or remove dark class on document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Simulate fetching data from backend/API
    const fetchTemplateData = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod/api/professional/${userId}/${draftId}?template=template-2`);
        if (response.ok) {
          const data = await response.json();
          setAIGenData(prev => ({
            ...prev,
            ...data,
            content: data.content || {}
          }));
          // Set initial component states from fetched data
          if (data.content) {
            setComponentStates(data.content);
            console.log("Fetched content:", data.content);
          }
        }
      } catch (error) {
        console.error('Error fetching template data:', error);
        // Use default data if fetch fails
        setAIGenData(prev => ({
          ...prev,
          content: {
            about: {},
            certifications: {},
            clients: {},
            experience: {},
            // Initialize other component states
          }
        }));
      }
    };
    fetchTemplateData()
  }, [userId, draftId]);

  useEffect(() => {
    // Update AIGenData with component states when they change
    setAIGenData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        ...componentStates,
      },
    }));

    // Auto-save functionality (optional)
    const autoSave = setTimeout(() => {
      if (Object.keys(componentStates).length > 0) {
        saveTemplateData();
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(autoSave);
  }, [componentStates]);

  const saveTemplateData = async () => {
    try {
      const response = await fetch(`/api/template-data/${userId}/${draftId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...AIGenData,
          templateSelection: AIGenData.templateSelection,
          content: componentStates
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save template data');
      }

      console.log('Template data saved successfully');
    } catch (error) {
      console.error('Error saving template data:', error);
    }
  };

  const handleDarkModeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Function to handle final publish
  const handlePublish = async () => {
    try {
      await saveTemplateData();

      // Additional publish logic
      const response = await fetch(`/api/publish/${AIGenData.userId}/${AIGenData.publishedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateSelection: AIGenData.templateSelection,
          content: componentStates
        })
      });

      if (response.ok) {
        console.log('Portfolio published successfully');
        toast.success('Portfolio published successfully!');
      } else {
        toast.error('Failed to publish portfolio');
      }
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      toast.error('Error publishing portfolio. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onDarkModeToggle={handleDarkModeToggle} />

      {/* Publish Button */}
      <div className="fixed top-20 left-4 z-50">
        <button
          onClick={handlePublish}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Publish Changes
        </button>
      </div>

      <main>
        <Hero />

        {/* About Section with State Management */}
        <About
          aboutData={componentStates.about}
          onStateChange={(state) => collectComponentState('about', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.publishedId}
          templateSelection={AIGenData.templateSelection}
        />

        <Skills />
        <Projects />
        {/* Certifications Section with State Management */}
        <Certifications
          certData={componentStates.certifications}
          onStateChange={(state) => collectComponentState('certifications', state)}
          userId={AIGenData.userId}
          publishedId={AIGenData.publishedId}
          templateSelection={AIGenData.templateSelection}
        />

        {/* Clients Section with State Management */}
        <section id="clients">
          <Clients
            clientsData={componentStates.clients}
            onStateChange={(state) => collectComponentState('clients', state)}
            userId={AIGenData.userId}
            publishedId={AIGenData.publishedId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        <section id="testimonials">
          <SimpleTestimonials />
        </section>

        <Contact />
      </main>

      <Footer />
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />




    </div>
  );
}