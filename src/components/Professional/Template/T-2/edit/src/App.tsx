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

const POLL_INTERVAL = 8000;
const POLL_MAX_WAIT = 300000;

export default function EditTemp_2() {
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData, publishProfessionalTemplate } = useTemplate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [componentStates, setComponentStates] = useState<ComponentStates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pollElapsed, setPollElapsed] = useState(0);

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

  useEffect(() => {
    if (!userId || !draftId) return;

    let elapsed = 0;
    let cancelled = false;

    const tryFetch = async () => {
      try {
        const response = await fetch(`https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod/api/professional/${userId}/${draftId}?template=template-2`);

        if (!response.ok) {
          if (response.status === 404 && elapsed < POLL_MAX_WAIT) {
            if (!cancelled) {
              elapsed += POLL_INTERVAL;
              setPollElapsed(elapsed);
              setTimeout(tryFetch, POLL_INTERVAL);
            }
            return;
          }
          toast.error('Failed to load template data');
          if (!cancelled) setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (!cancelled) {
          setFinalTemplate(data);
          setAIGenData(data);
          setComponentStates(data.content || {});
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error('Error loading template data');
          setIsLoading(false);
        }
      }
    };

    tryFetch();
    return () => { cancelled = true; };
  }, [userId, draftId, setFinalTemplate, setAIGenData]);

  const handleDarkModeToggle = useCallback((isDark: boolean) => {
    setIsDarkMode(isDark);
  }, []);

  if (isLoading) {
    const minutes = Math.floor(pollElapsed / 60000);
    const seconds = Math.floor((pollElapsed % 60000) / 1000);
    const isPolling = pollElapsed > 0;
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-yellow-50 to-amber-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isPolling ? "AI is building your website..." : "Loading your profile..."}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {isPolling
              ? "Our AI is generating your professional website. This usually takes 1-3 minutes. Please stay on this page."
              : "Fetching your data, please wait."}
          </p>
          {isPolling && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-700 text-xs font-medium">
                Time elapsed: {minutes > 0 ? `${minutes}m ` : ""}{seconds}s &nbsp;•&nbsp; Checking every 8 seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
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
        <section id="certification">
        <Certifications
          certData={componentStates.certificationsContent}
          onStateChange={createStateChangeHandler('certificationsContent')}
          userId={AIGenData.userId}
          professionalId={AIGenData.professionalId}
          templateSelection={AIGenData.templateSelection}
        /></section>

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