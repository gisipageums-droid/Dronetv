import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useTemplate } from '../../../../../context/context'
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
}

interface AIGenData {
  professionalId: string;
  userId: string;
  submissionId: string;
  templateSelection: string;
  content?: ComponentStates;
}

export default function Edit_event_t2() {
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData, publishProfessionalTemplate } = useTemplate();
  const [componentStates, setComponentStates] = useState<ComponentStates>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // const { userId, professionalId } = useParams();

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
      submissionId: AIGenData.submissionId,
      templateSelection: AIGenData.templateSelection,
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

  // Fetch template data
  // useEffect(() => {
  //   const fetchTemplateData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch(`https://xgnw16tgpi.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}?template=event-template`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log('Response status:', data);
  //         setFinalTemplate(data[0]);
  //         setAIGenData(data[0]);

  //         if (data[0].content) {
  //           setComponentStates(data[0].content);
  //         } else {
  //           toast.error("No content found in response");
  //           setComponentStates({});
  //         }
  //       } else {
  //         console.error('Failed to fetch template data:', response.status);
  //         toast.error('Failed to load template data');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching template data:', error);
  //       toast.error('Error loading template data');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (userId && professionalId) {
  //     fetchTemplateData();
  //   }
  // }, [userId, professionalId, setFinalTemplate, setAIGenData]);

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading event template data...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        navigationData={componentStates.navigationContent}
        onStateChange={createStateChangeHandler('navigationContent')}
      />

      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSection
            heroData={componentStates.heroContent}
            onStateChange={createStateChangeHandler('heroContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Events Section */}
        <section id="events">
          <EventsSection
            eventsData={componentStates.eventsContent}
            onStateChange={createStateChangeHandler('eventsContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Highlights Section */}
        <section id="highlights">
          <HighlightsSection
            highlightsData={componentStates.highlightsContent}
            onStateChange={createStateChangeHandler('highlightsContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Speakers Section */}
        <section id="speakers">
          <SpeakersSection
            speakersData={componentStates.speakersContent}
            onStateChange={createStateChangeHandler('speakersContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Schedule Section */}
        <section id="schedule">
          <ScheduleSection
            scheduleData={componentStates.scheduleContent}
            onStateChange={createStateChangeHandler('scheduleContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Exhibitors Section */}
        <section id="exhibitors">
          <ExhibitorsSection
            exhibitorsData={componentStates.exhibitorsContent}
            onStateChange={createStateChangeHandler('exhibitorsContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Gallery Section */}
        <section id="gallery">
          <GallerySection
            galleryData={componentStates.galleryContent}
            onStateChange={createStateChangeHandler('galleryContent')}
            userId={AIGenData.userId}
            professionalId={AIGenData.professionalId}
            templateSelection={AIGenData.templateSelection}
          />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <ContactSection
          />
        </section>
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
        style={{ zIndex: 9999 }}
      />

    </div>
  );
}