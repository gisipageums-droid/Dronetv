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
import Blog from './components/Blog'; // Import the Blog component
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

const PortfolioTemplate2: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Static data for Dev R - Founder & CEO
  const staticData: ApiData = {
    fullName: "Dev R",
    profilePicture: "/images/dev.png",
    rotatingTitles: "Founder & CEO|Business Strategist|Drone Technology Expert|Innovation Leader",
    tagline: "Driving Innovation in Drone Technology | GIS | AI | IT Solutions",
    location: "Singapore & Hyderabad, India",
    primaryColor: "#FFD400",
    accentColor: "#FF0000",
    button1Text: "View Portfolio",
    button1Link: "#portfolio",
    button2Text: "Get In Touch",
    button2Link: "#contact",
    bio: "Founder & CEO — IPage UM Services (Singapore & India), India Drone Academy, Drone TV. Broadcasting the future of drones — one innovation, one story at a time.",
    email: "",
    phone: "",
    contactMessage: "Let's collaborate to drive innovation in drone technology, GIS, AI, and IT solutions. Ready to transform your business with cutting-edge technology.",
    socialLinks: {
      whatsapp: { S: "https://wa.me/6590062901" },
      github: { S: "#" },
      instagram: { S: "#" },
      linkedin: { S: "#" }
    },
    logo: "/images/dev.png",
    footerText: "© 2024 Dev R. Founder & CEO — IPage UM Services. All rights reserved.",
    services: [
      {
        M: {
          icon: { S: "🏠" },
          title: { S: "Real Estate Appraisal" },
          description: { S: "Professional property valuation services using advanced technology and market analysis." }
        }
      },
      {
        M: {
          icon: { S: "🏢" },
          title: { S: "Property Management" },
          description: { S: "Comprehensive property management solutions for residential and commercial properties." }
        }
      },
      {
        M: {
          icon: { S: "📷" },
          title: { S: "Real Estate Photography" },
          description: { S: "High-quality aerial and ground photography for property listings and marketing." }
        }
      },
      {
        M: {
          icon: { S: "🖼️" },
          title: { S: "Stock Photography" },
          description: { S: "Professional stock photography services for commercial and creative projects." }
        }
      },
      {
        M: {
          icon: { S: "✂️" },
          title: { S: "Video Editing" },
          description: { S: "Expert video editing and post-production services for all types of content." }
        }
      },
      {
        M: {
          icon: { S: "🎥" },
          title: { S: "Videography" },
          description: { S: "Professional videography services including aerial cinematography and promotional videos." }
        }
      },
      {
        M: {
          icon: { S: "👤" },
          title: { S: "Career Development Coaching" },
          description: { S: "Personalized career coaching and professional development guidance." }
        }
      },
      {
        M: {
          icon: { S: "🎓" },
          title: { S: "Training" },
          description: { S: "Comprehensive training programs in drone technology, business development, and IT solutions." }
        }
      },
      {
        M: {
          icon: { S: "📋" },
          title: { S: "Project Management" },
          description: { S: "End-to-end project management services ensuring timely delivery and quality results." }
        }
      },
      {
        M: {
          icon: { S: "🎧" },
          title: { S: "Virtual Assistance" },
          description: { S: "Professional virtual assistance services for business operations and administrative tasks." }
        }
      }
    ],
    projects: [
      {
        M: {
          title: { S: "Drone Technology Solutions" },
          description: { S: "Advanced drone technology implementation for various industries including real estate and surveillance." },
          category: { S: "Technology" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "Web Development Projects" },
          description: { S: "Custom web development solutions for businesses ranging from e-commerce to corporate websites." },
          category: { S: "Web Development" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "Design Portfolio" },
          description: { S: "Creative design solutions including branding, UI/UX design, and visual identity development." },
          category: { S: "Design" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "Video Production" },
          description: { S: "Professional video production including aerial cinematography, promotional videos, and documentaries." },
          category: { S: "Video" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      },
      {
        M: {
          title: { S: "Business Innovation" },
          description: { S: "Strategic business innovation projects focusing on AI, GIS, and technology integration." },
          category: { S: "Innovation" },
          image: { M: { file: { M: {} }, preview: { NULL: false } } }
        }
      }
    ],
    skills: [
      {
        M: {
          name: { S: "Business Strategy" },
          category: { S: "Business" },
          proficiency: { N: "95" }
        }
      },
      {
        M: {
          name: { S: "Business Development" },
          category: { S: "Business" },
          proficiency: { N: "92" }
        }
      },
      {
        M: {
          name: { S: "Business Planning" },
          category: { S: "Business" },
          proficiency: { N: "90" }
        }
      },
      {
        M: {
          name: { S: "Strategic Planning" },
          category: { S: "Leadership" },
          proficiency: { N: "94" }
        }
      },
      {
        M: {
          name: { S: "R&D Innovation" },
          category: { S: "Innovation" },
          proficiency: { N: "88" }
        }
      },
      {
        M: {
          name: { S: "Drone Technology" },
          category: { S: "Technology" },
          proficiency: { N: "91" }
        }
      },
      {
        M: {
          name: { S: "Project Management" },
          category: { S: "Leadership" },
          proficiency: { N: "89" }
        }
      },
      {
        M: {
          name: { S: "Team Leadership" },
          category: { S: "Leadership" },
          proficiency: { N: "93" }
        }
      }
    ],
    testimonials: [
      {
        M: {
          name: { S: "Jennifer Martinez" },
          rating: { N: "5" },
          role: { S: "Real Estate Developer" },
          quote: { S: "Marcus delivered absolutely stunning aerial photography for our luxury development. The quality and professionalism exceeded our expectations completely." },
          company: { S: "Skyline Properties" }
        }
      },
      {
        M: {
          name: { S: "Robert Chen" },
          rating: { N: "5" },
          role: { S: "Event Coordinator" },
          quote: { S: "Professional, reliable, and incredibly talented. The aerial footage from our outdoor festival was absolutely breathtaking and captured every important moment." },
          company: { S: "Premier Events" }
        }
      },
      {
        M: {
          name: { S: "Amanda Foster" },
          rating: { N: "5" },
          role: { S: "Marketing Director" },
          quote: { S: "The drone cinematography for our tourism campaign was exceptional. The aerial shots showcased our coastal region beautifully and significantly boosted our marketing efforts." },
          company: { S: "Coastal Tourism" }
        }
      },
      {
        M: {
          name: { S: "David Thompson" },
          rating: { N: "5" },
          role: { S: "Construction Manager" },
          quote: { S: "Outstanding time-lapse documentation of our construction project. The progress videos helped us communicate effectively with stakeholders and track development milestones." },
          company: { S: "BuildRight Construction" }
        }
      },
      {
        M: {
          name: { S: "Sarah Williams" },
          rating: { N: "5" },
          role: { S: "Film Producer" },
          quote: { S: "Marcus brought our documentary to life with incredible aerial shots. His creative vision and technical expertise made all the difference in our storytelling." },
          company: { S: "Indie Films Studio" }
        }
      }
    ],
    blogPosts: [
      {
        M: {
          title: { S: "The Future of Drone Technology in Commercial Photography" },
          excerpt: { S: "Exploring the latest advancements in drone technology and how they're revolutionizing commercial photography and videography." },
          url: { S: "#" },
          date: { S: "2024-01-15" },
          author: { S: "Marcus Johnson" },
          category: { S: "Technology" },
          readTime: { S: "5 min read" }
        }
      },
      {
        M: {
          title: { S: "Essential Tips for Aerial Real Estate Photography" },
          excerpt: { S: "Learn the key techniques and best practices for capturing stunning aerial shots that sell properties faster." },
          url: { S: "#" },
          date: { S: "2024-01-10" },
          author: { S: "Marcus Johnson" },
          category: { S: "Photography" },
          readTime: { S: "7 min read" }
        }
      },
      {
        M: {
          title: { S: "Drone Regulations: What Every Pilot Should Know in 2024" },
          excerpt: { S: "Stay compliant with the latest FAA regulations and safety guidelines for commercial drone operations." },
          url: { S: "#" },
          date: { S: "2024-01-05" },
          author: { S: "Marcus Johnson" },
          category: { S: "Regulations" },
          readTime: { S: "6 min read" }
        }
      }
    ],
    projects_0__image: "/images/1.png",
    projects_1__image: "/images/7.png",
    projects_2__image: "/images/11.png",
    projects_3__image: "/images/28.png",
    projects_4__image: "/images/36.png",
    testimonials_0__photo: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_1__photo: "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_2__photo: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_3__photo: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
    testimonials_4__photo: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    blogPosts_0__image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
    blogPosts_1__image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
    blogPosts_2__image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600"
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

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (isLoading) return <Preloader />;

  // Transform services
  const formattedServices = (staticData.services || []).map(service => ({
    icon: service.M.icon.S,
    title: service.M.title.S,
    description: service.M.description.S
  }));

  // Transform skills
  const formattedSkills = (staticData.skills || []).map(skill => ({
    name: skill.M.name.S,
    category: skill.M.category.S,
    proficiency: parseInt(skill.M.proficiency.N)
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

  // Transform testimonials
  const formattedTestimonials = {
    testimonials: staticData.testimonials || [],
    ...Object.fromEntries(
      Object.entries(staticData).filter(([key]) => key.startsWith('testimonials_')))
  };

  // Transform blog posts
  const formattedBlogPosts = {
    blogPosts: staticData.blogPosts || [],
    ...Object.fromEntries(
      Object.entries(staticData).filter(([key]) => key.startsWith('blogPosts_')))
  };

  // Unique categories for portfolio filtering
  const uniqueCategories = Array.from(
    new Set(formattedProjects.map(p => p.category).filter(Boolean)
  ));
  const portfolioCategories = ['All', ...uniqueCategories];

  // Flatten social links
  const flattenedSocialLinks: Record<string, string> = {};
  if (staticData.socialLinks) {
    Object.entries(staticData.socialLinks).forEach(([key, val]) => {
      flattenedSocialLinks[key] = val?.S || '';
    });
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <HeroSection
          fullName={staticData.fullName}
          profilePicture={staticData.profilePicture}
          rotatingTitles={staticData.rotatingTitles}
          tagline={staticData.tagline}
          location={staticData.location}
          primaryColor={staticData.primaryColor}
          accentColor={staticData.accentColor}
          button1Text={staticData.button1Text}
          button1Link={staticData.button1Link}
          button2Text={staticData.button2Text}
          button2Link={staticData.button2Link}
          imagePaths={[
            '/images/dev.png',
            '/images/1.png',
            '/images/7.png',
            '/images/11.png',
            '/images/28.png'
          ]}
        />

        <AboutMe
          title="About"
          highlightText="Us"
          subtitle={staticData.rotatingTitles.split('|')[0]?.trim() || 'Professional'}
          description={staticData.bio}
          experienceYears="6"
          profileImage={staticData.profilePicture}
          signatureText={staticData.fullName}
          primaryColor={staticData.primaryColor}
          accentColor={staticData.accentColor}
          location={staticData.location}
        />

        <Skills 
          skills={formattedSkills} 
          primaryColor={staticData.primaryColor} 
          accentColor={staticData.accentColor} 
        />

        <Services
          servicesTitle="Our Professional"
          servicesDescription="We offer comprehensive services tailored to your needs"
          services={formattedServices}
          primaryColor={staticData.primaryColor}
          accentColor={staticData.accentColor}
        />

        <Portfolio 
          projects={formattedProjects} 
          // primaryColor={apiData.primaryColor}
          // accentColor={apiData.accentColor}
          // categories={portfolioCategories}
        />

        {/* <Testimonials apiResponse={formattedTestimonials} /> */}

        {/* Add the Blog component */}
        {staticData.blogPosts && staticData.blogPosts.length > 0 && (
          <Blog apiResponse={formattedBlogPosts} />
        )}

        <Contact/>

        <Footer
          footerLogo={staticData.logo}
          footerText={staticData.footerText}
          socialLinks={flattenedSocialLinks}
          location={staticData.location}
          services={formattedServices}
          primaryColor={staticData.primaryColor}
          accentColor={staticData.accentColor}
        />
      </div>
    </div>
  );
};

export default PortfolioTemplate2;