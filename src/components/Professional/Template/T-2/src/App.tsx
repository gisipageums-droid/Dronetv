import { useEffect, useState } from 'react';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { SimpleTestimonials } from './components/SimpleTestimonials';
import { Skills } from './components/Skills';
import { Services } from './components/Services';

export default function ProTemp2() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Apply or remove dark class on document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleDarkModeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header onDarkModeToggle={handleDarkModeToggle} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services/>
        <Certifications />
        <section id="clients">
          <Clients />
        </section>
        <section id="testimonials">
          <SimpleTestimonials />
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}