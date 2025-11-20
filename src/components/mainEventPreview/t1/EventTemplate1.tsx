import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTemplate } from "../../context/context";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SpeakersSection from "./components/SpeakersSection";
import AgendaSection from "./components/AgendaSection";
import SponsorsSection from "./components/SponsorsSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import Back from "./components/Back";

interface EventTemplateData {
  draftId?: string;
  eventName?: string; 
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

const EventTemplate1: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { draftId, userId, isAIgen, eventName } = useParams();
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData } = useTemplate();

  const fetchTemplateData = async (draftId: string, userId: string, isAIgen: string, eventName: string) => {
    try {
      setIsLoading(true);
     const response = await fetch(
          `https://fupab15ap0.execute-api.ap-south-1.amazonaws.com/dev/${eventName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFinalTemplate(data.data);
      setAIGenData(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching template data:", error);
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong please try again!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (draftId && userId && isAIgen) {
      fetchTemplateData(draftId, userId, isAIgen, eventName);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [draftId, userId, isAIgen]);

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
      <Navigation headerData={finalTemplate.content.header} />
      <HeroSection heroData={finalTemplate.content.hero} />
      <AboutSection aboutData={finalTemplate.content.about} />
      <SpeakersSection speakersData={finalTemplate.content.speakersData} />
      <AgendaSection agendaData={finalTemplate.content.Agenda} />
      <SponsorsSection
        userId={userId}
        sponsorsData={finalTemplate.content.sponsorsData}
      />
      <GallerySection galleryData={finalTemplate.content.Gallery} />
      <ContactSection />
      <Footer footerData={finalTemplate.content.footer} />
      {isAIgen === "AIgen" ? null : <Back />}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default EventTemplate1;