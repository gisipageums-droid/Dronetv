export interface FormData {
  // A0. Company Category
  companyCategory: string[];

  // A. Company Identity & Contacts
  companyName: string;
  yearEstablished: string;
  directorName: string;
  directorPhone: string;
  directorEmail: string;
  altContactName: string;
  altContactPhone: string;
  altContactEmail: string;
  websiteUrl: string;
  companyProfileLink?: string;
  promoVideoFiveMinUrl?: string;
  promoVideoOneMinUrl?: string;
  officeAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  legalName?: string;
  gstin?: string;
  cinOrUdyamOrPan?: string;
  supportEmail?: string;
  supportContactNumber?: string;
  whatsappNumber?: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
    cin?: string;
    udyam?: string;
    pan?: string;
  };
  operatingHours?: string;
  promoCode: string;

  // B. Sectors Served
  sectorsServed: {
  Drone: [],
  AI: [],
  GIS: []
}
sectorsOther: {
  Drone: "",
  AI: "",
  GIS: ""
}

  // C. Business Categories & Coverage
  mainCategories: string[];
  otherMainCategories?: string;
  geographyOfOperations: string[];
  coverageType?: string;

  // edtemporarily
  // subCategories:string[];
  subCategories?: { [key: string]: string[] }; 
  // subSubCategories:string[]
subSubCategories?: { [subCategory: string]: string[] };




  // D1. Drone Manufacturing
  manufacturingSubcategories: string[];
  manufOther?: string;
  dgcaTypeCertificateUrl?: string;

  // D2. Drone Services
  serviceSubcategories: string[];
  servicesOther?: string;

  // D3. Drone Training/RPTO
  trainingTypes: string[];
  trainingOther?: string;
  rptoAuthorisationCertificateUrl?: string;

  // D4. Aerial Photography & Videography
  photoVideoSubcategories: string[];
  photoVideoOther?: string;

  // D5. Drone Software Development
  softwareSubcategories: string[];
  softwareOther?: string;

  // D6. AI Based Solutions
  aiSolutions: string[];
  aiSolutionsOther?: string;
  aiProducts: string[];
  aiProductsOther?: string;
  aiServices: string[];
  aiServicesOther?: string;

  // D7. GIS/DGPS
  gnssSolutions: string[];
  gnssSolutionsOther?: string;
  gnssProducts: string[];
  gnssProductsOther?: string;
  gnssServices: string[];
  gnssServicesOther?: string;

  // E. Website Content & Presentation
  heroBackgroundUrl?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  aboutTitle: string;
  aboutImageUrl?: string;
  aboutExperienceYears?: number;
  aboutTeamExperience?: string;
  companyValuesSelection: string[];
  servicesTitle: string;
  servicesDescription?: string;
  services: Array<{ icon: string; title: string; description?: string }>;
  productsTitle: string;
  productCategories?: string;
  products: Array<{ title: string; description?: string }>;
  clientsTitle?: string;
  clients: Array<{ name: string; logo?: string; industry: string }>;
  testimonials: Array<{
    name: string;
    role: string;
    rating: number;
    photo?: string;
    quoteSeed: string;
  }>;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  addressLine: string;
  pinCode: string;
  mapEmbedUrl?: string;
  contactFormText?: string;
  submitButtonText?: string;
  footerLogoUrl?: string;
  footerDescriptionDraft?: string;
  footerText: string;
  footerEmail?: string;
  footerPhone?: string;
  footerAddress?: string;
  footerNavLinks: Array<{ label: string; link: string }>;
  newsletterEnabled?: boolean;
  newsletterDescription?: string;

  // F. Promotion Preferences & Billing
  promoFormats: string[];
  billingContactName?: string;
  billingContactEmail?: string;
  billingGstDetails?: string;
  billingAddress?: string;
  paymentMethod?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;

  // Media Uploads
  companyLogoUrl: string;
  brochurePdfUrl?: string;
  cataloguePdfUrl?: string;
  caseStudiesUrl?: string;
  brandGuidelinesUrl?: string;

  // templateId
  templateSelection?: number;
}

export interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}