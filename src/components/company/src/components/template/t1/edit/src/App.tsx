import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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
import { useLocation, useParams } from "react-router-dom";
// Import the new editable components
import EditableGallerySection from "./components/Gallery";
import EditableCompanyProfile from "./components/Profile";

export default function App() {
  const [componentStates, setComponentStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading your company template...");
  const { AIGenData, setFinalTemplate, setAIGenData } = useTemplate();
  const { userId, draftId } = useParams();
  const location = useLocation();
  const loadedRef = useRef(false);

  const collectComponentState = useCallback((componentName, state) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  useEffect(() => {
    if (!userId || !draftId || loadedRef.current) return;
    loadedRef.current = true;

    const API_URL = `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${userId}/${draftId}?template=template-1`;

    // Form passed data directly — show template immediately, poll in background for publishedId
    if (location.state?.aiGenData) {
      setAIGenData(location.state.aiGenData);
      setIsLoading(false);
      let attempts = 0;
      const bgPoll = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch(API_URL);
          if (res.ok) {
            const data = await res.json();
            if (data?.publishedId) {
              clearInterval(bgPoll);
              setAIGenData(prev => ({ ...prev, publishedId: data.publishedId }));
              return;
            }
          }
        } catch { /* keep polling */ }
        if (attempts >= 20) clearInterval(bgPoll);
      }, 3000);
      return;
    }

    // Fallback: poll until AI generation is done
    let cancelled = false;
    const MAX = 12;

    const poll = async () => {
      for (let i = 0; i < MAX; i++) {
        if (cancelled) return;
        try {
          const res = await fetch(API_URL);
          if (res.ok) {
            const data = await res.json();
            if (data?.content || data?.publishedId) {
              if (!cancelled) { setAIGenData(data); setIsLoading(false); }
              return;
            }
          }
        } catch { /* keep polling */ }
        if (i < MAX - 1) {
          if (i === 3) setLoadingMessage("Almost ready, applying content...");
          await new Promise(r => setTimeout(r, 2500));
        }
      }
      if (!cancelled) {
        toast.error("Failed to load template data. Please try again.");
        setIsLoading(false);
      }
    };

    poll();
    return () => { cancelled = true; };
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">{loadingMessage}</p>
          <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
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
        companyName={AIGenData?.content?.company?.name}

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
        footersData={AIGenData?.content?.services}
      />
    </div>
  );
}