import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { FormData } from "./types/form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Step1CompanyCategory from "./components/steps/Step1CompanyCategory";
import Step3SectorsServed from "./components/steps/Step3SectorsServed";
import Step4BusinessCategories from "./components/steps/Step4BusinessCategories";
import Step5ProductsServices from "./components/steps/Step5ProductsServices";
import Step7PromotionBilling from "./components/steps/Step7PromotionBilling";
import Step8MediaUploads from "./components/steps/Step8MediaUploads";
import PreviewPublish from "./components/PreviewPublish";
import { useTemplate, useUserAuth } from "../../../../../context/context";
import { toast } from "react-toastify";
import { COMPANY_API, LAMBDA } from '../../../../../../lib/apiConfig';

type DigiStatus = 'idle' | 'loading' | 'polling' | 'verified' | 'error';

function mapFormDataToAIGenData(fd: FormData, draftId: string, userId: string) {
  const companyName = fd.companyName || '';
  const industry = fd.companyCategory?.[0] || 'Drone Technology';
  const established = fd.yearEstablished || '';
  const location = [fd.city, fd.state, fd.country].filter(Boolean).join(', ') || 'India';
  const heroImage = fd.heroBackgroundUrl || 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1080&q=80';
  const address = [fd.addressLine || fd.officeAddress, fd.city, fd.state, fd.postalCode || fd.pinCode].filter(Boolean).join(', ');
  const yearsExp = established ? `${new Date().getFullYear() - parseInt(established)}+` : '5+';

  return {
    publishedId: '',
    userId,
    draftId,
    templateSelection: 'template-1',
    isEdited: false,
    content: {
      company: {
        name: companyName,
        logo: fd.companyLogoUrl || '',
        industry,
        established,
        location,
        metrics: { yearsInBusiness: yearsExp, projectsCompleted: '30+', clientsSatisfied: '10+' }
      },
      hero: {
        heading: `${companyName} - Professional ${industry} Solutions`,
        subheading: `Leading ${industry} company delivering innovative solutions`,
        description: fd.footerDescriptionDraft || `${companyName} delivers solutions that blend technology, creativity, and purpose.`,
        mainHeroImage: heroImage,
        secHeroImage: heroImage,
        numberOfClients: '500',
        clientImage1: heroImage, clientImage2: heroImage, clientImage3: heroImage,
        clientImage4: heroImage, clientImage5: heroImage, clientImage6: heroImage,
        primaryAction: { type: 'primary', text: fd.primaryCtaText || 'Get Quote' },
        secondaryAction: { type: 'secondary', text: fd.secondaryCtaText || 'View Services' }
      },
      about: {
        companyName,
        industry,
        established,
        headquarters: location,
        description1: fd.aboutTeamExperience || `${companyName} was founded with a vision to deliver professional ${industry} solutions.`,
        description2: `${companyName} is committed to delivering excellence and innovation in the ${industry} sector.`,
        mission: `To deliver exceptional ${industry} solutions that drive business success`,
        vision: `To be the leading ${industry} company known for innovation and quality`,
        officeImage: fd.aboutImageUrl || '',
        certifications: [],
        achievements: []
      },
      services: {
        heading: { head: fd.servicesTitle || 'Our Services', desc: fd.servicesDescription || 'Professional services tailored to your needs' },
        services: (fd.services || []).filter(s => s.title?.trim()).map(s => ({ icon: s.icon || '', title: s.title.trim(), description: s.description || '' })),
        categories: ['All']
      },
      products: {
        heading: { title: fd.productsTitle || 'Professional Products', heading: 'Innovative Solutions', description: 'Quality solutions.', trust: 'for your business.' },
        products: (fd.products || []).filter(p => p.title?.trim()).map(p => ({ title: p.title.trim(), description: p.description || '' })),
        benefits: [
          { icon: '30', color: 'red-accent', title: '30-Day Money Back', desc: 'Try our solutions risk-free.' },
          { icon: '99%', color: 'primary', title: '99% Success Rate', desc: 'Industry-leading success rate.' },
          { icon: '∞', color: 'gradient', title: 'Unlimited Support', desc: 'Comprehensive support included.' }
        ]
      },
      blog: {
        header: { title: `${industry} Blog`, badge: 'Latest Insights', desc: `Expert insights from ${companyName}` },
        posts: []
      },
      clients: {
        headline: { title: fd.clientsTitle || 'Trusted by Leading Organizations', description: `${companyName} serves clients across ${location}` },
        clients: (fd.clients || []).map(c => ({ logo: c.logo || '', name: c.name || '', image: c.logo || '' })),
        stats: [
          { value: '30+', label: 'Projects Completed' },
          { value: '10+', label: 'Happy Clients' },
          { value: yearsExp, label: 'Years Experience' },
          { value: '95%', label: 'Success Rate' }
        ]
      },
      testimonials: {
        headline: { title: 'What Our Clients Say', description: `Success stories from clients of ${companyName}` },
        testimonials: (fd.testimonials || []).map(t => ({ name: t.name || '', gender: 'male', role: t.role || '', image: t.photo || '', quote: t.quoteSeed || '', rating: t.rating || 5 })),
        stats: []
      },
      contact: {
        title: fd.contactTitle || `Get In Touch with ${companyName}`,
        description: `Contact us for professional ${industry} consultation`,
        ctaButton: 'Get Free Consultation',
        backgroundImage: heroImage,
        benefits: [`Free ${industry} consultation`, 'Expert guidance', 'Competitive pricing', 'Fast response'],
        contactInfo: {
          phone: fd.contactPhone || fd.directorPhone || '',
          email: fd.contactEmail || fd.directorEmail || '',
          address,
          website: fd.websiteUrl || '',
          companyName,
          supportPhone: fd.supportContactNumber || '',
          supportEmail: fd.supportEmail || '',
          whatsappLink: fd.whatsappNumber || '',
          gstin: fd.gstin || '',
          directorName: fd.directorName || '',
          directorPrefix: fd.directorPrefix || '',
          legalName: fd.legalName || ''
        },
        businessHours: fd.operatingHours || 'Mon-Fri: 9:00 AM - 6:00 PM',
        mapEmbedUrl: fd.mapEmbedUrl || '',
        socialMedia: {
          linkedin: fd.socialLinks?.linkedin || '',
          twitter: fd.socialLinks?.twitter || '',
          facebook: fd.socialLinks?.facebook || '',
          instagram: fd.socialLinks?.instagram || '',
          youtube: fd.socialLinks?.youtube || '',
          website: fd.socialLinks?.website || ''
        },
        alternateContact: { name: fd.altContactName || '', email: fd.altContactEmail || '', phone: fd.altContactPhone || '' },
        billingContact: { name: '', email: '', address: '', gstin: '' }
      },
      profile: {
        companyName,
        establishedYear: parseInt(established) || new Date().getFullYear() - 5,
        growthThisYear: 18,
        satisfiedCustomers: 10,
        teamSize: 15,
        projectsDelivered: 30,
        imageUrl: fd.aboutImageUrl || heroImage,
        description: fd.footerDescriptionDraft || `Leading ${industry} company delivering innovative solutions`,
        coreValues: fd.companyValuesSelection?.length ? fd.companyValuesSelection : ['Innovation', 'Quality', 'Client Focus', 'Integrity']
      },
      gallery: {
        heading: { title: `${companyName} Portfolio`, description: `Showcasing our ${industry} expertise` },
        categories: ['All', 'Portfolio', 'Projects'],
        images: []
      },
      header: {
        logoSrc: fd.companyLogoUrl || '',
        logoUrl: fd.companyLogoUrl || '',
        companyName,
        navItems: ['Home', 'About', 'Services', 'Products', 'Contact']
      }
    }
  };
}

