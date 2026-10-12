// Shared option lists for the professional form and the professional directory.
// Keep in step with the backend search (services/professional/app/search.py).

export type SectorKey = "drone_aerospace" | "gis" | "ai" | "robotics" | "business_support";

export const SECTOR_LABEL: Record<SectorKey, string> = {
  drone_aerospace: "Drone / Aerospace",
  gis: "GIS & Geospatial",
  ai: "AI",
  robotics: "Robotics",
  business_support: "Business Support Services",
};

export const SECTOR_INFO: { key: SectorKey; name: string; desc: string }[] = [
  { key: "drone_aerospace", name: "Drone / Aerospace", desc: "UAV, aerospace and aviation: manufacturing, services and training" },
  { key: "gis", name: "GIS & Geospatial", desc: "Geographic Information Systems and GNSS, GPS, DGPS" },
  { key: "ai", name: "AI", desc: "Artificial Intelligence solutions and products" },
  { key: "robotics", name: "Robotics", desc: "Robotics, autonomous systems, electronics and automation" },
  { key: "business_support", name: "Business Support Services", desc: "Legal, finance, marketing, logistics and other support services" },
];

export const SPECIALIZATIONS: Record<Exclude<SectorKey, "business_support">, string[]> = {
  "drone_aerospace": [
    "Drone Pilot",
    "DGCA Certified Remote Pilot",
    "Drone Instructor",
    "Flight Instructor",
    "Drone Trainer",
    "Drone Surveyor",
    "Drone Mapping Specialist",
    "Drone Inspection Specialist",
    "Aerial Photographer",
    "Drone Videographer",
    "FPV Pilot",
    "Agricultural Drone Specialist",
    "Precision Agriculture Specialist",
    "Drone Delivery Specialist",
    "UAV Engineer",
    "UAV Design Engineer",
    "UAV Manufacturing Engineer",
    "Drone Assembly Technician",
    "Drone Maintenance Technician",
    "UAV Test Pilot",
    "Flight Test Engineer",
    "Flight Dynamics Engineer",
    "Propulsion Engineer",
    "Aerodynamics Engineer",
    "Aerospace Engineer",
    "Aeronautical Engineer",
    "Avionics Engineer",
    "Payload Integration Engineer",
    "Swarm Drone Engineer",
    "Counter UAS Specialist",
    "Defence Technology Professional",
    "Surveillance Specialist",
    "Drone Operations Manager",
    "Drone Project Manager",
    "Drone Safety Officer",
    "Drone Regulatory Consultant",
    "Drone Data Analyst",
    "Aviation Safety Professional",
    "Air Traffic Management Professional",
    "Solar Inspection Specialist",
    "Powerline Inspection Specialist",
    "Infrastructure Inspection Specialist",
    "Bridge Inspection Specialist",
    "Railway Inspection Specialist",
    "Pipeline Inspection Specialist",
    "Mining Survey Specialist",
    "Construction Survey Specialist",
    "Telecom Inspection Specialist",
    "Oil and Gas Inspection Specialist",
    "Environmental Monitoring Specialist",
    "Disaster Management Specialist"
  ],
  "gis": [
    "GIS Analyst",
    "GIS Engineer",
    "GIS Developer",
    "GIS Consultant",
    "GIS Trainer",
    "Geospatial Analyst",
    "Remote Sensing Specialist",
    "Photogrammetry Specialist",
    "LiDAR Specialist",
    "Survey Engineer",
    "Land Surveyor",
    "Mapping Specialist",
    "Cartographer",
    "Geospatial Data Scientist",
    "Spatial Data Analyst",
    "QGIS Specialist",
    "ArcGIS Specialist",
    "GNSS / GPS Specialist",
    "Digital Twin Specialist",
    "3D Mapping Specialist"
  ],
  "ai": [
    "AI Engineer",
    "Machine Learning Engineer",
    "Deep Learning Engineer",
    "Computer Vision Engineer",
    "Data Scientist",
    "Data Analyst",
    "Generative AI Engineer",
    "AI Automation Engineer",
    "AI Trainer",
    "Full Stack Developer",
    "Front End Developer",
    "Back End Developer",
    "Mobile App Developer",
    "Cloud Engineer",
    "DevOps Engineer",
    "Embedded Software Engineer",
    "IoT Engineer",
    "Cybersecurity Specialist",
    "QA / Software Testing Engineer"
  ],
  "robotics": [
    "Robotics Engineer",
    "Robotics Software Engineer",
    "Robotics Trainer",
    "Autonomous Systems Engineer",
    "ROS Developer",
    "Mechatronics Engineer",
    "Control Systems Engineer",
    "Automation Engineer",
    "Embedded Systems Engineer",
    "Sensor Integration Engineer",
    "Navigation Engineer",
    "SLAM Engineer",
    "UGV Specialist",
    "USV / Marine Robotics Specialist",
    "Electronics Engineer",
    "Electrical Engineer",
    "PCB Design Engineer",
    "RF Engineer",
    "Communication Systems Engineer",
    "Battery and Power Systems Engineer",
    "Sensor Engineer"
  ]
};

