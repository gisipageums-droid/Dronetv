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
import { useTemplate } from "../../../../../../../components/context/context";
import Publish from "./components/Publish";
import Back from "./components/Back";

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

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, professionalId } = useParams();
  const { finalTemplate, setFinalTemplate, setAIGenData } = useTemplate();

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
    },
    [setFinalTemplate]
  );

  const fetchTemplateData = useCallback(
    async (professionalId: string, userId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          // `https://xgnw16tgpi.execute-api.ap-south-1.amazonaws.com/dev/${userId}/${professionalId}?template=template1`,
          `https://l5fb7y1eij.execute-api.ap-south-1.amazonaws.com/dev/get-teme?userId=${userId}&professionalId=${professionalId}`, 
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
    },
    [setFinalTemplate, setAIGenData]
  );

  useEffect(() => {
    if (professionalId && userId) {
      fetchTemplateData(professionalId, userId);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [professionalId, userId, fetchTemplateData]);

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

  if (!finalTemplate || !finalTemplate.content) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-muted-foreground">
            The requested company page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  console.log(finalTemplate.content.footerContent);

  return (
    <DarkModeProvider>
      <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
        <Navbar
          content={finalTemplate.content.headerContent}
          onSave={(updatedHeader) =>
            handleUpdateSection("headerContent", updatedHeader)
          }
          userId={finalTemplate.userId}
        />
        <Hero
          content={finalTemplate.content.heroContent}
          onSave={(updatedHero) =>
            handleUpdateSection("heroContent", updatedHero)
          }
          userId={finalTemplate.userId}
        />
        <About
          content={finalTemplate.content.aboutContent}
          onSave={(updatedAbout) =>
            handleUpdateSection("aboutContent", updatedAbout)
          }
          userId={finalTemplate.userId}
        />
        <Skills
          content={finalTemplate.content.skillContent}
          onSave={(updatedSkills) =>
            handleUpdateSection("skillContent", updatedSkills)
          }
        />
        <Projects
          content={finalTemplate.content.projectContent}
          onSave={(updatedProjects) =>
            handleUpdateSection("projectContent", updatedProjects)
          }
          userId={finalTemplate.userId}
        />
        <Service
          content={finalTemplate.content.serviceContent}
          onSave={(updatedService) =>
            handleUpdateSection("serviceContent", updatedService)
          }
        />
        <Testimonials
          content={finalTemplate.content.testimonialContent}
          onSave={(updatedTestimonial) =>
            handleUpdateSection("testimonialContent", updatedTestimonial)
          }
        />
        <Contact
          content={finalTemplate.content.contactContent}
          onSave={(updatedContact) =>
            handleUpdateSection("contactContent", updatedContact)
          }
        />
        <Footer
          content={finalTemplate.content.footerContent}
          onSave={(updatedFooter) =>
            handleUpdateSection("footerContent", updatedFooter)
          }
        />
        <Back />
        <Publish />
        <Toaster position="top-right" richColors />
      </div>
    </DarkModeProvider>
  );
};

export default App;