// ---- initial form state ----
const initialFormData: FormData = {
  // Company Information
  companyCategory: [],
  companyName: "",
  yearEstablished: "",
  websiteUrl: "",
  promoCode: "",

  // Basic Information (from Aadhar verification)
  fullName: "",
  dateOfBirth: "",
  gender: "",
  relationshipType: "",
  relationshipName: "",
  basicAddress: "",
  basicCity: "",
  basicPostalCode: "",
  basicCountry: "",
  basicState: "",

  // Aadhar Verification
  aadharNumber: "",
  aadharVerified: false,
  aadharConsentAccepted: false,

  // PAN Information
  panNumber: "",

  // GST Verification
  legalName: "",
  gstin: "",
  gstAddress: "",
  communicationAddress: "",
  sameAsRegisteredAddress: false,
  businessField: "",
  natureOfBusiness: "",
  cin: "",
  udyamRegistrationNumber: "",

  // Director/MD Information
  directorPrefix: undefined,
  directorName: "",
  directorAddress: "",
  directorPhone: "",
  directorEmail: "",

  // Alternative Contact
  altContactGender: undefined,
  altContactName: "",
  altContactPhone: "",
  altContactEmail: "",

  // Support Information
  supportEmail: "",
  supportContactNumber: "",

  // Social Media Links
  socialLinks: {
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
    pan: "",
    twitter: "",
  },

  // Address Information
  officeAddress: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",

  // Other fields
  companyProfileLink: "",
  promoVideoFiveMinUrl: "",
  promoVideoOneMinUrl: "",
  whatsappNumber: "",
  operatingHours: "",

  sectorsServed: {
    Drone: [],
    AI: [],
    GIS: []
  },
  sectorsOther: {
    Drone: "",
    AI: "",
    GIS: ""
  },
  mainCategories: [],
  otherMainCategories: "",
  geographyOfOperations: [],
  coverageType: "",

  // Drone Categories
  manufacturingSubcategories: [],
  manufOther: "",
  dgcaTypeCertificateUrl: "",
  serviceSubcategories: [],
  servicesOther: "",
  trainingTypes: [],
  trainingOther: "",
  rptoAuthorisationCertificateUrl: "",
  photoVideoSubcategories: [],
  photoVideoOther: "",

  // AI Categories
  softwareSubcategories: [],
  softwareOther: "",
  aiSolutions: [],
  aiSolutionsOther: "",
  aiProducts: [],
  aiProductsOther: "",
  aiServices: [],
  aiServicesOther: "",

  // GIS Categories
  gnssSolutions: [],
  gnssSolutionsOther: "",
  gnssProducts: [],
  gnssProductsOther: "",
  gnssServices: [],
  gnssServicesOther: "",

  // Template Content
  heroBackgroundUrl: "",
  primaryCtaText: "",
  primaryCtaLink: "",
  secondaryCtaText: "",
  secondaryCtaLink: "",
  aboutTitle: "",
  aboutImageUrl: "",
  aboutExperienceYears: 0,
  aboutTeamExperience: "",
  companyValuesSelection: [],
  servicesTitle: "",
  servicesDescription: "",
  services: [],
  productsTitle: "",
  productCategories: "",
  products: [],
  clientsTitle: "",
  clients: [],
  testimonials: [],
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  addressLine: "",
  pinCode: "",
  mapEmbedUrl: "",
  contactFormText: "",
  submitButtonText: "",
  footerLogoUrl: "",
  footerDescriptionDraft: "",
  footerText: "",
  footerEmail: "",
  footerPhone: "",
  footerAddress: "",
  footerNavLinks: [],
  newsletterEnabled: false,
  newsletterDescription: "",

  // Promotion & Billing
  promoFormats: [],
  billingContactName: "",
  billingContactEmail: "",
  billingGstDetails: "",
  billingAddress: "",
  paymentMethod: "",
  acceptTerms: false,
  acceptPrivacy: false,

  // Media Uploads
  companyLogoUrl: "",
  brochurePdfUrl: "",
  cataloguePdfUrl: "",
  caseStudiesUrl: "",
  brandGuidelinesUrl: "",

  // Template Selection
  templateId: "",
};

