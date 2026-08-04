import React, { useEffect, useState } from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import { useParams } from "react-router-dom";

// T1 components
import Navbar from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Service from "./components/Service";
import Back from "./components/Back";

// T2 components
import { Header as T2Header } from "../../t2/src/components/Header";
import { Hero as T2Hero } from "../../t2/src/components/Hero";
import { About as T2About } from "../../t2/src/components/About";
import { Skills as T2Skills } from "../../t2/src/components/Skills";
import { Projects as T2Projects } from "../../t2/src/components/Projects";
import { Services as T2Services } from "../../t2/src/components/services";
import { Certifications as T2Certifications } from "../../t2/src/components/Certifications";
import { Clients as T2Clients } from "../../t2/src/components/Clients";
import { SimpleTestimonials as T2Testimonials } from "../../t2/src/components/SimpleTestimonials";
import { Contact as T2Contact } from "../../t2/src/components/Contact";
import { Footer as T2Footer } from "../../t2/src/components/Footer";
import { PROFESSIONAL_API, LAMBDA } from '../../../../lib/apiConfig';

const CARDS_API = PROFESSIONAL_API
  ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=main`
  : `${LAMBDA.professional}/professional-dashboard-cards?viewType=main`;
const CONTENT_API = PROFESSIONAL_API ? `${PROFESSIONAL_API}/template-content` : `${LAMBDA.profTemplateDash}`;

const FinalT1: React.FC = () => {
  const { urlSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [templateType, setTemplateType] = useState<string>("template-1");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!urlSlug) {
      setError("Profile not found");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);

        let cardsData: any = null;
        const cardsRes = await fetch(CARDS_API, { signal: controller.signal });
        if (cardsRes.ok) {
          cardsData = await cardsRes.json();
        }
        // Fall back to Lambda if local API failed or returned empty
        if (!cardsData || !(cardsData.cards || []).length) {
          const lambdaCardsRes = await fetch(
            `${LAMBDA.professional}/professional-dashboard-cards?viewType=main`,
            { signal: controller.signal }
          );
          if (!lambdaCardsRes.ok) throw new Error("Failed to load profiles");
          cardsData = await lambdaCardsRes.json();
        }
        const card = (cardsData.cards || []).find(
          (c: any) => (c.urlSlug || "").toLowerCase() === urlSlug.toLowerCase()
        );
        if (!card) throw new Error("Profile not found");

        const templateParam =
          card.templateSelection === "template-2" ? "template2" : "template1";

        let profileContent: any = null;

        if (PROFESSIONAL_API) {
          const contentRes = await fetch(
            `${CONTENT_API}/${card.userId}/${card.professionalId}?template=${templateParam}`,
            { signal: controller.signal }
          );
          if (contentRes.ok) {
            const contentData = await contentRes.json();
            profileContent = Array.isArray(contentData) ? contentData[0] : contentData;
          }
        }

        // Fall back to profTemplateFinalLoad if CONTENT_API unavailable or returned empty
        if (!profileContent || (Array.isArray(profileContent) && profileContent.length === 0)) {
          const finalLoadUrl = `${LAMBDA.profTemplateFinalLoad}/get-teme?userId=${encodeURIComponent(card.userId)}&professionalId=${encodeURIComponent(card.professionalId)}`;
          const fallbackRes = await fetch(finalLoadUrl, { signal: controller.signal });
          if (!fallbackRes.ok) throw new Error("Failed to load profile content");
          const fallbackData = await fallbackRes.json();
          profileContent = fallbackData.data || null;
        }

        if (!profileContent) throw new Error("Profile content unavailable");

        setTemplateType(card.templateSelection || "template-1");
        setProfileData(profileContent);
        setIsLoading(false);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load profile");
          setIsLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [urlSlug]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

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
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profileData?.content) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-muted-foreground">
            The requested profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const { content, professionalId } = profileData;

  if (templateType === "template-2") {
    return (
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
        <T2Header
          headerData={content.headerContent}
          onDarkModeToggle={setIsDarkMode}
        />
        <main>
          <T2Hero heroData={content.heroContent} />
          <T2About aboutData={content.aboutContent} />
          <T2Skills skillsData={content.skillContent} />
          <T2Projects projectData={content.projectContent} />
          <T2Services serviceData={content.serviceContent} />
          <T2Certifications certificationsData={content.certificationsContent} />
          <section id="clients">
            <T2Clients clientData={content.clientsContent} />
          </section>
          <section id="testimonials">
            <T2Testimonials testimonialData={content.testimonialContent} />
          </section>
          <T2Contact
            contactData={content.contactContent}
            professionalId={professionalId}
          />
          <Back />
        </main>
        <T2Footer footerData={content.footerContent} />
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <div className="relative min-h-screen transition-colors duration-300 bg-surface-main dark:bg-gray-900">
        <Navbar content={content.headerContent} />
        <Hero content={content.heroContent} />
        <About content={content.aboutContent} />
        <Skills content={content.skillContent} />
        <Projects content={content.projectContent} />
        <Service content={content.serviceContent} />
        <Testimonials content={content.testimonialContent} />
        <Contact
          content={content.contactContent}
          professionalId={professionalId}
        />
        <Footer content={content.footerContent} />
        <Back />
      </div>
    </DarkModeProvider>
  );
};

export default FinalT1;
