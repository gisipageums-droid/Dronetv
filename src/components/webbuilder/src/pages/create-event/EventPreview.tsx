import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download } from 'lucide-react';

const EventPreview: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('eventFormData');
    if (!storedData) {
      navigate('/create-event');
      return;
    }
    setFormData(JSON.parse(storedData));
  }, [navigate]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#DC2626] mx-auto mb-4"></div>
          <p className="text-ink-paragraph">Loading your event page...</p>
        </div>
      </div>
    );
  }

  const isTemplate2 = templateId === '2';

  return (
    <div className={`min-h-screen ${isTemplate2 ? 'bg-ink text-white' : 'bg-surface-main'}`}>
      {/* Preview Header */}
      <header className="bg-ink text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/create-event')}
                className="flex items-center gap-2 text-white hover:text-[#F8C400] transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Form
              </button>
              <div className="text-lg font-bold">
                Event Preview - Template {templateId}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/create-event')}
                className="flex items-center gap-2 bg-[#F8C400] text-ink px-4 py-2 rounded-lg font-semibold hover:bg-[#F8C400]/90 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button className="flex items-center gap-2 bg-[#DC2626] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#DC2626]/90 transition-colors">
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
          <div className={`${isTemplate2 ? 'bg-ink' : 'bg-surface-card'} rounded-lg shadow-lg overflow-hidden`}>
            {/* Hero Section Preview */}
            <section className={`${isTemplate2 ? 'bg-ink' : 'bg-[#F8C400]'} py-20 text-center relative`}>
              <div className="container mx-auto px-4">
                <h1 className={`text-6xl font-bold ${isTemplate2 ? 'text-[#F8C400]' : 'text-ink'} mb-4`}>
                  {formData.eventName || 'Your Event Name'}
                </h1>
                <div className={`flex justify-center gap-6 mb-8 ${isTemplate2 ? 'text-white' : 'text-ink'}`}>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{formData.eventDate || 'Event Date'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕒</span>
                    <span>{formData.eventTime || 'Event Time'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{formData.venue || 'Event Venue'}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className={`${isTemplate2 ? 'bg-[#F8C400] text-ink' : 'bg-[#DC2626] text-white'} px-8 py-4 rounded-full font-semibold`}>
                    {formData.primaryCTA?.text || 'Register Now'}
                  </button>
                  <button className={`${isTemplate2 ? 'bg-[#DC2626] text-white' : 'bg-ink text-white'} px-8 py-4 rounded-full font-semibold`}>
                    {formData.secondaryCTA?.text || 'View Agenda'}
                  </button>
                </div>
              </div>
            </section>

            {/* About Section Preview */}
            <section className={`py-20 ${isTemplate2 ? 'bg-ink' : 'bg-surface-card'}`}>
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#F8C400]' : 'text-ink'} mb-4`}>
                    {formData.aboutTitle || 'About the Event'}
                  </h2>
                  <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#F8C400]' : 'bg-[#F8C400]'} mx-auto`}></div>
                </div>
                <div className="max-w-4xl mx-auto text-center">
                  <p className={`${isTemplate2 ? 'text-ink-light' : 'text-ink-paragraph'} text-lg leading-relaxed mb-8`}>
                    {formData.description || 'Your event description will appear here. Tell attendees what to expect and why they should join.'}
                  </p>
                  
                  {/* Objectives */}
                  {formData.objectives && formData.objectives.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {formData.objectives.map((objective: string, index: number) => (
                        <div key={index} className={`${isTemplate2 ? 'bg-ink' : 'bg-ink-offwhite'} rounded-lg p-6`}>
                          <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <p className={`${isTemplate2 ? 'text-ink-light' : 'text-ink-paragraph'}`}>{objective}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Speakers Section Preview */}
            {formData.speakers && formData.speakers.length > 0 && (
              <section className={`py-20 ${isTemplate2 ? 'bg-ink' : 'bg-ink-offwhite'}`}>
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#F8C400]' : 'text-ink'} mb-4`}>
                      Featured Speakers
                    </h2>
                    <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#F8C400]' : 'bg-[#F8C400]'} mx-auto`}></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {formData.speakers.map((speaker: any, index: number) => (
                      <div key={index} className={`${isTemplate2 ? 'bg-ink' : 'bg-surface-card'} rounded-lg overflow-hidden shadow-lg`}>
                        <div className={`h-48 ${isTemplate2 ? 'bg-ink-charcoal' : 'bg-ink-light'} flex items-center justify-center`}>
                          <span className={`${isTemplate2 ? 'text-ink-caption' : 'text-ink-caption'}`}>Speaker Photo</span>
                        </div>
                        <div className="p-6">
                          <h3 className={`text-xl font-bold ${isTemplate2 ? 'text-white' : 'text-ink'} mb-2`}>{speaker.name}</h3>
                          <p className={`text-[#F8C400] font-semibold mb-2`}>{speaker.role}</p>
                          <p className={`text-sm ${isTemplate2 ? 'text-ink-caption' : 'text-ink-paragraph'}`}>{speaker.topic}</p>
                          {speaker.featured && (
                            <span className="inline-block bg-[#DC2626] text-white px-2 py-1 rounded text-xs font-semibold mt-2">
                              KEYNOTE
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Agenda Section Preview */}
            {formData.agenda && formData.agenda.length > 0 && (
              <section className={`py-20 ${isTemplate2 ? 'bg-ink' : 'bg-surface-card'}`}>
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#F8C400]' : 'text-ink'} mb-4`}>
                      Event Schedule
                    </h2>
                    <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#F8C400]' : 'bg-[#F8C400]'} mx-auto`}></div>
                  </div>
                  <div className="max-w-4xl mx-auto space-y-6">
                    {formData.agenda.map((session: any, index: number) => (
                      <div key={index} className={`${isTemplate2 ? 'bg-ink' : 'bg-ink-offwhite'} rounded-lg p-6`}>
                        <div className="flex items-center gap-6">
                          <div className="text-2xl font-bold text-[#DC2626]">{session.time}</div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${isTemplate2 ? 'text-white' : 'text-ink'} mb-2`}>{session.title}</h3>
                            <div className={`flex gap-4 text-sm ${isTemplate2 ? 'text-ink-caption' : 'text-ink-paragraph'}`}>
                              <span>👤 {session.speaker}</span>
                              <span>📍 {session.location}</span>
                              <span>⏱️ {session.duration}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.type === 'keynote' ? 'bg-[#DC2626] text-white' : 'bg-[#F8C400] text-ink'
                          }`}>
                            {session.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Highlights Section (Template 2 only) */}
            {isTemplate2 && formData.highlights && formData.highlights.length > 0 && (
              <section className="py-20 bg-ink">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#F8C400] mb-4">
                      What's Happening
                    </h2>
                    <div className="w-24 h-1 bg-[#F8C400] mx-auto"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {formData.highlights.map((highlight: any, index: number) => (
                      <div key={index} className="bg-ink rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold">{highlight.icon.charAt(0).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#F8C400] mb-3">{highlight.title}</h3>
                        <p className="text-ink-caption">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section Preview */}
            <section className={`py-20 ${isTemplate2 ? 'bg-ink' : 'bg-ink-offwhite'}`}>
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className={`text-4xl font-bold ${isTemplate2 ? 'text-[#F8C400]' : 'text-ink'} mb-4`}>
                    Register Now
                  </h2>
                  <div className={`w-24 h-1 ${isTemplate2 ? 'bg-[#F8C400]' : 'bg-[#F8C400]'} mx-auto mb-6`}></div>
                  <p className={`${isTemplate2 ? 'text-ink-light' : 'text-ink-paragraph'} max-w-2xl mx-auto`}>
                    {formData.contactFormMessage || 'Ready to join us? Register now or get in touch for more information.'}
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16">
                  <div className={`${isTemplate2 ? 'bg-ink' : 'bg-surface-card'} rounded-lg p-8`}>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-ink-charcoal border-ink-paragraph text-white' : 'bg-ink-offwhite border-ink-light'} border rounded-lg focus:ring-2 focus:ring-[#DC2626] focus:border-transparent`}
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-ink-charcoal border-ink-paragraph text-white' : 'bg-ink-offwhite border-ink-light'} border rounded-lg focus:ring-2 focus:ring-[#DC2626] focus:border-transparent`}
                        />
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Message (Optional)"
                        className={`w-full px-4 py-3 ${isTemplate2 ? 'bg-ink-charcoal border-ink-paragraph text-white' : 'bg-ink-offwhite border-ink-light'} border rounded-lg focus:ring-2 focus:ring-[#DC2626] focus:border-transparent resize-none`}
                      />
                      <button
                        type="submit"
                        className="w-full bg-[#DC2626] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#DC2626]/90 transition-colors"
                      >
                        Register Now
                      </button>
                    </form>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${isTemplate2 ? 'bg-ink-charcoal' : 'bg-ink-light'} rounded-lg h-64 flex items-center justify-center`}>
                      <span className={`${isTemplate2 ? 'text-ink-caption' : 'text-ink-caption'}`}>Map Placeholder</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center">
                          <span className="text-white">@</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isTemplate2 ? 'text-white' : 'text-ink'}`}>Email</h4>
                          <p className={`${isTemplate2 ? 'text-ink-caption' : 'text-ink-paragraph'}`}>{formData.email || 'your@email.com'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#DC2626] rounded-full flex items-center justify-center">
                          <span className="text-white">📞</span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isTemplate2 ? 'text-white' : 'text-ink'}`}>Phone</h4>
                          <p className={`${isTemplate2 ? 'text-ink-caption' : 'text-ink-paragraph'}`}>{formData.phone || '+1 (555) 123-4567'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Preview */}
            <footer className="bg-ink text-white py-12">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4">
                    <span className="text-[#F8C400]">Your</span>
                    <span className="text-[#DC2626]">Event</span>
                  </div>
                  <p className="text-ink-caption mb-6">
                    © 2025 {formData.eventName || 'Your Event'}. All rights reserved.
                  </p>
                  <div className="flex justify-center gap-4">
                    {formData.socialLinks.facebook && (
                      <a href={formData.socialLinks.facebook} className="text-[#DC2626] hover:text-[#F8C400] transition-colors">
                        Facebook
                      </a>
                    )}
                    {formData.socialLinks.twitter && (
                      <a href={formData.socialLinks.twitter} className="text-[#DC2626] hover:text-[#F8C400] transition-colors">
                        Twitter
                      </a>
                    )}
                    {formData.socialLinks.instagram && (
                      <a href={formData.socialLinks.instagram} className="text-[#DC2626] hover:text-[#F8C400] transition-colors">
                        Instagram
                      </a>
                    )}
                    {formData.socialLinks.linkedin && (
                      <a href={formData.socialLinks.linkedin} className="text-[#DC2626] hover:text-[#F8C400] transition-colors">
                        LinkedIn
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

export default EventPreview;