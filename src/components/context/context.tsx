import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
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
  const [haveAccount, setHaveAccount] = useState<boolean>(true);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
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
    <UserAuthContext.Provider
      value={{
        user,
        isLogin,
        login,
        logout,
        haveAccount,
        setHaveAccount,
        accountEmail,
        setAccountEmail,
      }}
    >
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
    "publishedId": "pub-3d84a9f399834920",
    "userId": "example2@gmail.com",
    "draftId": "draft-6161bb639e3f42e38f01103fbf797dec",
    "templateSelection": "template-2",
    "isEdited": false,
    "lastModified": "2025-10-27T12:51:30.479422",
    "version": 1,
    "content": {
        "company": {
            "name": "awcawuk",
            "logo": "https://dronetv-company-assets-store.s3.ap-south-1.amazonaws.com/uploads/example2@gmail.com/identity/logos/1761569431-ac767a4c-AC-repair.jpg",
            "industry": "Drone Technology",
            "established": "",
            "location": "nagpur, MH, IN",
            "metrics": {
                "yearsInBusiness": "5+",
                "projectsCompleted": "550+",
                "clientsSatisfied": "85+"
            }
        },
        "hero": {
            "title": "Innovating Drone Technology Solutions with awcawuk",
            "subtitle": "Empowering businesses with cutting-edge Drone Technology services in nagpur, MH, IN",
            "backgroundImage": "https://images.unsplash.com/photo-1585240027282-07853a0b05d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3xlbnwwfDB8fHwxNzYxNTU4MjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
            "features": [
                "Enhanced data collection for optimized operations efficiency",
                "Leading provider of Drone Technology solutions in nagpur, MH, IN",
                "Expertise in advanced Drone Technology applications for diverse industries"
            ],
            "primaryAction": {
                "type": "primary",
                "text": "Get Quote"
            },
            "secondaryAction": {
                "type": "secondary",
                "text": "View Services"
            }
        },
        "about": {
            "description1": "Founded by acalknw in , awcawuk envisioned revolutionizing Drone Technology, overcoming initial challenges to pioneer industry advancements.",
            "description2": "",
            "mission": "Empower businesses with top-tier Drone Technology solutions for enhanced efficiency and productivity.",
            "vision": "To lead the global Drone Technology sector, driving innovation and setting new standards of excellence.",
            "officeImage": "",
            "visionPillars": [
                {
                    "title": "Professional Excellence",
                    "icon": "\ud83c\udfaf",
                    "description": "Setting benchmarks in Drone Technology quality standards"
                },
                {
                    "title": "Innovation",
                    "icon": "\ud83d\udca1",
                    "description": "Driving forward with cutting-edge Drone Technology solutions"
                },
                {
                    "title": "Client Success",
                    "icon": "\ud83d\udcc8",
                    "description": "Delivering measurable Drone Technology results for client satisfaction"
                },
                {
                    "title": "Integrity",
                    "icon": "\ud83e\udd1d",
                    "description": "Upholding transparency in all Drone Technology practices"
                }
            ],
            "certifications": [
                "Industry-recognized Drone Technology certification 1",
                "Professional Drone Technology accreditation 2",
                "Drone Technology compliance certification 3"
            ],
            "achievements": [
                "Achieved 30% operational efficiency improvement through Drone Technology integration",
                "Recipient of Drone Technology Innovation Award in",
                "Reached a milestone of 100 successful client projects with tangible impact"
            ]
        },
        "services": {
            "heading": {
                "head": "Professional Drone Technology Services",
                "desc": "Comprehensive Drone Technology solutions by awcawuk"
            },
            "services": [
                {
                    "benefits": [
                        "Time-saving data collection with up to 40% efficiency",
                        "Cost-effective solutions compared to traditional survey methods",
                        "Improved data accuracy leading to better decision-making"
                    ],
                    "image": "https://images.unsplash.com/photo-1753726065899-f6592b49bdb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBzZXJ2aWNlJTIwdGVjaG5vbG9neSUyMGFkdmFuY2VkfGVufDB8MHx8fDE3NjE1NTgyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "features": [
                        "High-precision GPS technology for accurate data collection",
                        "Customizable survey parameters based on client needs",
                        "Detailed mapping reports with actionable insights",
                        "Real-time monitoring and data analysis"
                    ],
                    "process": [
                        "Step 1: Initial consultation and project requirement analysis",
                        "Step 2: Flight planning and data collection",
                        "Step 3: Data processing and analysis",
                        "Step 4: Report generation and client review",
                        "Step 5: Delivery of final survey reports"
                    ],
                    "detailedDescription": "Our aerial mapping and surveying services offer a range of applications from land surveying to infrastructure inspection. Using cutting-edge drone technology, we provide efficient and precise data collection for various industries.",
                    "description": "Specialized aerial mapping and surveying using advanced drone technology.",
                    "timeline": "2-4 weeks",
                    "title": "Aerial Mapping and Surveying",
                    "category": "Drone Technology Services",
                    "pricing": "\u20b950,000 - \u20b93,00,000"
                }
            ],
            "categories": [
                "All",
                "Drone Technology Services",
                "Professional Services"
            ]
        },
        "products": {
            "heading": {
                "title": "Professional Drone Technology Products",
                "heading": "Innovative Solutions Built for Success",
                "description": "Quality Drone Technology solutions by awcawuk",
                "trust": "for your business."
            },
            "products": [
                {
                    "title": "Industrial Inspection Drone",
                    "category": "Drone Technology Solutions",
                    "image": "https://images.unsplash.com/photo-1597378994822-9f850841e676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9kdWN0JTIwc29sdXRpb24lMjBhZHZhbmNlZHxlbnwwfDB8fHwxNzYxNTU4MjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                    "description": "An advanced drone designed for industrial inspections and monitoring.",
                    "features": [
                        "High-resolution camera with thermal imaging capabilities",
                        "Long-range flight capability for extensive coverage",
                        "Live streaming of inspection footage for real-time analysis",
                        "Robust build suitable for challenging environments"
                    ],
                    "isPopular": true,
                    "categoryColor": "bg-blue-100 text-blue-800",
                    "detailedDescription": "The Industrial Inspection Drone is an essential tool for various industries requiring regular inspections. With its cutting-edge features and durability, it ensures efficient and detailed monitoring of critical infrastructure.",
                    "pricing": "\u20b98,00,000 - \u20b920,00,000",
                    "timeline": "3-5 weeks delivery with training"
                }
            ],
            "benefits": [
                {
                    "icon": "30",
                    "color": "red-accent",
                    "title": "30-Day Guarantee",
                    "desc": "Risk-free trial period"
                },
                {
                    "icon": "95%",
                    "color": "primary",
                    "title": "95% Success Rate",
                    "desc": "Industry-leading results"
                },
                {
                    "icon": "\u221e",
                    "color": "gradient",
                    "title": "Unlimited Support",
                    "desc": "Comprehensive assistance"
                }
            ]
        },
        "blog": {
            "header": {
                "title": "Drone Technology Blog",
                "badge": "Latest Insights",
                "desc": "Expert insights and industry trends from awcawuk"
            },
            "posts": [
                {
                    "date": "2025-08-25",
                    "image": "https://images.unsplash.com/photo-1760553120296-afe0e7692768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxEcm9uZSUyMFRlY2hub2xvZ3klMjB0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMGFkdmFuY2VkfGVufDB8MHx8fDE3NjE1NTgyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "author": "",
                    "readTime": "5 min read",
                    "id": 1.0,
                    "title": "Latest Trends in Drone Technology for 2025",
                    "excerpt": "Comprehensive overview of emerging trends and innovations in Drone Technology",
                    "category": "Drone Technology Trends",
                    "content": "<h1>Latest Trends in Drone Technology for 2025</h1><p>The Drone Technology sector is experiencing rapid transformation with new technologies and methodologies emerging.</p><h2>Key Trends</h2><p>Industry leaders are focusing on innovation, efficiency, and sustainable practices.</p><h2>Impact on Businesses</h2><p>These trends are reshaping how businesses approach Drone Technology solutions.</p><h2>Future Outlook</h2><p>The future of Drone Technology looks promising with continued advancement and adoption.</p>"
                },
                {
                    "date": "2025-08-20",
                    "image": "https://images.unsplash.com/photo-1585240027282-07853a0b05d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwyfHxEcm9uZSUyMFRlY2hub2xvZ3klMjB0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMHByb2Zlc3Npb25hbHxlbnwwfDB8fHwxNzYxNTU4MjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
                    "author": "",
                    "readTime": "7 min read",
                    "id": 2.0,
                    "title": "How to Choose the Right Drone Technology Solution",
                    "excerpt": "Practical guide to selecting the best Drone Technology services for your business",
                    "category": "Drone Technology Guide",
                    "content": "<h1>Choosing the Right Drone Technology Solution</h1><p>Making the right choice in Drone Technology solutions is crucial for business success.</p><h2>Key Considerations</h2><p>Evaluate your requirements, budget, and long-term goals.</p><h2>Evaluation Criteria</h2><p>Consider technology, support, scalability, and return on investment.</p><h2>Making the Decision</h2><p>Partner with experienced providers who understand your industry needs.</p>"
                },
                {
                    "date": "2025-08-15",
                    "image": "https://images.unsplash.com/photo-1511333122491-991715e06289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwzfHxEcm9uZSUyMFRlY2hub2xvZ3klMjB0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMGlubm92YXRpdmV8ZW58MHwwfHx8MTc2MTU1ODI0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
                    "author": "",
                    "readTime": "6 min read",
                    "id": 3.0,
                    "title": "ROI and Business Benefits of Drone Technology Solutions",
                    "excerpt": "Understanding the return on investment in Drone Technology technology",
                    "category": "Drone Technology Business",
                    "content": "<h1>ROI of Drone Technology Solutions</h1><p>Investing in Drone Technology solutions delivers measurable business benefits.</p><h2>Cost Savings</h2><p>Reduce operational costs through efficiency and automation.</p><h2>Productivity Gains</h2><p>Improve productivity and output quality with professional solutions.</p><h2>Competitive Advantage</h2><p>Stay ahead with cutting-edge Drone Technology technology and expertise.</p>"
                }
            ]
        },
        "clients": {
            "headline": {
                "title": "Trusted by Leading Organizations",
                "description": "awcawuk serves diverse clients across industries in nagpur, MH, IN and beyond"
            },
            "clients": [
                {
                    "name": "Professional Services Ltd",
                    "image": "https://images.unsplash.com/photo-1642310290564-30033ff60334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxjb21wYW55JTIwbG9nbyUyMHByb2Zlc3Npb25hbHxlbnwwfDJ8fHwxNzYxNTMxNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                },
                {
                    "name": "Technology Innovations",
                    "image": "https://images.unsplash.com/photo-1713990983242-e65d22c36f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwyfHxjb21wYW55JTIwbG9nbyUyMHByb2Zlc3Npb25hbHxlbnwwfDJ8fHwxNzYxNTMxNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                },
                {
                    "name": "Business Solutions Corp",
                    "image": "https://images.unsplash.com/photo-1667840579428-599d8e942363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwzfHxjb21wYW55JTIwbG9nbyUyMHByb2Zlc3Npb25hbHxlbnwwfDJ8fHwxNzYxNTMxNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                },
                {
                    "name": "Industry Leaders Inc",
                    "image": "https://images.unsplash.com/photo-1753978546915-5dafd18b1e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHw0fHxjb21wYW55JTIwbG9nbyUyMHByb2Zlc3Npb25hbHxlbnwwfDJ8fHwxNzYxNTMxNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                }
            ],
            "stats": [
                {
                    "value": "550+",
                    "label": "Projects Completed"
                },
                {
                    "value": "85+",
                    "label": "Happy Clients"
                },
                {
                    "value": "5+",
                    "label": "Years Experience"
                },
                {
                    "value": "95%",
                    "label": "Success Rate"
                }
            ]
        },
        "testimonials": {
            "headline": {
                "title": "What Our Clients Say",
                "description": "Success stories from clients of awcawuk"
            },
            "testimonials": [
                {
                    "name": "Rajesh Kumar",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
                    "role": "Project Manager, Drone Technology Solutions Ltd",
                    "quote": "Working with awcawuk has been excellent. Their Drone Technology expertise helped us achieve our project goals efficiently and within budget."
                },
                {
                    "name": "Priya Sharma",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80",
                    "role": "Operations Director, Tech Innovations",
                    "quote": "awcawuk provided exceptional Drone Technology services. Their professional approach and attention to detail made a significant difference."
                },
                {
                    "name": "Amit Patel",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                    "role": "CEO, Business Ventures",
                    "quote": "The team at awcawuk delivered beyond expectations. Their Drone Technology solutions have significantly improved our operations."
                },
                {
                    "name": "Dr. Sunita Verma",
                    "rating": 4.0,
                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
                    "role": "Director, Professional Services",
                    "quote": "awcawuk combines technical expertise with excellent customer service. Highly recommended for Drone Technology solutions."
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
            "title": "Get In Touch with awcawuk",
            "description": "Consult with awcawuk for expert guidance on integrating Drone Technology solutions",
            "ctaButton": "Get Free Consultation",
            "backgroundImage": "https://images.unsplash.com/photo-1725795210683-cf624ec1aafa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBjb25zdWx0YXRpb24lMjBvZmZpY2V8ZW58MHwwfHx8MTc2MTU1ODI0OXww&ixlib=rb-4.1.0&q=80&w=1080",
            "benefits": [
                "Free Drone Technology consultation and tailored needs assessment",
                "Expert guidance from experienced Drone Technology team",
                "Competitive pricing with transparent cost breakdown",
                "Swift response time and dependable support"
            ],
            "contactInfo": {
                "phone": "+917798598846",
                "email": "ayushchouhan417@gmail.com",
                "address": "3061/1\nrameshwari road",
                "website": "https://www.youtube.com/",
                "companyName": "awcawuk",
                "supportPhone": "",
                "supportEmail": "",
                "whatsappLink": "",
                "gstin": "",
                "directorName": "acalknw",
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
                "name": "ayush chouhan",
                "email": "awcihakjwc",
                "phone": "awcaknwclkajw"
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
                    "question": "What makes awcawuk different in Drone Technology?",
                    "answer": "awcawuk combines deep Drone Technology expertise with a commitment to quality and customer satisfaction. Our experienced team delivers tailored solutions that meet your specific business needs."
                },
                {
                    "question": "How do you ensure quality in Drone Technology projects?",
                    "answer": "We follow industry best practices and quality standards throughout every project. Our team conducts thorough testing and validation to ensure all deliverables meet the highest quality benchmarks."
                },
                {
                    "question": "What is your pricing structure for Drone Technology services?",
                    "answer": "Our pricing is transparent and competitive, based on project scope, complexity, and timeline. We provide detailed quotes after understanding your requirements and offer flexible payment options."
                },
                {
                    "question": "How long do Drone Technology projects typically take?",
                    "answer": "Project timelines vary based on scope and complexity. Most Drone Technology projects are completed within 2-8 weeks. We provide realistic timelines during consultation and keep you updated throughout."
                },
                {
                    "question": "Do you provide ongoing support after project completion?",
                    "answer": "Yes, we offer comprehensive post-project support including maintenance, troubleshooting, and consultation. Our support team is available to ensure your Drone Technology solutions continue to perform optimally."
                },
                {
                    "question": "What industries do you serve with Drone Technology solutions?",
                    "answer": "We serve clients across multiple sectors including manufacturing, construction, agriculture, real estate, and technology. Our Drone Technology solutions are adaptable to various industry requirements."
                }
            ]
        },
        "profile": {
            "heading": "Our Expert Team",
            "subheading": "Meet the professionals driving our success",
            "teamMembers": [
                {
                    "id": 1,
                    "name": "acalknw",
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
                "title": "awcawuk Portfolio",
                "description": "Showcasing our Drone Technology expertise"
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
                    "url": "https://images.unsplash.com/photo-1511333122491-991715e06289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjB3b3JrfGVufDB8MHx8fDE3NjE1NTgyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "title": "Professional Drone Technology Project 1",
                    "category": "Portfolio",
                    "description": "Showcase of our professional services - Professional Drone Technology Project 1",
                    "isPopular": true
                },
                {
                    "id": 2.0,
                    "url": "https://images.unsplash.com/photo-1597378994822-9f850841e676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwyfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjB3b3JrfGVufDB8MHx8fDE3NjE1NTgyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "title": "Professional Drone Technology Project 2",
                    "category": "Portfolio",
                    "description": "Showcase of our professional services - Professional Drone Technology Project 2",
                    "isPopular": true
                },
                {
                    "id": 3.0,
                    "url": "https://images.unsplash.com/photo-1661936955098-b991c99fd023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwzfHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjB3b3JrfGVufDB8MHx8fDE3NjE1NTgyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "title": "Professional Drone Technology Project 3",
                    "category": "Portfolio",
                    "description": "Showcase of our professional services - Professional Drone Technology Project 3",
                    "isPopular": false
                },
                {
                    "id": 4.0,
                    "url": "https://images.unsplash.com/photo-1499512670907-145ba08fcc16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHw0fHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjB3b3JrfGVufDB8MHx8fDE3NjE1NTgyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "title": "Professional Drone Technology Project 4",
                    "category": "Projects",
                    "description": "Showcase of our professional services - Professional Drone Technology Project 4",
                    "isPopular": false
                },
                {
                    "id": 5.0,
                    "url": "https://images.unsplash.com/photo-1582575904714-760d1c5a45cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHw1fHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjB3b3JrfGVufDB8MHx8fDE3NjE1NTgyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "title": "Professional Drone Technology Project 5",
                    "category": "Projects",
                    "description": "Showcase of our professional services - Professional Drone Technology Project 5",
                    "isPopular": false
                },
                {
                    "id": 6.0,
                    "url": "https://images.unsplash.com/photo-1499512670907-145ba08fcc16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHw2fHxEcm9uZSUyMFRlY2hub2xvZ3klMjBwcm9mZXNzaW9uYWwlMjB3b3JrfGVufDB8MHx8fDE3NjE1NTgyNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    "title": "Professional Drone Technology Project 6",
                    "category": "Projects",
                    "description": "Showcase of our professional services - Professional Drone Technology Project 6",
                    "isPopular": false
                }
            ]
        }
    }
});

  const [finaleDataReview, setFinaleDataReview] = useState<any | []>({});
  const [navModel, setNavModel] = useState(true);

  const navigate = useNavigate();
  const { isLogin } = useUserAuth();

  function navigatemodel() {
   
      return (
        <motion.div
          className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Successfully Published!
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                You have successfully published your template.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/")}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Go to Login
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      );
 
  }

  //pulish final template
  async function fetchAPI() {
    if (Object.keys(finalTemplate).length === 0) {
      toast.error("No content to publish");
      return;
    }

    try {
      const response = await fetch(
        // `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${AIGenData.userId}/update/${AIGenData.publishedId}`,
        `https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update`,
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

      if (isLogin === false) {
        setNavModel(true);
        // navigatemodel();
      } else {
        navigate("/user-companies");
        setNavModel(false);
      }

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
        // `https://3l8nvxqw1a.execute-api.ap-south-1.amazonaws.com/prod/api/draft/${finaleDataReview.userId}/update/${finaleDataReview.publishedId}`,
        `https://59rgr29n6b.execute-api.ap-south-1.amazonaws.com/dev/update`,
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
      navigate("/user-companies");
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
        navModel,
        navigatemodel
        
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
