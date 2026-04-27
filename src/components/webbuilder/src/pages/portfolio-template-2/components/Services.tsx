import React from "react";
import {
  Home,
  Building,
  Camera,
  Image as ImageIcon,
  Scissors,
  Video,
  UserCheck,
  GraduationCap,
  ClipboardList,
  Headphones,
} from "lucide-react";

type Service = {
  title: string;
  description: string;
  icon: string;
  features?: string[];
};

interface ServicesProps {
  servicesTitle?: string;
  servicesDescription?: string;
  services?: Service[];
  iconMap?: Record<string, React.ReactNode>;
  primaryColor?: string;
  accentColor?: string;
}

const defaultIconMap: Record<string, React.ReactNode> = {
  home: <Home size={32} />,
  building: <Building size={32} />,
  camera: <Camera size={32} />,
  image: <ImageIcon size={32} />,
  scissors: <Scissors size={32} />,
  video: <Video size={32} />,
  usercheck: <UserCheck size={32} />,
  graduation: <GraduationCap size={32} />,
  clipboard: <ClipboardList size={32} />,
  headphones: <Headphones size={32} />,
};

const Services: React.FC<ServicesProps> = ({
  servicesTitle = "My Services",
  servicesDescription = "A wide range of professional services to support your business, property, content, and career development goals.",
  services = [
    {
      icon: "home",
      title: "Real Estate Appraisal",
      description:
        "Accurate valuation of residential and commercial properties based on market trends and property features.",
      features: ["Market Analysis", "Comparative Reports", "Certified Valuation"],
    },
    {
      icon: "building",
      title: "Property Management",
      description:
        "Complete management of rental properties ensuring smooth operations and tenant satisfaction.",
      features: ["Rent Collection", "Maintenance Support", "Tenant Screening"],
    },
    {
      icon: "camera",
      title: "Real Estate Photography",
      description:
        "High-quality photography that highlights your property’s best features to attract buyers and renters.",
      features: ["Interior & Exterior", "Wide-Angle Lenses", "Fast Delivery"],
    },
    {
      icon: "image",
      title: "Stock Photography",
      description:
        "A curated library and custom shoots for commercial, editorial, and digital stock photo needs.",
      features: ["Royalty-Free Licensing", "High Resolution", "Tailored Themes"],
    },
  ],
  iconMap = defaultIconMap,
  primaryColor = "#FFD400",
  accentColor = "#FF0000",
}) => {
  return (
    <section id="services" className="py-20" style={{ backgroundColor: primaryColor }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-4">
            {servicesTitle} <span style={{ color: accentColor }}>Services</span>
          </h2>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: "#000" }}
          ></div>
          <p
            data-aos="fade-up"
            data-aos-delay="400"
            className="text-black/80 max-w-2xl mx-auto text-lg"
          >
            {servicesDescription}
          </p>
        </div>

        {/* Service Items */}
        <div className="max-w-6xl mx-auto space-y-16">
          {services.map((service, index) => (
            <div
              key={index}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={index * 100}
              className={`flex items-center gap-12 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } flex-col lg:flex-row`}
            >
              {/* Text Section */}
              <div className="flex-1">
                <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: accentColor }}
                    >
                      {iconMap[service.icon] ||
                        <span className="w-8 h-8 bg-gray-300 rounded-full inline-block"></span>}
                    </div>
                    <h3 className="text-2xl font-bold text-black">{service.title}</h3>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    {service.description}
                  </p>

                  {service.features && (
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: accentColor }}
                          ></div>
                          <span className="text-gray-600 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="mt-8 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: "#000" }}
                  >
                    Learn More →
                  </button>
                </div>
              </div>

              {/* Visual Section */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  >
                    <div
                      className="w-48 h-48 rounded-full flex items-center justify-center animate-pulse"
                      style={{ backgroundColor: `${accentColor}33` }}
                    >
                      <div className="transform scale-150" style={{ color: accentColor }}>
                        {iconMap[service.icon] ||
                          <span className="w-8 h-8 bg-gray-300 rounded-full inline-block"></span>}
                      </div>
                    </div>
                  </div>

                  {/* Floating dots */}
                  <div
                    className="absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce"
                    style={{
                      backgroundColor: accentColor,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  ></div>
                  <div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-black rounded-full animate-bounce"
                    style={{
                      animationDelay: `${index * 0.2 + 0.5}s`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
