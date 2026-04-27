import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Upload, Plus, Trash2, Star } from 'lucide-react';
import { uploadImageToS3 } from './src/utils/s3Upload';

interface CompanyValue {
  icon?: string; // optional for select
  title: string;
  description: string;
}
interface Client {
  name: string;
  logo: string;
  industry: string;
}
interface Service {
  icon: string;
  title: string;
  description: string;
}
interface Product {
  image: string;
  title: string;
  description: string;
  link: string;
}
interface Testimonial {
  name: string;
  role: string;
  quote: string;
  photo: string;
  rating: number;
}
interface FormData {
  companyName: string;
  contactName: string;
  category?: string;
  // Header & Hero
  companyLogo: string;
  navigationLinks: { label: string; link: string }[];
  heroHeadline: string;
  heroSubheadline: string;
  heroBackground: string;
  primaryCTA: { text: string; link: string };
  secondaryCTA: { text: string; link: string };

  // About
  aboutTitle: string;
  aboutDescription: string;
  aboutTeamExperience?: string; // optional: add a second para for experience highlight
  aboutImage: string;
  aboutExperienceYears?: number; // optional: years of experience display
  companyValues: CompanyValue[];
  videoEmbedUrl: string;

  // Services
  servicesTitle: string;
  servicesDescription?: string;
  services: Service[];

  // Products
  productsTitle: string;
  productCategories: string;
  products: Product[];

  // Clients & Testimonials
  clientsTitle: string;
  clientLogos: string[];
  testimonials: Testimonial[];
  clients: Client[];

  // Contact
  contactTitle: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  mapEmbedUrl: string;
  contactFormText: string;
  submitButtonText: string;

  // Footer
  footerLogo: string;
  footerDescription: string;
  footerText: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  footerNavLinks: { label: string; link: string }[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    website?: string;
  };
  newsletterEnabled: boolean;
  newsletterDescription: string;
}



