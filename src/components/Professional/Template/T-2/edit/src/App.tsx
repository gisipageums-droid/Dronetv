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
    const steps = [
      "Analyzing your business information...",
      "Generating color palette and design...",
      "Creating website content...",
      "Building your website structure...",
      "Adding final touches and optimizations...",
      "Your website is almost ready!",
    ];
    const activeStep = isPolling ? Math.min(Math.floor((pollElapsed / 300000) * steps.length), steps.length - 1) : 0;
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #12122a 50%, #0a0a14 100%)' }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #FFEB3B 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FFEB3B 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FFEB3B 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 0 48px rgba(251,191,36,0.45), 0 0 16px rgba(251,191,36,0.3)' }}>
                <svg className="w-12 h-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce"
                style={{ boxShadow: '0 0 12px rgba(251,191,36,0.6)' }}>
                <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isPolling ? "AI is Building Your Website" : "Loading Your Profile..."}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {isPolling ? "Please stay on this page while we craft your digital presence" : "Fetching your data, please wait."}
            </p>
          </div>

          {isPolling && (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400 font-medium">Progress</span>
                  <span className="text-yellow-400 font-semibold">{minutes > 0 ? `${minutes}m ` : ""}{seconds}s elapsed</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min(95, (pollElapsed / 300000) * 100)}%`,
                      background: 'linear-gradient(90deg, #FFEB3B, #FFA000)',
                      boxShadow: '0 0 10px rgba(251,191,36,0.6)'
                    }} />
                </div>
              </div>

              <div className="space-y-2">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isCompleted = index < activeStep;
                  return (
                    <div key={index}
                      className={`flex items-center p-3 rounded-xl border transition-all duration-500 ${isActive ? "scale-[1.02]" : ""}`}
                      style={{
                        background: isActive ? 'rgba(251,191,36,0.12)' : isCompleted ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                        borderColor: isActive ? 'rgba(251,191,36,0.4)' : isCompleted ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'
                      }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300"
                        style={{
                          background: isActive ? '#FFEB3B' : isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)',
                          boxShadow: isActive ? '0 0 12px rgba(251,191,36,0.5)' : 'none'
                        }}>
                        {isCompleted ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className={`text-xs font-bold ${isActive ? "text-gray-900" : "text-gray-500"}`}>{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-all duration-300 ${isActive ? "text-yellow-300" : isCompleted ? "text-green-400" : "text-gray-500"}`}>{step}</span>
                      {isActive && (
                        <div className="ml-auto flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!isPolling && (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"
                style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.5))' }} />
            </div>
          )}

          <p className="text-center text-gray-600 text-xs mt-6">This usually takes 1–3 minutes</p>
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