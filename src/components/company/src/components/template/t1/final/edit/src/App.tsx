import { useCallback, useEffect, useState } from "react";
import { useTemplate } from "../../../../../../../../context/context";
import About from "./components/About";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import EditableGallerySection from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import EditableCompanyProfile from "./components/Profile";
import Publish from "./components/Publish";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import UsedBy from "./components/UsedBy";
import { useParams } from "react-router-dom";
import Back from "./components/Back";

export default function App() {
  const { finaleDataReview, setFinalTemplate, setFinaleDataReview } = useTemplate();
  const [componentStates, setComponentStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { pub, userId } = useParams();

  // Always start from top when entering this page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // ✅ Fetch template data when pub/userId changes
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://koxt4kvnni.execute-api.ap-south-1.amazonaws.com/dev/templates?publishId=${encodeURIComponent(pub || "")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (isMounted) {
          console.log("Fetched data:", data);
          setFinaleDataReview(data.data);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    }

    if (pub && userId) fetchData();
    return () => {
      isMounted = false;
    };
  }, [pub, userId, setFinaleDataReview]);

  // ✅ Memoized state collector
  const collectComponentState = useCallback((componentName: string, state: any) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  // ✅ Sync collected component state into finalTemplate
  useEffect(() => {
    if (!finaleDataReview) return;

    setFinalTemplate((prev) => ({
      ...prev,
      publishedId: finaleDataReview.publishedId,
      userId: finaleDataReview.userId,
      draftId: finaleDataReview.draftId,
      templateSelection: finaleDataReview.templateSelection,
      content: {
        ...prev.content,
        company: finaleDataReview?.content?.company,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, finaleDataReview]);

  // ✅ Declare ALL hooks before conditional returns
  const headerStateChange = useCallback((state) => collectComponentState("header", state), [collectComponentState]);
  const heroStateChange = useCallback((state) => collectComponentState("hero", state), [collectComponentState]);
  const aboutStateChange = useCallback((state) => collectComponentState("about", state), [collectComponentState]);
  const profileStateChange = useCallback((state) => collectComponentState("profile", state), [collectComponentState]);
  const productsStateChange = useCallback((state) => collectComponentState("products", state), [collectComponentState]);
  const servicesStateChange = useCallback((state) => collectComponentState("services", state), [collectComponentState]);
  const galleryStateChange = useCallback((state) => collectComponentState("gallery", state), [collectComponentState]);
  const blogStateChange = useCallback((state) => collectComponentState("blog", state), [collectComponentState]);
  const testimonialsStateChange = useCallback((state) => collectComponentState("testimonials", state), [collectComponentState]);
  const usedByStateChange = useCallback((state) => collectComponentState("usedBy", state), [collectComponentState]);
  const contactStateChange = useCallback((state) => collectComponentState("contact", state), [collectComponentState]);
  const footerStateChange = useCallback((state) => collectComponentState("footer", state), [collectComponentState]);

  // ✅ Conditional rendering after all hooks
  if (isLoading || !finaleDataReview?.content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  // ✅ Final render
  return (
    <div>
      <Header
        headerData={finaleDataReview.content.header}
        onStateChange={headerStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Hero
        heroData={finaleDataReview.content.hero}
        onStateChange={heroStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <UsedBy
        usedByData={finaleDataReview.content.usedBy}
        onStateChange={usedByStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <About
        aboutData={finaleDataReview.content.about}
        onStateChange={aboutStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <EditableCompanyProfile
        profileData={finaleDataReview.content.profile}
        onStateChange={profileStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Services
        serviceData={finaleDataReview.content.services}
        onStateChange={servicesStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Products
        productData={finaleDataReview.content.products}
        onStateChange={productsStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <EditableGallerySection
        galleryData={finaleDataReview.content.gallery}
        onStateChange={galleryStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Blog
        blogData={finaleDataReview.content.blog}
        onStateChange={blogStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Testimonials
        content={finaleDataReview.content.testimonials}
        onStateChange={testimonialsStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Contact
        content={finaleDataReview.content.contact}
        onStateChange={contactStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Publish />
      <Back />
      <Footer
        onStateChange={footerStateChange}
        content={finaleDataReview.content.footer}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
    </div>
  );
}
