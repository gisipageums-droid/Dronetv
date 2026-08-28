import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Products from "./components/Products";
import Blog from "./components/Blog";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import { useTemplate } from "../../../context/context";
import { useParams, useNavigate } from "react-router-dom";
import Documents from "./components/Documents";
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

      if (company?.publishedId) {
        const base = COMPANY_API || LAMBDA.companyPreviewLoad;
        fetch(`${base}/${company.publishedId}/track-view`, { method: "POST" }).catch(() => {});
      }
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

  // Scroll to the section named in the URL hash (e.g. #contact) once content
  // has loaded. The 300ms delay races against a user who starts scrolling
  // or tapping the page themselves right after it loads - this fires anyway
  // and yanks their scroll position back to the hash target mid-interaction
  // (looked exactly like "tapping the Contact form scrolls it back to top",
  // since #contact is usually where they land). Cancel the pending scroll
  // the moment the user shows any sign of interacting on their own.
  useEffect(() => {
    if (isLoading || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });
    window.addEventListener('pointerdown', cancel, { once: true });
    window.addEventListener('keydown', cancel, { once: true });
    const timer = setTimeout(() => {
      if (!cancelled) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [isLoading]);

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
    <div className="w-full overflow-x-hidden">
      <Header
        headerData={finaleDataReview.content.header}

      />
      <Hero
        heroData={finaleDataReview.content.hero}
        companyName={finaleDataReview.companyName}

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
      <Documents documents={finaleDataReview.content.documents} />
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
    </div>
  );
}
