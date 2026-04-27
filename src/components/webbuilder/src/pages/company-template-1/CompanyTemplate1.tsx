import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Import your sections
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProductsSection from './components/ProductsSection';
import ClientsSection from './components/ClientsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

interface Company {
  [key: string]: any;
}

const CompanyTemplate1: React.FC = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companySlug) return;

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const decodedCompanyName = decodeURIComponent(companySlug);
        const res = await fetch('https://80lbhj32ja.execute-api.ap-south-1.amazonaws.com/singlecompany', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName: decodedCompanyName })
        });

        const data = await res.json();
        // API returns an array? (If so, get first element. Otherwise, use as object)
        let c = null;
        if (Array.isArray(data) && data.length > 0) {
          c = data[0];
        } else if (data && typeof data === 'object') {
          c = data;
        }
        // --- Console debug for each section props ---
        if (c && typeof c === 'object') {
          console.log('=== Navigation ===', {
            navigationLinks: c.navigationLinks,
            companyLogo: c.companyLogo,
          });
          console.log('=== HeroSection ===', {
            headline: c.heroHeadline,
            subheadline: c.heroSubheadline,
            background: c.heroBackground || c.aboutImage,
            primaryCTA: c.primaryCTA,
            secondaryCTA: c.secondaryCTA,
            companyLogo: c.companyLogo,
          });
          console.log('=== AboutSection ===', {
            aboutTitle: c.aboutTitle,
            aboutDescription: c.aboutDescription,
            aboutTeamExperience: c.aboutTeamExperience,
            aboutImage: c.aboutImage,
            aboutExperienceYears: c.aboutExperienceYears,
            companyValues: c.companyValues,
            videoEmbedUrl: c.videoEmbedUrl,
          });
          console.log('=== ServicesSection ===', {
            servicesTitle: c.servicesTitle,
            servicesDescription: c.servicesDescription,
            services: c.services,
          });
          console.log('=== ProductsSection ===', {
            productsTitle: c.productsTitle,
            productCategories: c.productCategories,
            products: c.products,
          });
          console.log('=== ClientsSection ===', {
            clientsTitle: c.clientsTitle,
            clients: c.clients,
            clientLogos: c.clientLogos,
            testimonials: c.testimonials,
          });
          console.log('=== ContactSection ===', {
            contactTitle: c.contactTitle,
            email: c.email,
            phone: c.phone,
            addressLine: c.addressLine,
            city: c.city,
            state: c.state,
            pinCode: c.pinCode,
            mapEmbedUrl: c.mapEmbedUrl,
            contactFormText: c.contactFormText,
            submitButtonText: c.submitButtonText,
          });
          console.log('=== Footer ===', {
            footerLogo: c.footerLogo,
            footerText: c.footerText,
            footerNavLinks: c.footerNavLinks,
            socialLinks: c.socialLinks,
          });
        }
        setCompany(c);
      } catch (e) {
        setCompany(null);
      }
      setLoading(false);
    };

    fetchCompany();
  }, [companySlug]);

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (!company) return <div className="text-center py-20 text-xl">Company not found.</div>;

  // You can also log here, but logging in useEffect after fetch will catch API mapping errors early

  return (
    <div className="bg-white">
      <Navigation
        navigationLinks={company.navigationLinks}
        companyLogo={company.companyLogo}
        companyName={company.companyName}
      />
      <section id="home">
        <HeroSection
          headline={company.heroHeadline}
          subheadline={company.heroSubheadline}
          background={company.heroBackground || company.aboutImage}
          primaryCTA={company.primaryCTA}
          secondaryCTA={company.secondaryCTA}
          companyLogo={company.companyLogo}
        />
      </section>
      <section id="about">
        <AboutSection
          aboutTitle={company.aboutTitle}
          aboutDescription={company.aboutDescription}
          aboutTeamExperience={company.aboutTeamExperience}
          aboutImage={company.aboutImage}
          aboutExperienceYears={company.aboutExperienceYears}
          companyValues={company.companyValues}
          videoEmbedUrl={company.videoEmbedUrl}
        />
      </section>
      <section id="services">
        <ServicesSection
          servicesTitle={company.servicesTitle}
          servicesDescription={company.servicesDescription}
          services={company.services}
        />
      </section>
      <section id="products">
        <ProductsSection
          productsTitle={company.productsTitle}
          productCategories={company.productCategories}
          products={company.products}
        />
      </section>
      <section id="clients">
        <ClientsSection
          clientsTitle={company.clientsTitle}
          clients={company.clients}
          clientLogos={company.clientLogos}
          testimonials={company.testimonials}
        />
      </section>
      <section id="contact">
        <ContactSection
          contactTitle={company.contactTitle}
          email={company.email}
          phone={company.phone}
          addressLine={company.addressLine}
          city={company.city}
          state={company.state}
          pinCode={company.pinCode}
          mapEmbedUrl={company.mapEmbedUrl}
          contactFormText={company.contactFormText}
          submitButtonText={company.submitButtonText}
        />
      </section>
      <Footer
        footerLogo={company.footerLogo}
        footerText={company.footerText}
        footerNavLinks={company.footerNavLinks}
        socialLinks={company.socialLinks}
        email={company.email}
        phone={company.phone}
        address={company.addressLine || company.address}
        services={company.services && Array.isArray(company.services)
          ? company.services.map((s: any) => s.title || s.name || s.service || '')
          : []
        }
      />

    </div>
  );

};

export default CompanyTemplate1;
