import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import HighlightsSection from './components/HighlightsSection';
import SpeakersSection from './components/SpeakersSection';
import AgendaSection from './components/AgendaSection';
import ExhibitorsSection from './components/ExhibitorsSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Publish from './components/Publish';

const EventTemplate2: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });
  }, []);

  return (
    <div className="bg-black text-white">
      <Navigation />
      <HeroSection />
      <HighlightsSection />
      <SpeakersSection />
      <AgendaSection />
      <ExhibitorsSection />
      <GallerySection />
      <ContactSection />
      <Footer />
      <Publish/>
    </div>
  );
};

export default EventTemplate2;