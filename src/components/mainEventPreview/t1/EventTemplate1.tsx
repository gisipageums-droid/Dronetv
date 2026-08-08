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
import { EVENTS_API, LAMBDA } from '../../../lib/apiConfig';

// Different event records store section content at different nesting
// depths under the fetched record's `content` field — some records have
// it directly, others wrap it one level deeper alongside record metadata
// (older records, or records touched by different backend paths). Reading
// a fixed depth left every section on real published events silently
// falling back to placeholder "demo Event" content. Detect the right
// level instead of assuming.
const looksLikeEventSections = (obj: any): boolean =>
  !!obj && typeof obj === "object" &&
  ("header" in obj || "hero" in obj || "speakersData" in obj || "sponsorsData" in obj);

function normalizeEventRecord(raw: any): any {
  if (!raw || typeof raw !== "object") return raw;
  const direct = raw.content;
  const nested = direct?.content;
  const sectionContent = looksLikeEventSections(direct)
    ? direct
    : looksLikeEventSections(nested)
    ? nested
    : direct;
  return { ...raw, content: sectionContent };
}

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
  const {  eventName } = useParams();
  const { finalTemplate, setFinalTemplate, AIGenData, setAIGenData } = useTemplate();

  const fetchTemplateData = async (nameOrSlug: string) => {
    try {
      setIsLoading(true);
      const url = EVENTS_API ? `${EVENTS_API}/public/${nameOrSlug}` : `${LAMBDA.eventPreview}/${nameOrSlug}`;
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });

      if (response.ok) {
        const data = await response.json();
        const normalized = normalizeEventRecord(data.data.data);
        setFinalTemplate(normalized);
        setAIGenData(data.data.data);
        setIsLoading(false);
        return;
      }

      // Slug-based fallback: look up real event name from dashboard
      const dashUrl = `${LAMBDA.events}/events-dashboard?viewType=main`;
      const dashRes = await fetch(dashUrl);
      if (dashRes.ok) {
        const dash = await dashRes.json();
        const cards = dash.cards || [];
        const match = cards.find((c: { urlSlug?: string }) => c.urlSlug === nameOrSlug);
        if (match?.eventName) {
          const retryUrl = EVENTS_API
            ? `${EVENTS_API}/public/${encodeURIComponent(match.eventName)}`
            : `${LAMBDA.eventPreview}/${encodeURIComponent(match.eventName)}`;
          const retryRes = await fetch(retryUrl, { method: "GET", headers: { "Content-Type": "application/json" } });
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            const normalized = normalizeEventRecord(retryData.data.data);
            setFinalTemplate(normalized);
            setAIGenData(retryData.data.data);
            setIsLoading(false);
            return;
          }
        }
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Something went wrong please try again!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventName) {
      const cleanSlug = eventName.includes("/event/")
        ? eventName.split("/event/").pop() || eventName
        : eventName;
      fetchTemplateData(cleanSlug);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [eventName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-status-info"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
          <p className="text-ink-paragraph mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-status-info text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!finalTemplate || !finalTemplate.content) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-ink-paragraph">
            The requested event page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-offwhite">
      <Navigation headerData={finalTemplate.content.header} />
      <HeroSection heroData={finalTemplate.content.hero} />
      <AboutSection aboutData={finalTemplate.content.about} />
      <SpeakersSection speakersData={finalTemplate.content.speakersData} />
      <AgendaSection agendaData={finalTemplate.content.Agenda} />
      <SponsorsSection
        sponsorsData={finalTemplate.content.sponsorsData}
      />
      <GallerySection galleryData={finalTemplate.content.Gallery} />
      <ContactSection id={finalTemplate.eventId} />
      <Footer footerData={finalTemplate.content.footer} />
      <Back />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default EventTemplate1;