interface CompanyData {
  publishedId: string;
  userId: string;
  draftId: string;
  templateSelection: string;
}

function App({ embedded = false, initialCompanyCategory, companyData, onEmbeddedSubmit, initialTemplateId }: { embedded?: boolean; initialCompanyCategory?: string[]; companyData?: CompanyData; onEmbeddedSubmit?: (aiGenData: any) => void; initialTemplateId?: string }) {
  const [companyNameStatus, setCompanyNameStatus] = useState<null | {
    available: boolean;
    suggestions?: string[];
    message: string;
  }>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview & publish flow
  const [showPreview, setShowPreview] = useState(false);

  // DigiLocker / Aadhaar verification
  const [digiToken, setDigiToken] = useState('');
  const [digiState, setDigiState] = useState('');
  const [startPolling, setStartPolling] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [digiStatus, setDigiStatus] = useState<DigiStatus>('idle');
  const [digiConsent, setDigiConsent] = useState(false);
  const digiTokenRef = useRef('');
  const digiStateRef = useRef('');

  const [isDraftLoading, setIsDraftLoading] = useState(embedded && !!companyData?.draftId);

  // Consolidated to Step 1 only
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(() => {
    if (embedded) return initialFormData; // embedded form loads from draft API, not localStorage
    try {
      const saved = localStorage.getItem("companyFormDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData && typeof parsed.formData === "object") {
          const merged = { ...initialFormData, ...parsed.formData } as FormData;
          if (!merged.companyCategory) {
            merged.companyCategory = [];
          }
          return merged;
        }
      }
    } catch (e) {
      console.error("Failed to read formData from localStorage on init", e);
    }
    return initialFormData;
  });

  const { draftDetails, setDraftDetails, setAIGenData, AIGenData } = useTemplate();
  const { user: authUser } = useUserAuth();
  const loggedInEmail = authUser?.email || authUser?.userData?.email || null;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialCompanyCategory && initialCompanyCategory.length > 0) {
      setFormData((prev) => ({ ...prev, companyCategory: initialCompanyCategory }));
    }
  }, [initialCompanyCategory?.join(",")]);

  // When embedded with existing company, fetch and pre-populate full draft data
  useEffect(() => {
    if (!embedded || !companyData?.draftId || !companyData?.userId) return;
    const template = companyData.templateSelection || 'template-1';
    setIsDraftLoading(true);

    const draftUrl = COMPANY_API ? `${COMPANY_API}/api/draft/${companyData.userId}/${companyData.draftId}?template=${template}` : `${LAMBDA.companyDraft}/api/draft/${companyData.userId}/${companyData.draftId}?template=${template}`;
    const publishedUrl = companyData.publishedId
      ? COMPANY_API ? `${COMPANY_API}/dashboard-cards/published-details/${companyData.publishedId}` : `${LAMBDA.company}/dashboard-cards/published-details/${companyData.publishedId}`
      : null;

    Promise.all([
      fetch(draftUrl).then(r => r.json()).catch(() => ({})),
      publishedUrl
        ? fetch(publishedUrl, { headers: { 'X-User-Id': companyData.userId } }).then(r => r.json()).catch(() => ({}))
        : Promise.resolve({}),
    ]).then(([draftData, publishedData]) => {
      // Extract services & products from published template content (scraped at registration)
      const publishedServices: any[] = publishedData?.content?.services?.services || [];
      const publishedProducts: any[] = publishedData?.content?.products?.products || [];

      const formDataFromDraft = draftData?.formData || {};

      // Use scraped services/products as fallback when draft has none
      const mergedFormData = {
        ...formDataFromDraft,
        services: formDataFromDraft.services?.length > 0
          ? formDataFromDraft.services
          : publishedServices.map((s: any) => ({ icon: s.icon || 'service', title: s.title || '', description: s.description || '' })),
        products: formDataFromDraft.products?.length > 0
          ? formDataFromDraft.products
          : publishedProducts.map((p: any) => ({ title: p.title || '', description: p.description || '' })),
      };

      if (Object.keys(mergedFormData).length > 0) {
        setFormData(prev => ({ ...prev, ...mergedFormData }));
      }
    }).finally(() => setIsDraftLoading(false));
  }, [embedded, companyData?.draftId, companyData?.userId, companyData?.publishedId]);

  // Set selected template from parent when creating new company via dashboard
  useEffect(() => {
    if (initialTemplateId) {
      setFormData(prev => ({ ...prev, templateId: initialTemplateId }));
    }
  }, [initialTemplateId]);

  // ✅ extract params for prefill
  const params = useParams<{
    publicId?: string;
    userId?: string;
    draftId?: string;
  }>();
  const { publicId, userId: urlUserId, draftId: urlDraftId } = params;

  // ✅ loading state for prefill
  const [isApiLoading, setIsApiLoading] = useState(false);

  // ✅ prefill form logic
  useEffect(() => {
    const fetchDraftData = async () => {
      if (publicId && urlUserId && urlDraftId) {
        try {
          setIsApiLoading(true);
          const API_URL = COMPANY_API ? `${COMPANY_API}/${publicId}/${urlUserId}/${urlDraftId}` : `${LAMBDA.companyDraftLoad}/${publicId}/${urlUserId}/${urlDraftId}`;
          const response = await fetch(API_URL);
          const data = await response.json();

          if (data?.formData) {
            setFormData((prev) => ({ ...prev, ...data.formData }));
            setAIGenData(data);
          } else {
            console.error("API returned invalid data:", data);
          }
        } catch (error) {
          console.error("Error fetching draft data:", error);
        } finally {
          setIsApiLoading(false);
        }
      }
    };

    fetchDraftData();
  }, [publicId, urlUserId, urlDraftId, setAIGenData]);

  // Persist form data and step to localStorage so data survives refresh until submission
  useEffect(() => {
    if (embedded) return; // embedded form loads from draft API
    try {
      const saved = localStorage.getItem("companyFormDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData && typeof parsed.formData === "object") {
          setFormData((prev) => ({ ...prev, ...parsed.formData }));
        }
        if (parsed?.step && Number.isInteger(parsed.step)) {
          setCurrentStep(parsed.step);
        }
      }
    } catch (e) {
      console.error("Failed to load saved draft from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (embedded) return; // don't pollute public form draft with embedded data
    try {
      const payload = JSON.stringify({ formData, step: currentStep });
      localStorage.setItem("companyFormDraft", payload);
    } catch (e) {
      console.error("Failed to save draft to localStorage", e);
    }
  }, [formData, currentStep]);

  // Detect DigiLocker callback after redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('digi_callback')) {
      const storedToken = localStorage.getItem('digi_client_token');
      const storedState = localStorage.getItem('digi_state');
      const wasInPreview = localStorage.getItem('digi_preview_mode') === 'true';

      if (storedToken && storedState) {
        setDigiToken(storedToken);
        setDigiState(storedState);
        digiTokenRef.current = storedToken;
        digiStateRef.current = storedState;
        setStartPolling(true);
        setDigiStatus('polling');
        setDigiConsent(true);
      }
      if (wasInPreview) setShowPreview(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Fresh form load (not a DigiLocker return) — clear stale GST data from previous sessions
      const hasDraft = !!localStorage.getItem('companyFormDraft');
      if (!hasDraft) {
        localStorage.removeItem('gstSectionData');
        localStorage.removeItem('verifiedGSTData');
      }
    }
  }, []);

  // DigiLocker polling
  useEffect(() => {
    digiTokenRef.current = digiToken;
    digiStateRef.current = digiState;
  }, [digiToken, digiState]);

  useEffect(() => {
    if (!startPolling) return;

    let attempts = 0;
    const MAX = 40;

    const timer = setInterval(async () => {
      const token = digiTokenRef.current;
      const state = digiStateRef.current;
      if (!token || !state) return;

      try {
        const res = await axios.post('https://digilocker.meon.co.in/v2/send_entire_data', {
          client_token: token,
          state,
        });

        if (res.data.success && res.data.status === 'success') {
          clearInterval(timer);
          setStartPolling(false);
          setAadharVerified(true);
          setDigiStatus('verified');
          localStorage.removeItem('digi_client_token');
          localStorage.removeItem('digi_state');
          localStorage.removeItem('digi_preview_mode');
          toast.success('Aadhaar verification successful!');
          return;
        }
      } catch {
        // continue polling
      }

      attempts++;
      if (attempts >= MAX) {
        clearInterval(timer);
        setStartPolling(false);
        setDigiStatus('error');
        toast.error('Verification timed out. Please try again.');
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [startPolling]);

  // DigiLocker login handler
  const handleDigiLockerLogin = async () => {
    if (!digiConsent) {
      toast.error('Please accept the consent checkbox first.');
      return;
    }
    setDigiStatus('loading');
    try {
      const tokenRes = await axios.post('https://digilocker.meon.co.in/get_access_token', {
        company_name: 'ipage',
        secret_token: 'lwHaBrdbfda67P3uO5jbC7HElp6cpBQb',
      });

      if (tokenRes.data.status) {
        const { client_token, state } = tokenRes.data;
        localStorage.setItem('digi_client_token', client_token);
        localStorage.setItem('digi_state', state);
        localStorage.setItem('digi_preview_mode', 'true');

        const currentUrl = window.location.origin + window.location.pathname;
        const redirectUrl = `${currentUrl}?digi_callback=true`;

        const urlRes = await axios.post('https://digilocker.meon.co.in/digi_url', {
          client_token,
          redirect_url: redirectUrl,
          company_name: 'ipage',
          documents: 'aadhaar,pan',
          pan_name: 'RAHUL KUMAR',
          pan_no: 'CAPUD4335K',
          other_documents: [],
        });

        if (urlRes.data.status === 'success' && urlRes.data.url) {
          window.location.href = urlRes.data.url;
        } else {
          setDigiStatus('error');
          toast.error('Unable to start DigiLocker. Please try again.');
        }
      } else {
        setDigiStatus('error');
        toast.error('DigiLocker initialization failed.');
      }
    } catch {
      setDigiStatus('error');
      toast.error('Error starting DigiLocker. Please try again.');
    }
  };

  // function to check company name availability
  const checkCompanyName = async (name: string) => {
    if (!name || name.length < 2) {
      setCompanyNameStatus(null);
      return;
    }
    setIsCheckingName(true);
    try {
      const res = await fetch(
        COMPANY_API ? `${COMPANY_API}/drafts/check-name?name=${encodeURIComponent(
          name
        )}` : `${LAMBDA.companyFormDraft}/drafts/check-name?name=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      setCompanyNameStatus(data);
    } catch (err) {
      setCompanyNameStatus({
        available: false,
        message: "Error checking name",
      });
    } finally {
      setIsCheckingName(false);
    }
  };

  function handleClick() {
    navigate(
      `/edit/template/${draftDetails.templateSelection === 1 ? "t1" : "t2"}/${draftDetails.draftId
      }/${draftDetails.userId}`
    );
  }

  const templateId = location.state?.templateId;
  initialFormData.templateId = templateId || "";

  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>(templateId);
  const [userId] = useState<string>("user-123");

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // Step 1 validation logic
  const validateStep1 = () => {
    // Company Category: at least 1
    if (!formData.companyCategory || formData.companyCategory.length === 0) {
      toast.error("Please select at least one Company Category.");
      return false;
    }
    // Company Name: required
    if (!formData.companyName || formData.companyName.trim() === "") {
      toast.error("Company Name is required.");
      return false;
    }
    // Website URL is now optional
    /*
    if (!formData.websiteUrl || formData.websiteUrl.trim() === "") {
      toast.error("Website URL is required.");
      return false;
    }
    */
    // Director/MD Information required
    if (!formData.directorName || formData.directorName.trim() === "") {
      toast.error("Director Name is required.");
      return false;
    }
    const phoneDigits = (formData.directorPhone || '').replace(/\D/g, '');
    if (phoneDigits.length < 12) {
      toast.error("Please enter a valid 10-digit Indian phone number.");
      return false;
    }
    if (!formData.directorEmail || formData.directorEmail.trim() === "") {
      toast.error("Director Email is required.");
      return false;
    }
    if (!formData.gstin || formData.gstin.trim() === "") {
      toast.error("GST/CIN/LLPIN verification is required to list your company.");
      return false;
    }
    if (!formData.gstVerified) {
      toast.error("Please verify your GST/CIN/LLPIN before proceeding.");
      return false;
    }
    return true;
  };

  // Step 3 validation logic
  const validateStep3 = () => {
    if (!formData.sectorsServed || typeof formData.sectorsServed !== "object") {
      toast.error("Please select at least one sector.");
      return false;
    }
    // Check if at least one selected category has at least one sector selected
    const hasAny = formData.companyCategory.some(
      (cat) =>
        Array.isArray(formData.sectorsServed[cat]) &&
        formData.sectorsServed[cat].length > 0
    );
    if (!hasAny) {
      toast.error(
        "Please select at least one sector for your company category."
      );
      return false;
    }
    return true;
  };

  // Step 4 validation logic
  const validateStep4 = () => {
    if (!formData.mainCategories || formData.mainCategories.length === 0) {
      toast.error("Please select at least one Main Business Category.");
      return false;
    }
    if (
      !formData.geographyOfOperations ||
      formData.geographyOfOperations.length === 0
    ) {
      toast.error("Please select at least one Geography of Operations.");
      return false;
    }
    return true;
  };

  // Step 5 validation logic
  const validateStep5 = () => {
    return true;
  };

  // Step 7 validation logic
  const validateStep7 = () => {
    if (!formData.promoFormats || formData.promoFormats.length === 0) {
      toast.error("Please select at least one Promotion Preference.");
      return false;
    }
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      toast.error(
        "Please accept Terms & Conditions and Privacy Policy to continue."
      );
      return false;
    }
    return true;
  };

  // Step 8 validation logic
  const validateStep8 = () => {
    return true;
  };

  // ── Submit: update existing company website content
  const handleEmbeddedSubmit = useCallback(async () => {
    if (!companyData) return;
    setIsSubmitting(true);
    try {
      const aiGenData = mapFormDataToAIGenData(formData, companyData.draftId, companyData.userId);
      aiGenData.publishedId = companyData.publishedId;
      aiGenData.templateSelection = companyData.templateSelection;
      if (onEmbeddedSubmit) {
        onEmbeddedSubmit(aiGenData);
      } else {
        const templateNum = companyData.templateSelection === 'template-2' ? '2' : '1';
        navigate(
          `/user/companies/edit/${templateNum}/${companyData.publishedId}/${companyData.userId}`,
          { state: { aiGenData } }
        );
      }
    } catch {
      toast.error("Failed to update. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, companyData, navigate, onEmbeddedSubmit]);

  const handleStep1Submit = useCallback(async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    try {
      const FORM_SUBMIT_API_URL = COMPANY_API ? `${COMPANY_API}/drafts` : `${LAMBDA.companyFormDraft}/drafts`;
      
      const finalTemplateId = formData.templateId || templateId || "1";

      const payload = {
        userId: loggedInEmail || formData.directorEmail,
        directorEmail: formData.directorEmail,
        templateSelection: finalTemplateId,
        templateDetails: {
          id: null,
          name: "",
          value: finalTemplateId,
        },
        formData: {
          ...formData,
          templateId: finalTemplateId,
          submittedAt: new Date().toISOString(),
        },
        uploadedFiles: {},
        batchInfo: {
          isLastBatch: true,
          timestamp: Date.now(),
          processingMethod: "step1_immediate_submit",
        },
      };

      const response = await axios.post(FORM_SUBMIT_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 60000,
      });

      setDraftDetails(response.data);

      localStorage.removeItem("companyFormDraft");
      localStorage.removeItem("digi_preview_mode");
      localStorage.removeItem("gstSectionData");
      localStorage.removeItem("verifiedGSTData");

      const draftId = response.data?.draftId;
      const userId = response.data?.userId;
      if (userId) localStorage.setItem('dronetv_company_userId', userId);
      const aiGenData = mapFormDataToAIGenData(formData, draftId, userId);
      const templateSlug = finalTemplateId === "2" || finalTemplateId === "template-2" ? "t2" : "t1";
      navigate(`/edit/template/${templateSlug}/${draftId}/${userId}`, { state: { aiGenData } });

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error";
      toast.error(`Failed to list your company: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, templateId, navigate, setDraftDetails]);

  const handlePreview = () => {
    if (!validateStep1()) return;
    setShowPreview(true);
  };

  const nextStep = () => {
    let valid = true;
    if (embedded) {
      // Embedded: steps 1-5 (Sectors, Categories, Products, Promotion, Media)
      switch (currentStep) {
        case 1: valid = validateStep3(); break; // Sectors Served
        case 2: valid = validateStep4(); break; // Business Categories
        case 4: valid = validateStep7(); break; // Promotion & Billing
      }
    }
    if (!valid) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (embedded) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleEmbeddedSubmit();
      }
    }
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (embedded && currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
      onSkip: skipStep,
      onStepClick: (step: number) => setCurrentStep(step),
      isValid: true,
      showSkip: false,
      embedded,
    };

    // Public /form route — single step, "Preview & Publish" flow
    if (!embedded) {
      return (
        <Step1CompanyCategory
          {...commonProps}
          onNext={handlePreview}
          checkCompanyName={checkCompanyName}
          companyNameStatus={companyNameStatus}
          isCheckingName={isCheckingName}
          isSubmitting={isSubmitting}
        />
      );
    }

    // Dashboard embedded — 5-step stepper (no company info step)
    switch (currentStep) {
      case 2:
        return <Step4BusinessCategories {...commonProps} />;
      case 3:
        return <Step5ProductsServices {...commonProps} />;
      case 4:
        return <Step7PromotionBilling {...commonProps} />;
      case 5:
        return <Step8MediaUploads {...commonProps} />;
      default: // step 1
        return <Step3SectorsServed {...commonProps} />;
    }
  };

  if (isApiLoading) {
    return (
      <div className="fixed inset-0 bg-indigo-900 flex items-center justify-center z-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Loading form data...
          </h1>
          <p className="text-blue-200 text-lg">
            Please wait while we prefill your form
          </p>
        </div>
      </div>
    );
  }

  if (isDraftLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading your company data…</p>
      </div>
    );
  }

  if (showPreview) {
    return (
      <PreviewPublish
        formData={formData}
        onBack={() => setShowPreview(false)}
        onPublish={handleStep1Submit}
        isPublishing={isSubmitting}
        aadharVerified={true}
        digiStatus={digiStatus}
        consent={digiConsent}
        onConsentChange={setDigiConsent}
        onStartDigiLocker={handleDigiLockerLogin}
        embedded={embedded}
      />
    );
  }

  return <div>{renderStep()}</div>;
}

export default App;