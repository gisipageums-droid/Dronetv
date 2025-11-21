import { useCallback, useEffect, useState } from "react";
import { useTemplate } from "../../../../../../../context/context";
import About from "./components/About";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Publish from "./components/Publish";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import UsedBy from "./components/UsedBy";
import { useParams } from "react-router-dom";
// Import the new editable components
import EditableGallerySection from "./components/Gallery";
import EditableCompanyProfile from "./components/Profile";

export default function App() {
  const [componentStates, setComponentStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { AIGenData, setFinalTemplate, getAIgenData } = useTemplate();
  const { userId, draftId } = useParams();
  // Memoize the collectComponentState function
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
          await getAIgenData(userId, draftId, "template-1");
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

  // Update finalTemplate whenever componentStates changes
  useEffect(() => {
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
  const handleUsedByChange = useCallback(
    (state) => collectComponentState("usedBy", state),
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

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header
        headerData={AIGenData?.content?.company}
        onStateChange={handleHeaderChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />
      <Hero
        heroData={AIGenData?.content?.hero}
        companyName={AIGenData.content.company.name}

        onStateChange={handleHeroChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />
      <UsedBy
        usedByData={AIGenData?.content?.usedBy}
        onStateChange={handleUsedByChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />
      <About
        aboutData={AIGenData?.content?.about}
        onStateChange={handleAboutChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />

      {/* Add the EditableCompanyProfile component */}
      <EditableCompanyProfile
        profileData={AIGenData?.content?.profile}
        onStateChange={handleProfileChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />

      <Services
        serviceData={AIGenData?.content?.services}
        onStateChange={handleServicesChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />
      <Products
        productData={AIGenData?.content?.products}
        onStateChange={handleProductsChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />

      {/* Add the EditableGallerySection component */}
      <EditableGallerySection
        onStateChange={handleGalleryChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
        galleryData={AIGenData?.content?.gallery}
      />

      <Blog
        blogData={AIGenData?.content?.blog}
        onStateChange={handleBlogChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />

      <Testimonials
        content={AIGenData?.content?.testimonials}
        onStateChange={handleTestimonialsChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />
      <Contact
        content={AIGenData?.content?.contact}
        onStateChange={handleContactChange}
        publishedId={AIGenData?.publishedId}
        userId={AIGenData?.userId}
        templateSelection={AIGenData?.templateSelection}
      />
      <Publish />
      <Footer
        onStateChange={handleFooterChange}
        content={AIGenData?.content?.company}
        userId={AIGenData?.userId}
        publishedId={AIGenData?.publishedId}
        templateSelection={AIGenData?.templateSelection}
      />
    </div>
  );
}