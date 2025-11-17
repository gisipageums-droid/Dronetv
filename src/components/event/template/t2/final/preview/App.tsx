import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { EventsSection } from './components/EventsSection';
import { HighlightsSection } from './components/HighlightsSection';
import { SpeakersSection } from './components/SpeakersSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ExhibitorsSection } from './components/ExhibitorsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/FooterSection';
import Back from './components/Back';

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

export default function FinalPreview_event_t2() {
  const [componentStates, setComponentStates] = useState<ComponentStates>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { userId} = useParams();

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

  // Enhanced fetch function with corrected data mapping
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://fupab15ap0.execute-api.ap-south-1.amazonaws.com/dev/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched template data:', data.items[0].content);
          setComponentStates(data.items[0].content);
        } else {
          toast.error('Failed to load template data');
        }
      } catch (error) {
        console.error('Error loading template data:', error);
        toast.error('Error loading template data');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId ) {
      fetchTemplateData();
    }
  }, [userId, ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event template data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        navigationData={componentStates.navigationContent}
      />

      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSection
            heroData={componentStates.heroContent}
          />
        </section>

        {/* Events Section */}
        <section id="events">
          <EventsSection
            eventsData={componentStates.eventsContent}
          />
        </section>

        {/* Highlights Section */}
        <section id="highlights">
          <HighlightsSection
            highlightsData={componentStates.highlightsContent}
          />
        </section>

        {/* Speakers Section */}
        <section id="speakers">
          <SpeakersSection
            speakersData={componentStates.speakersContent}
          />
        </section>

        {/* Schedule Section */}
        <section id="schedule">
          <ScheduleSection
            scheduleData={componentStates.scheduleContent}
          />
        </section>

        {/* Exhibitors Section */}
        <section id="exhibitors">
          <ExhibitorsSection
            exhibitorsData={componentStates.exhibitorsContent}
          />
        </section>

        {/* Gallery Section */}
        <section id="gallery">
          <GallerySection
            galleryData={componentStates.galleryContent}
          />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>

        <Footer
        footerData={componentStates.footerContent} />
        <Back/>

      </main>

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