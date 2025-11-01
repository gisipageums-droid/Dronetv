import React, { useState, useEffect } from 'react';
import { Award, Star, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. Company Interface - covers API fields
interface Company {
  companyName: string;
  companyLogo?: string;
  heroHeadline?: string;
  heroBackground?: string;
  aboutImage?: string;
  aboutDescription?: string;
  aboutExperienceYears?: number;
  aboutTeamExperience?: string;
  city?: string;
  state?: string;
  timestamp?: string;
  industry?: string;
  category?: string;
  products?: { title?: string; image?: string; description?: string;[key: string]: any }[];
  services?: { title?: string; description?: string;[key: string]: any }[];
  companyValues?: { title?: string; description?: string;[key: string]: any }[];
  testimonials?: { rating?: number }[];
  productsTitle?: string;
}

const FeaturedCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  console.log("companies", companies);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {

    axios.get('https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=main')
      .then(response => {
        console.log("response", response.data);
        if (response.data.success == true) {

          setCompanies(response.data.cards.slice(0, 6)); // Top 6 featured

        }
        else {
          setCompanies([]);
        }

      })
      .catch(error => {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      });
    // const fetchCompanies = async () => {
    //   try {
    //     const res = await fetch('https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?viewType=main');
    //     const data = await res.json();
    //     setCompanies(data.slice(0, 6)); // Top 6 featured
    //   } catch {
    //     setCompanies([]);
    //   }
    // };
    // fetchCompanies();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-yellow-300 via-yellow-300 to-yellow-300 relative overflow-hidden min-h-screen">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, #FFEB3B 25%, transparent 25%), linear-gradient(-45deg, #FDD835 25%, transparent 25%)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }}
        ></div>
      </div>
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200/20 rounded-full animate-pulse blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-yellow-500/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tight">
            <span className="">
              Featured Companies
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Industry leaders shaping the future of drone technology, artificial intelligence, and geospatial solutions with innovative products and groundbreaking research
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {

            companies.length > 0
              ? companies.map((company, index) => {
                const title = company.heroHeadline || company.companyName || 'Unnamed Company';
                const imgSrc = (company as any).previewImage || (company as any).heroImage || company.companyLogo || '';
                const desc =
                  company.aboutDescription ||
                  (company as any).companyDescription ||
                  company.productsTitle ||
                  'No company description.';
                const locationText = (company as any).location || company.city || company.state || 'India';
                const year = (company as any).publishedDate || (company as any).createdAt || (company as any).lastModified || company.timestamp;
                const sinceText = year ? `Since ${new Date(year).getFullYear()}` : 'Since 2020';
                const servicesCount =
                  (company.services && company.services.length) || (company as any).servicesCount || 'N/A';
                const productsList = company.products || [];
                const productsCount = productsList.length || (company as any).productsCount || 'N/A';
                const industry =
                  company.industry || ((company as any).sectors && (company as any).sectors[0]) || company.category || 'Drone/Tech';
                const rating =
                  company.testimonials && company.testimonials.length
                    ? (
                      company.testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) /
                      company.testimonials.length
                    ).toFixed(1)
                    : '5.0';
                const companySlug =
                  (company as any).urlSlug || (company as any).cleanUrl || company.publishedId || encodeURIComponent(company.companyName || `company-${index}`);

                return (
                  <div
                    key={company.publishedId || index}
                    className={`group relative bg-[#f1ee8e] rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 opacity-100 translate-y-0`}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                      animation: `fadeInUp 0.8s ease-out ${index * 150}ms both`
                    }}
                    onMouseEnter={() => setHoveredCard(company.companyName)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => navigate(`${company.templateSelection=="template-1"?`/company/${company.companyName || companySlug}`:`/companies/${company.companyName || companySlug}`}`)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Company Image Header */}
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={company.companyName}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">No image</div>
                      )}

                      {/* Black overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/80 transition-all duration-500"></div>

                      {/* Logo Overlay */}
                      <div className="absolute top-4 left-4">
                        <div className="relative bg-yellow-400/20 backdrop-blur-sm rounded-2xl p-3 border border-yellow-400/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-yellow-400/30 transition-all duration-500">
                          {(company as any).companyLogo || (company as any).heroImage ? (
                            <img
                              src={(company as any).companyLogo || (company as any).heroImage}
                              alt={company.companyName}
                              className="h-8 w-8 object-contain bg-white"
                            />
                          ) : (
                            <span className="text-yellow-500 font-black text-xl">?</span>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-400/30">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-bold text-yellow-400">{rating}</span>
                      </div>

                      {/* Industry Badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-yellow-400/20 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-400/30">
                          {industry}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Company Header */}
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                          {title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {locationText}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            {sinceText}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm line-clamp-3">
                        {desc}
                      </p>

                      {/* Experience & Courses */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {/* Experience */}
                        <div className="text-center p-2 sm:p-3 bg-yellow-200 rounded-lg sm:rounded-xl group-hover:bg-yellow-300 transition-colors duration-300">
                          <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-800 mx-auto mb-1 transition-colors duration-300" />
                          <div className="text-xs sm:text-sm font-bold text-yellow-800">
                            {company.aboutExperienceYears ? `${company.aboutExperienceYears} yrs` : '5+ yrs'}
                          </div>
                          <div className="text-xs text-yellow-700">Experience</div>
                        </div>

                        {/* Courses / Services Count */}
                        <div className="text-center p-2 sm:p-3 bg-yellow-300 rounded-lg sm:rounded-xl group-hover:bg-yellow-400 transition-colors duration-300">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-900 mx-auto mb-1" />
                          <div className="text-xs sm:text-sm font-bold text-yellow-900">
                            {servicesCount}
                          </div>
                          <div className="text-xs text-yellow-800">Services</div>
                        </div>
                      </div>

                      {/* Specialties (use products as badges) */}
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {productsList.slice(0, 3).map((prod, idx) => (
                            <span
                              key={prod.title || prod.image || idx}
                              className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium group-hover:bg-yellow-400 transition-colors duration-300"
                            >
                              {prod.title || prod.description || 'Product'}
                            </span>
                          ))}
                          {productsCount && productsCount !== 'N/A' && productsCount > 3 && (
                            <span className="bg-yellow-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium group-hover:bg-yellow-400 transition-colors duration-300">
                              +{productsCount - 3} more
                            </span>
                          )}
                          {!productsList.length && productsCount && productsCount !== 'N/A' && (
                            <span className="bg-yellow-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                              {productsCount} products
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Achievements (companyValues) */}
                      <div className="mb-3 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                          <Award className="h-3 w-3 flex-shrink-0" />
                          Achievements:
                        </h4>
                        <div className="space-y-1">
                          {company.companyValues?.slice(0, 2).map((value, idx) => (
                            <div
                              key={value.title || value.description || idx}
                              className="text-xs text-gray-600 flex items-start gap-1"
                            >
                              <div className="w-1 h-1 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <b>{value.title}:</b> <span>{value.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="flex justify-center pt-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/company/${(company as any).urlSlug || companySlug}`);
                          }}
                          className="group/btn bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                          <span>View Profile</span>
                          <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                    {/* Yellow Glow Border on Hover */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-yellow-400/30 group-hover:shadow-lg group-hover:shadow-yellow-400/20 transition-all duration-500"></div>
                  </div>
                );
              })
              : "No featured companies available at the moment."
          }


        </div>
        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-black mb-4">Want to be featured?</h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Join our network of innovative companies shaping the future of drone technology and reach thousands of industry professionals.
            </p>
            <button
              className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => navigate('/partner')}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
