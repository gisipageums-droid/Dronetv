import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

interface ApiData {
  fullName: string;
  profilePicture: string;
  rotatingTitles: string;
  tagline: string;
  location: string;
  primaryColor: string;
  accentColor: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  bio: string;
  email: string;
  phone: string;
  contactMessage: string;
  socialLinks: {
    whatsapp: { S: string };
    github: { S: string };
    instagram: { S: string };
    linkedin: { S: string };
  };
  logo: string;
  footerText: string;
  services: Array<{
    M: {
      icon: { S: string };
      title: { S: string };
      description: { S: string };
    };
  }>;
  projects: Array<{
    M: {
      title: { S: string };
      description: { S: string };
      category: { S: string };
      image: { M: { file: { M: any }; preview: { NULL: boolean } } };
    };
  }>;
  skills: Array<{
    M: {
      name: { S: string };
      category: { S: string };
      proficiency: { N: string };
    };
  }>;
  testimonials: Array<{
    M: {
      name: { S: string };
      rating: { N: string };
      photo?: {
        M: {
          preview?: { NULL: boolean };
          file?: { M: Record<string, unknown> };
        };
      };
      role?: { S: string };
      quote: { S: string };
      company?: { S: string };
    };
  }>;
  blogPosts?: Array<{ // Add blogPosts to the interface
    M: {
      title: { S: string };
      excerpt: { S: string };
      url: { S: string };
      date?: { S: string };
      author?: { S: string };
      category?: { S: string };
      readTime?: { S: string };
      image?: {
        M: {
          preview?: { NULL: boolean };
          file?: { M: Record<string, unknown> };
        };
      };
    };
  }>;
  projects_0__image?: string;
  projects_1__image?: string;
  testimonials_0__photo?: string;
  blogPosts_0__image?: string; // Add blog post image references
  [key: string]: any;
}

