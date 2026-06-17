import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Eye, Heart, Users, Calendar, Award, Lightbulb, Globe, ArrowRight, Mail, Phone, MapPin, Rocket, Star, Video } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();
  const [hoveredTeamMember, setHoveredTeamMember] = useState(null);
  const [visibleTimelineItems, setVisibleTimelineItems] = useState([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleTimelineItems((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    const cards = timelineRef.current?.querySelectorAll('.timeline-card') || [];
    cards.forEach((card, index) => {
      card.setAttribute('data-index', index.toString());
      observer.observe(card);
    });
    return () => { cards.forEach((card) => observer.unobserve(card)); };
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Dev R",
      role: "Founder & CEO",
      image: "/images/dev.png",
      bio: "Founder of Drone TV, India Drone Academy, and IPAGE UM Services — driving innovation in UAV training, GIS, and simulation technologies.",
    },
    {
      id: 2,
      name: "Vamsi Krishna Kurakula",
      role: "Director",
      image: "/images/vamsi.png",
      bio: "Director at Drone TV and IPAGE UMS, with expertise in business development, project strategy, and UAV integration.",
    },
    {
      id: 3,
      name: "Amarnath Reddy",
      role: "Promotional Manager",
      image: "/images/amar.png",
      bio: "Leads promotions and outreach at Drone TV, connecting audiences with cutting-edge drone tech content and events.",
    },
  ];

  const timelineEvents = [
    { year: 'Aug 2024', title: 'Foundational Vision', description: 'The idea of bringing all drone-related sectors onto one platform under "Drone TV" was born.', icon: Calendar },
    { year: 'Nov 2024', title: 'Pre Launch', description: 'We proudly Pre launched Drone TV showcasing innovators, drone products, and expert insights with a unified media voice.', icon: Rocket },
    { year: 'Jan 2025', title: 'Building the Drone Ecosystem', description: 'Drone TV began recognizing industry leaders, drone service providers, and key players across the UAV ecosystem.', icon: Star },
    { year: 'April 2025', title: 'Media Partner – Drone Expo 2025 (Hyderabad)', description: 'Drone TV served as the official media partner covering stalls, product showcases, and thought leader interviews.', icon: Video },
    { year: 'Jul 2025', title: 'Official Portal Launch at Drone Expo Curtain Raiser', description: 'DroneTV.in was officially launched during the Curtain Raiser of Drone Expo 2025 in Goregaon, Mumbai.', icon: Target },
    { year: 'Sept 2025', title: 'Upcoming: Drone Expo 2025 Mumbai Edition', description: 'We are gearing up for the Mumbai edition (Sept 25–27) committed to delivering a high-impact media experience.', icon: Target },
  ];

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">About</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">About <span className="text-yellow-400">Drone TV</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Driving the future of drones through education and innovation.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">2024</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Founded</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">India</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Wide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-7 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-400 rounded-full p-3 mr-4 flex-shrink-0">
                    <Target className="h-6 w-6 text-black" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  To bring every sector of the drone industry together on one unified platform — Drone TV. We aim to offer new innovators a prominent space to showcase their ideas, deliver expert content from drone companies, and present in-depth insights from drone enthusiasts, industry speakers, and tech visionaries.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-7 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-400 rounded-full p-3 mr-4 flex-shrink-0">
                    <Eye className="h-6 w-6 text-black" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  To become the definitive global platform for showcasing drone innovation — where every drone enthusiast, creator, and company has a voice. We envision a future where Drone TV stands as the trusted source for all things drones.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
              <img src="/images/logo.png" alt="Drone Technology" className="w-full h-52 object-contain rounded-xl mb-6" />
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Shaping Tomorrow's Technology</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Through comprehensive education and industry partnerships, we're building the foundation for the next generation of drone innovations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder's Message */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-8 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          A Message from Our Founder
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative">
                <img src="/images/dev.png" alt="Dev R - Founder" className="w-52 h-52 object-cover rounded-full shadow-lg" />
                <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full p-3 shadow-md">
                  <Heart className="h-5 w-5 text-black" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>Drone TV was created to unify the drone ecosystem — a platform that educates, connects, and empowers. With experience across training, services, and simulation, I saw the urgent need for a media space that truly reflects the pulse of this fast-growing industry.</p>
                <p>What began in February 2024 as an idea became reality in 2025 with live event coverage, expert interviews, and community-driven storytelling. Today, Drone TV stands as a voice for innovators and drone professionals nationwide.</p>
                <p>Drone TV continues that journey — showcasing how drones are transforming industries and lives.</p>
                <p className="font-bold text-gray-900">We're not just documenting the future — we're helping build it.</p>
              </div>
              <div className="mt-6">
                <div className="text-base font-bold text-gray-900">Dev R</div>
                <div className="text-sm text-gray-500">Founder &amp; CEO, Drone TV</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-2 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            Meet Our Team
          </h2>
          <p className="text-sm text-gray-500 mb-8">The passionate individuals behind Drone TV's mission to democratize drone technology education.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onMouseEnter={() => setHoveredTeamMember(member.id)}
                onMouseLeave={() => setHoveredTeamMember(null)}
              >
                <div className="relative overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {hoveredTeamMember === member.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-xs font-semibold text-yellow-600 mb-2">{member.role}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12" ref={timelineRef}>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-2 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          Our Journey
        </h2>
        <p className="text-sm text-gray-500 mb-10">Key milestones in Drone TV's evolution from startup to industry leader.</p>

        <div className="relative">
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 rounded-full" />
          <div className="space-y-6 sm:space-y-10">
            {timelineEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = event.icon;
              const isVisible = visibleTimelineItems[index];

              return (
                <div key={index} className="timeline-card">
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <div
                      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all duration-500 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
                      style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full border-2 border-yellow-400 flex items-center justify-center shadow-sm">
                          <IconComponent className="h-5 w-5 text-black" />
                        </div>
                        <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">{event.year}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:grid items-center" style={{ gridTemplateColumns: '1fr 80px 1fr' }}>
                    <div className="pr-8">
                      {isEven && (
                        <div
                          className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-500 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
                          style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                        >
                          <span className="inline-block bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold mb-3">{event.year}</span>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center relative z-10">
                      <div className="w-14 h-14 bg-white rounded-full border-2 border-yellow-400 flex items-center justify-center shadow-md">
                        <IconComponent className="h-7 w-7 text-black" />
                      </div>
                    </div>
                    <div className="pl-8">
                      {!isEven && (
                        <div
                          className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-500 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
                          style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                        >
                          <span className="inline-block bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold mb-3">{event.year}</span>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes slide-in-left {
            0% { opacity: 0; transform: translateX(-60px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slide-in-right {
            0% { opacity: 0; transform: translateX(60px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-slide-in-left { animation: slide-in-left 0.7s ease-out forwards; }
          .animate-slide-in-right { animation: slide-in-right 0.7s ease-out forwards; }
        `}</style>
      </div>

      {/* Contact CTA */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to Join Our Mission?</h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto mb-8">Whether you're a drone enthusiast, industry professional, or technology innovator, we'd love to connect with you.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Mail className="h-4 w-4 text-yellow-400" />
              <span>bd@dronetv.in</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Phone className="h-4 w-4 text-yellow-400" />
              <span>+91 7520123555</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <MapPin className="h-4 w-4 text-yellow-400" />
              <span>Hyderabad - 500008 India</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:bd@dronetv.in" className="bg-yellow-400 text-black px-7 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-all flex items-center gap-2 justify-center">
              Get In Touch <ArrowRight className="h-4 w-4" />
            </a>
            <button onClick={() => navigate('/partner')} className="border border-yellow-400 text-yellow-400 px-7 py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
