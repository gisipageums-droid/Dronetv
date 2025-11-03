import { useEffect, useState } from "react";
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
import { useTemplate } from "../../../context/context";
import { useLocation, useParams } from "react-router-dom";
import GallerySection from "./components/Gallery";
import CompanyProfile from "./components/Profile"
// import { useEffect } from "react";

export default function App() {
  const { finaleDataReview, setFinaleDataReview } = useTemplate();
   const { urlSlug } = useParams(); // Get both parameters from URL
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   // Function to fetch template data
   async function fetchTemplateData(urlSlug: string) {
     try {
       setIsLoading(true);
       const response = await fetch(`https://ykcimvca79.execute-api.ap-south-1.amazonaws.com/dev/template?companyName=${urlSlug}`);
       
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
       
       const data = await response.json();
       setFinaleDataReview(data.data);
       setIsLoading(false);
     } catch (error) {
       console.error("Error fetching template data:", error);
       setError(error.message);
       setIsLoading(false);
     }
   }
 
   useEffect(() => {
     // If we have both publishedId and userId from URL, fetch the data
     if (urlSlug) {
       fetchTemplateData(urlSlug);
     } else {
       setError("Required parameters not found in URL");
       setIsLoading(false);
     }
   }, [urlSlug]);
 
   if (isLoading) {
     return (
       <div className="min-h-screen bg-background text-foreground theme-transition flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="min-h-screen bg-background text-foreground theme-transition flex items-center justify-center">
         <div className="text-center">
           <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
           <p className="text-muted-foreground mb-4">{error}</p>
           <button 
             onClick={() => window.location.reload()}
             className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
           >
             Try Again
           </button>
         </div>
       </div>
     );
   }
 
   if (!finaleDataReview || !finaleDataReview.content) {
     return (
       <div className="min-h-screen bg-background text-foreground theme-transition flex items-center justify-center">
         <div className="text-center">
           <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
           <p className="text-muted-foreground">The requested company page could not be loaded.</p>
         </div>
       </div>
     );
   }

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header
        headerData={finaleDataReview.content.header}
       
      />
      <Hero
        heroData={finaleDataReview.content.hero}

      />
      <UsedBy
       usedByData={finaleDataReview.content.usedBy}
      />
      <About 
        aboutData={finaleDataReview.content.about}
      />
       <CompanyProfile
              profileData={finaleDataReview.content.profile}
            />
      <Services 
      serviceData={finaleDataReview.content.services}
      />
      <Products 
      productData={finaleDataReview.content.products} 
     
      />
      
      <GallerySection 
          galleryData={finaleDataReview.content.gallery}/>
      <Blog 
      blogData={finaleDataReview.content.blog}
    
      />
      <Testimonials 
      content={finaleDataReview.content.testimonials}
      
       />
      <Contact
      content={finaleDataReview.content.contact}
      publishedId={finaleDataReview.publishedId}
      />
      <Footer 
      content={finaleDataReview.content.footer}
      />
    </div>
  );
}
