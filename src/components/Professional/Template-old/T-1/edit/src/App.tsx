import React, { useCallback, useEffect, useState } from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import Navbar, { HeaderContent } from "./components/Header";
import Hero, { HeroContent } from "./components/Hero";
import About, { AboutContent } from "./components/About";
import Skills, { SkillContent } from "./components/Skills";
import Projects, { ProjectContent } from "./components/Projects";
import Testimonials, { TestimonialContent } from "./components/Testimonials";
import Contact, { ContactContent } from "./components/Contact";
import Footer, { FooterContent } from "./components/Footer";
import Service, { ServiceContent } from "./components/Service";
import { useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useTemplate } from "../../../../../../components/context/context";
import Publish from "./components/Publish";

interface AIResponse {
  professionalId?: string;
  userId?: string;
  submissionId?: string;
  templateSelection?: string;
  isEdited?: boolean;
  lastModified?: Date | null;
  version?: number;
  content: {
    headerContent: HeaderContent;
    heroContent: HeroContent;
    aboutContent: AboutContent;
    skillContent: SkillContent;
    projectContent: ProjectContent;
    serviceContent: ServiceContent;
    testimonialContent: TestimonialContent;
    contactContent: ContactContent;
    footerContent: FooterContent;
  };
}

type SectionContent =
  | HeroContent
  | AboutContent
  | SkillContent
  | ProjectContent
  | ServiceContent
  | TestimonialContent
  | ContactContent
  | FooterContent
  | object;

/**
 * We don't get footer json response from api,
 * so i have added dummy footer data
 */
const defaultFooterContent: FooterContent = {
  personalInfo: {
    name: "John Doe",
    description:
      "Full-Stack Developer passionate about creating exceptional digital experiences. I build modern, scalable applications that make a difference.",
  },
  socialLinks: [
    { name: "Github", href: "#", icon: "Github" },
    { name: "Linkedin", href: "#", icon: "Linkedin" },
    { name: "Mail", href: "mailto:john.doe@example.com", icon: "Mail" },
  ],
  quickLinks: [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
  ],
  moreLinks: [
    { href: "#services", label: "Services" },
    { href: "#testimonials", label: "Testimonials" },
  ],
  newsletter: {
    title: "Stay Updated",
    description: "Get notified about new projects and insights.",
    placeholder: "Your email",
    buttonText: "Join",
  },
  bottomSection: {
    copyrightText: "Made with",
    afterCopyrightText: "and lots of ☕",
    privacyPolicy: { href: "#", label: "Privacy Policy" },
    termsOfService: { href: "#", label: "Terms of Service" },
  },
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, draftId } = useParams<{ userId: string; draftId: string }>();
  const { setFinalTemplate, AIGenData, setAIGenData } = useTemplate();

  const handleUpdateSection = useCallback(
    (section: keyof AIResponse["content"], updatedContent: SectionContent) => {
      setFinalTemplate((prev: AIResponse) =>
        prev
          ? {
              ...prev,
              content: {
                ...prev.content,
                [section]: updatedContent,
              },
            }
          : prev
      );
      setAIGenData((prev: AIResponse) =>
        prev
          ? {
              ...prev,
              content: {
                ...prev.content,
                [section]: updatedContent,
              },
            }
          : prev
      );
    },
    [setFinalTemplate, setAIGenData]
  );

  useEffect(() => {
    async function fetchData() {
      if (!draftId || !userId) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod/api/professional/${userId}/${draftId}?template=template-1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AIResponse = await response.json();

        // Ensure footerContent exists with default values if not provided
        const updatedData = {
          ...data,
          content: {
            ...data.content,
            skillContent: {
              heading: data.content.skillContent?.heading || "My Skills",
              ...data.content.skillContent,
            },
            footerContent: data.content.footerContent || defaultFooterContent,
          },
        };

        setFinalTemplate(updatedData);
        setAIGenData(updatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [draftId, userId, setAIGenData, setFinalTemplate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!AIGenData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  console.log("Final Template =>", AIGenData);

  return (
    <DarkModeProvider>
      <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
        <Navbar
          content={AIGenData.content.headerContent}
          onSave={(updatedHeader) =>
            handleUpdateSection("headerContent", updatedHeader)
          }
          userId={AIGenData.userId}
        />
        <Hero
          content={AIGenData.content.heroContent}
          onSave={(updatedHero) =>
            handleUpdateSection("heroContent", updatedHero)
          }
          userId={AIGenData.userId}
        />
        <About
          content={AIGenData.content.aboutContent}
          onSave={(updatedAbout) =>
            handleUpdateSection("aboutContent", updatedAbout)
          }
          userId={AIGenData.userId}
        />
        <Skills
          content={AIGenData.content.skillContent}
          onSave={(updatedSkills) =>
            handleUpdateSection("skillContent", updatedSkills)
          }
        />
        <Projects
          content={AIGenData.content.projectContent}
          onSave={(updatedProjects) =>
            handleUpdateSection("projectContent", updatedProjects)
          }
          userId={AIGenData.userId}
        />
        <Service
          content={AIGenData.content.serviceContent}
          onSave={(updatedService) =>
            handleUpdateSection("serviceContent", updatedService)
          }
        />
        <Testimonials
          content={AIGenData.content.testimonialContent}
          onSave={(updatedTestimonial) =>
            handleUpdateSection("testimonialContent", updatedTestimonial)
          }
        />
        <Contact
          content={AIGenData.content.contactContent}
          onSave={(updatedContact) =>
            handleUpdateSection("contactContent", updatedContact)
          }
        />
        <Footer
          content={AIGenData.content.footerContent}
          onSave={(updatedFooter) =>
            handleUpdateSection("footerContent", updatedFooter)
          }
        />

        <Publish />
        <Toaster position="top-right" richColors />
      </div>
    </DarkModeProvider>
  );
};

export default App;
