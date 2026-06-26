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
import { useParams, useNavigate } from "react-router-dom";
import GallerySection from "./components/Gallery";
import CompanyProfile from "./components/Profile"
import Back from "./components/Back"
import { COMPANY_API, LAMBDA } from '../../../../lib/apiConfig';

export default function App() {
  const { finaleDataReview, setFinaleDataReview } = useTemplate();
  const { urlSlug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTemplateData(slug: string) {
    try {
      setIsLoading(true);
      const response = await fetch(COMPANY_API ? `${COMPANY_API}/template?companyName=${encodeURIComponent(slug)}` : `${LAMBDA.companyPreviewLoad}/template?companyName=${encodeURIComponent(slug)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const company = data.data;

      // If this is a template-2 company, redirect to the correct route
      if (company?.templateSelection === 'template-2') {
        const correctSlug = company.urlSlug || slug;
        navigate(`/companies/${correctSlug}`, { replace: true });
        return;
      }

      setFinaleDataReview(company);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching template data:", error);
      setError(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
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
        companyName={finaleDataReview.companyName}

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
        galleryData={finaleDataReview.content.gallery} />
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
      <Back />
      <Footer
        content={finaleDataReview.content.footer}
      />
    </div>
  );
}
