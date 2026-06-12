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

const POLL_INTERVAL = 8000;   // 8 seconds between retries
const POLL_MAX_WAIT = 300000; // 5 minutes total

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollElapsed, setPollElapsed] = useState(0);
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
    if (!draftId || !userId) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    let elapsed = 0;
    let cancelled = false;

    const tryFetch = async () => {
      try {
        const response = await fetch(
          `https://0jj3p6425j.execute-api.ap-south-1.amazonaws.com/prod/api/professional/${userId}/${draftId}?template=template-1`
        );

        if (!response.ok) {
          // AI not ready yet — keep polling if within time limit
          if (response.status === 404 && elapsed < POLL_MAX_WAIT) {
            if (!cancelled) {
              elapsed += POLL_INTERVAL;
              setPollElapsed(elapsed);
              setTimeout(tryFetch, POLL_INTERVAL);
            }
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AIResponse = await response.json();
        const updatedData = {
          ...data,
          content: {
            ...data.content,
            skillContent: {
              ...(data.content.skillContent || {}),
              heading: data.content.skillContent?.heading || "My Skills",
            },
            footerContent: data.content.footerContent || defaultFooterContent,
          },
        };

        if (!cancelled) {
          setFinalTemplate(updatedData);
          setAIGenData(updatedData);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : "An error occurred");
          setLoading(false);
        }
      }
    };

    tryFetch();
    return () => { cancelled = true; };
  }, [draftId, userId, setAIGenData, setFinalTemplate]);

  if (loading) {
    const minutes = Math.floor(pollElapsed / 60000);
    const seconds = Math.floor((pollElapsed % 60000) / 1000);
    const isPolling = pollElapsed > 0;
    const steps = [
      "Analyzing your business information...",
      "Generating color palette and design...",
      "Creating website content...",
      "Building your website structure...",
      "Adding final touches and optimizations...",
      "Your website is almost ready!",
    ];
    const activeStep = isPolling ? Math.min(Math.floor((pollElapsed / 300000) * steps.length), steps.length - 1) : 0;
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isPolling ? "AI is Building Your Website" : "Loading Your Profile..."}
            </h1>
            <p className="text-gray-500">
              {isPolling ? "Please stay on this page while we create your digital presence" : "Fetching your data, please wait."}
            </p>
          </div>

          {isPolling && (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{minutes > 0 ? `${minutes}m ` : ""}{seconds}s elapsed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(95, (pollElapsed / 300000) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isCompleted = index < activeStep;
                  return (
                    <div key={index} className={`flex items-center p-3 rounded-lg border transition-all duration-500 ${isActive ? "bg-yellow-50 border-yellow-300 scale-[1.02]" : isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 ${isActive ? "bg-yellow-400" : isCompleted ? "bg-green-500" : "bg-gray-200"}`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <span className={`text-xs font-bold ${isActive ? "text-gray-900" : "text-gray-500"}`}>{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-all duration-300 ${isActive ? "text-gray-900" : isCompleted ? "text-green-700" : "text-gray-400"}`}>{step}</span>
                      {isActive && (
                        <div className="ml-auto flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!isPolling && (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <p className="text-center text-gray-400 text-sm mt-6">This usually takes 1–3 minutes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
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

  if (!AIGenData.content) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-gray-500">No content found for this draft</div>
      </div>
    );
  }


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
