import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate } from "../../../context/context";
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
import { Services } from './components/services';

export default function FinalProTemp2() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { finaleDataReview, setFinaleDataReview } = useTemplate();
  const { professionalId, userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch template data
  async function fetchTemplateData(professionalId: string, userId: string) {
    try {
      setIsLoading(true);
      const response = await fetch(`https://xgnw16tgpi.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}?template=template2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFinaleDataReview(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching template data:", error);
      setError(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // If we have both professionalId and userId from URL, fetch the data
    if (professionalId && userId) {
      fetchTemplateData(professionalId, userId);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [professionalId, userId]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  console.log("Finale Data Review:--------", finaleDataReview[0].content);
  if (!finaleDataReview || !finaleDataReview[0].content) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-muted-foreground">The requested company page could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header 
        onDarkModeToggle={handleDarkModeToggle}
        headerData={finaleDataReview[0].content.headerContent}
      />
      <main>
        <Hero 
          heroData={finaleDataReview[0].content.heroContent}
        />
        <About 
          aboutData={finaleDataReview[0].content.aboutContent}
        />
        <Skills 
          skillsData={finaleDataReview[0].content.skillContent}
        />
        <Services 
          serviceData={finaleDataReview[0].content.serviceContent}
        />
        <Projects 
          projectData={finaleDataReview[0].content.projectContent}
        />
        <Certifications 
          certificationsData={finaleDataReview[0].content.certificationsContent}
        />
        <section id="clients">
          <Clients 
            clientData={finaleDataReview[0].content.clientsContent}
          />
        </section>
        <section id="testimonials">
          <SimpleTestimonials 
            testimonialData={finaleDataReview[0].content.testimonialContent}
          />
        </section>
        <Contact 
          contactData={finaleDataReview[0].content.contactContent}
          professionalId={professionalId}
        />
      </main>
      <Footer
        footerData={finaleDataReview[0].content.footerContent}
      />
    </div>
  );
}