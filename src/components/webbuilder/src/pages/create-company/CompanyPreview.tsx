import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download } from 'lucide-react';

const CompanyPreview: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('companyFormData');
    if (!storedData) {
      navigate('/create-company');
      return;
    }
    setFormData(JSON.parse(storedData));
  }, [navigate]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF0000] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your company page...</p>
        </div>
      </div>
    );
  }

  const isTemplate2 = templateId === '2';

  return (
    <div className={`min-h-screen ${isTemplate2 ? 'bg-black text-white' : 'bg-white'}`}>
      {/* Preview Header */}
      <header className="bg-black text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/create-company')}
                className="flex items-center gap-2 text-white hover:text-[#FFD400] transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Form
              </button>
              <div className="text-lg font-bold">
                Company Preview - Template {templateId}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/create-company')}
                className="flex items-center gap-2 bg-[#FFD400] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#FFD400]/90 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button className="flex items-center gap-2 bg-[#FF0000] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#FF0000]/90 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="pt-8">
        <div className="container mx-auto px-4">
          <div className={`${isTemplate2 ? 'bg-black' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
            {/* Hero Section Preview */}
            <section className={`${isTemplate2 ? 'bg-black' : 'bg-[#FFD400]'} py-20 text-center relative`}>
              <div className="container mx-auto px-4">
                <h1 className={`text-6xl font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-4`}>
                  {formData.heroHeadline || 'Your Company Headline'}
                </h1>
                <p className={`text-xl ${isTemplate2 ? 'text-gray-300' : 'text-black/80'} max-w-2xl mx-auto mb-8`}>
                  {formData.heroSubheadline || 'Your company subheadline goes here'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className={`${isTemplate2 ? 'bg-[#FFD400] text-black' : 'bg-[#FF0000] text-white'} px-8 py-4 rounded-full font-semibold`}>
                    {formData.primaryCTA?.text || 'Explore Products'}
                  </button>
                  <button className={`${isTemplate2 ? 'bg-[#FF0000] text-white' : 'bg-black text-white'} px-8 py-4 rounded-full font-semibold`}>
                    {formData.secondaryCTA?.text || 'Contact Us'}
                  </button>
                </div>
              </div>
            </section>

            {/* About Section Preview */}
            <section className={`py-20 ${isTemplate2 ? 'bg-black' : 'bg-white'}`}>
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-4`}>
                    {formData.aboutTitle || 'About Our Company'}
                  </h2>
                  <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#FFD400]' : 'bg-[#FFD400]'} mx-auto`}></div>
                </div>
                <div className="max-w-4xl mx-auto text-center">
                  <div className={`w-32 h-32 ${isTemplate2 ? 'bg-gray-800' : 'bg-gray-200'} rounded-full mx-auto mb-8 flex items-center justify-center`}>
                    <span className={`${isTemplate2 ? 'text-gray-500' : 'text-gray-500'}`}>Image</span>
                  </div>
                  <p className={`${isTemplate2 ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed mb-8`}>
                    {formData.aboutDescription || 'Your company description will appear here. Tell your story and highlight your expertise.'}
                  </p>
                  
                  {/* Company Values */}
                  {formData.companyValues && formData.companyValues.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {formData.companyValues.map((value: any, index: number) => (
                        <div key={index} className={`${isTemplate2 ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-6`}>
                          <h3 className={`font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-2`}>{value.title}</h3>
                          <p className={`text-sm ${isTemplate2 ? 'text-gray-400' : 'text-gray-600'}`}>{value.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Services Section Preview */}
            {formData.services && formData.services.length > 0 && (
              <section className={`py-20 ${isTemplate2 ? 'bg-black' : 'bg-[#FFD400]'}`}>
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-4`}>
                      {formData.servicesTitle || 'Our Services'}
                    </h2>
                    <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#FFD400]' : 'bg-black'} mx-auto`}></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {formData.services.map((service: any, index: number) => (
                      <div key={index} className={`${isTemplate2 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-black hover:text-white'} rounded-lg p-6 transition-colors group`}>
                        <div className={`w-16 h-16 ${isTemplate2 ? 'bg-[#FF0000]' : 'bg-[#FF0000]'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <span className="text-white font-bold">{service.icon.charAt(0).toUpperCase()}</span>
                        </div>
                        <h3 className={`text-xl font-bold mb-4 ${isTemplate2 ? 'text-white group-hover:text-[#FFD400]' : 'text-black group-hover:text-white'}`}>
                          {service.title}
                        </h3>
                        <p className={`${isTemplate2 ? 'text-gray-400 group-hover:text-gray-300' : 'text-black/80 group-hover:text-gray-300'}`}>
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Products Section Preview */}
            {formData.products && formData.products.length > 0 && (
              <section className={`py-20 ${isTemplate2 ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-4`}>
                      {formData.productsTitle || 'Our Products'}
                    </h2>
                    <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#FFD400]' : 'bg-[#FFD400]'} mx-auto`}></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {formData.products.map((product: any, index: number) => (
                      <div key={index} className={`${isTemplate2 ? 'bg-black border border-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className={`h-48 ${isTemplate2 ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center`}>
                          <span className={`${isTemplate2 ? 'text-gray-500' : 'text-gray-500'}`}>Product Image</span>
                        </div>
                        <div className="p-6">
                          <h3 className={`text-xl font-bold ${isTemplate2 ? 'text-white' : 'text-black'} mb-3`}>{product.title}</h3>
                          <p className={`${isTemplate2 ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{product.description}</p>
                          <button className={`${isTemplate2 ? 'text-[#FF0000] hover:text-[#FFD400]' : 'text-[#FF0000] hover:text-[#FF0000]/80'} font-semibold`}>
                            Learn More →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Testimonials Section Preview */}
            {formData.testimonials && formData.testimonials.length > 0 && (
              <section className={`py-20 ${isTemplate2 ? 'bg-black' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-4`}>
                      What Our Clients Say
                    </h2>
                    <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#FFD400]' : 'bg-[#FFD400]'} mx-auto`}></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {formData.testimonials.map((testimonial: any, index: number) => (
                      <div key={index} className={`${isTemplate2 ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-[#FFD400]">★</span>
                          ))}
                        </div>
                        <p className={`${isTemplate2 ? 'text-gray-300' : 'text-gray-600'} mb-6 italic`}>
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${isTemplate2 ? 'bg-gray-800' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                            <span className={`${isTemplate2 ? 'text-gray-500' : 'text-gray-500'} text-xs`}>Photo</span>
                          </div>
                          <div>
                            <h4 className={`font-semibold ${isTemplate2 ? 'text-white' : 'text-black'}`}>{testimonial.name}</h4>
                            <p className={`text-sm ${isTemplate2 ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section Preview */}
            <section className={`py-20 ${isTemplate2 ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#FFD400]' : 'text-black'} mb-4`}>
                    {formData.contactTitle || 'Get In Touch'}
                  </h2>
                  <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#FFD400]' : 'bg-[#FFD400]'} mx-auto mb-6`}></div>
                  <p className={`${isTemplate2 ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                    {formData.contactFormText || 'Ready to work with us? Send us a message.'}
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16">
                  <div className={`${isTemplate2 ? 'bg-black' : 'bg-gray-50'} rounded-lg p-8`}>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent`}
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent`}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Subject"
                        className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent`}
                      />
                      <textarea
                        rows={6}
                        placeholder="Your Message"
                        className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent resize-none`}
                      />
                      <button
                        type="submit"
                        className="w-full bg-[#FF0000] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#FF0000]/90 transition-colors"
                      >
                        {formData.submitButtonText || 'Send Message'}
                      </button>
                    </form>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${isTemplate2 ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg h-64 flex items-center justify-center`}>
                      <span className={`${isTemplate2 ? 'text-gray-500' : 'text-gray-500'}`}>Map Placeholder</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
                          <span className="text-white">@</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isTemplate2 ? 'text-white' : 'text-black'}`}>Email</h4>
                          <p className={`${isTemplate2 ? 'text-gray-400' : 'text-gray-600'}`}>{formData.email || 'your@email.com'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
                          <span className="text-white">📞</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isTemplate2 ? 'text-white' : 'text-black'}`}>Phone</h4>
                          <p className={`${isTemplate2 ? 'text-gray-400' : 'text-gray-600'}`}>{formData.phone || '+1 (555) 123-4567'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
                          <span className="text-white">📍</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isTemplate2 ? 'text-white' : 'text-black'}`}>Address</h4>
                          <p className={`${isTemplate2 ? 'text-gray-400' : 'text-gray-600'}`}>{formData.address || 'Your Company Address'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Preview */}
            <footer className="bg-black text-white py-12">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4">
                    Your<span className="text-[#FFD400]">Company</span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    {formData.footerText || '© 2025 Your Company. All rights reserved.'}
                  </p>
                  <div className="flex justify-center gap-4">
                    {formData.socialLinks.linkedin && (
                      <a href={formData.socialLinks.linkedin} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        LinkedIn
                      </a>
                    )}
                    {formData.socialLinks.instagram && (
                      <a href={formData.socialLinks.instagram} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        Instagram
                      </a>
                    )}
                    {formData.socialLinks.youtube && (
                      <a href={formData.socialLinks.youtube} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        YouTube
                      </a>
                    )}
                    {formData.socialLinks.website && (
                      <a href={formData.socialLinks.website} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyPreview;