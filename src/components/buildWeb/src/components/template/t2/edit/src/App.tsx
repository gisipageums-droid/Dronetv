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
import { useEffect, useState, useCallback } from "react"; // Add useCallback
import Publish from "./components/Publish";

export default function App() {
  const { AIGenData, isPublishedTriggered, setFinalTemplate } = useTemplate();
  const [componentStates, setComponentStates] = useState<Record<string, any>>({});

  // Memoize the collectComponentState function
  const collectComponentState = useCallback((componentName: string, state: any) => {
    setComponentStates((prev: Record<string, any>) => ({
      ...prev,
      [componentName]: state
    }));
  }, []);

  // When isPublishedTriggered becomes true, update finalTemplate
  useEffect(() => {
    if (isPublishedTriggered) {
      setFinalTemplate((prev: any) => ({
        ...prev,
        publishedId: AIGenData.publishedId,
        userId: AIGenData.userId,
        draftId: AIGenData.draftId,
        templateSelection: AIGenData.templateSelection,
        content: {
          ...prev.content,
          ...componentStates
        }
      }));
    }
  }, [isPublishedTriggered, componentStates, setFinalTemplate]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header 
          headerData={AIGenData.content.company}
          onStateChange={useCallback((state: any) => collectComponentState('header', state), [collectComponentState])}
        />
        <main>
          <Hero 
            heroData={AIGenData.content.hero}
            onStateChange={useCallback((state: any) => collectComponentState('hero', state), [collectComponentState])}
          />
          <About 
            aboutData={AIGenData.content.about}
            onStateChange={useCallback((state: any) => collectComponentState('about', state), [collectComponentState])}
          />
          <Services 
            serviceData={AIGenData.content.services}
            onStateChange={useCallback((state: any) => collectComponentState('services', state), [collectComponentState])}
          />
          <Product 
            productData={AIGenData.content.products}
            onStateChange={useCallback((state: any) => collectComponentState('products', state), [collectComponentState])}
          />
          <Blog 
            blogData={AIGenData.content.blog}
            onStateChange={useCallback((state: any) => collectComponentState('blog', state), [collectComponentState])}
          />
          <Testimonials 
            testimonialsData={AIGenData.content.testimonials}
            onStateChange={useCallback((state: any) => collectComponentState('testimonials', state), [collectComponentState])}
          />
          <Clients 
            clientData={AIGenData.content.clients}
            onStateChange={useCallback((state: any) => collectComponentState('clients', state), [collectComponentState])}
          />
          <Contact 
            onStateChange={useCallback((state: any) => collectComponentState('contact', state), [collectComponentState])}
          />
          <Publish/>
        </main>
        <Footer 
          onStateChange={useCallback((state: any) => collectComponentState('footer', state), [collectComponentState])}
        />
      </div>
    </ThemeProvider>
  );
}
