import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTemplate } from "../../../../../context/context";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SpeakersSection from "./components/SpeakersSection";
import AgendaSection from "./components/AgendaSection";
import SponsorsSection from "./components/SponsorsSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Publish from "./components/Publish";
import { Toaster } from "sonner";

interface EventTemplateData {
  draftId?: string;
  userId?: string;
  status?: string;
  templateSelection?: string;
  templateId?: string;
  eventType?: string;
  createdAt?: string;
  updatedAt?: string;
  formData?: object;
  uploadedFiles?: object;
  isPublished?: boolean;
  content: {
    header: HeaderContent;
    hero: HeroContent;
    about: AboutContent;
    Agenda: AgendaContent;
    speakersData: SpeakersDataContent;
    Gallery: GalleryContent;
    sponsorsData: SponsorsDataContent;
    footer: FooterContent;
  };
  aiGenerated?: boolean;
  eventId?: string;
  generationMetadata?: object;
}

interface HeaderContent {
  eventName: string;
  ctaText: string;
  navItems: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
}

interface HeroContent {
  title: string;
  date: string;
  time: string;
  location: string;
  eventDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  videoUrl: string;
  highlights: string[];
  btn1: string;
  btn2: string;
}

interface AboutContent {
  heading: string;
  subText: string;
  features: Feature[];
  zonesTitle: string;
  zonesTitleHighlight: string;
  zonesSubtitle: string;
  zones: Zone[];
}

interface Feature {
  title: string;
  description: string;
}

interface Zone {
  title: string;
  description: string;
}

interface AgendaContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  themes: {
    [key: string]: Theme;
  };
}

interface Theme {
  title: string;
  note: string;
  bullets: string[];
}

interface SpeakersDataContent {
  speakers: SpeakerDay[];
  headerContent: SpeakersHeaderContent;
}

interface SpeakerDay {
  day: string;
  speakers: Speaker[];
}

interface Speaker {
  name: string;
  company: string;
  id: number;
  avatar: string;
  title: string;
}

interface SpeakersHeaderContent {
  sectionTitle: string;
  eventTitle: string;
  subtitle: string;
}

interface GalleryContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  items: GalleryItem[];
}

interface GalleryItem {
  type: string;
  title: string;
  src: string;
}

interface SponsorsDataContent {
  title: string;
  titleHighlight: string;
  partners: Partner[];
}

interface Partner {
  header: string;
  image: string;
}

interface FooterContent {
  eventName: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
}

interface QuickLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

// Define types for component states (similar to App.tsx)
interface ComponentStates {
  header: HeaderContent;
  hero: HeroContent;
  about: AboutContent;
  Agenda: AgendaContent;
  speakersData: SpeakersDataContent;
  Gallery: GalleryContent;
  sponsorsData: SponsorsDataContent;
  footer: FooterContent;
}

const EventTemplate1: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { draftId, userId, isAIgen } = useParams();
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData } = useTemplate();
  
  // Component states to collect data from all sections (similar to App.tsx)
  const [componentStates, setComponentStates] = useState<ComponentStates>({
    header: {
      eventName: '',
      ctaText: '',
      navItems: []
    },
    hero: {
      title: '',
      date: '',
      time: '',
      location: '',
      eventDate: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      videoUrl: '',
      highlights: [],
      btn1: '',
      btn2: ''
    },
    about: {
      heading: '',
      subText: '',
      features: [],
      zonesTitle: '',
      zonesTitleHighlight: '',
      zonesSubtitle: '',
      zones: []
    },
    Agenda: {
      title: '',
      titleHighlight: '',
      subtitle: '',
      themes: {}
    },
    speakersData: {
      speakers: [],
      headerContent: {
        sectionTitle: '',
        eventTitle: '',
        subtitle: ''
      }
    },
    Gallery: {
      title: '',
      titleHighlight: '',
      subtitle: '',
      items: []
    },
    sponsorsData: {
      title: '',
      titleHighlight: '',
      partners: []
    },
    footer: {
      eventName: '',
      description: '',
      quickLinksTitle: '',
      quickLinks: [],
      socialLinks: []
    }
  });

  // Memoize the collectComponentState function with proper dependencies
  const collectComponentState = useCallback((componentName: keyof ComponentStates, state: any) => {
    setComponentStates(prev => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  // Memoize callback creators to prevent recreation on every render
  const createStateChangeHandler = useCallback(<K extends keyof ComponentStates>(
    componentName: K
  ) => (state: Partial<ComponentStates[K]>) => {
    setComponentStates(prev => ({
      ...prev,
      [componentName]: { ...prev[componentName], ...state }
    }));
  }, []);

  // Update finalTemplate whenever componentStates changes (similar to App.tsx)
  useEffect(() => {
    setFinalTemplate((prev: any) => ({
      ...prev,
      draftId: AIGenData.draftId,
      userId: AIGenData.userId,
      status: AIGenData.status,
      templateSelection: AIGenData.templateSelection,
      templateId: AIGenData.templateId,
      eventType: AIGenData.eventType,
      eventId: AIGenData.eventId,
      content: {
        ...prev.content,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, AIGenData]);

  const fetchTemplateData = useCallback(
    async (draftId: string, userId: string, isAIgen: string) => {
      try {
        setIsLoading(true);
        let response;

        if (isAIgen === "AIgen") {
          response = await fetch(
            `https://2kmz6d0aqa.execute-api.ap-south-1.amazonaws.com/prod/events?submissionId=${draftId}&userId=${userId}&templateId=1`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // Replace with your actual API for non-AIgen case
          response = await fetch(
            `YOUR_NON_AIGEN_API_HERE?draftId=${draftId}&userId=${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Set both AIGenData and finalTemplate similar to App.tsx
        setFinalTemplate(data.data);
        setAIGenData(data.data);
        
        // Initialize component states with fetched data or default values
        if (data.data.content) {
          setComponentStates({
            ...componentStates, // Keep existing state as fallback
            ...data.data.content
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching template data:", error);
        if (error instanceof Error) setError(error.message);
        else setError("Something went wrong please try again!");
        setIsLoading(false);
      }
    },
    [setFinalTemplate, setAIGenData]
  );

  useEffect(() => {
    if (draftId && userId && isAIgen) {
      fetchTemplateData(draftId, userId, isAIgen);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [draftId, userId, isAIgen, fetchTemplateData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!finalTemplate || !finalTemplate.content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-gray-600">
            The requested event page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navigation
        headerData={componentStates.header}
        onStateChange={createStateChangeHandler('header')}
      />
      <HeroSection
        heroData={componentStates.hero}
        onStateChange={createStateChangeHandler('hero')}
      />
      <AboutSection
        aboutData={componentStates.about}
        onStateChange={createStateChangeHandler('about')}
      />
      <SpeakersSection
        speakersData={componentStates.speakersData}
        onStateChange={createStateChangeHandler('speakersData')}
      />
      <AgendaSection
        agendaData={componentStates.Agenda}
        onStateChange={createStateChangeHandler('Agenda')}
      />
      <SponsorsSection
        sponsorsData={componentStates.sponsorsData}
        onStateChange={createStateChangeHandler('sponsorsData')}
      />
      <GallerySection
        galleryData={componentStates.Gallery}
        onStateChange={createStateChangeHandler('Gallery')}
      />
      <ContactSection />
      <Footer
        footerData={componentStates.footer}
        onStateChange={createStateChangeHandler('footer')}
      />
      
      <Publish />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default EventTemplate1;