const CreateCompany: React.FC = () => {
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [productImageUploadLoading, setProductImageUploadLoading] = useState<{ [key: number]: boolean }>({});
  const [productImageUploadMessage, setProductImageUploadMessage] = useState<{ [key: number]: string }>({});
  const [clientLogoUploadLoading, setClientLogoUploadLoading] = useState<{ [key: number]: boolean }>({});
  const [clientLogoUploadMessage, setClientLogoUploadMessage] = useState<{ [key: number]: string }>({});
  const [aboutImageUploadLoading, setAboutImageUploadLoading] = useState(false);
  const [aboutImageUploadMessage, setAboutImageUploadMessage] = useState('');
  const [testimonialPhotoUploadLoading, setTestimonialPhotoUploadLoading] = useState<{ [key: number]: boolean }>({});
  const [testimonialPhotoUploadMessage, setTestimonialPhotoUploadMessage] = useState<{ [key: number]: string }>({});
  const [heroImageUploadLoading, setHeroImageUploadLoading] = useState(false);
  const [heroImageUploadMessage, setHeroImageUploadMessage] = useState('');
  const [footerLogoUploadLoading, setFooterLogoUploadLoading] = useState(false);
  const [footerLogoUploadMessage, setFooterLogoUploadMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeError, setPromoCodeError] = useState('');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async () => {
    // (optional: validate data here)
    const formDataWithTimestamp = {
      ...formData,
      timestamp: new Date().toISOString(),// or new Date().toISOString() if you want ISO format
    };
    // Call the API
    const response = await fetch('https://6dcd2cnc76.execute-api.ap-south-1.amazonaws.com/postCompanyform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formDataWithTimestamp)
    });

    if (response.ok) {
      // Success — maybe route to preview page
      navigate('/companies');
    } else {
      // Handle error
      alert('Failed to create company. Try again!');
    }
  };
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    category: '',
    // Header & Hero
    companyLogo: '',
    navigationLinks: [
      { label: 'Home', link: '#home' },
      { label: 'About', link: '#about' },
      { label: 'Services', link: '#services' },
      { label: 'Products', link: '#products' },
      { label: 'Contact', link: '#contact' }
    ],
    heroHeadline: '',
    heroSubheadline: '',
    heroBackground: '',
    primaryCTA: { text: 'Explore Products', link: '#products' },
    secondaryCTA: { text: 'Contact Us', link: '#contact' },

    // About
    aboutTitle: 'About Our Company',
    aboutDescription: '',
    aboutTeamExperience: '',
    aboutImage: '',
    aboutExperienceYears: 5,
    companyValues: [],
    videoEmbedUrl: '',

    // Services
    servicesTitle: 'Our Services',
    servicesDescription: '',
    services: [],

    // Products
    productsTitle: 'Our Products',
    productCategories: 'All, Surveillance, Agriculture, Custom',
    products: [],

    // Clients & Testimonials
    clientsTitle: 'Our Clients',
    clients: [],
    clientLogos: [],
    testimonials: [],

    // Contact
    contactTitle: 'Get In Touch',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    mapEmbedUrl: '',
    contactFormText: 'Ready to work with us? Send us a message.',
    submitButtonText: 'Send Message',

    // Footer
    footerLogo: '',
    footerDescription: ' ',
    footerText: '© 2025 Your Company. All rights reserved.',
    footerEmail: '',
    footerPhone: '',
    footerAddress: '',
    footerNavLinks: [
      { label: 'Home', link: '#home' },
      { label: 'About', link: '#about' },
      { label: 'Services', link: '#services' },
      { label: 'Products', link: '#products' },
      { label: 'Contact', link: '#contact' }
    ],
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      whatsapp: '',
      website: ''
    },
    newsletterEnabled: true,
    newsletterDescription: 'Subscribe to our newsletter for the latest drone technology updates.'
  });



  const steps = [
    'Basic Details',
    'Header & Hero',
    'About Section',
    'Services',
    'Products',
    'Clients & Testimonials',
    'Contact',
    'Footer'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionValue = prev[section as keyof FormData];
      // Check if it's an object (not array, not null)
      if (
        sectionValue &&
        typeof sectionValue === 'object' &&
        !Array.isArray(sectionValue)
      ) {
        return {
          ...prev,
          [section]: {
            ...sectionValue,
            [field]: value
          }
        };
      }
      // fallback, do nothing
      return prev;
    });
  };

  const addArrayItem = (field: string, item: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof FormData] as any[]), item]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, updatedItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as any[]).map((item, i) =>
        i === index ? updatedItem : item
      )
    }));
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">Basic Company Details</h2>
            <input
              type="text"
              required
              placeholder="Your company name (used in URL)"
              className="w-full px-4 py-2 border rounded-md"
              value={formData.companyName}
              onChange={e => {
                const rawValue = e.target.value;
                // Remove anything that's not A-Z, a-z, or 0-9
                const cleaned = rawValue.replace(/[^a-zA-Z0-9]/g, '');
                handleInputChange('companyName', cleaned);
              }}
            />


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-md"
                onChange={e => handleInputChange('contactName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-md"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border rounded-md"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotional Code</label>
              <input
                type="text"
                placeholder="Enter Promotional Code"
                className="w-full px-4 py-2 border rounded-md"
                value={promoCode}
                onChange={e => {
                  setPromoCode(e.target.value);
                  setPromoCodeError('');
                }}
              />
              {promoCodeError && (
                <div className="text-red-600 mt-1 text-sm">{promoCodeError}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={formData.category || ''}
                onChange={e => handleInputChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="Drone Manufacturer">Drone Manufacturer</option>
                <option value="Drone Service Provider">Drone Service Provider</option>
                <option value="Spare Parts Provider">Spare Parts Provider</option>
                <option value="Startup">Startup</option>
                <option value="AI Solutions">AI Solutions</option>
                <option value="GIS Solutions">GIS Solutions</option>
                <option value="Training Institute">Training Institute</option>
                <option value="Drone Pilot">Drone Pilot</option>
                <option value="Agritech">Agritech</option>
                <option value="Aerial Cinematography">Aerial Cinematography</option>
                <option value="Media & Events">Media & Events</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Government">Government</option>
                <option value="Academia/College">Academia/College</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        );

      case 2: // Header & Hero
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Header & Hero Section</h3>

            {/* Company Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload your company logo</p>

                {/* Loader & message UI */}
                {imageUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg className="animate-spin h-6 w-6 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] font-semibold">Uploading image...</span>
                  </div>
                )}
                {imageUploadMessage && (
                  <div className="text-green-600 font-semibold mt-2">{imageUploadMessage}</div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="company-logo-input"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageUploadLoading(true);            // Start loader
                      setImageUploadMessage('');              // Clear old messages
                      try {
                        // Upload to S3 and get the URL
                        const url = await uploadImageToS3(file);
                        setFormData((prev) => ({
                          ...prev,
                          companyLogo: url,
                        }));
                        setImageUploadMessage('Logo uploaded successfully!');
                      } catch (err) {
                        setImageUploadMessage('Image upload failed: ' + (err as Error).message);
                      } finally {
                        setImageUploadLoading(false);         // Stop loader
                      }
                    }
                  }}
                />
                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black"
                  onClick={() => document.getElementById('company-logo-input')?.click()}
                  type="button"
                >
                  Choose File
                </button>
                {formData.companyLogo && (
                  <img
                    src={formData.companyLogo}
                    alt="Logo Preview"
                    className="mx-auto mt-2 h-16"
                  />
                )}
              </div>
            </div>



            {/* Hero Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload your hero background image</p>

                {/* Loader & message UI */}
                {heroImageUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg className="animate-spin h-6 w-6 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] font-semibold">Uploading image...</span>
                  </div>
                )}
                {heroImageUploadMessage && (
                  <div className="text-green-600 font-semibold mt-2">{heroImageUploadMessage}</div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="hero-background-input"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setHeroImageUploadLoading(true);
                      setHeroImageUploadMessage('');
                      try {
                        const url = await uploadImageToS3(file);
                        setFormData((prev) => ({
                          ...prev,
                          heroBackground: url,
                        }));
                        setHeroImageUploadMessage('Hero background uploaded successfully!');
                      } catch (err) {
                        setHeroImageUploadMessage('Image upload failed: ' + (err as Error).message);
                      } finally {
                        setHeroImageUploadLoading(false);
                      }
                    }
                  }}
                />
                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black"
                  onClick={() => document.getElementById('hero-background-input')?.click()}
                  type="button"
                >
                  Choose File
                </button>
                {formData.heroBackground && (
                  <img
                    src={formData.heroBackground}
                    alt="Hero Background Preview"
                    className="mx-auto mt-2 h-32 w-full object-cover rounded"
                  />
                )}
              </div>
            </div>


            {/* Hero Headline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Headline</label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={e => handleInputChange('heroHeadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFD400] focus:border-transparent"
                placeholder="Advanced Drone Solutions"
              />
            </div>

            {/* Hero Subheadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subheadline</label>
              <textarea
                value={formData.heroSubheadline}
                onChange={e => handleInputChange('heroSubheadline', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFD400] focus:border-transparent"
                placeholder="Pioneering the future of aerial technology..."
              />
            </div>

            {/* CTA Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Text</label>
                <input
                  type="text"
                  value={formData.primaryCTA.text}
                  onChange={e => handleNestedInputChange('primaryCTA', 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFD400] focus:border-transparent"
                  placeholder="Explore Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Link</label>
                <input
                  type="text"
                  value={formData.primaryCTA.link}
                  onChange={e => handleNestedInputChange('primaryCTA', 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFD400] focus:border-transparent"
                  placeholder="#services"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Text</label>
                <input
                  type="text"
                  value={formData.secondaryCTA.text}
                  onChange={e => handleNestedInputChange('secondaryCTA', 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFD400] focus:border-transparent"
                  placeholder="Contact Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Link</label>
                <input
                  type="text"
                  value={formData.secondaryCTA.link}
                  onChange={e => handleNestedInputChange('secondaryCTA', 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFD400] focus:border-transparent"
                  placeholder="#contact"
                />
              </div>
            </div>
          </div>
        );

      case 3: // About Section
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">About Section</h3>

            {/* Section Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={e => handleInputChange('aboutTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="About DroneTech"
              />
            </div>

            {/* Section Description (first para) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Description (Company Summary)</label>
              <textarea
                value={formData.aboutDescription}
                onChange={e => handleInputChange('aboutDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="DroneTech is a pioneering company in the UAV industry, specializing in advanced drone solutions for various sectors..."
              />
            </div>

            {/* Section Description (team/experience para) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Description (Team/Experience)</label>
              <textarea
                value={formData.aboutTeamExperience}
                onChange={e => handleInputChange('aboutTeamExperience', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="With over 5 years of experience and a team of expert engineers, we deliver cutting-edge drone technology..."
              />
            </div>

            {/* About Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Section Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload about section image</p>

                {/* Loader & message UI */}
                {aboutImageUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg className="animate-spin h-6 w-6 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] font-semibold">Uploading image...</span>
                  </div>
                )}
                {aboutImageUploadMessage && (
                  <div className="text-green-600 font-semibold mt-2">{aboutImageUploadMessage}</div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="about-image-input"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAboutImageUploadLoading(true);
                      setAboutImageUploadMessage('');
                      try {
                        const url = await uploadImageToS3(file);
                        setFormData((prev) => ({
                          ...prev,
                          aboutImage: url,
                        }));
                        setAboutImageUploadMessage('About image uploaded successfully!');
                      } catch (err) {
                        setAboutImageUploadMessage('Image upload failed: ' + (err as Error).message);
                      } finally {
                        setAboutImageUploadLoading(false);
                      }
                    }
                  }}
                />
                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black"
                  onClick={() => document.getElementById('about-image-input')?.click()}
                  type="button"
                >
                  Choose File
                </button>
                {formData.aboutImage && (
                  <img
                    src={formData.aboutImage}
                    alt="About Preview"
                    className="mx-auto mt-2 h-16"
                  />
                )}
              </div>
            </div>



            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <input
                type="number"
                min={1}
                value={formData.aboutExperienceYears || 5}
                onChange={e => handleInputChange('aboutExperienceYears', parseInt(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="5"
              />
              <span className="ml-2 text-gray-600 text-sm">Years</span>
            </div>

            {/* Company Values */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Company Values (Mission, Vision, Values)</label>
                <button
                  onClick={() => addArrayItem('companyValues', { icon: 'target', title: '', description: '' })}
                  className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
                >
                  <Plus size={16} />
                  Add Value
                </button>
              </div>
              <div className="space-y-4">
                {formData.companyValues.map((value, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      {/* Icon selector */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <select
                          value={value.icon}
                          onChange={e => updateArrayItem('companyValues', index, { ...value, icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="target">🎯 Target (Mission)</option>
                          <option value="eye">👁️ Eye (Vision)</option>
                          <option value="award">🏆 Award (Values)</option>
                        </select>
                      </div>
                      {/* Value title */}
                      <input
                        type="text"
                        value={value.title}
                        onChange={e => updateArrayItem('companyValues', index, { ...value, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g. Mission"
                      />
                      {/* Delete button */}
                      <button
                        onClick={() => removeArrayItem('companyValues', index)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-6"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* Value description */}
                    <textarea
                      value={value.description}
                      onChange={e => updateArrayItem('companyValues', index, { ...value, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Describe this value..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Services
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Services Section</h3>
              <button
                onClick={() =>
                  addArrayItem('services', {
                    icon: 'camera',
                    title: '',
                    description: ''
                  })
                }
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Service
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.servicesTitle}
                onChange={e => handleInputChange('servicesTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Our Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
              <textarea
                value={formData.servicesDescription || ''}
                onChange={e => handleInputChange('servicesDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Comprehensive drone solutions tailored to meet the unique needs of various industries and applications."
              />
            </div>

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-4 gap-4 items-end">
                    {/* Icon Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <select
                        value={service.icon}
                        onChange={e =>
                          updateArrayItem('services', index, {
                            ...service,
                            icon: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      >
                        <option value="camera">Camera (Aerial Surveying)</option>
                        <option value="zap">Zap (Agricultural Monitoring)</option>
                        <option value="shield">Shield (Security & Surveillance)</option>
                        <option value="settings">Settings (Custom UAV Solutions)</option>
                      </select>
                    </div>
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={e =>
                          updateArrayItem('services', index, {
                            ...service,
                            title: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="e.g. Aerial Surveying"
                      />
                    </div>
                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={service.description}
                        onChange={e =>
                          updateArrayItem('services', index, {
                            ...service,
                            description: e.target.value
                          })
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="Describe the service..."
                      />
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeArrayItem('services', index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-8"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Products
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Products Section</h3>
              <button
                onClick={() => addArrayItem('products', { image: '', title: '', description: '', link: '' })}
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.productsTitle}
                onChange={(e) => handleInputChange('productsTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Categories (comma-separated)</label>
              <input
                type="text"
                value={formData.productCategories}
                onChange={(e) => handleInputChange('productCategories', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="All, Surveillance, Agriculture, Custom"
              />
            </div>

            <div className="space-y-6">
              {formData.products.map((product, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">Upload product image</p>

                        {/* Loader & message UI */}
                        {productImageUploadLoading[index] && (
                          <div className="flex items-center justify-center mt-2">
                            <svg className="animate-spin h-6 w-6 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <span className="ml-2 text-[#FFD400] font-semibold">Uploading image...</span>
                          </div>
                        )}
                        {productImageUploadMessage[index] && (
                          <div className="text-green-600 font-semibold mt-2">{productImageUploadMessage[index]}</div>
                        )}

                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          id={`product-image-input-${index}`}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setProductImageUploadLoading((prev) => ({ ...prev, [index]: true }));
                              setProductImageUploadMessage((prev) => ({ ...prev, [index]: '' }));
                              try {
                                const url = await uploadImageToS3(file);
                                updateArrayItem('products', index, { ...product, image: url });
                                setProductImageUploadMessage((prev) => ({ ...prev, [index]: 'Product image uploaded successfully!' }));
                              } catch (err) {
                                setProductImageUploadMessage((prev) => ({ ...prev, [index]: 'Image upload failed: ' + (err as Error).message }));
                              } finally {
                                setProductImageUploadLoading((prev) => ({ ...prev, [index]: false }));
                              }
                            }
                          }}
                        />
                        <button
                          className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black"
                          onClick={() => document.getElementById(`product-image-input-${index}`)?.click()}
                          type="button"
                        >
                          Choose File
                        </button>
                        {product.image && (
                          <img
                            src={product.image}
                            alt="Product Preview"
                            className="mx-auto mt-2 h-16"
                          />
                        )}
                      </div>
                    </div>


                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={product.title}
                          onChange={(e) => updateArrayItem('products', index, { ...product, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                        <input
                          type="text"
                          value={product.link}
                          onChange={(e) => updateArrayItem('products', index, { ...product, link: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Product link"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={product.description}
                      onChange={(e) => updateArrayItem('products', index, { ...product, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="Product description..."
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('products', index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Product
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Clients & Testimonials
        return (
          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-black mb-6">Clients & Testimonials</h3>

            {/* Clients Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Clients</label>
                <button
                  onClick={() => addArrayItem('clients', { name: '', logo: '', industry: '' })}
                  className="bg-[#FFD400] text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FFD400]/90"
                >
                  <Plus size={16} />
                  Add Client
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(formData.clients || []).map((client, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Logo</label>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {client.logo ? (
                            <img src={client.logo} alt="Client Logo" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No Logo</span>
                          )}
                        </div>
                        {/* Loader & Message */}
                        {clientLogoUploadLoading[idx] && (
                          <div className="flex items-center ml-2">
                            <svg className="animate-spin h-5 w-5 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          </div>
                        )}
                        {clientLogoUploadMessage[idx] && (
                          <span className="text-green-600 text-xs ml-2">{clientLogoUploadMessage[idx]}</span>
                        )}
                        <button
                          className="bg-[#FFD400] text-black px-2 py-1 text-xs rounded"
                          type="button"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = async (e: any) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setClientLogoUploadLoading((prev) => ({ ...prev, [idx]: true }));
                                setClientLogoUploadMessage((prev) => ({ ...prev, [idx]: '' }));
                                try {
                                  const url = await uploadImageToS3(file);
                                  updateArrayItem('clients', idx, { ...client, logo: url });
                                  setClientLogoUploadMessage((prev) => ({ ...prev, [idx]: 'Logo uploaded!' }));
                                } catch (err) {
                                  setClientLogoUploadMessage((prev) => ({ ...prev, [idx]: 'Upload failed: ' + (err as Error).message }));
                                } finally {
                                  setClientLogoUploadLoading((prev) => ({ ...prev, [idx]: false }));
                                }
                              }
                            };
                            input.click();
                          }}
                        >
                          Upload
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                          onClick={() => removeArrayItem('clients', idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Client Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={client.name}
                        onChange={e => updateArrayItem('clients', idx, { ...client, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Company Name"
                      />
                    </div>
                    {/* Client Industry */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                      <input
                        type="text"
                        value={client.industry}
                        onChange={e => updateArrayItem('clients', idx, { ...client, industry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. Technology, Agriculture"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Testimonials</label>
                <button
                  onClick={() => addArrayItem('testimonials', { name: '', role: '', quote: '', photo: '', rating: 5 })}
                  className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
                >
                  <Plus size={16} />
                  Add Testimonial
                </button>
              </div>

              <div className="space-y-6">
                {formData.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client Photo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm">Upload client photo</p>

                          {/* Loader & message UI */}
                          {testimonialPhotoUploadLoading[index] && (
                            <div className="flex items-center justify-center mt-2">
                              <svg className="animate-spin h-6 w-6 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                              <span className="ml-2 text-[#FFD400] font-semibold">Uploading image...</span>
                            </div>
                          )}
                          {testimonialPhotoUploadMessage[index] && (
                            <div className="text-green-600 font-semibold mt-2">{testimonialPhotoUploadMessage[index]}</div>
                          )}

                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            id={`testimonial-photo-input-${index}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setTestimonialPhotoUploadLoading((prev) => ({ ...prev, [index]: true }));
                                setTestimonialPhotoUploadMessage((prev) => ({ ...prev, [index]: '' }));
                                try {
                                  const url = await uploadImageToS3(file);
                                  updateArrayItem('testimonials', index, { ...testimonial, photo: url });
                                  setTestimonialPhotoUploadMessage((prev) => ({ ...prev, [index]: 'Client photo uploaded successfully!' }));
                                } catch (err) {
                                  setTestimonialPhotoUploadMessage((prev) => ({ ...prev, [index]: 'Image upload failed: ' + (err as Error).message }));
                                } finally {
                                  setTestimonialPhotoUploadLoading((prev) => ({ ...prev, [index]: false }));
                                }
                              }
                            }}
                          />
                          <button
                            className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black"
                            onClick={() => document.getElementById(`testimonial-photo-input-${index}`)?.click()}
                            type="button"
                          >
                            Choose File
                          </button>
                          {testimonial.photo && (
                            <img
                              src={testimonial.photo}
                              alt="Client Photo Preview"
                              className="mx-auto mt-2 h-16"
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                          <input
                            type="text"
                            value={testimonial.role}
                            onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                            placeholder="CEO, Company Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => updateArrayItem('testimonials', index, { ...testimonial, rating: star })}
                                className={`${star <= testimonial.rating ? 'text-[#FFD400]' : 'text-gray-300'}`}
                              >
                                <Star size={20} fill="currentColor" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                      <textarea
                        value={testimonial.quote}
                        onChange={(e) => updateArrayItem('testimonials', index, { ...testimonial, quote: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="What did they say about your company?"
                      />
                    </div>
                    <button
                      onClick={() => removeArrayItem('testimonials', index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                      Remove Testimonial
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 7: // Contact
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Contact Section</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.contactTitle}
                onChange={(e) => handleInputChange('contactTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line</label>
                <input
                  type="text"
                  value={formData.addressLine}
                  onChange={e => handleInputChange('addressLine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Hyderabad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Telangana"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={e => handleInputChange('pinCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="500001"
                />
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
              <input
                type="url"
                value={formData.mapEmbedUrl}
                onChange={(e) => handleInputChange('mapEmbedUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="https://maps.google.com/embed?..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Form Text</label>
              <textarea
                value={formData.contactFormText}
                onChange={(e) => handleInputChange('contactFormText', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
              <input
                type="text"
                value={formData.submitButtonText}
                onChange={(e) => handleInputChange('submitButtonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 8: // Footer
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-black mb-6">Footer Section</h3>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload your footer logo</p>

                {/* Loader & message UI */}
                {footerLogoUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg className="animate-spin h-6 w-6 text-[#FFD400]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FFD400" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="#FFD400" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] font-semibold">Uploading image...</span>
                  </div>
                )}
                {footerLogoUploadMessage && (
                  <div className="text-green-600 font-semibold mt-2">{footerLogoUploadMessage}</div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="footer-logo-input"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFooterLogoUploadLoading(true);
                      setFooterLogoUploadMessage('');
                      try {
                        // Upload to S3 and get the URL
                        const url = await uploadImageToS3(file);
                        setFormData((prev) => ({
                          ...prev,
                          footerLogo: url,
                        }));
                        setFooterLogoUploadMessage('Footer logo uploaded successfully!');
                      } catch (err) {
                        setFooterLogoUploadMessage('Image upload failed: ' + (err as Error).message);
                      } finally {
                        setFooterLogoUploadLoading(false);
                      }
                    }
                  }}
                />
                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black"
                  onClick={() => document.getElementById('footer-logo-input')?.click()}
                  type="button"
                >
                  Choose File
                </button>
                {formData.footerLogo && (
                  <img
                    src={formData.footerLogo}
                    alt="Footer Logo Preview"
                    className="mx-auto mt-2 h-16"
                  />
                )}
              </div>
            </div>



            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Description</label>
              <textarea
                value={formData.footerDescription || ''}
                onChange={e => handleInputChange('footerDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Short company description for the footer..."
              />
            </div>

            {/* Footer Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
              <input
                type="text"
                value={formData.footerText || ''}
                onChange={e => handleInputChange('footerText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.footerEmail || ''}
                  onChange={e => handleInputChange('footerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="info@dronetech.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.footerPhone || ''}
                  onChange={e => handleInputChange('footerPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contact Address</label>
                <input
                  type="text"
                  value={formData.footerAddress || ''}
                  onChange={e => handleInputChange('footerAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="Bangalore, Karnataka"
                />
              </div>
            </div>

            {/* Footer Navigation Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Navigation Links</label>
              <div className="space-y-2">
                {formData.footerNavLinks?.map((item, idx) => (
                  <div className="flex gap-2" key={idx}>
                    <input
                      type="text"
                      value={item.label}
                      onChange={e => updateArrayItem('footerNavLinks', idx, { ...item, label: e.target.value })}
                      placeholder="Label"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={item.link}
                      onChange={e => updateArrayItem('footerNavLinks', idx, { ...item, link: e.target.value })}
                      placeholder="#section"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('footerNavLinks', idx)}
                      className="text-red-500 font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('footerNavLinks', { label: '', link: '' })}
                  className="text-[#FF0000] mt-2 px-2 py-1 rounded border border-[#FF0000]"
                >
                  + Add Link
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'youtube', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.socialLinks.website || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">WhatsApp</label>
                  <input
                    type="url"
                    value={formData.socialLinks.whatsapp || ''}
                    onChange={e => handleNestedInputChange('socialLinks', 'whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://wa.me/..."
                  />
                </div>
              </div>
            </div>

            {/* Newsletter Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={!!formData.newsletterEnabled}
                onChange={e => handleInputChange('newsletterEnabled', e.target.checked)}
                id="newsletterEnabled"
                className="w-5 h-5 border-gray-400 rounded focus:ring-2 focus:ring-[#FF0000]"
              />
              <label htmlFor="newsletterEnabled" className="text-gray-700 text-sm font-medium">
                Enable Newsletter Signup in Footer
              </label>
            </div>

            {formData.newsletterEnabled && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Newsletter Description</label>
                <input
                  type="text"
                  value={formData.newsletterDescription || ''}
                  onChange={e => handleInputChange('newsletterDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Subscribe to our newsletter for the latest drone technology updates."
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              Drone<span className="text-[#FFD400]">TV</span>
            </div>
            <nav>
              <span className="text-white">Company Form Builder</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#FF0000] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Step Navigation */}
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-6">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index + 1)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currentStep === index + 1
                      ? 'bg-[#FF0000] text-white'
                      : currentStep > index + 1
                        ? 'bg-[#FFD400] text-black'
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={() => {
                    const enteredCode = promoCode.trim().toLowerCase();
                    const validCodes = ['mumbai2025', 'dronetv2025', 'dtea2025','pranay2025'];

                    if (currentStep === 1 && !validCodes.includes(enteredCode)) {
                      setPromoCodeError('Please enter a valid promotional code to proceed.');
                      return;
                    }

                    setPromoCodeError(''); // clear error if valid
                    setCurrentStep(Math.min(steps.length, currentStep + 1));
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF0000]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight size={20} />
                </button>

              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-[#FFD400] text-black rounded-lg font-semibold hover:bg-[#FFD400]/90 transition-colors"
                >
                  <Save size={20} />
                  Create Company Page
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCompany;