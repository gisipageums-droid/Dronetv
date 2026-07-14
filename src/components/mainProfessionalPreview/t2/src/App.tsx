import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import  Back  from './components/Back';
import { PROFESSIONAL_API, LAMBDA } from '../../../../lib/apiConfig';

export default function MainProTemp2() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { finaleDataReview, setFinaleDataReview } = useTemplate();
  const { urlSlug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTemplateData(urlSlug: string) {
    try {
      setIsLoading(true);

      if (PROFESSIONAL_API) {
        const response = await fetch(`${PROFESSIONAL_API}/template/${urlSlug}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          if (!data.error && data.items && data.items.length > 0) {
            setFinaleDataReview(data.items[0]);
            setIsLoading(false);
            return;
          }
        }
      }

      // Step 1: find the professional card by urlSlug from public listing
      const cardsResp = await fetch(
        `${LAMBDA.professional}/professional-dashboard-cards?viewType=main`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      if (!cardsResp.ok) throw new Error(`Cards fetch failed: ${cardsResp.status}`);
      const cardsData = await cardsResp.json();
      const card = (cardsData.cards || []).find((c: any) => c.urlSlug === urlSlug);
      if (!card) {
        setError('not found');
        setIsLoading(false);
        return;
      }

      // Template-1 professionals are handled by /professional/:urlSlug route
      if (card.templateSelection === 'template-1') {
        navigate(`/professional/${urlSlug}`, { replace: true });
        return;
      }

      // Step 2: fetch full template data using userId + professionalId
      const tmplResp = await fetch(
        `${LAMBDA.profTemplateFinalLoad}/get-teme?userId=${encodeURIComponent(card.userId)}&professionalId=${encodeURIComponent(card.professionalId)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      if (!tmplResp.ok) throw new Error(`Template fetch failed: ${tmplResp.status}`);
      const tmplData = await tmplResp.json();
      if (!tmplData.data) {
        setError('not found');
        setIsLoading(false);
        return;
      }
      setFinaleDataReview(tmplData.data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // If we have both publishedId and userId from URL, fetch the data
    if (urlSlug) {
      fetchTemplateData( urlSlug);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [urlSlug]);

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
    const isNotFound = error.includes('404') || error.includes('not found');
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {isNotFound ? 'Profile Not Yet Published' : 'Error Loading Page'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isNotFound
              ? 'This professional has not published their profile yet.'
              : error}
          </p>
          {!isNotFound && (
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
  if (!finaleDataReview || !finaleDataReview.content) {
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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <Header 
        onDarkModeToggle={handleDarkModeToggle}
        headerData={finaleDataReview.content.headerContent}
      />
      <main>
        <Hero 
          heroData={finaleDataReview.content.heroContent}
        />
        <About 
          aboutData={finaleDataReview.content.aboutContent}
        />
        <Skills 
          skillsData={finaleDataReview.content.skillContent}
        />
        <Projects 
          projectData={finaleDataReview.content.projectContent}
        />
        <Services 
          serviceData={finaleDataReview.content.serviceContent}
        />
        <Certifications 
          certificationsData={finaleDataReview.content.certificationsContent}
        />
        <section id="clients">
          <Clients 
            clientData={finaleDataReview.content.clientsContent}
          />
        </section>
        <section id="testimonials">
          <SimpleTestimonials 
            testimonialData={finaleDataReview.content.testimonialContent}
          />
        </section>
        <Contact 
          contactData={finaleDataReview.content.contactContent}
          professionalId={finaleDataReview.professionalId}
        />
        <Back />
      </main>
      <Footer
        footerData={finaleDataReview.content.footerContent}
      />
    </div>
  );
}