export const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const CERT_TYPES = [
  "DGCA Remote Pilot Certificate",
  "DGCA Instructor Certification",
  "GIS Certification",
  "Remote Sensing Certification",
  "Survey Certification",
  "AI / ML Certification",
  "Robotics Certification",
  "Aviation Certification",
  "OEM Product Certification",
  "Safety Certification",
  "Other Professional Certification"
];

export const BUSINESS_SUPPORT_CATEGORIES = [
  "Legal & Regulatory Services",
  "Accounting, Tax & Finance",
  "Insurance Services",
  "Banking & Funding",
  "Printing & Branding",
  "Digital Marketing & Advertising",
  "IT & Software Services",
  "Recruitment & HR Services",
  "Hotels & Accommodation",
  "Travel & Tourism",
  "Transport & Logistics",
  "Event & Exhibition Services",
  "Media & Production Services",
  "Training & Consulting",
  "Office & Infrastructure Services",
  "Equipment Rental",
  "Security Services",
  "Import / Export & Customs",
  "Business Consulting",
  "Other Business Services"
];

export const PROFESSIONAL_TYPES = [
  "Student",
  "Intern",
  "Trainee",
  "Apprentice",
  "Employee",
  "Government Employee",
  "Freelancer",
  "Consultant",
  "Independent Professional",
  "Self Employed Professional",
  "Entrepreneur",
  "Founder / Co-Founder",
  "Business Owner",
  "Academic / Faculty",
  "Researcher",
  "Trainer / Instructor",
  "Subject Matter Expert",
  "Job Seeker",
  "Retired Professional",
  "Other"
];

export const EXPERIENCE_LEVELS = [
  "Student / Learning",
  "Fresher",
  "Less than 1 Year",
  "1 to 3 Years",
  "3 to 5 Years",
  "5 to 10 Years",
  "10 to 15 Years",
  "15 to 20 Years",
  "More than 20 Years"
];

export const AVAILABILITY = [
  "Available for Full Time Employment",
  "Available for Part Time Work",
  "Available for Freelance Projects",
  "Available for Consulting",
  "Available for Contract Work",
  "Available for Internship",
  "Available for Training Assignments",
  "Available for Research Collaboration",
  "Available for Business Collaboration",
  "Open to Opportunities",
  "Not Currently Available"
];

export const WORK_PREFERENCES = [
  "On Site",
  "Remote",
  "Hybrid",
  "Open to Travel",
  "Open to Relocation"
];

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const COUNTRY_CODES = "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW".split(" ");

// Country names in English, India first. Falls back to a short list when the
// browser has no region names.
export function countryNames(): string[] {
  let names: string[] = [];
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    names = COUNTRY_CODES.map(c => dn.of(c) || "").filter((n, i) => n && n !== COUNTRY_CODES[i]);
  } catch {
    names = ["Singapore", "United Arab Emirates", "United Kingdom", "United States", "Other"];
  }
  names.sort((a, b) => a.localeCompare(b));
  return ["India", ...names.filter(n => n !== "India")];
}
