import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Product from "./components/Product";
import Blog from "./components/Blog";
import Testimonials from "./components/Testimonials";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { useTemplate } from "../../../../../../../context/context";
import { useEffect, useState, useCallback } from "react";
import Publish from "./components/Publish";
import Gallery from "./components/Gallery";
import Profile from "./components/Profile";
import { useParams } from "react-router-dom";
export default function App() {
  const [componentStates, setComponentStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { AIGenData, setFinalTemplate, getAIgenData } = useTemplate();
  const { userId, draftId } = useParams();

  // ✅ Define all hooks at top
  const collectComponentState = useCallback((componentName, state) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId && draftId) {
        try {
          setIsLoading(true);
          await getAIgenData(userId, draftId, "template-2");
        } catch (error) {
          console.error("Failed to load data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, draftId]);

  useEffect(() => {
    if (!AIGenData) return;
    setFinalTemplate((prev) => ({
      ...prev,
      publishedId: AIGenData.publishedId,
      userId: AIGenData.userId,
      draftId: AIGenData.draftId,
      templateSelection: AIGenData.templateSelection,
      content: {
        ...prev.content,
        company: AIGenData?.content?.company,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, AIGenData]);

  // ✅ Predefine all callbacks here
  const handleHeaderChange = useCallback(
    (state) => collectComponentState("header", state),
    [collectComponentState]
  );
  const handleHeroChange = useCallback(
    (state) => collectComponentState("hero", state),
    [collectComponentState]
  );
  const handleAboutChange = useCallback(
    (state) => collectComponentState("about", state),
    [collectComponentState]
  );
  const handleProfileChange = useCallback(
    (state) => collectComponentState("profile", state),
    [collectComponentState]
  );
  const handleProductsChange = useCallback(
    (state) => collectComponentState("products", state),
    [collectComponentState]
  );
  const handleServicesChange = useCallback(
    (state) => collectComponentState("services", state),
    [collectComponentState]
  );
  const handleGalleryChange = useCallback(
    (state) => collectComponentState("gallery", state),
    [collectComponentState]
  );
  const handleBlogChange = useCallback(
    (state) => collectComponentState("blog", state),
    [collectComponentState]
  );
  const handleTestimonialsChange = useCallback(
    (state) => collectComponentState("testimonials", state),
    [collectComponentState]
  );
  const handleClientsChange = useCallback(
    (state) => collectComponentState("clients", state),
    [collectComponentState]
  );
  const handleContactChange = useCallback(
    (state) => collectComponentState("contact", state),
    [collectComponentState]
  );
  const handleFooterChange = useCallback(
    (state) => collectComponentState("footer", state),
    [collectComponentState]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading template data...</p>
        </div>
      </div>
    );
  }

  // ✅ Use callbacks safely here
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header
          headerData={AIGenData?.content?.company}
          onStateChange={handleHeaderChange}
          publishedId={AIGenData.publishedId}
          userId={AIGenData.userId}
          templateSelection={AIGenData.templateSelection}
        />
        <main>
          <Hero
            heroData={AIGenData?.content?.hero}
            headerData={AIGenData?.content?.company}
            onStateChange={handleHeroChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <About
            aboutData={AIGenData?.content?.about}
            onStateChange={handleAboutChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Profile
            profileData={AIGenData?.content?.profile}
            onStateChange={handleProfileChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Product
            productData={AIGenData?.content?.products}
            onStateChange={handleProductsChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Services
            serviceData={AIGenData?.content?.services}
            onStateChange={handleServicesChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Gallery
            galleryData={AIGenData?.content?.gallery}
            onStateChange={handleGalleryChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Blog
            blogData={AIGenData?.content?.blog}
            onStateChange={handleBlogChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Testimonials
            testimonialsData={AIGenData?.content?.testimonials}
            onStateChange={handleTestimonialsChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Clients
            clientData={AIGenData?.content?.clients}
            onStateChange={handleClientsChange}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Contact onStateChange={handleContactChange} />
          <Publish />
        </main>
        <Footer
          footerData={AIGenData?.content?.services}
          footerLogo={AIGenData?.content?.company}
          onStateChange={handleFooterChange}
          publishedId={AIGenData.publishedId}
          userId={AIGenData.userId}
          templateSelection={AIGenData.templateSelection}
        />
      </div>
    </ThemeProvider>
  );
}
