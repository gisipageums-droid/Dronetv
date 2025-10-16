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

// import { useEffect } from "react";

export default function App() {
 const { finaleDataReview, setFinalTemplate,setFinaleDataReview } = useTemplate();
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

  // Move ALL hooks above any conditional return!
  // Do NOT call hooks inside if statements or after a conditional return.
  const headerStateChange = useCallback((state) => collectComponentState('header', state), [collectComponentState]);
  const heroStateChange = useCallback((state) => collectComponentState('hero', state), [collectComponentState]);
  const aboutStateChange = useCallback((state) => collectComponentState('about', state), [collectComponentState]);
  const profileStateChange = useCallback((state) => collectComponentState('profile', state), [collectComponentState]);
  const productsStateChange = useCallback((state) => collectComponentState('products', state), [collectComponentState]);
  const servicesStateChange = useCallback((state) => collectComponentState('services', state), [collectComponentState]);
  const galleryStateChange = useCallback((state) => collectComponentState('gallery', state), [collectComponentState]);
  const blogStateChange = useCallback((state) => collectComponentState('blog', state), [collectComponentState]);
  const testimonialsStateChange = useCallback((state) => collectComponentState('testimonials', state), [collectComponentState]);
  const usedByStateChange = useCallback((state) => collectComponentState("usedBy", state), [collectComponentState]);
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
    // The className here is no longer needed as the useEffect handles the root element
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
        usedByData={finaleDataReview.content.UsedBy}
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
      <Blog 
      blogData={finaleDataReview.content.blog}
      onStateChange={blogStateChange}
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
