import React, { useCallback, useEffect, useState } from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import Navbar from "./components/Header";
import Hero, { HeroContent } from "./components/Hero";
import About, { AboutContent } from "./components/About";
import Skills, { SkillContent } from "./components/Skills";
import Projects, { ProjectContent } from "./components/Projects";
import Testimonials, { TestimonialContent } from "./components/Testimonials";
import Contact, { ContactContent } from "./components/Contact";
import Footer from "./components/Footer";
import Service, { ServiceContent } from "./components/Service";
import { useParams } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useTemplate } from "../../../../../../components/context/context";

interface AIResponse {
  professionalId?: string;
  userId?: string;
  submissionId?: string;
  templateSelection?: string;
  isEdited?: boolean;
  lastModified?: Date | null;
  version?: number;
  content: {
    headerContent: object;
    heroContent: HeroContent;
    aboutContent: AboutContent;
    skillContent: SkillContent;
    projectContent: ProjectContent;
    serviceContent: ServiceContent;
    testimonialContent: TestimonialContent;
    contactContent: ContactContent;
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
  | object;

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, draftId } = useParams<{ userId: string; draftId: string }>();
  const {
    finalTemplate,
    setFinalTemplate,
    AIGenData,
    setAIGenData,
    publishProfessionalTemplate,
  } = useTemplate();

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
        setFinalTemplate(data);
        setAIGenData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [draftId, userId, setAIGenData, setFinalTemplate]);

  const handlePublish = useCallback(() => {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }
    setIsPublishing(true);
    publishProfessionalTemplate()
    .then(() => setIsPublishing(false))
    // setTimeout(() => {
    //   setIsPublishing(false);
    // }, 2000);
  }, [finalTemplate, publishProfessionalTemplate]);

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

  // console.log(finalTemplate);

  return (
    <DarkModeProvider>
      <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
        <Navbar />
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
        <Footer />

        <button
          onClick={handlePublish}
          className="fixed z-50 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-orange-500 rounded-full right-10 bottom-20 hover:scale-105 hover:shadow-lg"
        >
          {isPublishing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Publish Update
            </div>
          )}
        </button>

        <Toaster position="top-right" richColors />
      </div>
    </DarkModeProvider>
  );
};

export default App;
