import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// User Authentication Types and Context
interface User {
  email: string;
  fullName: string;
  token?: string;
  // Add other user properties as needed
}

interface UserAuthContextType {
  user: User | null;
  isLogin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(
  undefined
);

interface UserAuthProviderProps {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLogin = !!user;

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, isLogin, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}

// Template Management Types and Context
interface TemplateContextType {
  draftDetails: any | [];
  setDraftDetails: React.Dispatch<React.SetStateAction<any | []>>;
  AIGenData: any | [];
  setAIGenData: React.Dispatch<React.SetStateAction<any | []>>;
  isPublishedTriggered: boolean;
  setIsPublishedTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  finalTemplate: any | [];
  setFinalTemplate: React.Dispatch<React.SetStateAction<any | []>>;
  publishTemplate: () => void;

  finaleDataReview: any | [];
  setFinaleDataReview: React.Dispatch<React.SetStateAction<any | []>>;
  editPublishTemplate: () => void;
  publishProfessionalTemplate: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  children,
}) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const [isPublishedTriggered, setIsPublishedTriggered] =
    useState<boolean>(false);
  const [finalTemplate, setFinalTemplate] = useState<any | []>({});
  const [AIGenData, setAIGenData] = useState<any>({
    "publishedId": "pub-ed9a2986c5df46ef",
    "userId": "example@gmail.com",
    "draftId": "draft-28fe098e40ee49cda940dddb7194ad39",
    "templateSelection": "template-2",
    "isEdited": false,
    "lastModified": "2025-10-17T20:03:57.178058",
    "version": 1,
    "content": {
        "company": {
            "name": "dsvsdv",
            "logo": "https://dronetv-company-assets-store.s3.ap-south-1.amazonaws.com/uploads/example@gmail.com/identity/logos/1760731289-a9f3acd0-drone.png",
            "industry": "Aerial Survey & Mapping",
            "established": "2020",
            "location": "Nagpur, MH, IN",
            "metrics": {
                "yearsInBusiness": "5+",
                "projectsCompleted": "800+",
                "clientsSatisfied": "135+"
            }
        },
        "hero": {
            "title": "Precision in Aerial Survey & Mapping",
            "subtitle": "dsvsdv specializes in high accuracy aerial surveying and mapping, integrating GIS and topographical analysis.",
            "backgroundImage": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
            "features": [
                "High precision surveying with cutting-edge technology",
                "Proven compliance with Aerial Survey & Mapping standards",
                "Professional certifications ensuring industry expertise"
            ],
            "primaryAction": {
                "type": "primary",
                "text": "Get Quote"
            },
            "secondaryAction": {
                "type": "secondary",
                "text": "View Portfolio"
            }
        },
        "about": {
            "description1": "Founded by vsdv, dsvsdv was established with a vision to revolutionize the Aerial Survey & Mapping industry. From the beginning, we aimed to deliver unmatched accuracy and quality in our",
            "description2": "services. With the growth of our company, we expanded our team, bringing together experts with a shared passion for precision",
            "mission": "To provide high precision Aerial Survey & Mapping services, ensuring quality and compliance.",
            "vision": "To be the global leader in Aerial Survey & Mapping, driving innovation through technology and expertise.",
            "officeImage": "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5",
            "visionPillars": [
                {
                    "title": "Excellence",
                    "icon": "\ud83c\udfaf",
                    "description": "Unmatched precision and quality in Aerial Survey & Mapping"
                },
                {
                    "title": "Innovation",
                    "icon": "\ud83d\udca1",
                    "description": "Pioneering new methods for Aerial Survey & Mapping"
                },
                {
                    "title": "Integrity",
                    "icon": "\ud83e\udd1d",
                    "description": "Transparent practices with professional ethics"
                },
                {
                    "title": "Results",
                    "icon": "\ud83d\udcc8",
                    "description": "Delivering measurable outcomes in Aerial Survey & Mapping"
                }
            ],
            "certifications": [
                "Certified Photogrammetric Surveyor (CPS)",
                "Certified Mapping Scientist (CMS)",
                "Compliance Certification in Cartography and Geo-Information"
            ],
            "achievements": [
                "Successfully mapped over 5000 hectares with 99% accuracy",
                "Recipient of Excellence in Aerial Surveying Award",
                "Helped clients save over \u20b910 Crores through efficient land management"
            ]
        },
        "services": {
            "heading": {
                "head": "Professional Aerial Survey & Mapping Services",
                "desc": "Your success is our mission. Discover our comprehensive Aerial Survey & Mapping solutions."
            },
            "services": [
                {
                    "benefits": [
                        "Save up to 30% on land management costs",
                        "Improve project planning with accurate data",
                        "Ensure compliance with professional certifications"
                    ],
                    "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    "features": [
                        "High accuracy aerial surveys",
                        "Detailed topographical mapping",
                        "Expert GIS integration",
                        "Timely project delivery"
                    ],
                    "process": [
                        "Initial consultation to assess project needs",
                        "Detailed planning and strategy formulation",
                        "Implementation of aerial survey and data analysis",
                        "Quality assurance and compliance check",
                        "Final delivery with ongoing support"
                    ],
                    "detailedDescription": "Our aerial survey service combines state-of-the-art technology with expert analysis, resulting in high precision maps. With a focus on quality and accuracy, we deliver reliable data for land management and construction monitoring.",
                    "description": "High precision aerial surveys and detailed mapping services that optimize land management.",
                    "timeline": "1-4 weeks depending on project complexity",
                    "title": "Professional Aerial Survey & Mapping Service",
                    "category": "Aerial Survey & Mapping",
                    "pricing": "\u20b950,000-\u20b93,00,000 (based on scope)"
                }
            ],
            "categories": [
                "All",
                "Aerial Survey & Mapping",
                "Specialized Solutions"
            ]
        },
        "products": {
            "heading": {
                "title": "Professional Aerial Survey & Mapping Products",
                "heading": "Innovative Solutions Built for Success",
                "description": "Enhance your operations with our quality Aerial Survey & Mapping solutions.",
                "trust": "for your business."
            },
            "products": [
                {
                    "title": "dsvsdv Aerial Mapping Solution",
                    "category": "Aerial Survey & Mapping Solutions",
                    "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    "description": "Our specialized aerial mapping product ensures high accuracy and quality, supporting your business needs.",
                    "features": [
                        "High precision aerial mapping",
                        "Professional grade GIS integration",
                        "Expert support",
                        "Reliable performance"
                    ],
                    "isPopular": true,
                    "categoryColor": "bg-blue-100 text-blue-800",
                    "detailedDescription": "Our product integrates advanced mapping technology with professional GIS to provide detailed, accurate maps. It is designed to support land management, construction monitoring, and similar applications.",
                    "pricing": "\u20b910,00,000 - \u20b915,00,000",
                    "timeline": "2-4 weeks delivery with training"
                }
            ],
            "benefits": [
                {
                    "icon": "30",
                    "color": "red-accent",
                    "title": "30-Day Guarantee",
                    "desc": "Risk-free trial of our Aerial Survey & Mapping solution"
                },
                {
                    "icon": "99%",
                    "color": "primary",
                    "title": "Success Rate",
                    "desc": "Proven track record in Aerial Survey & Mapping"
                },
                {
                    "icon": "\u221e",
                    "color": "gradient",
                    "title": "Ongoing Support",
                    "desc": "Comprehensive assistance for your Aerial Survey & Mapping needs"
                }
            ]
        },
        "blog": {
            "header": {
                "title": "Aerial Survey & Mapping Blog",
                "badge": "Latest Insights",
                "desc": "Stay updated with latest trends and insights in Aerial Survey & Mapping"
            },
            "posts": [
                {
                    "date": "2025-08-25",
                    "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
                    "author": "dsvsdv",
                    "readTime": "5 min read",
                    "id": 1.0,
                    "title": "Latest trends and innovations in Aerial Survey & Mapping for 2025",
                    "excerpt": "An analysis of recent developments and future outlook in Aerial Survey & Mapping",
                    "category": "Trends",
                    "content": "<p>The world of Aerial Survey & Mapping is constantly evolving, with new technologies and methods emerging. As we look to the future, a few key trends stand out...</p>"
                },
                {
                    "date": "2025-08-20",
                    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                    "author": "dsvsdv",
                    "readTime": "7 min read",
                    "id": 2.0,
                    "title": "Business strategies for success in Aerial Survey & Mapping",
                    "excerpt": "Strategic insights for business growth and market positioning in Aerial Survey & Mapping",
                    "category": "Strategy",
                    "content": "<p>In the competitive Aerial Survey & Mapping industry, a robust business strategy is essential for success...</p>"
                },
                {
                    "date": "2025-08-15",
                    "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
                    "author": "dsvsdv",
                    "readTime": "6 min read",
                    "id": 3.0,
                    "title": "Technology transforming the Aerial Survey & Mapping landscape",
                    "excerpt": "Exploring the impact of technology on Aerial Survey & Mapping and its future implications",
                    "category": "Technology",
                    "content": "<p>Technology is reshaping the Aerial Survey & Mapping landscape in profound ways...</p>"
                }
            ]
        },
        "clients": {
            "headline": {
                "title": "Trusted Partners",
                "description": "Working with leading organizations across Nagpur, MH, IN"
            },
            "clients": [
                {
                    "name": "Solutions Ltd",
                    "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80"
                },
                {
                    "name": "Innovation Corp",
                    "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=80"
                },
                {
                    "name": "Tech Ventures",
                    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80"
                },
                {
                    "name": "Business Partners",
                    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80"
                }
            ],
            "stats": [
                {
                    "value": "500+",
                    "label": "Projects Completed"
                },
                {
                    "value": "150+",
                    "label": "Happy Clients"
                },
                {
                    "value": "8+",
                    "label": "Years in Business"
                },
                {
                    "value": "95%",
                    "label": "Success Rate"
                }
            ]
        },
        "testimonials": {
            "headline": {
                "title": "Client Success Stories",
                "description": "Satisfied clients sharing their success with our Aerial Survey & Mapping services"
            },
            "testimonials": [
                {
                    "name": "Rajesh Kumar",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
                    "role": "Manager, Solutions Ltd",
                    "quote": "dsvsdv's precision in aerial mapping significantly improved our project planning efficiency."
                },
                {
                    "name": "Priya Sharma",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80",
                    "role": "Operations Director, Corp",
                    "quote": "With dsvsdv's services, we achieved high accuracy in our land management operation."
                },
                {
                    "name": "Amit Patel",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                    "role": "CEO, Ventures",
                    "quote": "dsvsdv helped us save over \u20b91 Crore in construction costs through their precise surveying."
                }
            ],
            "stats": [
                {
                    "value": "4.8/5",
                    "label": "Average Rating"
                },
                {
                    "value": "150+",
                    "label": "Happy Clients"
                },
                {
                    "value": "500+",
                    "label": "Projects Completed"
                },
                {
                    "value": "95%",
                    "label": "Success Rate"
                }
            ]
        },
        "contact": {
            "title": "Ready to Transform Your Aerial Survey & Mapping Operations?",
            "description": "Contact dsvsdv today for a consultation tailored to your specific needs.",
            "ctaButton": "Get Free Consultation",
            "backgroundImage": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
            "benefits": [
                "Free initial consultation",
                "Customized solution design",
                "Expert guidance and support",
                "Competitive pricing"
            ],
            "contactInfo": {
                "phone": "dvsdv",
                "email": "example@gmail.com",
                "address": "Parvati Nagar",
                "website": "https://www.youtube.com/",
                "companyName": "dsvsdv",
                "supportPhone": "",
                "supportEmail": "",
                "whatsappLink": "",
                "gstin": "",
                "directorName": "vsdv",
                "legalName": ""
            },
            "businessHours": "Mon-Fri: 9:00 AM - 6:00 PM",
            "mapEmbedUrl": "",
            "socialMedia": {
                "linkedin": "",
                "twitter": "",
                "facebook": "",
                "instagram": "",
                "youtube": "",
                "website": ""
            },
            "alternateContact": {
                "name": "fsvsdv",
                "email": "sdvsdv",
                "phone": "dsfdsfv"
            },
            "billingContact": {
                "name": "",
                "email": "",
                "address": "",
                "gstin": ""
            }
        },
        "faq": {
            "title": "Frequently Asked Questions",
            "questions": [
                {
                    "question": "What makes dsvsdv different in Aerial Survey & Mapping?",
                    "answer": "At dsvsdv, we combine expertise with advanced technology to deliver high precision aerial surveys and mapping services. Our commitment to quality and compliance sets us apart."
                },
                {
                    "question": "How do you ensure quality in Aerial Survey & Mapping projects?",
                    "answer": "Quality is at the heart of our services. We adhere to strict quality standards and have robust quality assurance processes in place."
                },
                {
                    "question": "What is your Aerial Survey & Mapping pricing structure?",
                    "answer": "Our pricing is competitive and transparent, based on the scope of the project. We provide value-driven services that optimize your operations."
                },
                {
                    "question": "How long do Aerial Survey & Mapping projects typically take?",
                    "answer": "Project timelines vary based on the complexity and scope of the work. Typically, a project can take anywhere from 1-4 weeks."
                },
                {
                    "question": "Do you provide ongoing Aerial Survey & Mapping support?",
                    "answer": "Yes, we provide comprehensive support to our clients, ensuring their continuous success."
                },
                {
                    "question": "What Aerial Survey & Mapping specializations do you offer?",
                    "answer": "We specialize in precision aerial surveying, topographical mapping, construction monitoring, and GIS integration."
                }
            ]
        },
        "profile": {
            "heading": "Our Expert Team",
            "subheading": "Meet the professionals driving our success",
            "teamMembers": [
                {
                    "id": 1,
                    "name": "vsdv",
                    "role": "CEO & Director",
                    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                    "bio": "Visionary leader with extensive industry experience",
                    "socialLinks": {
                        "linkedin": "#",
                        "twitter": "#"
                    }
                }
            ],
            "joinTeam": {
                "title": "Join Our Growing Team",
                "description": "We're always looking for passionate professionals",
                "buttonText": "View Careers"
            }
        },
        "gallery": {
            "heading": {
                "title": "Our Portfolio",
                "description": "Showcasing successful projects and professional excellence"
            },
            "categories": [
                "All",
                "Portfolio",
                "Projects",
                "Professional Services",
                "Client Projects"
            ],
            "images": [
                {
                    "id": 1.0,
                    "url": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
                    "title": "Project 1",
                    "category": "Portfolio",
                    "description": "Showcase of our professional services - Project 1",
                    "isPopular": true
                },
                {
                    "id": 2.0,
                    "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                    "title": "Project 2",
                    "category": "Portfolio",
                    "description": "Showcase of our professional services - Project 2",
                    "isPopular": true
                },
                {
                    "id": 3.0,
                    "url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
                    "title": "Project 3",
                    "category": "Projects",
                    "description": "Showcase of our professional services - Project 3",
                    "isPopular": false
                }
            ]
        }
    }
});

  const [finaleDataReview, setFinaleDataReview] = useState<any | []>({});

  const navigate = useNavigate();
  //pulish final template
  async function fetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.publishedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalTemplate),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      toast.success(
        "Your site is successfully published and now it is under review"
      );
      navigate("/user/companies");
      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  //edit and publish final template

  async function editFetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${finaleDataReview.userId}/update/${finaleDataReview.publishedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalTemplate),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      toast.success(
        "Your site is successfully published and now it is under review"
      );
      navigate("/user/companies");
      setFinaleDataReview({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  function publishTemplate() {
    setIsPublishedTriggered(true);
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      fetchAPI();
    }, 100);
  }
  function editPublishTemplate() {
    setIsPublishedTriggered(true);
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      editFetchAPI();
    }, 100);
  }

  useEffect(() => {
    console.log("finalData:", finalTemplate);
  }, [finalTemplate]);

  useEffect(() => {
    console.log("final preview data:", finaleDataReview);
  }, [finaleDataReview]);

  async function publishProfessionalTemplate() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        `https://tlpun4lz89.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.professionalId}?template=${AIGenData.templateSelection}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalTemplate),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      toast.success(
        "Your template is successfully published and now it is under review"
      );
      navigate("/user/professional");
      setAIGenData({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Something went wrong...");
    }
  }

  return (
    <TemplateContext.Provider
      value={{
        draftDetails,
        setDraftDetails,
        AIGenData,
        setAIGenData,
        isPublishedTriggered,
        setIsPublishedTriggered,
        finalTemplate,
        setFinalTemplate,
        publishTemplate,
        publishProfessionalTemplate,
        setFinaleDataReview,
        finaleDataReview,
        editPublishTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}

// Combined Provider for easier app integration
interface CombinedProvidersProps {
  children: ReactNode;
}

export const CombinedProviders: React.FC<CombinedProvidersProps> = ({
  children,
}) => {
  return (
    <UserAuthProvider>
      <TemplateProvider>{children}</TemplateProvider>
    </UserAuthProvider>
  );
};
