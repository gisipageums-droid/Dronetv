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
import { useTemplate } from "../../../../../../../../context/context";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Publish from "./components/Publish";
import Profile from "./components/Profile";
import Gallery from "./components/Gallery";
import Back from "./components/Back";

export default function App() {
  const { finaleDataReview, setFinalTemplate, setFinaleDataReview } = useTemplate();
  const [componentStates, setComponentStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { pub, userId } = useParams();

  // ✅ All hooks appear before any return statements
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://koxt4kvnni.execute-api.ap-south-1.amazonaws.com/dev/templates?publishId=${encodeURIComponent(pub ?? "")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (isMounted) {
          console.log("✅ Data fetched successfully:", data);
          setFinaleDataReview(data?.data);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("❌ Error fetching data:", err);
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    }

    if (pub && userId) fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pub, userId, setFinaleDataReview]);

  // ✅ Stable callback to collect each section’s data
  const collectComponentState = useCallback((componentName: string, state: any) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  // ✅ Keep template state synced
  useEffect(() => {
    if (!finaleDataReview) return;
    setFinalTemplate((prev) => ({
      ...prev,
      publishedId: finaleDataReview?.publishedId,
      userId: finaleDataReview?.userId,
      draftId: finaleDataReview?.draftId,
      templateSelection: finaleDataReview?.templateSelection,
      content: {
        ...prev.content,
        company: finaleDataReview?.content?.company,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, finaleDataReview]);

  // ✅ Define all `useCallback`s before any return
  const headerStateChange = useCallback((s) => collectComponentState("header", s), [collectComponentState]);
  const heroStateChange = useCallback((s) => collectComponentState("hero", s), [collectComponentState]);
  const aboutStateChange = useCallback((s) => collectComponentState("about", s), [collectComponentState]);
  const profileStateChange = useCallback((s) => collectComponentState("profile", s), [collectComponentState]);
  const productsStateChange = useCallback((s) => collectComponentState("products", s), [collectComponentState]);
  const servicesStateChange = useCallback((s) => collectComponentState("services", s), [collectComponentState]);
  const galleryStateChange = useCallback((s) => collectComponentState("gallery", s), [collectComponentState]);
  const blogStateChange = useCallback((s) => collectComponentState("blog", s), [collectComponentState]);
  const testimonialsStateChange = useCallback((s) => collectComponentState("testimonials", s), [collectComponentState]);
  const clientsStateChange = useCallback((s) => collectComponentState("clients", s), [collectComponentState]);
  const contactStateChange = useCallback((s) => collectComponentState("contact", s), [collectComponentState]);
  const footerStateChange = useCallback((s) => collectComponentState("footer", s), [collectComponentState]);

  // ✅ Return happens last
  if (isLoading || !finaleDataReview?.content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-lg text-gray-600">Loading your template...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Stable render path
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header
          headerData={finaleDataReview.content.header}
          onStateChange={headerStateChange}
          publishedId={finaleDataReview.publishedId}
          userId={finaleDataReview.userId}
          templateSelection={finaleDataReview.templateSelection}
        />
        <main>
          <Hero heroData={finaleDataReview.content.hero} onStateChange={heroStateChange} {...finaleDataReview} />
          <About aboutData={finaleDataReview.content.about} onStateChange={aboutStateChange} {...finaleDataReview} />
          <Profile profileData={finaleDataReview.content.profile} onStateChange={profileStateChange} {...finaleDataReview} />
          <Product productData={finaleDataReview.content.products} onStateChange={productsStateChange} {...finaleDataReview} />
          <Services serviceData={finaleDataReview.content.services} onStateChange={servicesStateChange} {...finaleDataReview} />
          <Gallery galleryData={finaleDataReview.content.gallery} onStateChange={galleryStateChange} {...finaleDataReview} />
          <Blog blogData={finaleDataReview.content.blog} onStateChange={blogStateChange} {...finaleDataReview} />
          <Testimonials testimonialsData={finaleDataReview.content.testimonials} onStateChange={testimonialsStateChange} {...finaleDataReview} />
          <Clients clientData={finaleDataReview.content.clients} onStateChange={clientsStateChange} {...finaleDataReview} />
          <Contact contactData={finaleDataReview.content.contact} onStateChange={contactStateChange} {...finaleDataReview} />
          <Publish />
          <Back />
        </main>
        <Footer
          footerData={finaleDataReview.content.footer}
          onStateChange={footerStateChange}
          {...finaleDataReview}
        />
      </div>
    </ThemeProvider>
  );
}
