import React, { useState, useEffect, useRef } from 'react';
import { Target, Eye, Heart, Users, Calendar, Award, Lightbulb, Globe, ArrowRight, Mail, Phone, MapPin, Rocket, Star, Video } from 'lucide-react';

const AboutPage = () => {
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

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);
  const teamMembers = [
    {
      id: 1,
      name: "Dev R",
      role: "Founder & CEO",
      image: "/images/dev.png",
      bio: "Founder of Drone TV, India Drone Academy, and IPAGE UM Services — driving innovation in UAV training, GIS, and simulation technologies.",
      funFact: "Has personally led over 200 drone missions across India, including defense and disaster response zones."
    },
    {
      id: 2,
      name: "Vamsi Krishna Kurakula",
      role: "Director",
      image: "/images/vamsi.png",
      bio: "Director at Drone TV and IPAGE UMS, with expertise in business development, project strategy, and UAV integration.",
      funFact: "Has successfully expanded drone services to over 5 Indian states through government and enterprise partnerships."
    },
    {
      id: 3,
      name: "Amarnath Reddy",
      role: "Promotional Manager",
      image: "/images/amar.png",
      bio: "Leads promotions and outreach at Drone TV, connecting audiences with cutting-edge drone tech content and events.",
      funFact: "Once organized a drone roadshow covering 7 cities in just 14 days."
    },


  ];

  const timelineEvents = [
    {
      year: 'Aug 2024',
      title: 'Foundational Vision',
      description:
        'The idea of bringing all drone-related sectors onto one platform under "Drone TV" was born. ',
      icon: Calendar,
    },
    {
      year: 'Nov 204',
      title: 'Pre Launch',
      description:
        'We proudly Pre launched Drone TV  showcasing innovators, drone products, and expert insights with a unified media voice.',
      icon: Rocket,
    },
    {
      year: 'Jan 2025',
      title: 'Building the Drone Ecosystem',
      description:
        'Drone TV began recognizing industry leaders, drone service providers, and key players across the UAV ecosystem. We started curating data, stories, and innovations to shape the foundation of the DroneTV platform.',
      icon: Star,
    },
    
    {
      year: 'April 2025',
      title: 'Media Partner – Drone Expo 2025 (Hyderabad)',
      description:
        'Drone TV served as the official media partner  covering stalls, product showcases, and thought leader interviews, reaffirming our mission.',
      icon: Video,
    },
    {
      year: 'Jul 2025',
      title: 'Official Portal Launch at Drone Expo Curtain Raiser',
      description:
        'DroneTV.in was officially launched during the Curtain Raiser of Drone Expo 2025 in Goregaon, Mumbai marking a new era for drone-focused media, community, and innovation.',
      icon: Target,
    },
        {
      year: 'Sept 2025',
      title: 'Upcoming: Drone Expo 2025  Mumbai Edition',
      description:
        'We are gearing up for the Mumbai edition (Sept 25–27)  committed to delivering a high-impact media experience once again.',
      icon: Target,
    },
  ];
  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            About Drone TV
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Driving the future of drones through education and innovation.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
      </section>


      {/* Mission and Vision Section */}
      <section className="py-8 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">

                <div className="flex items-center mb-6">
                  <div className="bg-yellow-400 rounded-full p-4 mr-4">
                    <Target className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="text-3xl font-black text-black">Our Mission</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To bring every sector of the drone industry together on one unified platform Drone TV. We aim to offer new innovators a prominent space to showcase their ideas, deliver expert content from drone companies, and present in-depth insights from drone enthusiasts, industry speakers, and tech visionaries.
                </p>

              </div>

              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-400 rounded-full p-4 mr-4">
                    <Eye className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="text-3xl font-black text-black">Our Vision</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">

                  To become the definitive global platform for showcasing drone innovation where every drone enthusiast, creator, and company has a voice. We envision a future where Drone TV stands as the trusted source for all things drones: from new technologies and speaker sessions to deep-dive interviews and public showcases.
                </p>

              </div>
            </div>

            <div className="relative">
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-2xl">
                <img
                  src="/images/logo.png"
                  alt="Drone Technology"
                  className="w-full w-20 h-54 object-cover rounded-2xl mb-6"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-4">Shaping Tomorrow's Technology</h3>
                  <p className="text-gray-600 mb-6">
                    Through comprehensive education and industry partnerships, we're building the foundation for the next generation of drone innovations.
                  </p>
                  {/* <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Message Section */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f1ee8e] rounded-3xl p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <div className="relative">
                  <img
                    src="/images/dev.png"
                    alt="Alex Johnson - Founder"
                    className="w-64 h-64 object-cover rounded-full mx-auto shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg">
                    <Heart className="h-8 w-8 text-black" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
                  A Message from Our Founder
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Drone TV was created to unify the drone ecosystem  a platform that educates, connects, and empowers. With experience across training, services, and simulation, I saw the urgent need for a media space that truly reflects the pulse of this fast-growing industry.
                  </p>
                  <p className="text-lg">
                    What began in February 2024 as an idea became reality in 2025 with live event coverage, expert interviews, and community-driven storytelling. Today, Drone TV stands as a voice for innovators and drone professionals nationwide.
                  </p>
                  <p className="text-lg"> Drone TV continues that journey  showcasing how drones are transforming industries and lives.
                  </p>
                  <p className="text-lg font-semibold text-black">
                    We’re not just documenting the future  we’re helping build it.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="text-xl font-bold text-black">Dev R</div>
                  <div className="text-gray-600">Founder & CEO, Drone TV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              The passionate individuals behind Drone TV's mission to democratize drone technology education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="group bg-yellow-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 150}ms both`
                }}
                onMouseEnter={() => setHoveredTeamMember(member.id)}
                onMouseLeave={() => setHoveredTeamMember(null)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-md bg-yellow-200 group">
                  <div className="bg-yellow-200 flex items-center justify-center h-64">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-500 ${hoveredTeamMember === member.id ? 'opacity-100' : 'opacity-0'
                      }`}
                  >

                  </div>
                </div>

                {/* Below image text */}



                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-1 group-hover:text-gray-800 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="text-yellow-600 font-semibold mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="py-20 bg-yellow-400" ref={timelineRef}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-black mb-4">Our Journey</h2>
        <p className="text-lg text-black/80 max-w-2xl mx-auto">
          Key milestones in Drone TV's evolution from startup to industry leader
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-black/20 rounded-full"></div>
        <div className="space-y-12">
          {timelineEvents.map((event, index) => {
            const isEven = index % 2 === 0;
            const IconComponent = event.icon;
            const isVisible = visibleTimelineItems[index];

            return (
              <div
                key={index}
                className={`relative flex items-center timeline-card ${
                  isEven ? 'justify-start' : 'justify-end'
                } ${
                  isVisible
                    ? isEven
                      ? 'animate-slide-in-left'
                      : 'animate-slide-in-right'
                    : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-100 rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg z-10">
                  <IconComponent className="h-8 w-8 text-black" />
                </div>
                <div className={`w-5/12 ${isEven ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-yellow-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                      {event.year}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">{event.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes slide-in-left {
        0% {
          opacity: 0;
          transform: translateX(-80px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slide-in-right {
        0% {
          opacity: 0;
          transform: translateX(80px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .animate-slide-in-left {
        animation: slide-in-left 0.8s ease-out forwards;
      }
      .animate-slide-in-right {
        animation: slide-in-right 0.8s ease-out forwards;
      }
    `}</style>
  </section>



      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-200 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a drone enthusiast, industry professional, or technology innovator, we'd love to connect with you and explore how we can work together.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-yellow-600" />
                <span>bd@dronetv.in</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 text-yellow-600" />
                <span>+91 7520123555</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <MapPin className="h-5 w-5 text-yellow-600" />
                <span>



                  Hyderabad - 500008 India</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center">
                <span>Get In Touch</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;