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
// import { p } from "framer-motion/client";

export default function App() {
  const { finaleDataReview, setFinalTemplate ,setFinaleDataReview} = useTemplate();
  const [componentStates, setComponentStates] = useState({});
  const { pub, userId } = useParams();


  useEffect(() => {
    async function fetchData() {
 try {
      const response = await fetch(
        `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${pub}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Published Details API Error:", errorText);

        if (response.status === 401) {
          throw new Error("User not authenticated.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to access this template.");
        } else if (response.status === 404) {
          throw new Error("Template not found.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Published Details Response:", data);
      setFinaleDataReview(data);
      
      return data;
    } catch (error) {
      console.error("Error fetching published details:", error);
      throw error;
    }
  }
    fetchData();

  }, [pub, userId]);
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

  // Add a loading check for finaleDataReview
  const isLoading =
    !finaleDataReview ||
    !finaleDataReview.content ||
    Object.keys(finaleDataReview.content).length === 0;

  // Memoized callbacks for each component
  const headerStateChange = useCallback((state) => collectComponentState('header', state), [collectComponentState]);
  const heroStateChange = useCallback((state) => collectComponentState('hero', state), [collectComponentState]);
  const aboutStateChange = useCallback((state) => collectComponentState('about', state), [collectComponentState]);
  const profileStateChange = useCallback((state) => collectComponentState('profile', state), [collectComponentState]);
  const productsStateChange = useCallback((state) => collectComponentState('products', state), [collectComponentState]);
  const servicesStateChange = useCallback((state) => collectComponentState('services', state), [collectComponentState]);
  const galleryStateChange = useCallback((state) => collectComponentState('gallery', state), [collectComponentState]);
  const blogStateChange = useCallback((state) => collectComponentState('blog', state), [collectComponentState]);
  const testimonialsStateChange = useCallback((state) => collectComponentState('testimonials', state), [collectComponentState]);
  const clientsStateChange = useCallback((state) => collectComponentState('clients', state), [collectComponentState]);
  const contactStateChange = useCallback((state) => collectComponentState('contact', state), [collectComponentState]);
  const footerStateChange = useCallback((state) => collectComponentState('footer', state), [collectComponentState]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

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
          <Hero 
            heroData={finaleDataReview.content.hero}
            onStateChange={heroStateChange}
            publishedId={finaleDataReview.publishedId}
            userId={finaleDataReview.userId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <About 
            aboutData={finaleDataReview.content.about}
            onStateChange={aboutStateChange}
             userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Profile
            profileData={finaleDataReview.content.profile}
            onStateChange={profileStateChange}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
            <Product 
              productData={finaleDataReview.content.products}
              onStateChange={productsStateChange}
              userId={finaleDataReview.userId}
              publishedId={finaleDataReview.publishedId}
              templateSelection={finaleDataReview.templateSelection}
            />
          <Services 
            serviceData={finaleDataReview.content.services}
            onStateChange={servicesStateChange}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Gallery 
            galleryData={finaleDataReview.content.gallery}
            onStateChange={galleryStateChange}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Blog 
            blogData={finaleDataReview.content.blog}
            onStateChange={blogStateChange}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Testimonials 
            testimonialsData={finaleDataReview.content.testimonials}
            onStateChange={testimonialsStateChange}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Clients 
            clientData={finaleDataReview.content.clients}
            onStateChange={clientsStateChange}
            userId={finaleDataReview.userId}
            publishedId={finaleDataReview.publishedId}
            templateSelection={finaleDataReview.templateSelection}
          />
          <Contact 
            contactData={finaleDataReview.content.contact}
            onStateChange={contactStateChange}
          />
          <Publish/>
          <Back />
        </main>
        <Footer
          footerData={finaleDataReview.content.footer} 
          onStateChange={footerStateChange}
          userId={finaleDataReview.userId}
          publishedId={finaleDataReview.publishedId}
          templateSelection={finaleDataReview.templateSelection}
        />
      </div>
    </ThemeProvider>
  );
}