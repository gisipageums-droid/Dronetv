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
import { EVENTS_API, LAMBDA } from '../../../../../lib/apiConfig';
import { authHeader } from '../../../../../lib/authService';

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
  const [contentLoaded, setContentLoaded] = useState(false);
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
            EVENTS_API ? `${EVENTS_API}/events?submissionId=${draftId}&userId=${userId}&templateId=2` : `${LAMBDA.eventTemplateLoad}/events?submissionId=${draftId}&userId=${userId}&templateId=2`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // Admin editing an already-published event: draftId here is
          // actually the eventId. The self-hosted backend never implements
          // /event-content — that path is a leftover from the old Lambda
          // API. Use the real admin-capable endpoint instead, which
          // requires a Bearer token.
          response = await fetch(
            EVENTS_API ? `${EVENTS_API}/event/${draftId}` : `${LAMBDA.eventTemplateContent}/${draftId}/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(EVENTS_API ? authHeader() : {}),
              },
            }
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const raw = await response.json();
        // /event/{eventId} returns a flat record with templateContent,
        // not the {data: {..., content}} shape /events (AIgen) returns —
        // normalize so the rest of this function can treat them the same.
        const data = EVENTS_API && isAIgen !== "AIgen"
          ? { data: { ...raw, content: raw.templateContent } }
          : raw;

        // Set both AIGenData and finalTemplate similar to EventTemplate1.tsx
        setFinalTemplate(data.data);
        setAIGenData(data.data);

        // Different event records store section content at different
        // nesting depths — some have it directly under data.data.content
        // (header, hero, ...), others wrap it one level deeper under
        // data.data.content.content alongside record metadata (older
        // records, seen on events created before some backend change).
        // Assuming a fixed depth per isAIgen branch previously left
        // sections empty for records shaped the other way — which still
        // let Publish silently overwrite real content with blank defaults.
        // Detect the right level by checking which one actually looks like
        // section content instead of assuming.
        const looksLikeSections = (obj: any) =>
          obj && typeof obj === "object" &&
          ("header" in obj || "hero" in obj || "speakersData" in obj || "sponsorsData" in obj);
        const rawContent = data.data?.content;
        const sectionContent = looksLikeSections(rawContent)
          ? rawContent
          : looksLikeSections(rawContent?.content)
          ? rawContent.content
          : null;

        if (sectionContent && Object.keys(sectionContent).length > 0) {
          setComponentStates(sectionContent);
          setContentLoaded(true);
        } else {
          setError("Could not load the event's existing content. Please refresh and try again before publishing.");
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
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-status-info"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
          <p className="text-ink-paragraph mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-status-info text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!AIGenData || !AIGenData.content) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-ink-paragraph">
            The requested event page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-main transition-colors duration-300">
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
      {contentLoaded ? (
        <Publish />
      ) : (
        <div className="fixed bottom-20 right-10 z-50 bg-ink-caption text-white font-semibold py-3 px-6 rounded-full shadow-lg cursor-not-allowed" title="Waiting for the event's existing content to load before publishing is enabled">
          Loading content…
        </div>
      )}

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