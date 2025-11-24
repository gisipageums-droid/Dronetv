import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Phone, Mail, CheckCircle, Send, Building2, Zap as Drone, Brain, Map } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  company: string;
  description: string;
  detailedDescription: string;
  images: string[];
  category: string;
  price: string;
  priceRange?: string;
  rating: number;
  reviewCount: number;
  location: string;
  features: string[];
  specifications: Record<string, string | undefined>;
  companyInfo: {
    name: string;
    established: string;
    employees: string;
    projects: string;
    certifications: string[];
    phone: string;
    email: string;
    website: string;
  };
  portfolio: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  benefits?: string[];
  process?: string[];
  timeline?: string;
}

// Mock data for services
const services = [
  {
    id: "1",
    title: "Advanced Drone Surveying",
    company: "IPage UM Services",
    description:
      "Efficient and accurate drone-based surveying solutions tailored for infrastructure, urban planning, and irrigation projects.",
    detailedDescription: `Our Advanced Drone Surveying service delivers high-resolution data for topographic mapping, corridor analysis, and volumetric studies. We use RTK-enabled drones and GCP-based workflows to ensure sub-centimeter accuracy. Ideal for construction, irrigation, smart city, and mining applications.

By replacing traditional ground surveying methods, our drone-based approach drastically reduces time, improves safety, and offers faster project execution timelines.`,
    images: [
      "/images/service1.1.webp",
      "/images/service2.jpg",
      "/images/service1.2.png"
    ],
    category: "Drone Technology",
    price: "₹22,000/KM",
    priceRange: "₹22,000-₹25,000/KM",
    rating: 4.9,
    reviewCount: 118,
    location: "Hyderabad, India",
    features: [
      "Orthomosaic Generation",
      "Topographic Mapping",
      "Infrastructure Scanning",
      "High Accuracy GCP Integration",
      "Volumetric Calculation",
      "Red Zone Compliant"
    ],
    specifications: {
      "Coverage Area": "Up to 300 acres/day",
      "Accuracy": "±3cm horizontal/vertical",
      "Output Formats": "GeoTIFF, KMZ, DXF, PDF",
      "Equipment Used": "RTK Drones with 20MP cameras",
      "Delivery Time": "24-48 hours",
      "Platform Compatibility": "AutoCAD, QGIS, ArcGIS"
    },
    companyInfo: {
      name: "IPage UM Services",
      established: "2008",
      employees: "100+",
      projects: "1200+",
      certifications: ["DGCA Approved", "ISO 9001", "Govt Empanelled"],
      phone: "+91 7799100040",
      email: "bd@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Tanuku Canal Project",
        description: "Red zone-compliant canal chainage mapping with overlays for the Tanuku region's irrigation canals.",
        image: "/images/service2.jpg",

      },
      {
        title: "Guduru Land Survey",
        description: "City-wide topographic survey with high-resolution orthophotos, focusing on land management in Guduru.",
        image: "/images/service2.1.jpg",

      },
      {
        title: "Gujarat Monument Survey",
        description: "Annual volumetric study of water retention areas and monument structures in Gujarat.",
        image: "/images/service2.2.jpg"
      }

    ]
  },
  {
    id: "2",
    title: "AI-Driven Infrastructure Inspection",
    company: "IPage UM Services",
    description:
      "Automated inspections using drone-captured imagery with AI for crack detection, corrosion analysis, and structural health monitoring.",
    detailedDescription: `Our AI-Driven Infrastructure Inspection service leverages machine learning and computer vision to detect anomalies like cracks, corrosion, or structural defects in buildings, bridges, towers, and solar farms. The system processes drone-captured images and videos to generate reports with geotagged insights.

This dramatically reduces manual inspection time while enhancing accuracy, especially for hard-to-reach or hazardous sites.`,
    images: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6809664/pexels-photo-6809664.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1684166/pexels-photo-1684166.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "AI & ML Solutions",
    price: "₹48,000/KM",
    priceRange: "₹48,000 - ₹50,000/KM",
    rating: 4.8,
    reviewCount: 106,
    location: "Singapore & India",
    features: [
      "AI Anomaly Detection",
      "Thermal Analysis",
      "Detailed Reports",
      "Cloud Integration",
      "Time Series Monitoring",
      "Multi-Asset Dashboard"
    ],
    specifications: {
      "Coverage": "50 structures/month",
      "Detection Accuracy": "95%+",
      "Thermal Sensitivity": "±2°C",
      "Report Formats": "PDF, JSON, Web Portal",
      "AI Models": "Custom Trained (YOLOv8)",
      "Integration": "AWS Cloud + Mobile Dashboard"
    },
    companyInfo: {
      name: "IPage UM Services",
      established: "2008",
      employees: "100+",
      projects: "1200+",
      certifications: ["DGCA Approved", "ISO 27001", "AI Registered IP"],
      phone: "+91 7799100040",
      email: "bd@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Bridge Crack Inspection",
        description: "AI model detects micro-cracks in remote highway bridges",
        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Solar Panel Heat Mapping",
        description: "Thermal scan detects faulty panels in 20MW solar plant",
        image: "https://images.pexels.com/photos/6809664/pexels-photo-6809664.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Tower Corrosion Analytics",
        description: "Visual AI detects rust and bolt weakness in telecom towers",
        image: "https://images.pexels.com/photos/1684166/pexels-photo-1684166.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "3",
    title: "GIS-based Precision Agriculture",
    company: "IPage UM Services",
    description:
      "Empowering agriculture with drone-enabled crop health monitoring, NDVI analytics, and precision spraying to boost yield and reduce resource waste.",
    detailedDescription: `Our GIS-based Precision Agriculture service uses drone technology combined with multispectral imaging and geospatial analytics to assess crop health, manage field zones, and guide precision spraying.

By leveraging NDVI, NDRE, and thermal imaging data, we help farmers identify stress zones, monitor growth stages, and apply inputs accurately. This data-driven approach reduces water, fertilizer, and pesticide usage, improving ROI and environmental sustainability.

Ideal for large farms, plantations, and contract-based agri-services. We provide end-to-end solutions—from field scanning to report generation and variable rate spraying.`,
    images: [
      "/images/service3.1.jpg",
      "/images/service3.2.jpg",
      "/images/service3.3.jpg"

    ],
    category: "GIS & Agriculture",
    price: "₹38,000/KM",
    priceRange: "₹38,000-₹40,000/KM/KM",
    rating: 4.7,
    reviewCount: 102,
    location: "Andhra Pradesh, India",
    features: [
      "NDVI & NDRE Index",
      "Field Zoning",
      "Real-time Crop Stress Detection",
      "Agriculture Analytics",
      "Variable Rate Spraying",
      "Post-Harvest Assessment"
    ],
    specifications: {
      "Coverage Rate": "100–150 acres/day",
      "Resolution": "Up to 5cm/pixel",
      "Sensors": "Multispectral, RGB, Thermal",
      "Output Formats": "NDVI Maps, Shapefiles, PDF Reports",
      "Platform Integration": "QGIS, Google Earth, Agri ERP",
      "Turnaround Time": "48 hours per mission"
    },
    companyInfo: {
      name: "IPage UM Services",
      established: "2008",
      employees: "100+",
      projects: "1200+",
      certifications: ["DGCA Approved", "ISO 9001", "AgriTech Certified"],
      phone: "+91 7799100040",
      email: "bd@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Sugarcane Field Monitoring",
        description: "NDVI scan across 400 acres for early detection of crop stress",
        image: "/images/service3.4.jpg"
      },
      {
        title: "Paddy Zoning in Krishna District",
        description: "GIS-based field segmentation and spraying map generation",
        image: "/images/service3.jpg"
      },
      {
        title: "Mango Orchard Health Mapping",
        description: "Multispectral imagery used for canopy coverage and health scoring",
        image: "/images/service3.1.jpg"
      }
    ]
  },
  {
    id: "4",
    title: "Drone Pilot Training Program",
    company: "Precision Aerial",
    description: "Comprehensive drone pilot training and certification programs for commercial and recreational operators.",
    detailedDescription: `Our Drone Pilot Training Program is designed for aspiring UAV pilots, agricultural operators, and industry professionals seeking certification. The curriculum covers theory, hands-on flying, simulator sessions, safety protocols, and regulatory compliance. We offer DGCA syllabus-based instruction, scenario-driven training, and real-world flight assessments to ensure you are job-ready. Graduates receive certification and lifetime career guidance.

Whether you're entering commercial drone services, mapping, cinematography, or inspections, this course gives you the skills and confidence to operate drones safely and professionally.`,
    images: [
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3860252/pexels-photo-3860252.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "Training",
    price: "₹45,000",
    priceRange: "₹45,000–₹75,000",
    rating: 4.6,
    reviewCount: 88,
    location: "Hyderabad, TS",
    features: ["DGCA Syllabus", "Simulator Practice", "Field Flying", "Certification Included"],
    specifications: {
      "Duration": "5–10 days",
      "Eligibility": "18+ years, 10th Pass",
      "Batch Size": "6–12 per group",
      "Practical Hours": "10+ hours flight time",
      "Certification": "DGCA/Industry Recognized",
      "Equipment": "Latest UAVs, Simulators"
    },
    companyInfo: {
      name: "Precision Aerial",
      established: "2018",
      employees: "25+",
      projects: "400+ Graduates",
      certifications: ["DGCA Recognized", "ISO 21001"],
      phone: "+91 9876543210",
      email: "info@precisionaerial.in",
      website: "https://precisionaerial.in"
    },
    portfolio: [
      {
        title: "Corporate Training – Pharma City",
        description: "Specialized RPTO drone training for pharma industrial security staff",
        image: "https://images.pexels.com/photos/3860252/pexels-photo-3860252.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "University Workshop",
        description: "Drone awareness and flight workshop at NIT Warangal",
        image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Aerial Cinematography Course",
        description: "Special short-term training for filmmakers on drone camera work",
        image: "https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "5",
    title: "Industrial Inspection Services",
    company: "CloudNav Industries",
    description: "Professional drone inspection services for industrial facilities, power lines, and infrastructure assets.",
    detailedDescription: `CloudNav Industries delivers advanced aerial inspection solutions for industrial sites, electrical utilities, solar plants, and refineries. Our drones are equipped with high-resolution RGB, thermal, and LiDAR sensors for fast, accurate, and non-intrusive inspections. We generate comprehensive visual and analytic reports, helping you detect faults, corrosion, and thermal anomalies before they become critical.

Inspections are scheduled around your operations, with minimal disruption and maximum safety, even in hazardous or inaccessible areas.`,
    images: [
      "https://images.pexels.com/photos/724712/pexels-photo-724712.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2577004/pexels-photo-2577004.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "Drone Technology",
    price: "₹1,50,000/KM",
    priceRange: "₹1,50,000–₹2,50,000/KM",
    rating: 4.8,
    reviewCount: 76,
    location: "Hyderabad, TS",
    features: ["Thermal Imaging", "Detailed Reports", "Safety Compliance", "Quick Turnaround"],
    specifications: {
      "Sensors": "4K RGB, Thermal, LiDAR",
      "Coverage": "Up to 10 km/day",
      "Output": "PDF, 3D Models, GIS Layers",
      "Report Time": "24–72 hours",
      "Compliance": "DGCA, ISO 45001",
      "Personnel": "Certified UAV Pilots"
    },
    companyInfo: {
      name: "CloudNav Industries",
      established: "2015",
      employees: "60+",
      projects: "300+ Sites",
      certifications: ["ISO 45001", "DGCA Empanelled"],
      phone: "+91 9123456789",
      email: "contact@cloudnav.in",
      website: "https://cloudnav.in"
    },
    portfolio: [
      {
        title: "Power Line Corridor Inspection",
        description: "Aerial thermography and visual inspection of 100km power corridor",
        image: "https://images.pexels.com/photos/724712/pexels-photo-724712.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Solar Plant Assessment",
        description: "Detection of panel faults in 50MW solar plant using drones",
        image: "https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Refinery Safety Audit",
        description: "Annual compliance survey for refinery safety management",
        image: "https://images.pexels.com/photos/2577004/pexels-photo-2577004.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "6",
    title: "Machine Learning Consulting",
    company: "FutureFlight Corp",
    description: "Expert consulting services for implementing machine learning solutions in drone operations and data analysis.",
    detailedDescription: `FutureFlight Corp empowers organizations to leverage AI/ML in drone data workflows. Our experts design, deploy, and train custom models for object detection, anomaly analysis, crop health, asset monitoring, and more. We work with both on-premise and cloud pipelines, ensuring your business can extract actionable insights from vast geospatial datasets.

Clients benefit from tailored strategies, fast PoCs, integration with leading platforms, and ongoing AI support—maximizing return on drone investments.`,
    images: [
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "Consulting",
    price: "₹12,000/KM",
    priceRange: "₹12,000–₹25,000/KM",
    rating: 4.9,
    reviewCount: 44,
    location: "Boston, MA",
    features: ["Custom Solutions", "Expert Team", "Implementation Support", "Training Included"],
    specifications: {
      "Use Cases": "Agriculture, Infra, Security, Environment",
      "Model Support": "YOLO, TensorFlow, PyTorch",
      "Delivery": "PoC in 7–15 days",
      "Integration": "AWS, Azure, On-Prem",
      "Languages": "Python, C++, R",
      "Support": "Ongoing ML Ops"
    },
    companyInfo: {
      name: "FutureFlight Corp",
      established: "2016",
      employees: "35+",
      projects: "150+",
      certifications: ["AWS Partner", "AI Solutions Specialist"],
      phone: "+1 617-555-1234",
      email: "ml@futureflight.com",
      website: "https://futureflight.com"
    },
    portfolio: [
      {
        title: "Crop Disease Detection",
        description: "Built & deployed ML models for real-time crop disease alerts",
        image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Asset Management Automation",
        description: "Automated defect detection in railway infrastructure imagery",
        image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Urban Land Use Classification",
        description: "Developed AI models for mapping urban land types",
        image: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "7",
    title: "Environmental Monitoring",
    company: "EcoSky Solutions",
    description: "Comprehensive environmental monitoring services using drone technology for wildlife, forestry, and conservation projects.",
    detailedDescription: `EcoSky Solutions leverages UAVs and advanced sensors for wildlife census, forest health checks, pollution tracking, and water body analysis. We support environmental NGOs, forestry departments, and research institutes with high-resolution maps, change detection, and time-series analytics. Reports are designed for conservation action and regulatory compliance.

Projects can include monthly monitoring, endangered species protection, and illegal encroachment detection across remote areas.`,
    images: [
      "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "GIS Services",
    price: "₹28,000/KM",
    priceRange: "₹28,000–₹45,000/KM",
    rating: 4.5,
    reviewCount: 59,
    location: "Hyderabad, TS",
    features: ["Wildlife Tracking", "Forest Health", "Water Quality", "Conservation Reports"],
    specifications: {
      "Coverage": "Up to 50 sq. km/day",
      "Sensors": "Multispectral, LiDAR, Thermal",
      "Reporting": "Monthly/Quarterly",
      "Deliverables": "GIS Maps, Reports, Data Layers",
      "Compliance": "MoEFCC, ISO 14001",
      "Team": "Ecologists, UAV Pilots"
    },
    companyInfo: {
      name: "EcoSky Solutions",
      established: "2017",
      employees: "22+",
      projects: "90+",
      certifications: ["ISO 14001", "MoEFCC Registered"],
      phone: "+91 9000001234",
      email: "info@ecoskysol.in",
      website: "https://ecoskysol.in"
    },
    portfolio: [
      {
        title: "Forest Degradation Study",
        description: "Annual mapping of forest loss in Telangana using drone LiDAR",
        image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Wildlife Corridor Mapping",
        description: "Tracking of elephant movement corridors in Karnataka forests",
        image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Water Quality Monitoring",
        description: "Drone-based surface water sampling and analysis for lakes",
        image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "8",
    title: "Autonomous Flight Systems",
    company: "AutoFly Technologies",
    description: "Development and implementation of autonomous flight systems for commercial drone operations.",
    detailedDescription: `AutoFly Technologies offers end-to-end autonomous flight solutions for industries seeking to automate survey, inspection, and delivery operations. Our systems leverage GNSS, RTK, computer vision, and advanced path planning for reliable, repeatable missions. Features include obstacle avoidance, adaptive mission control, emergency failsafe, and integration with cloud dashboards.

Whether for mapping, security patrol, or scheduled delivery, our engineers design, test, and implement tailored autopilot workflows—reducing costs and increasing operational safety for enterprise clients.`,
    images: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "AI Solutions",
    price: "₹2,50,000/Project",
    priceRange: "₹2,50,000–₹8,00,000/project",
    rating: 4.7,
    reviewCount: 61,
    location: "Hyderabad, TS",
    features: ["Autonomous Navigation", "Obstacle Avoidance", "Mission Planning", "Safety Systems"],
    specifications: {
      "Supported UAVs": "Quad, Hexa, VTOL",
      "Flight Modes": "Auto, Semi-Auto, Manual Override",
      "Failsafe": "RTB, Auto-Land, Emergency Stop",
      "Sensors": "Lidar, RGB, GPS, RTK",
      "Mission Types": "Survey, Patrol, Delivery",
      "Integration": "REST API, Cloud Dashboard"
    },
    companyInfo: {
      name: "AutoFly Technologies",
      established: "2016",
      employees: "45+",
      projects: "90+",
      certifications: ["DGCA Approved", "ISO 9001"],
      phone: "+91 9988776655",
      email: "contact@autofly.in",
      website: "https://autofly.in"
    },
    portfolio: [
      {
        title: "Airport Perimeter Patrol",
        description: "Automated security drone system for a major Indian airport",
        image: "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Smart Agriculture Spraying",
        description: "Autonomous drone swarm for variable-rate pesticide application",
        image: "https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Logistics Delivery Trial",
        description: "Unmanned package delivery demo in Hyderabad IT corridor",
        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "9",
    title: "Drone Maintenance Services",
    company: "IPAGEUMS",
    description: "Professional maintenance and repair services for all types of commercial and industrial drones.",
    detailedDescription: `IPAGEUMS provides comprehensive maintenance and repair solutions to ensure maximum uptime for your UAV fleet. Our certified engineers handle everything from preventive servicing and emergency repairs to component upgrades and regulatory checks. We maintain parts inventory for leading brands and offer warranty management, AMC plans, and technical training for your in-house teams.

Downtime is minimized with our rapid service TAT and remote support for field troubleshooting—keeping your drone operations safe, legal, and efficient.`,
    images: [
      "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1040485/pexels-photo-1040485.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "Maintenance",
    price: "₹18,000/Service",
    priceRange: "₹18,000–₹75,000/service",
    rating: 4.4,
    reviewCount: 51,
    location: "Hyderabad, TS",
    features: ["Preventive Maintenance", "Emergency Repairs", "Parts Replacement", "Performance Testing"],
    specifications: {
      "Supported Models": "DJI, Pixhawk, Custom",
      "Service Types": "Annual/Spot/AMC",
      "TAT": "24–72 hours",
      "Spare Inventory": "Motors, Props, Batteries, Sensors",
      "Compliance": "DGCA/CAA",
      "Warranty Support": "OEM & Third-Party"
    },
    companyInfo: {
      name: "IPAGEUMS",
      established: "2010",
      employees: "30+",
      projects: "300+",
      certifications: ["DGCA Approved", "ISO 9001"],
      phone: "+91 7799100040",
      email: "support@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Mining Drone AMC",
        description: "Annual maintenance contract for 25 mapping UAVs in mining sector",
        image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Emergency Repair – Power Grid",
        description: "Rapid motor and controller replacement after field crash",
        image: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Flight Testing Lab",
        description: "Comprehensive flight performance and calibration testing",
        image: "https://images.pexels.com/photos/1040485/pexels-photo-1040485.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "10",
    title: "Urban Planning GIS",
    company: "IPAGEUMS",
    description: "Specialized GIS services for urban planning, smart city development, and municipal infrastructure management.",
    detailedDescription: `IPAGEUMS delivers GIS solutions tailored for urban planners, city authorities, and infrastructure consultants. Our services include base mapping, land use classification, utility network mapping, traffic flow analysis, and 3D city modeling. We integrate drone imagery, government datasets, and IoT sensor feeds into actionable web-GIS dashboards.

From feasibility studies to implementation, our data-driven approach supports smart city planning, sustainable infrastructure, and transparent governance.`,
    images: [
      "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/169677/pexels-photo-169677.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "GIS Services",
    price: "₹60,000/KM",
    priceRange: "₹60,000–₹1,50,000/KM",
    rating: 4.6,
    reviewCount: 48,
    location: "Hyderabad, TS",
    features: ["Urban Analysis", "Traffic Planning", "Infrastructure Mapping", "Population Studies"],
    specifications: {
      "Output": "Base Maps, Zoning, 3D Models",
      "Data Integration": "Drone, Survey, IoT, Satellite",
      "Platform": "Web-GIS Dashboard",
      "Reporting": "PDF, Shapefile, Web Portal",
      "Turnaround": "7–30 days/project",
      "Team": "Urban Planners, GIS Analysts"
    },
    companyInfo: {
      name: "IPAGEUMS",
      established: "2010",
      employees: "30+",
      projects: "200+ Urban Projects",
      certifications: ["Smart City Partner", "ISO 9001"],
      phone: "+91 7799100040",
      email: "gis@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Vijayawada Smart City",
        description: "Comprehensive GIS mapping and dashboard for urban mobility",
        image: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Hyderabad Metro Zoning",
        description: "Automated zoning and infrastructure asset mapping",
        image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Water Network Audit",
        description: "Pipeline mapping and leak detection for urban municipality",
        image: "https://images.pexels.com/photos/169677/pexels-photo-169677.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "11",
    title: "Search and Rescue Operations",
    company: "IPAGEUMS",
    description: "Emergency search and rescue operations using advanced drone technology and thermal imaging systems.",
    detailedDescription: `IPAGEUMS deploys rapid-response UAVs for missing person searches, disaster relief, and emergency support. Our drones are equipped with high-res cameras, thermal sensors, and real-time video transmission to provide live situational awareness to rescue teams. Missions are coordinated with local authorities and NDRF, operating day or night, in rugged or inaccessible terrains.

Our proven track record in time-critical SAR missions has helped save lives and accelerate recovery across challenging environments.`,
    images: [
      "https://images.pexels.com/photos/724712/pexels-photo-724712.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/267076/pexels-photo-267076.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/712394/pexels-photo-712394.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "Drone Technology",
    price: "₹26,000/KM",
    priceRange: "₹26,000–₹55,000/KM",
    rating: 4.9,
    reviewCount: 53,
    location: "Hyderabad, TS",
    features: ["24/7 Availability", "Thermal Imaging", "GPS Tracking", "Emergency Response"],
    specifications: {
      "Response Time": "Within 2 hours",
      "Coverage": "Up to 20 sq.km/mission",
      "Sensors": "Thermal, RGB, GPS",
      "Integration": "Police/NDRF Dispatch",
      "Night Ops": "Yes",
      "Reporting": "Live Feed, Incident Reports"
    },
    companyInfo: {
      name: "IPAGEUMS",
      established: "2010",
      employees: "30+",
      projects: "50+ SAR Ops",
      certifications: ["Govt Registered", "Disaster Relief Partner"],
      phone: "+91 7799100040",
      email: "rescue@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Flood Rescue, AP",
        description: "Thermal drone search for stranded villagers during Godavari floods",
        image: "https://images.pexels.com/photos/267076/pexels-photo-267076.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Night SAR in Forest",
        description: "Successful missing person search using night-vision drone",
        image: "https://images.pexels.com/photos/724712/pexels-photo-724712.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Disaster Site Mapping",
        description: "Rapid mapping for post-cyclone assessment and rescue planning",
        image: "https://images.pexels.com/photos/712394/pexels-photo-712394.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },
  {
    id: "12",
    title: "AI Data Analytics Platform",
    company: "IPAGEUMS",
    description: "Cloud-based AI platform for analyzing drone-collected data with advanced machine learning algorithms.",
    detailedDescription: `The IPAGEUMS AI Data Analytics Platform transforms drone images and videos into actionable business intelligence. Designed for asset managers, surveyors, and agri-tech firms, our platform offers secure cloud storage, automated model runs (object detection, classification, change detection), and real-time dashboards.

Custom APIs and reporting tools enable seamless integration with existing ERPs, while our support team guides model deployment and data interpretation for maximum ROI.`,
    images: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    category: "AI Solutions",
    price: "Custom Pricing",
    priceRange: "Contact for Quote",
    rating: 4.8,
    reviewCount: 49,
    location: "Hyderabad, TS",
    features: ["Cloud Processing", "Custom Dashboards", "API Access", "Real-time Analytics"],
    specifications: {
      "Supported Data": "RGB, Thermal, Multispectral, LiDAR",
      "AI Models": "YOLO, UNet, Custom",
      "Output": "Dashboards, Reports, API, Alerts",
      "Security": "SSL/TLS, GDPR Ready",
      "Integration": "ERP, GIS, IoT",
      "Support": "24/7 Technical"
    },
    companyInfo: {
      name: "IPAGEUMS",
      established: "2010",
      employees: "30+",
      projects: "120+ Analytics Clients",
      certifications: ["AI Registered IP", "ISO 27001"],
      phone: "+91 7799100040",
      email: "ai@ipageums.com",
      website: "https://ipageums.com"
    },
    portfolio: [
      {
        title: "Solar Plant Asset Analytics",
        description: "Automated AI analytics for 30MW solar asset maintenance",
        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Crop Yield Estimation",
        description: "NDVI/ML-based platform for seasonal yield prediction",
        image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        title: "Infrastructure Change Detection",
        description: "AI-powered monitoring for urban expansion and asset changes",
        image: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]
  },

];

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('overview'); // Tab state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Define isSubmitted state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch service details from API
  useEffect(() => {
    const fetchServiceDetails = () => {
      setLoading(true);
      setError(null);

      // Use the ID directly as publishedId (ServicesPage now passes publishedId directly)
      const publishedId = id;
      const API_URL = `https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/services/details/${publishedId}`;

      axios
        .get(API_URL)
        .then((response) => {
          const responseData = response.data;

          if (responseData.status && responseData.data) {
            const apiData = responseData.data;

            if (apiData.services && apiData.services.services && apiData.services.services.length > 0) {
              // Use the first service from the API response
              const serviceData = apiData.services.services[0];
              const mappedService: Service = {
                id: publishedId || "unknown",
                title: serviceData.title || "Service",
                company: apiData.userId ? apiData.userId.split('@')[0] : "Company",
                description: serviceData.description || "",
                detailedDescription: serviceData.detailedDescription || serviceData.description || "",
                images: [serviceData.image || "/images/service1.jpg"],
                category: serviceData.category || "General",
                price: serviceData.pricing || "Contact for pricing",
                priceRange: serviceData.pricing || "Contact for pricing",
                rating: 4.5, // Default rating
                reviewCount: 150, // Default review count
                location: "India", // Default location
                features: serviceData.features || [],
                specifications: {
                  "Category": serviceData.category || "General",
                  "Timeline": serviceData.timeline || "N/A",
                  "Pricing": serviceData.pricing || "Contact for pricing",
                  "Benefits": serviceData.benefits ? serviceData.benefits.join(", ") : "N/A",
                  "Process": serviceData.process ? serviceData.process.join(", ") : "N/A"
                },
                companyInfo: {
                  name: apiData.userId ? apiData.userId.split('@')[0] : "Company",
                  established: "2010",
                  employees: "50+",
                  projects: "500+",
                  certifications: ["DGCA Approved", "ISO 9001"],
                  phone: "+91 9876543210",
                  email: apiData.userId || "contact@company.com",
                  website: "https://company.com"
                },
                portfolio: [
                  {
                    title: "Sample Project 1",
                    description: "Description of sample project 1",
                    image: serviceData.image || "/images/service1.jpg"
                  },
                  {
                    title: "Sample Project 2",
                    description: "Description of sample project 2",
                    image: serviceData.image || "/images/service1.jpg"
                  },
                  {
                    title: "Sample Project 3",
                    description: "Description of sample project 3",
                    image: serviceData.image || "/images/service1.jpg"
                  }
                ],
                benefits: serviceData.benefits || [],
                process: serviceData.process || [],
                timeline: serviceData.timeline || "N/A"
              };
              setService(mappedService);
            } else {
              setError("No service data found");
            }
          } else {
            setError("Invalid response format");
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          setError("Failed to fetch service details");
          // Fallback to static service if available
          const fallbackService = services.find((s) => s.id === id);
          if (fallbackService) {
            setService(fallbackService);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-16 min-h-screen bg-yellow-400">
        <div className="text-center">
          <div className="mx-auto mb-4 w-32 h-32 rounded-full border-b-2 border-black animate-spin"></div>
          <p className="text-xl font-semibold text-black">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="flex justify-center items-center pt-16 min-h-screen bg-yellow-400">
        <div className="text-center">
          <p className="mb-4 text-xl font-semibold text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-yellow-400 bg-black rounded-lg transition-colors hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-24 text-2xl font-semibold text-center text-gray-700">
        Service not found.
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Drone Technology':
        return Drone;
      case 'AI Solutions':
        return Brain;
      case 'GIS Services':
        return Map;
      default:
        return Building2;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const IconComponent = getCategoryIcon(service.category);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      budget: '',
      timeline: '',
      message: ''
    });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-16 min-h-screen bg-yellow-400">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-black/70">
            <a href="/" className="transition-colors hover:text-black">Home</a>
            <span>/</span>
            <a href="/services" className="transition-colors hover:text-black">Services</a>
            <span>/</span>
            <span className="font-medium text-black">{service.category}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-12 mb-16 lg:grid-cols-3">
          {/* Service Details Section */}
          <div className="space-y-8 lg:col-span-3">
            {/* Main Service Info */}
            <div className="p-8 bg-white rounded-3xl border-2 shadow-lg border-black/20">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex gap-3 items-center mb-4">
                    <div className="p-3 bg-yellow-400 rounded-full">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <span className="px-3 py-1 text-sm font-bold text-yellow-400 bg-black rounded-full">
                      {service.category}
                    </span>
                  </div>

                  <h1 className="mb-2 text-3xl font-black text-black md:text-4xl">
                    {service.title}
                  </h1>

                  <div className="flex gap-4 items-center mb-4">
                    <div className="flex gap-1 items-center">
                      {renderStars(service.rating)}
                      <span className="ml-2 font-semibold text-black">{service.rating}</span>
                    </div>
                    <span className="text-black/70">({service.reviewCount} reviews)</span>
                  </div>

                  <div className="flex gap-4 items-center mb-4 text-black/70">
                    <div className="flex gap-1 items-center">
                      <Building2 className="w-4 h-4" />
                      {service.company}
                    </div>
                    <div className="flex gap-1 items-center">
                      <MapPin className="w-4 h-4" />
                      {service.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-1 text-3xl font-black text-black">{service.price}</div>
                </div>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-black/80">
                {service.description}
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 bg-yellow-50 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-black">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Images */}
            <div className="p-4 bg-white rounded-3xl border-2 shadow-lg border-black/20">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {service.images.map((image, index) => (
                  <div key={index} className="overflow-hidden relative rounded-2xl">
                    <img
                      src={image}
                      alt={`${service.title} ${index + 1}`}
                      className="object-cover w-full h-48 transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs Section */}
            <div className="overflow-hidden bg-white rounded-3xl border-2 shadow-lg border-black/20">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {['overview', 'specifications', 'portfolio'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-semibold capitalize transition-all duration-300 ${activeTab === tab
                        ? 'text-black border-b-2 border-black bg-yellow-50'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="max-w-none prose">
                    <h3 className="mb-4 text-2xl font-bold text-black">Service Overview</h3>
                    <div className="space-y-4 leading-relaxed text-gray-700">
                      {service.detailedDescription.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="mb-6 text-2xl font-bold text-black">Service Specifications</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {Object.entries(service.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                          <span className="font-semibold text-black">{key}:</span>
                          <span className="text-gray-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    <h3 className="mb-6 text-2xl font-bold text-black">Recent Projects</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {service.portfolio.map((item, index) => (
                        <div key={index} className="overflow-hidden bg-yellow-50 rounded-2xl">
                          <div className="p-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="object-cover w-full h-32 rounded-xl"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="mb-2 font-bold text-black">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
