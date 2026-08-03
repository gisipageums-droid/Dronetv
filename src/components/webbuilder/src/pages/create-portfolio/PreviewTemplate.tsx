import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download } from 'lucide-react';

const PreviewTemplate: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('portfolioFormData');
    if (!storedData) {
      navigate('/create-portfolio');
      return;
    }
    setFormData(JSON.parse(storedData));
  }, [navigate]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-surface-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF0000] mx-auto mb-4"></div>
          <p className="text-ink-paragraph">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-card">
      {/* Preview Header */}
      <header className="bg-ink text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/create-portfolio/professional/form')}
                className="flex items-center gap-2 text-white hover:text-[#FFD400] transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Editor
              </button>
              <div className="text-lg font-bold">
                Portfolio Preview - Template {templateId}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/create-portfolio/professional/form')}
                className="flex items-center gap-2 bg-[#FFD400] text-ink px-4 py-2 rounded-lg font-semibold hover:bg-[#FFD400]/90 transition-colors"
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
          <div className="bg-surface-card rounded-lg shadow-lg overflow-hidden">
            {/* Hero Section Preview */}
            <section className="bg-[#FFD400] py-20 text-center">
              <div className="container mx-auto px-4">
                <h1 className="text-6xl font-bold text-ink mb-4">
                  {formData.fullName || 'Your Name'}
                </h1>
                <div className="text-2xl font-semibold text-ink mb-6">
                  {formData.rotatingTitles ? 
                    formData.rotatingTitles.split(',')[0]?.trim() || 'Your Profession' 
                    : 'Your Profession'
                  }
                </div>
                <p className="text-lg text-ink/80 max-w-2xl mx-auto mb-8">
                  {formData.tagline || 'Your professional tagline goes here'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-[#FF0000] text-white px-8 py-4 rounded-full font-semibold">
                    {formData.button1Text || 'Hire Me'}
                  </button>
                  <button className="bg-ink text-white px-8 py-4 rounded-full font-semibold">
                    {formData.button2Text || 'Download CV'}
                  </button>
                </div>
              </div>
            </section>

            {/* About Section Preview */}
            <section className="py-20 bg-surface-card">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-ink mb-4">
                    About <span className="text-[#FF0000]">Me</span>
                  </h2>
                  <div className="w-24 h-1 bg-[#FFD400] mx-auto"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center">
                  <div className="w-32 h-32 bg-ink-light rounded-full mx-auto mb-8 flex items-center justify-center">
                    <span className="text-ink-caption">Photo</span>
                  </div>
                  <p className="text-ink-paragraph text-lg leading-relaxed mb-8">
                    {formData.bio || 'Your professional bio will appear here. Tell your story and highlight your expertise.'}
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <strong className="text-ink">Email:</strong>
                      <p className="text-ink-paragraph">{formData.email || 'your@email.com'}</p>
                    </div>
                    <div>
                      <strong className="text-ink">Phone:</strong>
                      <p className="text-ink-paragraph">{formData.phone || '+1 (555) 123-4567'}</p>
                    </div>
                    <div>
                      <strong className="text-ink">Location:</strong>
                      <p className="text-ink-paragraph">{formData.location || 'Your City, Country'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section Preview */}
            {formData.skills && formData.skills.length > 0 && (
              <section className="py-20 bg-ink-offwhite">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-ink mb-4">
                      My <span className="text-[#FF0000]">Skills</span>
                    </h2>
                    <div className="w-24 h-1 bg-[#FFD400] mx-auto"></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {formData.skills.map((skill: any, index: number) => (
                      <div key={index} className="bg-surface-card rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-ink">{skill.name}</span>
                          <span className="text-[#FF0000] font-bold">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-ink-light rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#FFD400] to-[#FF0000] h-2 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-ink-caption mt-1">{skill.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Services Section Preview */}
            {formData.services && formData.services.length > 0 && (
              <section className="py-20 bg-surface-card">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-ink mb-4">
                      My <span className="text-[#FF0000]">Services</span>
                    </h2>
                    <div className="w-24 h-1 bg-[#FFD400] mx-auto"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {formData.services.map((service: any, index: number) => (
                      <div key={index} className="bg-[#FFD400] rounded-lg p-6 text-center hover:bg-ink-charcoal hover:text-white transition-colors group">
                        <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold">{service.icon.charAt(0).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-4 group-hover:text-white">{service.title}</h3>
                        <p className="text-ink/80 group-hover:text-ink-light">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects Section Preview */}
            {formData.projects && formData.projects.length > 0 && (
              <section className="py-20 bg-ink-offwhite">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-ink mb-4">
                      My <span className="text-[#FF0000]">Portfolio</span>
                    </h2>
                    <div className="w-24 h-1 bg-[#FFD400] mx-auto"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {formData.projects.map((project: any, index: number) => (
                      <div key={index} className="bg-surface-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-ink-light flex items-center justify-center">
                          <span className="text-ink-caption">Project Image</span>
                        </div>
                        <div className="p-6">
                          <div className="text-xs font-bold text-[#FF0000] bg-[#FF0000]/10 px-2 py-1 rounded-full inline-block mb-3">
                            {project.category}
                          </div>
                          <h3 className="text-xl font-bold text-ink mb-3">{project.title}</h3>
                          <p className="text-ink-paragraph">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section Preview */}
            <section className="py-20 bg-[#FFD400]">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-ink mb-4">
                    Get In <span className="text-[#FF0000]">Touch</span>
                  </h2>
                  <div className="w-24 h-1 bg-ink mx-auto mb-6"></div>
                  <p className="text-ink/80 max-w-2xl mx-auto">
                    {formData.contactMessage || 'Ready to work together? Let\'s discuss your project.'}
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <div className="bg-surface-card rounded-lg p-8 shadow-lg">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="w-full px-4 py-3 border border-ink-light rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="w-full px-4 py-3 border border-ink-light rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Subject"
                        className="w-full px-4 py-3 border border-ink-light rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      />
                      <textarea
                        rows={6}
                        placeholder="Your Message"
                        className="w-full px-4 py-3 border border-ink-light rounded-lg focus:ring-2 focus:ring-[#FF0000] focus:border-transparent resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-[#FF0000] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#FF0000]/90 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Preview */}
            <footer className="bg-ink text-white py-12">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4">
                    Drone<span className="text-[#FFD400]">TV</span>
                  </div>
                  <p className="text-ink-caption mb-6">
                    {formData.footerText || '© 2024 Your Name. All rights reserved.'}
                  </p>
                  <div className="flex justify-center gap-4">
                    {formData.socialLinks.instagram && (
                      <a href={formData.socialLinks.instagram} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        Instagram
                      </a>
                    )}
                    {formData.socialLinks.linkedin && (
                      <a href={formData.socialLinks.linkedin} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        LinkedIn
                      </a>
                    )}
                    {formData.socialLinks.github && (
                      <a href={formData.socialLinks.github} className="text-[#FF0000] hover:text-[#FFD400] transition-colors">
                        GitHub
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

export default PreviewTemplate;