const PortfolioTemplate1: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Static data for Sumit Krishnan - DGCA RPAS Instructor
  const staticData: ApiData = {
    fullName: "Sumit Krishnan",
    profilePicture: "/images/sumit.jpg",
    rotatingTitles: "DGCA RPAS Instructor|Aerospace Educator|Drone Pilot Trainer|Flight Mechanics Expert",
    tagline: "Empowering India's drone workforce with certified training, real-world simulations, and aerospace expertise. Based at India Drone Academy, Hyderabad.",
    location: "Hyderabad, Telangana",
    primaryColor: "#FFD400",
    accentColor: "#FF0000",
    button1Text: "Download CV",
    button1Link: "#",
    button2Text: "Contact Me",
    button2Link: "#contact",
    bio: "I am a DGCA-certified Remotely Piloted Aircraft Instructor (Medium & Small Class) with over 11 years of combined experience in drone operations and aerospace education. I currently train drone pilots at India Drone Academy, Hyderabad. Previously an Assistant Professor of Aerospace Engineering, I've authored a book titled 'Fundamentals of Propulsion', published 7 research papers, and organized ICASAS-2019. I specialize in drone pilot training, flight dynamics, and UAV curriculum development.",
    email: "",
    phone: "",
    contactMessage: "Connect with me for drone training, aerospace education, or research collaboration. I'm currently based in Hyderabad and actively mentoring drone pilots across India.",
    socialLinks: {
      whatsapp: { S: "https://wa.me/919580120509" },
      github: { S: "#" },
      instagram: { S: "#" },
      linkedin: { S: "#" }
    },
    logo: "/images/sumit.jpg",
    footerText: "© 2024 Sumit Krishnan. DGCA RPAS Instructor & Aerospace Educator. All rights reserved.",
    services: [
      {
        M: {
          icon: { S: "🎓" },
          title: { S: "Drone Pilot Training" },
          description: { S: "Comprehensive RPAS training programs for aspiring drone pilots at India Drone Academy." }
        }
      },
      {
        M: {
          icon: { S: "✈️" },
          title: { S: "Aerospace Education" },
          description: { S: "Aviation-focused instruction in core aerospace disciplines from fundamentals to applied projects." }
        }
      },
      {
        M: {
          icon: { S: "📚" },
          title: { S: "Research & Technical Writing" },
          description: { S: "Authoring support, curriculum building, and academic research consulting in aerospace and drones." }
        }
      },
      {
        M: {
          icon: { S: "⚙️" },
          title: { S: "Workshops & Event Management" },
          description: { S: "End-to-end support for aerospace & UAV educational events, including ICASAS-style conferences." }
        }
      }
    ],
    projects: [
      {
        M: {
          title: { S: "Drone Training in Action" },
          description: { S: "Hands-on drone training, field operations, and simulator sessions at India Drone Academy." },
          category: { S: "Training" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "ICASAS-2019 Conference" },
          description: { S: "Organized International Conference on Airworthiness & Safety of Aerospace Systems." },
          category: { S: "Conference" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "Fundamentals of Propulsion" },
          description: { S: "Authored comprehensive book on propulsion fundamentals for aerospace engineering students." },
          category: { S: "Publication" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "Research Papers" },
          description: { S: "Published 7 research papers in aerospace engineering and drone technology domains." },
          category: { S: "Research" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      }
    ],
    skills: [
      {
        M: {
          name: { S: "RPAS Instructor (DGCA)" },
          category: { S: "Drone Training" },
          proficiency: { N: "98" }
        }
      },
      {
        M: {
          name: { S: "Ground School & Simulators" },
          category: { S: "Drone Training" },
          proficiency: { N: "95" }
        }
      },
      {
        M: {
          name: { S: "Practical Flying Sessions" },
          category: { S: "Drone Training" },
          proficiency: { N: "92" }
        }
      },
      {
        M: {
          name: { S: "Flight Dynamics & Stability" },
          category: { S: "Aerospace Expertise" },
          proficiency: { N: "93" }
        }
      },
      {
        M: {
          name: { S: "CFD & Wind Tunnel Testing" },
          category: { S: "Aerospace Expertise" },
          proficiency: { N: "91" }
        }
      },
      {
        M: {
          name: { S: "Curriculum Development" },
          category: { S: "Aerospace Expertise" },
          proficiency: { N: "90" }
        }
      },
      {
        M: {
          name: { S: "Technical Writing & Research" },
          category: { S: "Professional Skills" },
          proficiency: { N: "94" }
        }
      },
      {
        M: {
          name: { S: "Public Speaking & Presentations" },
          category: { S: "Professional Skills" },
          proficiency: { N: "89" }
        }
      },
      {
        M: {
          name: { S: "Conference & Event Management" },
          category: { S: "Professional Skills" },
          proficiency: { N: "88" }
        }
      }
    ],
    testimonials: [
      {
        M: {
          name: { S: "Sarah Johnson" },
          rating: { N: "5" },
          role: { S: "Real Estate Agent" },
          quote: { S: "Alex delivered exceptional aerial photography for our luxury property listings. The quality and professionalism exceeded our expectations completely." },
          company: { S: "Premium Properties" }
        }
      },
      {
        M: {
          name: { S: "Michael Chen" },
          rating: { N: "5" },
          role: { S: "Construction Manager" },
          quote: { S: "Outstanding drone services for our construction documentation. The time-lapse videos helped us track progress and communicate with stakeholders effectively." },
          company: { S: "BuildTech Solutions" }
        }
      },
      {
        M: {
          name: { S: "Emily Rodriguez" },
          rating: { N: "5" },
          role: { S: "Marketing Director" },
          quote: { S: "The aerial cinematography brought our brand campaign to life. Alex's creative vision and technical expertise made all the difference in our project success." },
          company: { S: "Creative Agency" }
        }
      },
      {
        M: {
          name: { S: "David Thompson" },
          rating: { N: "5" },
          role: { S: "Event Coordinator" },
          quote: { S: "Professional drone coverage for our outdoor events. The team was reliable, efficient, and delivered stunning footage that captured every important moment." },
          company: { S: "Elite Events" }
        }
      },
      {
        M: {
          name: { S: "Lisa Wang" },
          rating: { N: "5" },
          role: { S: "Tourism Manager" },
          quote: { S: "Incredible aerial footage of our coastal attractions. The videos significantly boosted our tourism campaign and helped showcase our region beautifully." },
          company: { S: "Coastal Tourism Board" }
        }
      }
    ],
    projects_0__image: "/images/sumit1.png",
    projects_1__image: "/images/sumit2.png",
    projects_2__image: "/images/sumit3.jpg",
    projects_3__image: "/images/sumit4.jpg",
    testimonials_0__photo: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_1__photo: "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_2__photo: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_3__photo: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_4__photo: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400"
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return <Preloader />;
  }

  // Transform services
  const formattedServices = (staticData.services || []).map(service => ({
    icon: service.M.icon.S,
    title: service.M.title.S,
    description: service.M.description.S
  }));

// Transform projects
  const formattedProjects = (staticData.projects || []).map((project, index) => {
    const imageKey = `projects_${index}__image`;
    return {
      title: project?.M?.title?.S || '',
      description: project?.M?.description?.S || '',
      category: project?.M?.category?.S || '',
      image: typeof staticData[imageKey] === 'string' ? staticData[imageKey] : ''
    };
  });

  // Unique categories for portfolio filtering
  const uniqueCategories = Array.from(
    new Set(formattedProjects.map(p => p.category).filter(Boolean)
  ));
  const portfolioCategories = ['All', ...uniqueCategories];
  
  // Transform skills data
  const formattedSkills = staticData.skills.map(skill => ({
    name: skill.M.name.S,
    category: skill.M.category.S,
    proficiency: parseInt(skill.M.proficiency.N)
  }));

  // Transform testimonials data
  const formattedTestimonials = (staticData.testimonials || []).map((testimonial, index) => {
    const imageKey = `testimonials_${index}__photo`;
    return {
      name: testimonial.M.name.S,
      rating: parseInt(testimonial.M.rating.N),
      role: testimonial.M.role?.S || '',
      quote: testimonial.M.quote.S,
      company: testimonial.M.company?.S || '',
      image: typeof staticData[imageKey] === 'string' ? staticData[imageKey] : ''
    };
  });

  
  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <HeroSection />
        
        <AboutMe />
        
        <Skills 
          skills={formattedSkills}
          primaryColor={staticData.primaryColor}
          accentColor={staticData.accentColor}
        />
        
        <Services />
        
        <Portfolio projects={formattedProjects} />
        
        {/* <Testimonials /> */}
        
        <Contact />
        
        <Footer />
      </div>
    </div>
  );
};

export default PortfolioTemplate1;