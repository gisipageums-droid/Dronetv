import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTemplate } from '../../../../context/context'
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { EventsSection } from './components/EventsSection';
import { HighlightsSection } from './components/HighlightsSection';
import { SpeakersSection } from './components/SpeakersSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ExhibitorsSection } from './components/ExhibitorsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import Publish from './components/Publish';
import { Footer } from './components/FooterSection';

// Define types for the component states
interface ComponentStates {
  navigationContent?: any;
  heroContent?: any;
  eventsContent?: any;
  highlightsContent?: any;
  speakersContent?: any;
  scheduleContent?: any;
  exhibitorsContent?: any;
  galleryContent?: any;
  contactContent?: any;
  footerContent?: any;
}

interface AIGenData {
  draftId?: string;
  userId?: string;
  status?: string;
  templateSelection?: string;
  templateId?: string;
  eventType?: string;
  createdAt?: string;
  updatedAt?: string;
  formData?: object;
  uploadedFiles?: object;
  isPublished?: boolean;
  content?: ComponentStates;
  aiGenerated?: boolean;
  eventId?: string;
  generationMetadata?: object;
  submissionId?: string;
}

export default function Edit_event_t2() {
  const { setFinalTemplate, AIGenData, setAIGenData } = useTemplate();
  const [componentStates, setComponentStates] = useState<ComponentStates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [hasFetched, setHasFetched] = useState(false);

  const { draftId, userId, isAIgen } = useParams();

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
      draftId: AIGenData.draftId,
      userId: AIGenData.userId,
      status: AIGenData.status,
      templateSelection: AIGenData.templateSelection,
      templateId: AIGenData.templateId,
      eventType: AIGenData.eventType,
      eventId: AIGenData.eventId,
      submissionId: AIGenData.submissionId,
      content: {
        ...prev.content,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, AIGenData]);

  // Scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'events', 'highlights', 'speakers', 'schedule', 'exhibitors', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced fetch function with same logic as EventTemplate1.tsx
  const fetchTemplateData = useCallback(
    async (draftId: string, userId: string, isAIgen: string) => {
      try {
        setIsLoading(true);
        setError(null);
        let response;

        if (isAIgen === "AIgen") {
          response = await fetch(
            `https://2kmz6d0aqa.execute-api.ap-south-1.amazonaws.com/prod/events?submissionId=${draftId}&userId=${userId}&templateId=2`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // Replace with your actual API for non-AIgen case
          response = await fetch(
            `https://2lksnliog8.execute-api.ap-south-1.amazonaws.com/prod/${draftId}/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Set both AIGenData and finalTemplate similar to EventTemplate1.tsx
        setFinalTemplate(data.data);
        setAIGenData(data.data);

        // Initialize component states with fetched data
        if (data.data.content) {
          setComponentStates(data.data.content);
        }

        setHasFetched(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching template data:", error);
        if (error instanceof Error) setError(error.message);
        else setError("Something went wrong please try again!");
        setIsLoading(false);
        toast.error("Error loading template data");
      }
    },
    [setFinalTemplate, setAIGenData] // Removed componentStates from dependencies
  );

  useEffect(() => {
    if (draftId && userId && isAIgen && !hasFetched) {
      fetchTemplateData(draftId, userId, isAIgen);
    } else if (!draftId || !userId || !isAIgen) {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [draftId, userId, isAIgen, fetchTemplateData, hasFetched]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!AIGenData || !AIGenData.content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-gray-600">
            The requested event page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        navigationData={componentStates?.navigationContent}
        onStateChange={createStateChangeHandler('navigationContent')}
      />

      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSection
            heroData={componentStates?.heroContent}
            onStateChange={createStateChangeHandler('heroContent')}
          />
        </section>

        {/* Events Section */}
        <section id="events">
          <EventsSection
            eventsData={componentStates?.eventsContent}
            onStateChange={createStateChangeHandler('eventsContent')}
          />
        </section>

        {/* Highlights Section */}
        <section id="highlights">
          <HighlightsSection
            highlightsData={componentStates?.highlightsContent}
            onStateChange={createStateChangeHandler('highlightsContent')}
          />
        </section>

        {/* Speakers Section */}
        <section id="speakers">
          <SpeakersSection
            speakersData={componentStates?.speakersContent}
            onStateChange={createStateChangeHandler('speakersContent')}
            userId={AIGenData.userId}
          />
        </section>

        {/* Schedule Section */}
        <section id="schedule">
          <ScheduleSection
            scheduleData={componentStates?.scheduleContent}
            onStateChange={createStateChangeHandler('scheduleContent')}
          />
        </section>

        {/* Exhibitors Section*/}
        <section id="exhibitors">
          <ExhibitorsSection
            exhibitorsData={componentStates?.exhibitorsContent}
            onStateChange={createStateChangeHandler('exhibitorsContent')}
            userId={AIGenData.userId}
          />
        </section>

        {/* Gallery Section */}
        <section id="gallery">
          <GallerySection
            galleryData={componentStates?.galleryContent}
            onStateChange={createStateChangeHandler('galleryContent')}
            userId={AIGenData.userId}
          />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>

        <Footer
          footerData={componentStates?.footerContent}
          onStateChange={createStateChangeHandler('footerContent')} />

      </main>

      {/* Publish Component */}
      <Publish />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999999 }}
      />
    </div>
  );
}