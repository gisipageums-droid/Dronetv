import React from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import Navbar from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
// import Certifications from './components/Certifications';
import Testimonials from './components/Testimonials';
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Service from "./components/Service";

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        {/* <Certifications /> */}
        <Service />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </DarkModeProvider>
  );
};

export default App;
