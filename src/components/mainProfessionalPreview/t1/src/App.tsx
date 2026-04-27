import React, { useCallback, useEffect, useState } from "react";
import { DarkModeProvider } from "./context/DarkModeContext";
import Navbar from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Service from "./components/Service";
import { useParams } from "react-router-dom";
import { useTemplate } from "../../../context/context";
import Back from "./components/Back";

const FinalT1: React.FC = () => {
  const { finaleDataReview, setFinaleDataReview } = useTemplate();
  const { urlSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplateData = useCallback(
    async (urlSlug: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://t6nbbkwszi.execute-api.ap-south-1.amazonaws.com/prod2/${urlSlug}`,
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
        setFinaleDataReview(data.items);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching template data:", error);
        if (error instanceof Error) setError(error.message);
        else setError("Something went wrong please try again!");
        setIsLoading(false);
      }
    },
    [setFinaleDataReview]
  );

  useEffect(() => {
    if (urlSlug) {
      fetchTemplateData(urlSlug);
    } else {
      setError("Required parameters not found in URL");
      setIsLoading(false);
    }
  }, [urlSlug, fetchTemplateData]);

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

  if (!finaleDataReview[0] || !finaleDataReview[0].content) {
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

  return (
    <DarkModeProvider>
      <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
        <Navbar content={finaleDataReview[0].content.headerContent} />
        <Hero content={finaleDataReview[0].content.heroContent} />
        <About content={finaleDataReview[0].content.aboutContent} />
        <Skills content={finaleDataReview[0].content.skillContent} />
        <Projects content={finaleDataReview[0].content.projectContent} />
        <Service content={finaleDataReview[0].content.serviceContent} />
        <Testimonials
          content={finaleDataReview[0].content.testimonialContent}
        />
        <Contact
          content={finaleDataReview[0].content.contactContent}
          professionalId={finaleDataReview[0].professionalId}
        />
        <Footer content={finaleDataReview[0].content.footerContent} />
        <Back />
      </div>
    </DarkModeProvider>
  );
};

export default FinalT1;