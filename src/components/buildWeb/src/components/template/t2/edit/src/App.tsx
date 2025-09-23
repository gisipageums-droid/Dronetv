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
import { useEffect, useState, useCallback } from "react";
import Publish from "./components/Publish";
import Gallery from "./components/Gallery";
import Profile from "./components/Profile";
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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header
          headerData={AIGenData.content.company}
          onStateChange={useCallback(
            (state) => collectComponentState("header", state),
            [collectComponentState]
          )}
          publishedId={AIGenData.publishedId}
          userId={AIGenData.userId}
          templateSelection={AIGenData.templateSelection}
        />
        <main>
          <Hero
            heroData={AIGenData.content.hero}
            onStateChange={useCallback(
              (state) => collectComponentState("hero", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <About
            aboutData={AIGenData.content.about}
            onStateChange={useCallback(
              (state) => collectComponentState("about", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Profile
            profileData={AIGenData.content.profile}
            onStateChange={useCallback(
              (state) => collectComponentState("profile", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Product
            productData={AIGenData.content.products}
            onStateChange={useCallback(
              (state) => collectComponentState("products", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Services
            serviceData={AIGenData.content.services}
            onStateChange={useCallback(
              (state) => collectComponentState("services", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Gallery
            galleryData={AIGenData.content.gallery}
            onStateChange={useCallback(
              (state) => collectComponentState("gallery", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Blog
            blogData={AIGenData.content.blog}
            onStateChange={useCallback(
              (state) => collectComponentState("blog", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Testimonials
            testimonialsData={AIGenData.content.testimonials}
            onStateChange={useCallback(
              (state) => collectComponentState("testimonials", state),
              [collectComponentState]
            )}
          />
          <Clients
            clientData={AIGenData.content.clients}
            onStateChange={useCallback(
              (state) => collectComponentState("clients", state),
              [collectComponentState]
            )}
            publishedId={AIGenData.publishedId}
            userId={AIGenData.userId}
            templateSelection={AIGenData.templateSelection}
          />
          <Contact
            onStateChange={useCallback(
              (state) => collectComponentState("contact", state),
              [collectComponentState]
            )}
          />
          <Publish />
        </main>
        <Footer
          footerData={AIGenData.content.services}
          footerLogo={AIGenData.content.company}
          onStateChange={useCallback(
            (state) => collectComponentState("footer", state),
            [collectComponentState]
          )}
          publishedId={AIGenData.publishedId}
          userId={AIGenData.userId}
          templateSelection={AIGenData.templateSelection}
        />
      </div>
    </ThemeProvider>
  );
}
