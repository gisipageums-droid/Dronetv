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

function fillSectionDefaults(content: any, companyName: string) {
  const name = companyName || "Our Company";

  const dummyServices = {
    heading: {
      head: content?.services?.heading?.head || "What We Offer",
      desc: content?.services?.heading?.desc || `Explore the range of professional services offered by ${name}.`,
    },
    categories: content?.services?.categories?.length ? content.services.categories : ["All", "Core", "Support"],
    services: content?.services?.services?.length ? content.services.services : [
      {
        title: "Consultation & Advisory",
        category: "Core",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
        description: "Expert guidance tailored to your business needs.",
        features: ["1-on-1 sessions", "Strategic roadmap", "Industry insights"],
        detailedDescription: `Our advisory team at ${name} works closely with clients to craft solutions that drive measurable results.`,
        benefits: ["Clarity on direction", "Reduced risk", "Faster decisions"],
        process: ["Initial assessment", "Strategy session", "Action plan"],
        pricing: "Contact us",
        timeline: "1–2 weeks",
      },
      {
        title: "Project Execution",
        category: "Core",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
        description: "End-to-end delivery from planning to completion.",
        features: ["Dedicated team", "Progress tracking", "Quality assurance"],
        detailedDescription: `${name} takes ownership of project delivery so you can focus on your business.`,
        benefits: ["On-time delivery", "Transparent reporting", "Cost control"],
        process: ["Kick-off", "Execution phase", "Handover"],
        pricing: "Custom quote",
        timeline: "4–12 weeks",
      },
      {
        title: "Ongoing Support",
        category: "Support",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
        description: "Reliable post-delivery support and maintenance.",
        features: ["Priority response", "Regular check-ins", "Issue resolution"],
        detailedDescription: `Our support packages ensure your operations run smoothly long after the initial engagement with ${name}.`,
        benefits: ["Peace of mind", "Rapid resolution", "Continuous improvement"],
        process: ["Onboarding", "Monitoring", "Monthly review"],
        pricing: "Monthly retainer",
        timeline: "Ongoing",
      },
    ],
  };

  const dummyProducts = {
    sectionTitle: content?.products?.sectionTitle || "Our Products",
    sectionSubtitle: content?.products?.sectionSubtitle || `Solutions from ${name}`,
    sectionDescription: content?.products?.sectionDescription || "Discover our range of products designed for quality and reliability.",
    trustText: content?.products?.trustText || "",
    products: content?.products?.products?.length ? content.products.products : [
      {
        id: 1, title: "Starter Package", category: "Essential", price: "₹999", originalPrice: "₹1,499",
        rating: 4.5, reviews: 48, description: "Everything you need to get started quickly.",
        image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80",
        badge: "Popular", features: ["Core features", "Email support", "1 user"], specifications: {}, inStock: true,
      },
      {
        id: 2, title: "Professional Plan", category: "Professional", price: "₹2,499", originalPrice: "₹3,999",
        rating: 4.8, reviews: 120, description: "Advanced capabilities for growing businesses.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
        badge: "Best Value", features: ["All Starter features", "Priority support", "5 users"], specifications: {}, inStock: true,
      },
      {
        id: 3, title: "Enterprise Solution", category: "Enterprise", price: "Custom", originalPrice: "",
        rating: 5.0, reviews: 35, description: "Tailored solutions for large-scale operations.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80",
        badge: "Custom", features: ["Unlimited users", "Dedicated manager", "SLA"], specifications: {}, inStock: true,
      },
    ],
  };

  const dummyTestimonials = {
    headline: {
      title: content?.testimonials?.headline?.title || "What Our Clients Say",
      description: content?.testimonials?.headline?.description || `Real feedback from people who have worked with ${name}.`,
    },
    testimonials: content?.testimonials?.testimonials?.length ? content.testimonials.testimonials : [
      { name: "Ravi Sharma", role: "Business Owner", quote: `Working with ${name} was a turning point. Professional, reliable, and results-driven.`, rating: 5, gender: "male" },
      { name: "Priya Nair", role: "Operations Manager", quote: `The team at ${name} understood our requirements from day one. Exceeded expectations.`, rating: 5, gender: "female" },
      { name: "Arjun Mehta", role: "Startup Founder", quote: `Highly recommend ${name} for anyone looking for quality and transparency at every step.`, rating: 4, gender: "male" },
    ],
  };

  const dummyBlog = {
    header: {
      title: content?.blog?.header?.title || "Latest Insights",
      desc: content?.blog?.header?.desc || `News and updates from ${name}.`,
    },
    posts: content?.blog?.posts?.length ? content.blog.posts : [
      {
        id: 1, title: `How ${name} Delivers Excellence Every Time`,
        excerpt: "A look at our process, values, and commitment to quality.",
        content: `At ${name}, excellence is a consistent standard we uphold across every project.`,
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
        category: "Company", date: "2025-01-15", author: name, readTime: "3 min read",
        outline: ["Our process", "Quality standards", "Client focus"], keywords: ["quality", "excellence"],
      },
      {
        id: 2, title: "Industry Trends to Watch This Year",
        excerpt: "Key developments shaping the landscape and how businesses are responding.",
        content: "Staying ahead of industry trends is critical for businesses that want to grow.",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
        category: "Insights", date: "2025-02-10", author: name, readTime: "4 min read",
        outline: ["Top trends", "What they mean for you", "How to prepare"], keywords: ["trends", "growth"],
      },
      {
        id: 3, title: "Tips for a Successful Business Partnership",
        excerpt: "Lessons learned from building long-term relationships that create value.",
        content: "The best business relationships are built on trust and clear communication.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
        category: "Tips", date: "2025-03-05", author: name, readTime: "3 min read",
        outline: ["Trust", "Communication", "Shared goals"], keywords: ["partnership", "collaboration"],
      },
    ],
  };

  return { ...content, services: dummyServices, products: dummyProducts, testimonials: dummyTestimonials, blog: dummyBlog };
}

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

  // ✅ Stable callback to collect each section's data
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

  // ✅ Fill empty sections with dummy data before rendering
  const content = fillSectionDefaults(finaleDataReview.content, finaleDataReview.content?.company?.name);

  // ✅ Stable render path
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header
          headerData={content.header}
          onStateChange={headerStateChange}
          publishedId={finaleDataReview.publishedId}
          userId={finaleDataReview.userId}
          templateSelection={finaleDataReview.templateSelection}
        />
        <main>
          <Hero heroData={content.hero} onStateChange={heroStateChange} {...finaleDataReview}
            headerData={content.header}
            companyName={finaleDataReview.companyName}
          />
          <About aboutData={content.about} onStateChange={aboutStateChange} {...finaleDataReview} />
          <Profile profileData={content.profile} onStateChange={profileStateChange} {...finaleDataReview} />
          <Product productData={content.products} onStateChange={productsStateChange} {...finaleDataReview} />
          <Services serviceData={content.services} onStateChange={servicesStateChange} {...finaleDataReview} />
          <Gallery galleryData={content.gallery} onStateChange={galleryStateChange} {...finaleDataReview} />
          <Blog blogData={content.blog} onStateChange={blogStateChange} {...finaleDataReview} />
          <Testimonials testimonialsData={content.testimonials} onStateChange={testimonialsStateChange} {...finaleDataReview} />
          <Clients clientData={content.clients} onStateChange={clientsStateChange} {...finaleDataReview} />
          <Contact contactData={content.contact} onStateChange={contactStateChange} {...finaleDataReview} />
          <Publish />
          <Back />
        </main>
        <Footer
          footerData={content.footer}
          onStateChange={footerStateChange}
          {...finaleDataReview}
        />
      </div>
    </ThemeProvider>
  );
}