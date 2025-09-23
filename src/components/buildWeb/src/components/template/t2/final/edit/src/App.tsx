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
import { useEffect, useState, useCallback } from "react";
import Publish from "./components/Publish";
import Profile from "./components/Profile";
import Gallery from "./components/Gallery";

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
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header 
          headerData={finaleDataReview.content.header}
          onStateChange={useCallback((state) => collectComponentState('header', state), [collectComponentState])}
          publishedId={finaleDataReview.publishedId}
          userId={finaleDataReview.userId}
          templateSelection={finaleDataReview.templateSelection}
        />
        <main>
          <Hero 
            heroData={finaleDataReview.content.hero}
            onStateChange={useCallback((state) => collectComponentState('hero', state), [collectComponentState])}
            publishedId={finaleDataReview.publishedId}
            userId={finaleDataReview.userId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <About 
            aboutData={finaleDataReview.content.about}
            onStateChange={useCallback((state) => collectComponentState('about', state), [collectComponentState])}
             userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Profile
            profileData={finaleDataReview.content.profile}
            onStateChange={useCallback((state) => collectComponentState('profile', state), [collectComponentState])}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
            <Product 
              productData={finaleDataReview.content.products}
              onStateChange={useCallback((state) => collectComponentState('products', state), [collectComponentState])}
              userId={finaleDataReview.userId}
              publishedId={finaleDataReview.publishedId}
              templateSelection={finaleDataReview.templateSelection}
            />
          <Services 
            serviceData={finaleDataReview.content.services}
            onStateChange={useCallback((state) => collectComponentState('services', state), [collectComponentState])}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Gallery 
            galleryData={finaleDataReview.content.gallery}
            onStateChange={useCallback((state) => collectComponentState('gallery', state), [collectComponentState])}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Blog 
            blogData={finaleDataReview.content.blog}
            onStateChange={useCallback((state) => collectComponentState('blog', state), [collectComponentState])}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Testimonials 
            testimonialsData={finaleDataReview.content.testimonials}
            onStateChange={useCallback((state) => collectComponentState('testimonials', state), [collectComponentState])}
          />
          <Clients 
            clientData={finaleDataReview.content.clients}
            onStateChange={useCallback((state) => collectComponentState('clients', state), [collectComponentState])}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Contact 
            contactData={finaleDataReview.content.contact}
            onStateChange={useCallback((state) => collectComponentState('contact', state), [collectComponentState])}
          />
          <Publish/>
        </main>
        <Footer
          footerData={finaleDataReview.content.footer} 
          onStateChange={useCallback((state) => collectComponentState('footer', state), [collectComponentState])}
          userId={finaleDataReview.userId}
          publishedId={finaleDataReview.publishedId}
          templateSelection={finaleDataReview.templateSelection}
        />
      </div>
    </ThemeProvider>
  );
}