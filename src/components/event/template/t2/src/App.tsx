import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { EventsSection } from './components/EventsSection';
import { HighlightsSection } from './components/HighlightsSection';
import { SpeakersSection } from './components/SpeakersSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ExhibitorsSection } from './components/ExhibitorsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import Back from './components/Back';

export default function Event_T2() {
  const [activeSection, setActiveSection] = useState('home');

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

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeSection={activeSection} />
      <HeroSection />
      <EventsSection />
      <HighlightsSection />
      <SpeakersSection />
      <ScheduleSection />
      <ExhibitorsSection />
      <GallerySection />
      <ContactSection />
      <Back/>
    </div>
  );
}