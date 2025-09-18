import { useEffect, useState, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UsedBy from "./components/UsedBy";
import About from "./components/About";
import Services from "./components/Services";
import Products from "./components/Products";
import Blog from "./components/Blog";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Publish from "./components/Publish";
import { useTemplate } from "../../../../../../../../context/context";
// import { useEffect } from "react";

export default function App() {
 const { finaleDataReview, setFinalTemplate } = useTemplate();
  const [componentStates, setComponentStates] = useState({});

  // Memoize the collectComponentState function
  const collectComponentState = useCallback((componentName, state) => {
    setComponentStates(prev => ({
      ...prev,
      [componentName]: state
    }));
  }, []);

  // Update finalTemplate whenever componentStates changes
  useEffect(() => {
    setFinalTemplate(prev => ({
      ...prev,
      publishedId: finaleDataReview.publishedId,
      userId: finaleDataReview.userId,
      draftId: finaleDataReview.draftId,
      templateSelection: finaleDataReview.templateSelection,
      content: {
        ...prev.content,
        ...componentStates
      }
    }));
  }, [componentStates, setFinalTemplate, finaleDataReview]);


  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header
        headerData={finaleDataReview.content.header}
        onStateChange={useCallback((state) => collectComponentState("header", state),[collectComponentState])}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <Hero
        heroData={finaleDataReview.content.hero}
        onStateChange={useCallback((state) => collectComponentState("hero", state),[collectComponentState])}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <UsedBy
        usedByData={finaleDataReview.content.UsedBy}
        onStateChange={useCallback((state) => collectComponentState("usedBy", state), [collectComponentState])}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      />
      <About 
        aboutData={finaleDataReview.content.about}
        onStateChange={useCallback((state) => collectComponentState("about", state), [collectComponentState])}
        publishedId={finaleDataReview.publishedId}
        userId={finaleDataReview.userId}
        templateSelection={finaleDataReview.templateSelection}
      
      />
      <Services 
      serviceData={finaleDataReview.content.services}
      onStateChange={useCallback((state) => collectComponentState("services", state), [collectComponentState])}
      publishedId={finaleDataReview.publishedId}
      userId={finaleDataReview.userId}
      templateSelection={finaleDataReview.templateSelection}
      />
      <Products 
      productData={finaleDataReview.content.products} 
      onStateChange={useCallback((state) => collectComponentState("products", state), [collectComponentState])}
      publishedId={finaleDataReview.publishedId}
      userId={finaleDataReview.userId}
      templateSelection={finaleDataReview.templateSelection}
      />
      <Blog 
      blogData={finaleDataReview.content.blog}
      onStateChange={useCallback((state) => collectComponentState("blog", state), [collectComponentState])}
      publishedId={finaleDataReview.publishedId}
      userId={finaleDataReview.userId}
      templateSelection={finaleDataReview.templateSelection}
      />
      
      <Testimonials 
      content={finaleDataReview.content.testimonials}
      onStateChange={useCallback((state) => collectComponentState("testimonials", state), [collectComponentState])}
      publishedId={finaleDataReview.publishedId}
      userId={finaleDataReview.userId}
      templateSelection={finaleDataReview.templateSelection}
       />
      <Contact
      content={finaleDataReview.content.contact}
      onStateChange={useCallback((state) => collectComponentState("contact", state), [collectComponentState])}
      publishedId={finaleDataReview.publishedId}
      userId={finaleDataReview.userId}
      templateSelection={finaleDataReview.templateSelection}
      />
      <Publish />
      <Footer 
      onStateChange={useCallback((state) => collectComponentState("footer", state), [collectComponentState])}
      content={finaleDataReview.content.footer}
            publishedId={finaleDataReview.publishedId}
      userId={finaleDataReview.userId}
      templateSelection={finaleDataReview.templateSelection}
      />
    </div>
  );
}
