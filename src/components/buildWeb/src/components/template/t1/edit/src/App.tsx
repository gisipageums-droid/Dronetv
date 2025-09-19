import { useEffect, useState, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UsedBy from "./components/UsedBy";
import About from "./components/About";
import Services from "./components/Services";
import Products from "./components/Products";
import Blog from "./components/Blog";
import BlogModal from "./components/BlogModal";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Publish from "./components/Publish";
import { useTemplate } from "../../../../../../../context/context";
// import { useEffect } from "react";

export default function App() {
  const { AIGenData, setFinalTemplate } = useTemplate();
  const [componentStates, setComponentStates] = useState({});

  // Memoize the collectComponentState function
  const collectComponentState = useCallback((componentName, state) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

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
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, AIGenData]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  // Set initial dark mode state based on user's system preference

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header
        headerData={AIGenData.content.company}
        onStateChange={useCallback((state) => collectComponentState("header", state),[collectComponentState])}
        publishedId={AIGenData.publishedId}
        userId={AIGenData.userId}
        templateSelection={AIGenData.templateSelection}
      />
      <Hero
        heroData={AIGenData.content.hero}
        onStateChange={useCallback((state) => collectComponentState("hero", state),[collectComponentState])}
        publishedId={AIGenData.publishedId}
        userId={AIGenData.userId}
        templateSelection={AIGenData.templateSelection}
      />
      <UsedBy
      
        onStateChange={useCallback((state) => collectComponentState("usedBy", state), [collectComponentState])}
        publishedId={AIGenData.publishedId}
        userId={AIGenData.userId}
        templateSelection={AIGenData.templateSelection}
      />
      <About 
        aboutData={AIGenData.content.about}
        onStateChange={useCallback((state) => collectComponentState("about", state), [collectComponentState])}
        publishedId={AIGenData.publishedId}
        userId={AIGenData.userId}
        templateSelection={AIGenData.templateSelection}
      
      />
      <Services 
      serviceData={AIGenData.content.services}
      onStateChange={useCallback((state) => collectComponentState("services", state), [collectComponentState])}
      publishedId={AIGenData.publishedId}
      userId={AIGenData.userId}
      templateSelection={AIGenData.templateSelection}
      />
      <Products 
      productData={AIGenData.content.products} 
      onStateChange={useCallback((state) => collectComponentState("products", state), [collectComponentState])}
      publishedId={AIGenData.publishedId}
      userId={AIGenData.userId}
      templateSelection={AIGenData.templateSelection}
      />
      <Blog 
      blogData={AIGenData.content.blog}
      onStateChange={useCallback((state) => collectComponentState("blog", state), [collectComponentState])}
      publishedId={AIGenData.publishedId}
      userId={AIGenData.userId}
      templateSelection={AIGenData.templateSelection}
      />
      
      <Testimonials 
      content={AIGenData.content.testimonials}
      onStateChange={useCallback((state) => collectComponentState("testimonials", state), [collectComponentState])}
      publishedId={AIGenData.publishedId}
      userId={AIGenData.userId}
      templateSelection={AIGenData.templateSelection}
       />
      <Contact
      content={AIGenData.content.contact}
      onStateChange={useCallback((state) => collectComponentState("contact", state), [collectComponentState])}
      publishedId={AIGenData.publishedId}
      userId={AIGenData.userId}
      templateSelection={AIGenData.templateSelection}
      />
      <Publish />
      <Footer 
      onStateChange={useCallback((state) => collectComponentState("footer", state), [collectComponentState])}
       content={AIGenData.content.company}
       publishedId={AIGenData.publishedId}
      userId={AIGenData.userId}
      templateSelection={AIGenData.templateSelection}
      />
    </div>
  );
}
