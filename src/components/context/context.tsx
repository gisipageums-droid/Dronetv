import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

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

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

interface UserAuthProviderProps {
  children: ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLogin = !!user;

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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

  finaleDataReview: any |[];
  setFinaleDataReview: React.Dispatch<React.SetStateAction<any | []>>;
  editPublishTemplate: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [draftDetails, setDraftDetails] = useState<any | []>({});
  const [isPublishedTriggered, setIsPublishedTriggered] = useState<boolean>(false);
  const [finalTemplate, setFinalTemplate] = useState<any | []>({});
  const [AIGenData, setAIGenData] = useState<any>({
    "publishedId": "pub-8902eb9a9a074893",
    "userId": "example@gmail.com",
    "draftId": "draft-ffbd08ccd7a449a7a82974a8fa4cff42",
    "templateSelection": "template-2",
    "isEdited": false,
    "lastModified": "2025-09-19T18:01:25.084759",
    "version": 1,
    "content": {
        "company": {
            "name": "br",
            "logo": "https://dronetv-company-assets-store.s3.ap-south-1.amazonaws.com/uploads/example@gmail.com/identity/logos/1758304869-6d32c400-KT-img.png",
            "industry": "Drone Technology Solutions",
            "established": "2020",
            "location": "nagpur, MH, IN",
            "metrics": {
                "yearsInBusiness": "5+",
                "projectsCompleted": "250+",
                "clientsSatisfied": "50+"
            }
        },
        "hero": {
            "title": "Revolutionizing Aerial Perspectives",
            "subtitle": "br delivers precise drone solutions, transforming your data capture. Experience unparalleled accuracy and innovation for superior results.",
            "backgroundImage": "Professional drone in action - aerial photography",
            "features": [
                "DGCA Certified Operations",
                "Advanced Drone Technology",
                "Professional Results Guaranteed"
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
            "description1": "BR was founded in [Year] by [Founder Name(s)] with a vision to revolutionize data acquisition through safe and reliable drone technology. Their initial focus was on providing high-quality aerial photography",
            "description2": "services. A deep commitment to client satisfaction fueled early growth. Over the years, BR has expanded its expertise to encompass",
            "mission": "To provide safe, reliable, and innovative drone-based solutions that deliver precise data and enhance operational efficiency for our clients, while adhering to the highest DGCA standards.",
            "vision": "To be the leading provider of cutting-edge drone technology solutions in India, empowering businesses and communities with aerial data insights.",
            "officeImage": "",
            "visionPillars": [
                {
                    "title": "Safety First",
                    "icon": "🛡",
                    "description": "Uncompromising DGCA compliance and safety"
                },
                {
                    "title": "Innovation",
                    "icon": "💡",
                    "description": "Cutting-edge drone technology solutions"
                },
                {
                    "title": "Precision",
                    "icon": "🎯",
                    "description": "Accurate, reliable data and services"
                },
                {
                    "title": "Partnership",
                    "icon": "🤝",
                    "description": "Long-term relationships based on trust"
                }
            ],
            "certifications": [
                "DGCA Remote Pilot License",
                "Professional Drone Operations Certification",
                "Advanced Aerial Photography Training"
            ],
            "achievements": [
                "500+ Successful Drone Operations Completed",
                "DGCA Certified Pilots and Operations",
                "99.8% Project Success Rate Achieved"
            ]
        },
        "services": {
            "heading": {
                "head": "Professional Drone Services",
                "desc": "Comprehensive aerial solutions designed to transform your business operations with precision, efficiency, and measurable results."
            },
            "services": [
                {
                    "benefits": [
                        "Reduce survey time by 80% compared to traditional ground methods",
                        "Achieve accuracy levels within 2-3cm tolerance for critical measurements",
                        "Cost savings of ₹2-5 lakhs per large-scale surveying project"
                    ],
                    "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    "features": [
                        "Sub-centimeter accuracy RTK GPS mapping",
                        "Real-time data processing and visualization",
                        "3D terrain modeling and point cloud generation",
                        "DGCA compliant flight operations with certified pilots"
                    ],
                    "process": [
                        "Comprehensive site assessment and detailed flight planning",
                        "DGCA clearance acquisition and safety protocol implementation",
                        "Professional drone deployment with RTK GPS precision systems",
                        "Real-time data collection with continuous quality monitoring",
                        "Advanced post-processing and comprehensive report generation"
                    ],
                    "detailedDescription": "Our aerial surveying services utilize advanced drone technology with RTK GPS systems to provide accurate topographical data, construction progress monitoring, and comprehensive infrastructure assessment.",
                    "description": "High-precision aerial surveys for construction, infrastructure development, and land management with centimeter-level accuracy.",
                    "timeline": "3-7 days depending on area coverage and complexity",
                    "title": "Aerial Survey & Mapping",
                    "category": "Survey Services",
                    "pricing": "₹25,000 - ₹1,50,000 per project"
                }
            ],
            "categories": [
                "All",
                "Survey Services"
            ]
        },
        "products": {
            "heading": {
                "title": "Professional Products",
                "heading": "Innovative Solutions Built for Success",
                "description": "Quality drone solutions for your business.",
                "trust": "for your business."
            },
            "products": [
                {
                    "title": "Professional Survey Drone X1",
                    "category": "Survey Equipment",
                    "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
                    "description": "High-precision survey drone with RTK GPS for professional mapping applications.",
                    "features": [
                        "24MP with 3-axis gimbal stabilization",
                        "2cm RTK precision positioning",
                        "45 minutes extended battery life",
                        "DGCA type certified for commercial operations"
                    ],
                    "isPopular": true,
                    "categoryColor": "bg-blue-100 text-blue-800",
                    "detailedDescription": "Professional-grade survey drone designed for accuracy and reliability in commercial applications.",
                    "pricing": "₹8,50,000 - ₹12,00,000",
                    "timeline": "2-4 weeks delivery with training"
                }
            ],
            "benefits": [
                {
                    "icon": "30",
                    "color": "red-accent",
                    "title": "30-Day Money Back",
                    "desc": "Try our solutions risk-free."
                },
                {
                    "icon": "99%",
                    "color": "primary",
                    "title": "99% Success Rate",
                    "desc": "Industry-leading success rate."
                },
                {
                    "icon": "∞",
                    "color": "gradient",
                    "title": "Unlimited Support",
                    "desc": "Comprehensive training and assistance."
                }
            ]
        },
        "blog": {
            "header": {
                "title": "Drone Technology Blog",
                "badge": "Latest Insights",
                "desc": "Stay updated with latest trends in aerial technology and industry insights from our experts."
            },
            "posts": [
                {
                    "date": "2025-08-25",
                    "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                    "author": "",
                    "readTime": "5 min read",
                    "id": 1.0,
                    "title": "DGCA Regulations 2025: What Drone Operators Need to Know",
                    "excerpt": "Complete guide to latest DGCA drone regulations and compliance requirements for commercial operations in India.",
                    "category": "Regulations",
                    "content": "<h1>Understanding the 2025 DGCA Drone Regulations</h1><p>The Directorate General of Civil Aviation (DGCA) in India has implemented updated regulations for drone operations in 2025.  These changes significantly impact commercial drone usage, requiring operators to understand and comply with new safety, operational, and registration requirements. This guide provides a comprehensive overview of key changes and their implications.</p><h2>Key Changes in DGCA Regulations 2025</h2><p>This section will detail specific changes, such as new licensing procedures, operational limitations in specific airspace,  and updated requirements for drone maintenance and safety protocols.  Specific examples of changes and their impact on businesses will be provided.</p><h2>Compliance and Best Practices</h2><p>This section will discuss practical steps for ensuring compliance.  It will cover topics such as obtaining necessary permits, implementing safety management systems, and adhering to operational guidelines.  We will provide checklists and resources to aid in compliance.</p><h2>Impact on Businesses</h2><p>The new regulations present both challenges and opportunities for businesses.  This section will analyze the potential impact on various sectors using drones, including infrastructure inspection, surveying, and agriculture.  We will discuss strategies for adapting to the new regulatory landscape.</p><h2>Staying Updated with DGCA Regulations</h2><p>The DGCA regularly updates its regulations. This section will provide resources and strategies for staying informed about changes and ensuring continued compliance. We will discuss subscription services and monitoring best practices.</p>"
                },
                {
                    "date": "2025-08-20",
                    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                    "author": "",
                    "readTime": "7 min read",
                    "id": 2.0,
                    "title": "Advanced Drone Surveying: Precision vs Traditional Methods",
                    "excerpt": "Comparing drone surveying accuracy with conventional land surveying techniques and cost implications.",
                    "category": "Technology",
                    "content": "<h1>Drone Surveying: A Revolution in Accuracy and Efficiency</h1><p>Traditional land surveying methods, while reliable, are often time-consuming and labor-intensive.  Drone surveying offers a compelling alternative, leveraging advanced technology to deliver precise data with increased efficiency. This comparison analyzes the key differences and explores the cost-benefit implications.</p><h2>Accuracy and Precision: Drone vs. Traditional</h2><p>This section will delve into a detailed comparison of accuracy levels achievable through both methods.  We will discuss factors influencing accuracy, such as sensor technology, processing techniques, and environmental conditions.  Real-world examples will illustrate the precision advantages of drone surveying.</p><h2>Cost-Benefit Analysis: Investing in Drone Technology</h2><p>A comprehensive cost-benefit analysis will be presented, comparing the initial investment, operational costs, and overall project expenses of both methods.  We will consider factors like labor costs, equipment expenses, data processing time, and potential project delays.</p><h2>Applications and Use Cases</h2><p>This section will explore the various applications of drone surveying across different industries, including construction, mining, agriculture, and environmental monitoring.  We will highlight specific use cases where drone surveying provides a significant advantage.</p><h2>Future Trends in Drone Surveying</h2><p>This section will discuss emerging technologies and trends shaping the future of drone surveying, such as advancements in sensor technology, AI-powered data processing, and integration with other surveying tools. We will also explore the potential impact of these advancements on accuracy, efficiency, and cost.</p>"
                },
                {
                    "date": "2025-08-15",
                    "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                    "author": "",
                    "readTime": "6 min read",
                    "id": 3.0,
                    "title": "ROI Analysis: Why Businesses Choose Drone Solutions",
                    "excerpt": "Data-driven analysis of return on investment from drone technology adoption across industries.",
                    "category": "Business",
                    "content": "<h1>Unlocking Business Value: The ROI of Drone Technology</h1><p>Drone technology is rapidly transforming various industries, offering businesses significant opportunities to improve efficiency, reduce costs, and gain a competitive edge. This analysis explores the return on investment (ROI) of adopting drone solutions across different sectors.</p><h2>Cost Savings and Efficiency Gains</h2><p>This section will quantify the cost savings achievable through drone technology adoption.  We will analyze specific examples across various industries, highlighting reductions in labor costs, material usage, and project timelines.  We will also discuss how drones increase operational efficiency.</p><h2>Improved Data Collection and Analysis</h2><p>Drones provide access to high-quality data, enabling businesses to make more informed decisions.  This section will discuss how improved data collection leads to better insights, optimized resource allocation, and reduced risks.  We will showcase case studies illustrating the value of drone-based data analysis.</p><h2>Enhanced Safety and Risk Mitigation</h2><p>Drones can perform dangerous or difficult tasks safely and efficiently, reducing risks to human personnel.  This section will explore how drone technology enhances safety in various applications, such as infrastructure inspection and emergency response.  We will discuss the associated cost savings from reduced accidents and injuries.</p><h2>Real-World Case Studies: Demonstrating ROI</h2><p>This section will present real-world case studies showcasing the successful implementation of drone technology across different industries.  We will analyze the ROI achieved by businesses in these case studies, providing concrete examples of the financial benefits.</p><h2>Making the Business Case for Drone Adoption</h2><p>This section will provide practical guidance on building a compelling business case for drone technology adoption. We will discuss key considerations, such as initial investment costs, ongoing operational expenses, and projected returns. We will offer a framework for evaluating the potential ROI of drone solutions within your specific business context.</p>"
                }
            ]
        },
        "clients": {
            "headline": {
                "title": "Trusted by Leading Organizations",
                "description": "We've worked with diverse clients across industries to deliver exceptional aerial solutions in nagpur, MH, IN and beyond."
            },
            "clients": [
                {
                    "name": "Infrastructure Solutions Pvt Ltd",
                    "image": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                },
                {
                    "name": "AgriTech Innovations",
                    "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                },
                {
                    "name": "Property Developers Ltd",
                    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                },
                {
                    "name": "Environmental Consultancy",
                    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                }
            ],
            "stats": [
                {
                    "value": "250+",
                    "label": "Projects Completed"
                },
                {
                    "value": "50+",
                    "label": "Happy Clients"
                },
                {
                    "value": "3+",
                    "label": "Years Experience"
                },
                {
                    "value": "99%",
                    "label": "Success Rate"
                }
            ]
        },
        "testimonials": {
            "headline": {
                "title": "What Our Clients Say",
                "description": "Real experiences from clients who have transformed their operations with our drone solutions."
            },
            "testimonials": [
                {
                    "name": "Rajesh Kumar",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    "role": "Project Manager, Construction Solutions Pvt Ltd",
                    "quote": "br's drone services significantly improved our site surveying process. We saw a 30% reduction in project completion time and a 15% decrease in material costs due to the increased accuracy of their data.  Their efficient data delivery was invaluable."
                },
                {
                    "name": "Priya Sharma",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    "role": "Operations Director, AgriTech Solutions",
                    "quote": "Using br's agricultural drone services, we've optimized our crop monitoring and spraying.  We've seen a 10% increase in yield and a 5% reduction in pesticide usage thanks to their precise data analysis and targeted application recommendations."
                },
                {
                    "name": "Amit Patel",
                    "rating": 5.0,
                    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    "role": "Marketing Head, Property Developers",
                    "quote": "br's stunning aerial photography significantly enhanced our marketing campaigns.  We saw a 20% increase in leads and a 15% boost in property sales after incorporating their high-resolution images and videos into our brochures and online listings."
                },
                {
                    "name": "Dr. Sunita Verma",
                    "rating": 4.0,
                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
                    "role": "Senior Consultant, Environmental Services",
                    "quote": "br's environmental monitoring services provided highly accurate data, crucial for our compliance reports.  Their adherence to regulatory standards and the precision of their data analysis were exceptional."
                }
            ],
            "stats": [
                {
                    "value": "4.9/5",
                    "label": "Average Rating"
                },
                {
                    "value": "50+",
                    "label": "Happy Clients"
                },
                {
                    "value": "500+",
                    "label": "Projects Delivered"
                },
                {
                    "value": "99%",
                    "label": "Success Rate"
                }
            ]
        },
        "contact": {
            "title": "Ready to Elevate Your Project?",
            "description": "Get in touch with our drone experts at br for a customized solution that transforms your operations.",
            "ctaButton": "Get Free Consultation",
            "backgroundImage": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
            "benefits": [
                "Free project consultation and assessment",
                "DGCA compliant operations with certified pilots",
                "24/7 technical support and emergency response",
                "Competitive pricing with transparent cost structure"
            ],
            "contactInfo": {
                "phone": "+91 9876543210",
                "email": "example@gmail.com",
                "address": "3061/1\nrameshwari road",
                "website": "www.company.com",
                "companyName": "br",
                "supportPhone": "",
                "supportEmail": "",
                "whatsappLink": "",
                "gstin": "",
                "directorName": "",
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
                "name": "",
                "email": "",
                "phone": ""
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
                    "question": "Are your drone operations DGCA compliant?",
                    "answer": "Yes, all our drone operations are fully DGCA compliant. We hold the necessary permits and licenses, and our pilots are certified and trained to adhere to all relevant regulations. We maintain meticulous flight logs and adhere to stringent safety protocols."
                },
                {
                    "question": "What types of projects can your drones handle?",
                    "answer": "Our drones are versatile and can handle a wide range of projects, including but not limited to: high-resolution aerial photography and videography, precise surveying and mapping, infrastructure inspection, and thermal imaging.  We can tailor our services to meet your specific needs."
                },
                {
                    "question": "How do you ensure data accuracy and reliability?",
                    "answer": "We utilize advanced technologies such as RTK GPS and post-processing techniques to ensure sub-centimeter accuracy in our data.  Our experienced data processing team rigorously checks and validates all data to guarantee reliability and meet the highest industry standards."
                },
                {
                    "question": "What is your process for obtaining necessary permissions and approvals for drone flights?",
                    "answer": "We handle all necessary permissions and approvals for drone flights. This includes liaising with relevant authorities, obtaining flight permits, and ensuring compliance with all regulations. This allows our clients to focus on their projects without worrying about the regulatory aspects."
                },
                {
                    "question": "What are the cost benefits of using br's drone services compared to traditional methods?",
                    "answer": "Our drone services often offer significant cost savings compared to traditional methods by reducing labor costs, minimizing site disruption, and accelerating project timelines. We provide detailed cost breakdowns and proposals tailored to your specific project requirements."
                },
                {
                    "question": "What is your insurance coverage and liability protection?",
                    "answer": "We maintain comprehensive liability insurance to protect our clients and ourselves against any potential risks associated with our drone operations. We are committed to ensuring the safety and security of all our projects."
                }
            ]
        }
    }
})

  const [finaleDataReview, setFinaleDataReview] = useState<any | []>({})

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
      toast.success("Your site is successfully published and now it is under review");
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
      toast.success("Your site is successfully published and now it is under review");
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
  }, [finaleDataReview])
  
  return (
    <TemplateContext.Provider value={{ 
      draftDetails, 
      setDraftDetails, 
      AIGenData, 
      setAIGenData, 
      isPublishedTriggered, 
      setIsPublishedTriggered, 
      finalTemplate, 
      setFinalTemplate, 
      publishTemplate,
      setFinaleDataReview,
      finaleDataReview,
      editPublishTemplate 
    }}>
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

export const CombinedProviders: React.FC<CombinedProvidersProps> = ({ children }) => {
  return (
    <UserAuthProvider>
      <TemplateProvider>
        {children}
      </TemplateProvider>
    </UserAuthProvider>
  );
};