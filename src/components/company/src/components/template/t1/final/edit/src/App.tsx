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

// Fills empty sections with placeholder content so sections don't appear headless
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
        detailedDescription: `Our advisory team at ${name} works closely with clients to identify opportunities and craft solutions that drive measurable results.`,
        benefits: ["Clarity on direction", "Reduced risk", "Faster decision-making"],
        process: ["Initial assessment", "Strategy session", "Action plan delivery"],
        pricing: "Contact us",
        timeline: "1–2 weeks",
      },
      {
        title: "Project Execution",
        category: "Core",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
        description: "End-to-end delivery from planning to completion.",
        features: ["Dedicated team", "Progress tracking", "Quality assurance"],
        detailedDescription: `${name} takes ownership of project delivery so you can focus on what matters most — your business.`,
        benefits: ["On-time delivery", "Transparent reporting", "Cost control"],
        process: ["Kick-off", "Execution phase", "Review & handover"],
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
        id: 1,
        title: "Starter Package",
        category: "Essential",
        price: "₹999",
        originalPrice: "₹1,499",
        rating: 4.5,
        reviews: 48,
        description: "Everything you need to get started quickly and confidently.",
        image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80",
        badge: "Popular",
        features: ["Core features", "Email support", "1 user"],
        specifications: {},
        inStock: true,
      },
      {
        id: 2,
        title: "Professional Plan",
        category: "Professional",
        price: "₹2,499",
        originalPrice: "₹3,999",
        rating: 4.8,
        reviews: 120,
        description: "Advanced capabilities for growing businesses.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
        badge: "Best Value",
        features: ["All Starter features", "Priority support", "5 users", "Analytics"],
        specifications: {},
        inStock: true,
      },
      {
        id: 3,
        title: "Enterprise Solution",
        category: "Enterprise",
        price: "Custom",
        originalPrice: "",
        rating: 5.0,
        reviews: 35,
        description: "Tailored solutions for large-scale operations.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80",
        badge: "Custom",
        features: ["Unlimited users", "Dedicated manager", "Custom integrations", "SLA"],
        specifications: {},
        inStock: true,
      },
    ],
  };

  const dummyTestimonials = {
    headline: {
      title: content?.testimonials?.headline?.title || "What Our Clients Say",
      description: content?.testimonials?.headline?.description || `Real feedback from people who have worked with ${name}.`,
    },
    testimonials: content?.testimonials?.testimonials?.length ? content.testimonials.testimonials : [
      {
        name: "Ravi Sharma",
        role: "Business Owner",
        quote: `Working with ${name} was a turning point for our business. Professional, reliable, and results-driven.`,
        rating: 5,
        gender: "male",
      },
      {
        name: "Priya Nair",
        role: "Operations Manager",
        quote: `The team at ${name} understood our requirements from day one. The output exceeded our expectations.`,
        rating: 5,
        gender: "female",
      },
      {
        name: "Arjun Mehta",
        role: "Startup Founder",
        quote: `Highly recommend ${name} for anyone looking for quality and transparency at every step.`,
        rating: 4,
        gender: "male",
      },
    ],
  };

  const dummyBlog = {
    header: {
      title: content?.blog?.header?.title || "Latest Insights",
      desc: content?.blog?.header?.desc || `News and updates from ${name}.`,
    },
    posts: content?.blog?.posts?.length ? content.blog.posts : [
      {
        id: 1,
        title: `How ${name} Delivers Excellence Every Time`,
        excerpt: "A look at our process, values, and commitment to quality that sets us apart.",
        content: `At ${name}, we believe that excellence is not a one-time achievement — it's a consistent standard we uphold across every project and every client interaction.`,
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
        category: "Company",
        date: "2025-01-15",
        author: name,
        readTime: "3 min read",
        outline: ["Our process", "Quality standards", "Client focus"],
        keywords: ["quality", "excellence", "business"],
      },
      {
        id: 2,
        title: "Industry Trends to Watch This Year",
        excerpt: "Key developments shaping the landscape and how forward-thinking businesses are responding.",
        content: "Staying ahead of industry trends is critical for businesses that want to grow. This post explores the most important shifts happening right now.",
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
        category: "Insights",
        date: "2025-02-10",
        author: name,
        readTime: "4 min read",
        outline: ["Top trends", "What they mean for you", "How to prepare"],
        keywords: ["trends", "industry", "growth"],
      },
      {
        id: 3,
        title: "Tips for a Successful Business Partnership",
        excerpt: "Lessons learned from building long-term relationships that create value for everyone involved.",
        content: "The best business relationships are built on trust, clear communication, and a shared commitment to outcomes.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
        category: "Tips",
        date: "2025-03-05",
        author: name,
        readTime: "3 min read",
        outline: ["Trust", "Communication", "Shared goals"],
        keywords: ["partnership", "business", "collaboration"],
      },
    ],
  };

  return {
    ...content,
    services: dummyServices,
    products: dummyProducts,
    testimonials: dummyTestimonials,
    blog: dummyBlog,
  };
}

export default function App() {
  const { finaleDataReview, setFinalTemplate, setFinaleDataReview } = useTemplate();

  // console.log("finaleDataReview",finaleDataReview.content.company.name)
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

  // ✅ Final render — fill empty sections with dummy data before rendering
  const content = fillSectionDefaults(finaleDataReview.content, finaleDataReview.content?.company?.name);

  return (
    <div>
      <Header
        headerData={content.header}
        onStateChange={headerStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Hero
        heroData={content.hero}
        companyName={content.company.name}
        onStateChange={heroStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <UsedBy
        usedByData={content.usedBy}
        onStateChange={usedByStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <About
        aboutData={content.about}
        onStateChange={aboutStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <EditableCompanyProfile
        profileData={content.profile}
        onStateChange={profileStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Services
        serviceData={content.services}
        onStateChange={servicesStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Products
        productData={content.products}
        onStateChange={productsStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <EditableGallerySection
        galleryData={content.gallery}
        onStateChange={galleryStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Blog
        blogData={content.blog}
        onStateChange={blogStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Testimonials
        content={content.testimonials}
        onStateChange={testimonialsStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Contact
        content={content.contact}
        onStateChange={contactStateChange}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Publish />
      <Back />
      <Footer
        onStateChange={footerStateChange}
        content={content.footer}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
    </div>
  );
}
