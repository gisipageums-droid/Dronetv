import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SpeakersSection from "./components/SpeakersSection";
import SponsorsSection from "./components/SponsorsSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Back from "./components/Back";
import CurtainRaiserSection from "./components/CurtainRaiserSection";

const EventTemplate1: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
      offset: 100,
    });
  }, []);

  return (
    <div className="bg-white">
      <Navigation />
      <HeroSection />
      <CurtainRaiserSection />
      <AboutSection />
      <SpeakersSection />
      <SponsorsSection />
      <GallerySection />
      <ContactSection />
      <Back/>
      <Footer />
    </div>
  );
};

export default EventTemplate1;
