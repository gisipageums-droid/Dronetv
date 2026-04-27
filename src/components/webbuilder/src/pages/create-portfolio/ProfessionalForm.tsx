import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  Plus,
  Trash2,
  Star,
  // Calendar,
  // Clock,
  // MapPin,
} from "lucide-react";
import AIInputField from "./Component/AllInputField";
// import { uploadImageToS3 } from "./src/utils/s3Upload";

interface ImageWithPreview {
  preview: string;
  file: File;
}

interface FormData {
  // Template Selection
  selectedTemplate: string;

  // General Settings
  logo?: ImageWithPreview;
  primaryColor: string;
  textColor: string;
  accentColor: string;

  // Hero Section
  fullName: string;
  rotatingTitles: string;
  tagline: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  heroBackground?: ImageWithPreview;

  // About Me
  profilePicture?: ImageWithPreview;
  bio: string;
  email: string;
  phone: string;
  location: string;
  signature?: ImageWithPreview;

  // Skills
  skills: Array<{
    category: string;
    name: string;
    proficiency: number;
  }>;

  // Services
  services: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  // Portfolio
  projects: Array<{
    image?: ImageWithPreview;
    title: string;
    category: string;
    description: string;
  }>;

  // Testimonials
  testimonials: Array<{
    name: string;
    role: string;
    photo?: ImageWithPreview;
    rating: number;
    quote: string;
  }>;

  // Blog
  blogPosts: Array<{
    title: string;
    image?: ImageWithPreview;
    excerpt: string;
    url: string;
  }>;

  // Contact
  socialLinks: {
    instagram: string;
    linkedin: string;
    github: string;
    whatsapp: string;
  };
  contactMessage: string;
  mapUrl: string;

  // Footer
  footerText: string;
  footerLogo?: ImageWithPreview;
}

const ProfessionalForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Image upload states
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [logoUploadMessage, setLogoUploadMessage] = useState("");

  const [heroBgUploadLoading, setHeroBgUploadLoading] = useState(false);
  const [heroBgUploadMessage, setHeroBgUploadMessage] = useState("");

  const [profilePicUploadLoading, setProfilePicUploadLoading] = useState(false);
  const [profilePicUploadMessage, setProfilePicUploadMessage] = useState("");

  const [projectImageUploadLoading, setProjectImageUploadLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [projectImageUploadMessage, setProjectImageUploadMessage] = useState<{
    [key: number]: string;
  }>({});

  const [testimonialPhotoUploadLoading, setTestimonialPhotoUploadLoading] =
    useState<Record<number, boolean>>({});
  const [testimonialPhotoUploadMessage, setTestimonialPhotoUploadMessage] =
    useState<Record<number, string>>({});

  const [blogImageUploadLoading, setBlogImageUploadLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [blogImageUploadMessage, setBlogImageUploadMessage] = useState<{
    [key: number]: string;
  }>({});

  const [footerLogoUploadLoading, setFooterLogoUploadLoading] = useState(false);
  const [footerLogoUploadMessage, setFooterLogoUploadMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    selectedTemplate: "",

    logo: undefined,
    primaryColor: "#FFD400",
    textColor: "#000000",
    accentColor: "#FF0000",

    fullName: "",
    rotatingTitles: "",
    tagline: "",
    button1Text: "Hire Me",
    button1Link: "#contact",
    button2Text: "Download CV",
    button2Link: "#",
    heroBackground: undefined,

    profilePicture: undefined,
    bio: "",
    email: "",
    phone: "",
    location: "",
    signature: undefined,

    skills: [],
    services: [],
    projects: [],
    testimonials: [],
    blogPosts: [],

    socialLinks: {
      instagram: "",
      linkedin: "",
      github: "",
      whatsapp: "",
    },
    contactMessage: "",
    mapUrl: "",

    footerText: "",
    footerLogo: undefined,
  });

  const steps = [
    "Select Template",
    "General Settings",
    "Hero Section",
    "About Me",
    "Skills",
    "Services",
    "Portfolio",
    "Testimonials",
    "Blog",
    "Contact",
    "Footer",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    section: keyof FormData,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as Record<string, any>) ?? {}),
        [field]: value,
      },
    }));
  };

  const addArrayItem = (field: string, item: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof FormData] as any[]), item],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as any[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateArrayItem = (field: string, index: number, updatedItem: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as any[]).map((item, i) =>
        i === index ? updatedItem : item
      ),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let portfolioId: string | null = null;

      // ✅ Step 1: Create portfolio without images
      const textOnlyData = JSON.parse(
        JSON.stringify(formData, (key, value) => {
          if (typeof value === "string" && value.startsWith("data:image"))
            return null;
          return value;
        })
      );

      const initRes = await fetch(
        "https://ginc7xsgw8.execute-api.ap-south-1.amazonaws.com/portfolio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(textOnlyData),
        }
      );

      const initData = await initRes.json();
      if (!initRes.ok || !initData.id)
        throw new Error("Failed to create portfolio");

      portfolioId = initData.id;
      console.log("✅ Created portfolio with ID:", portfolioId);

      // ✅ Step 2: Parallel image uploads
      const uploadPromises: Promise<void>[] = [];

      const uploadImageField = async (fieldName: string, imageObj: any) => {
        let imageBase64: string | null = null;

        if (imageObj?.preview?.startsWith("data:image")) {
          imageBase64 = imageObj.preview;
        } else if (imageObj?.file instanceof File) {
          imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageObj.file);
          });
        } else if (
          typeof imageObj === "string" &&
          imageObj.startsWith("data:image")
        ) {
          imageBase64 = imageObj;
        }

        if (!imageBase64) return;

        const imgPayload = { id: portfolioId, [fieldName]: imageBase64 };
        const res = await fetch(
          "https://ginc7xsgw8.execute-api.ap-south-1.amazonaws.com/portfolio",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(imgPayload),
          }
        );

        const data = await res.json();
        if (!res.ok) console.error(`❌ Failed to upload ${fieldName}`, data);
        else console.log(`✅ Uploaded ${fieldName}`, data);
      };

      // Queue uploads
      uploadPromises.push(uploadImageField("logo", formData.logo));
      uploadPromises.push(
        uploadImageField("heroBackground", formData.heroBackground)
      );
      uploadPromises.push(
        uploadImageField("profilePicture", formData.profilePicture)
      );
      uploadPromises.push(uploadImageField("signature", formData.signature));
      uploadPromises.push(uploadImageField("footerLogo", formData.footerLogo));

      formData.projects.forEach((proj, i) =>
        uploadPromises.push(
          uploadImageField(`projects[${i}].image`, proj.image)
        )
      );
      formData.testimonials.forEach((test, i) =>
        uploadPromises.push(
          uploadImageField(`testimonials[${i}].photo`, test.photo)
        )
      );
      formData.blogPosts.forEach((blog, i) =>
        uploadPromises.push(
          uploadImageField(`blogPosts[${i}].image`, blog.image)
        )
      );

      await Promise.all(uploadPromises);

      console.log("🎯 All images uploaded for portfolio ID:", portfolioId);
      navigate("/professionals");
    } catch (err) {
      console.error("❌ handleSubmit error:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const templates = [
    {
      id: "1",
      name: "Template 1",
      description:
        "Modern and clean design with yellow hero section and professional layout",
      image:
        "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600",
      features: [
        "Yellow Hero Section",
        "Grid Portfolio",
        "Testimonials Carousel",
        "Contact Form",
      ],
      previewUrl: "/portfolio-template-1",
    },
    {
      id: "2",
      name: "Template 2",
      description:
        "Split-screen layout with timeline skills and masonry portfolio grid",
      image:
        "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      features: [
        "Split Hero Layout",
        "Timeline Skills",
        "Masonry Portfolio",
        "Blog Section",
      ],
      previewUrl: "/portfolio-template-2",
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-black mb-8 text-center">
              Choose Your Portfolio Template
            </h3>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                    formData.selectedTemplate === template.id
                      ? "border-[#FF0000] shadow-2xl transform scale-105"
                      : "border-gray-200 hover:border-[#FFD400]"
                  }`}
                >
                  <div className="bg-white p-6">
                    <div
                      onClick={() =>
                        handleInputChange("selectedTemplate", template.id)
                      }
                      className="h-48 rounded-lg mb-4 flex items-center justify-center border overflow-hidden cursor-pointer"
                    >
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="text-xl font-bold text-black mb-2">
                      {template.name}
                    </h4>
                    <p className="text-gray-600 mb-4">{template.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      {template.features.map((feature, index) => (
                        <div key={index}>• {feature}</div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() =>
                          handleInputChange("selectedTemplate", template.id)
                        }
                        className="bg-[#FFD400] text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
                      >
                        Select
                      </button>

                      <a
                        href={`/company/portfolio/template-${template.id}/258964443767`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // General Settings
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">
              General Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Upload
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">Upload your logo</p>

                {logoUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg
                      className="animate-spin h-5 w-5 text-[#FFD400]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#FFD400"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="#FFD400"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                      Uploading...
                    </span>
                  </div>
                )}

                {logoUploadMessage && (
                  <div
                    className={`mt-2 text-sm font-semibold ${
                      logoUploadMessage.includes("failed")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {logoUploadMessage}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="logo-upload-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setLogoUploadLoading(true);
                    setLogoUploadMessage("");

                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setFormData((prev) => ({
                        ...prev,
                        logo: {
                          preview: event.target?.result as string, // ✅ Base64 preview
                          file: file, // ✅ Actual File
                        },
                      }));
                      setLogoUploadMessage(
                        "Preview loaded. Final image will be uploaded on form submit."
                      );
                      setLogoUploadLoading(false);
                    };
                    reader.onerror = () => {
                      setLogoUploadMessage("Image preview failed");
                      setLogoUploadLoading(false);
                    };

                    reader.readAsDataURL(file);
                  }}
                />

                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                  onClick={() =>
                    document.getElementById("logo-upload-input")?.click()
                  }
                  type="button"
                >
                  Choose File
                </button>

                {/* Image Preview */}
                {formData.logo?.preview && (
                  <div className="mt-3">
                    <img
                      src={formData.logo.preview}
                      alt="Logo Preview"
                      className="mx-auto max-h-32 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      handleInputChange("primaryColor", e.target.value)
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      handleInputChange("primaryColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) =>
                      handleInputChange("textColor", e.target.value)
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) =>
                      handleInputChange("textColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) =>
                      handleInputChange("accentColor", e.target.value)
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) =>
                      handleInputChange("accentColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Hero Section
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Hero Section</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotating Titles (comma-separated)
              </label>
              <input
                type="text"
                value={formData.rotatingTitles}
                onChange={(e) =>
                  handleInputChange("rotatingTitles", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Drone Pilot, UAV Engineer, Content Creator"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline/Subtext
              </label>
              <textarea
                value={formData.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Capturing the world from above with cutting-edge drone technology"
              />
            </div> */}

            <AIInputField
              label="Tagline/Subtext"
              placeholder="Capturing the world from above with cutting-edge drone technology"
              promptPrefix="Write a compelling and concise tagline for this description:"
              multiline
              rows={3}
              inputClassName="w-[45vw] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              onChange={(value) => handleInputChange("tagline", value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Background Image
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">
                  Upload hero background image
                </p>

                {heroBgUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg
                      className="animate-spin h-5 w-5 text-[#FFD400]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#FFD400"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="#FFD400"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                      Uploading...
                    </span>
                  </div>
                )}

                {heroBgUploadMessage && (
                  <div
                    className={`mt-2 text-sm font-semibold ${
                      heroBgUploadMessage.includes("failed")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {heroBgUploadMessage}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="hero-bg-upload-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setHeroBgUploadLoading(true);
                    setHeroBgUploadMessage("");

                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleInputChange("heroBackground", {
                        preview: event.target?.result as string, // base64
                        file, // original file for later S3 upload
                      });
                      setHeroBgUploadMessage(
                        "Preview loaded. Final image will be uploaded on form submit."
                      );
                      setHeroBgUploadLoading(false);
                    };
                    reader.onerror = () => {
                      setHeroBgUploadMessage("Image preview failed");
                      setHeroBgUploadLoading(false);
                    };

                    reader.readAsDataURL(file);
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("hero-bg-upload-input")?.click()
                  }
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                >
                  Choose File
                </button>

                {/* Preview */}
                {formData.heroBackground?.preview && (
                  <div className="mt-3">
                    <img
                      src={formData.heroBackground.preview}
                      alt="Hero Background"
                      className="mx-auto max-h-32 w-full max-w-lg object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={formData.button1Text}
                  onChange={(e) =>
                    handleInputChange("button1Text", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={formData.button1Link}
                  onChange={(e) =>
                    handleInputChange("button1Link", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={formData.button2Text}
                  onChange={(e) =>
                    handleInputChange("button2Text", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={formData.button2Link}
                  onChange={(e) =>
                    handleInputChange("button2Link", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4: // About Me
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">About Me</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">
                  Upload your profile picture
                </p>

                {profilePicUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg
                      className="animate-spin h-5 w-5 text-[#FFD400]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#FFD400"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="#FFD400"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                      Uploading...
                    </span>
                  </div>
                )}

                {profilePicUploadMessage && (
                  <div
                    className={`mt-2 text-sm font-semibold ${
                      profilePicUploadMessage.includes("failed")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {profilePicUploadMessage}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="profile-pic-upload-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setProfilePicUploadLoading(true);
                    setProfilePicUploadMessage("");

                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleInputChange("profilePicture", {
                        preview: event.target?.result as string, // base64 string
                        file, // original file for upload
                      });
                      setProfilePicUploadMessage(
                        "Preview loaded. Final image will be uploaded on form submit."
                      );
                      setProfilePicUploadLoading(false);
                    };
                    reader.onerror = () => {
                      setProfilePicUploadMessage("Image preview failed");
                      setProfilePicUploadLoading(false);
                    };

                    reader.readAsDataURL(file);
                  }}
                />

                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                  onClick={() =>
                    document.getElementById("profile-pic-upload-input")?.click()
                  }
                  type="button"
                >
                  Choose File
                </button>

                {/* Preview */}
                {formData.profilePicture?.preview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img
                      src={formData.profilePicture.preview}
                      alt="Profile Preview"
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio/Introduction
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Tell your story..."
              />
            </div> */}

            <AIInputField
              label="Bio/Introduction"
              placeholder="Tell your story..."
              promptPrefix="Write a professional, friendly introduction based on:"
              multiline
              rows={6}
              inputClassName="w-[45vw] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              onChange={(value) => handleInputChange("bio", value)}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="City, Country"
              />
            </div>
          </div>
        );

      case 5: // Skills
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Skills</h3>
              <button
                onClick={() =>
                  addArrayItem("skills", {
                    category: "Frontend",
                    name: "",
                    proficiency: 0,
                  })
                }
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Skill
              </button>
            </div>

            <div className="space-y-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={skill.category}
                        onChange={(e) =>
                          updateArrayItem("skills", index, {
                            ...skill,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Tools">Tools</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skill Name
                      </label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateArrayItem("skills", index, {
                            ...skill,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="React"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proficiency (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.proficiency}
                        onChange={(e) =>
                          updateArrayItem("skills", index, {
                            ...skill,
                            proficiency: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => removeArrayItem("skills", index)}
                      className="bg-red-500 text-white w-32 h-10 flex items-center justify-center rounded-md hover:bg-red-600"
                    >
                      Delete
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Services
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">
                Services Offered
              </h3>
              <button
                onClick={() =>
                  addArrayItem("services", {
                    icon: "camera",
                    title: "",
                    description: "",
                  })
                }
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Service
              </button>
            </div>

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    {/* Icon Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <select
                        value={service.icon}
                        onChange={(e) =>
                          updateArrayItem("services", index, {
                            ...service,
                            icon: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      >
                        <option value="camera">Camera</option>
                        <option value="video">Video</option>
                        <option value="code">Code</option>
                        <option value="palette">Palette</option>
                        <option value="settings">Settings</option>
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          updateArrayItem("services", index, {
                            ...service,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="Aerial Photography"
                      />
                    </div>

                    {/* AI Generated Description */}
                    {/* AI Generated Description */}
                    <div className="flex flex-col md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <AIInputField
                        placeholder="Service description..."
                        promptPrefix="Write a short and clear service description based on:"
                        multiline
                        rows={2}
                        value={service.description}
                        inputClassName="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        onChange={(value) =>
                          updateArrayItem("services", index, {
                            ...service,
                            description: value,
                          })
                        }
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="flex items-end">
                      <button
                        onClick={() => removeArrayItem("services", index)}
                        className="bg-red-500 text-white w-32 h-10 flex items-center justify-center rounded-md hover:bg-red-600"
                      >
                        Delete
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7: // Portfolio
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">
                Portfolio Projects
              </h3>
              <button
                onClick={() =>
                  addArrayItem("projects", {
                    image: "",
                    title: "",
                    category: "Web",
                    description: "",
                  })
                }
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            <div className="space-y-6">
              {formData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Image
                      </label>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload
                          size={32}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-gray-500 text-sm">
                          Upload project image
                        </p>

                        {projectImageUploadLoading[index] && (
                          <div className="flex items-center justify-center mt-2">
                            <svg
                              className="animate-spin h-5 w-5 text-[#FFD400]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#FFD400"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="#FFD400"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                            <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                              Uploading...
                            </span>
                          </div>
                        )}

                        {projectImageUploadMessage[index] && (
                          <div
                            className={`mt-2 text-sm font-semibold ${
                              projectImageUploadMessage[index].includes(
                                "failed"
                              )
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {projectImageUploadMessage[index]}
                          </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          id={`project-image-upload-input-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setProjectImageUploadLoading((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setProjectImageUploadMessage((prev) => ({
                              ...prev,
                              [index]: "",
                            }));

                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const updatedProjects = [...formData.projects];
                              updatedProjects[index].image = {
                                preview: event.target?.result as string,
                                file: file,
                              };
                              handleInputChange("projects", updatedProjects);

                              setProjectImageUploadMessage((prev) => ({
                                ...prev,
                                [index]:
                                  "Preview loaded. Final image will be uploaded on form submit.",
                              }));
                              setProjectImageUploadLoading((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            };
                            reader.onerror = () => {
                              setProjectImageUploadMessage((prev) => ({
                                ...prev,
                                [index]: "Image preview failed",
                              }));
                              setProjectImageUploadLoading((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            };

                            reader.readAsDataURL(file);
                          }}
                        />

                        <button
                          className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                          onClick={() =>
                            document
                              .getElementById(
                                `project-image-upload-input-${index}`
                              )
                              ?.click()
                          }
                          type="button"
                        >
                          Choose File
                        </button>

                        {/* Image Preview */}
                        {project.image?.preview && (
                          <div className="mt-3">
                            <img
                              src={project.image.preview}
                              alt={`Project ${index + 1} Preview`}
                              className="mx-auto max-h-32 object-contain rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) =>
                            updateArrayItem("projects", index, {
                              ...project,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Project Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={project.category}
                          onChange={(e) =>
                            updateArrayItem("projects", index, {
                              ...project,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        >
                          <option value="Web">Web</option>
                          <option value="Drone">Drone</option>
                          <option value="Design">Design</option>
                          <option value="App">App</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <AIInputField
                    label="Description"
                    placeholder="Project description..."
                    promptPrefix="Write a short and clear project description based on:"
                    multiline
                    rows={3}
                    inputClassName="w-[45vw] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    onChange={(value) =>
                      updateArrayItem("projects", index, {
                        ...project,
                        description: value,
                      })
                    }
                  />

                  <button
                    onClick={() => removeArrayItem("projects", index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 8: // Testimonials
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Testimonials</h3>
              <button
                onClick={() =>
                  addArrayItem("testimonials", {
                    name: "",
                    role: "",
                    photo: "",
                    rating: 5,
                    quote: "",
                  })
                }
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Photo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload
                          size={32}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-gray-500 text-sm">
                          Upload client photo
                        </p>

                        {testimonialPhotoUploadLoading[index] && (
                          <div className="flex items-center justify-center mt-2">
                            <svg
                              className="animate-spin h-5 w-5 text-[#FFD400]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#FFD400"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="#FFD400"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                            <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                              Uploading...
                            </span>
                          </div>
                        )}

                        {testimonialPhotoUploadMessage[index] && (
                          <div
                            className={`mt-2 text-sm font-semibold ${
                              testimonialPhotoUploadMessage[index].includes(
                                "failed"
                              )
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {testimonialPhotoUploadMessage[index]}
                          </div>
                        )}

                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          id={`testimonial-photo-upload-input-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setTestimonialPhotoUploadLoading((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setTestimonialPhotoUploadMessage((prev) => ({
                              ...prev,
                              [index]: "",
                            }));

                            // Create preview
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const updatedTestimonials = [
                                ...formData.testimonials,
                              ];
                              updatedTestimonials[index] = {
                                ...updatedTestimonials[index],
                                photo: {
                                  preview: event.target?.result as string,
                                  file: file,
                                },
                              };
                              handleInputChange(
                                "testimonials",
                                updatedTestimonials
                              );

                              setTestimonialPhotoUploadMessage((prev) => ({
                                ...prev,
                                [index]:
                                  "Preview loaded. Photo will be uploaded when you submit the form.",
                              }));
                              setTestimonialPhotoUploadLoading((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            };
                            reader.onerror = () => {
                              setTestimonialPhotoUploadMessage((prev) => ({
                                ...prev,
                                [index]: "Preview failed",
                              }));
                              setTestimonialPhotoUploadLoading((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />

                        <button
                          className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                          onClick={() =>
                            document
                              .getElementById(
                                `testimonial-photo-upload-input-${index}`
                              )
                              ?.click()
                          }
                          type="button"
                        >
                          Choose File
                        </button>

                        {formData.testimonials[index]?.photo && (
                          <div className="mt-3">
                            <img
                              src={
                                typeof formData.testimonials[index].photo ===
                                "object"
                                  ? formData.testimonials[index].photo.preview
                                  : formData.testimonials[index].photo
                              }
                              alt={`Client ${index + 1}`}
                              className="mx-auto h-16 w-16 rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) =>
                            updateArrayItem("testimonials", index, {
                              ...testimonial,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={testimonial.role}
                          onChange={(e) =>
                            updateArrayItem("testimonials", index, {
                              ...testimonial,
                              role: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="CEO, Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                updateArrayItem("testimonials", index, {
                                  ...testimonial,
                                  rating: star,
                                })
                              }
                              className={`${
                                star <= testimonial.rating
                                  ? "text-[#FFD400]"
                                  : "text-gray-300"
                              }`}
                            >
                              <Star size={20} fill="currentColor" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quote
                    </label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) =>
                        updateArrayItem("testimonials", index, {
                          ...testimonial,
                          quote: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="What did they say about your work?"
                    />
                  </div> */}

                  <AIInputField
                    label="Quote"
                    placeholder="What did they say about your work?"
                    promptPrefix="Client feedback for a portfolio:"
                    multiline
                    rows={3}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    onChange={(value) =>
                      updateArrayItem("testimonials", index, {
                        ...testimonial,
                        quote: value,
                      })
                    }
                  />

                  <button
                    onClick={() => removeArrayItem("testimonials", index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Testimonial
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 9: // Blog
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">
                Blog Preview (Optional)
              </h3>
              <button
                onClick={() =>
                  addArrayItem("blogPosts", {
                    title: "",
                    image: "",
                    excerpt: "",
                    url: "",
                  })
                }
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Blog Post
              </button>
            </div>

            <div className="space-y-6">
              {formData.blogPosts.map((post, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload
                          size={32}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-gray-500 text-sm">
                          Upload blog image
                        </p>

                        {blogImageUploadLoading[index] && (
                          <div className="flex items-center justify-center mt-2">
                            <svg
                              className="animate-spin h-5 w-5 text-[#FFD400]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#FFD400"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="#FFD400"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                            <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                              Uploading...
                            </span>
                          </div>
                        )}

                        {blogImageUploadMessage[index] && (
                          <div
                            className={`mt-2 text-sm font-semibold ${
                              blogImageUploadMessage[index].includes("failed")
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {blogImageUploadMessage[index]}
                          </div>
                        )}

                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          id={`blog-photo-upload-input-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setBlogImageUploadLoading((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setBlogImageUploadMessage((prev) => ({
                              ...prev,
                              [index]: "",
                            }));

                            // Create preview
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const updatedBlogPosts = [...formData.blogPosts];
                              updatedBlogPosts[index] = {
                                ...updatedBlogPosts[index],
                                image: {
                                  preview: event.target?.result as string,
                                  file: file,
                                },
                              };
                              handleInputChange("blogPosts", updatedBlogPosts);

                              setBlogImageUploadMessage((prev) => ({
                                ...prev,
                                [index]:
                                  "Preview loaded. Image will be uploaded when you submit the form.",
                              }));
                              setBlogImageUploadLoading((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            };
                            reader.onerror = () => {
                              setBlogImageUploadMessage((prev) => ({
                                ...prev,
                                [index]: "Preview failed",
                              }));
                              setBlogImageUploadLoading((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />

                        <button
                          className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                          onClick={() =>
                            document
                              .getElementById(
                                `blog-photo-upload-input-${index}`
                              )
                              ?.click()
                          }
                          type="button"
                        >
                          Choose File
                        </button>

                        {formData.blogPosts[index]?.image && (
                          <div className="mt-3">
                            <img
                              src={
                                typeof formData.blogPosts[index].image ===
                                "object"
                                  ? formData.blogPosts[index].image.preview
                                  : formData.blogPosts[index].image
                              }
                              alt={`Blog ${index + 1}`}
                              className="mx-auto h-16 w-16 rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) =>
                            updateArrayItem("blogPosts", index, {
                              ...post,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Blog post title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blog URL
                        </label>
                        <input
                          type="url"
                          value={post.url}
                          onChange={(e) =>
                            updateArrayItem("blogPosts", index, {
                              ...post,
                              url: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="https://blog.example.com/post"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={post.excerpt}
                      onChange={(e) =>
                        updateArrayItem("blogPosts", index, {
                          ...post,
                          excerpt: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="Brief description of the blog post..."
                    />
                  </div> */}

                  <AIInputField
                    label="Excerpt"
                    placeholder="Brief description of the blog post..."
                    promptPrefix="Write a brief blog excerpt:"
                    multiline
                    rows={3}
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    onChange={(value) =>
                      updateArrayItem("blogPosts", index, {
                        ...post,
                        excerpt: value,
                      })
                    }
                  />

                  <button
                    onClick={() => removeArrayItem("blogPosts", index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Post
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 10: // Contact
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">
              Contact Section
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Message
              </label>
              <textarea
                value={formData.contactMessage}
                onChange={(e) =>
                  handleInputChange("contactMessage", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Available for freelance drone work and collaborations."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "instagram",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "linkedin",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "github",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.socialLinks.whatsapp}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "whatsapp",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed URL (Optional)
              </label>
              <input
                type="url"
                value={formData.mapUrl}
                onChange={(e) => handleInputChange("mapUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="https://maps.google.com/embed?..."
              />
            </div>
          </div>
        );

      case 11: // Footer
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Footer</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Text
              </label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) =>
                  handleInputChange("footerText", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="© 2024 Your Name. All rights reserved."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Logo (Optional)
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">
                  Upload footer logo or leave empty to use header logo
                </p>

                {footerLogoUploadLoading && (
                  <div className="flex items-center justify-center mt-2">
                    <svg
                      className="animate-spin h-5 w-5 text-[#FFD400]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#FFD400"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="#FFD400"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-[#FFD400] text-sm font-semibold">
                      Uploading...
                    </span>
                  </div>
                )}

                {footerLogoUploadMessage && (
                  <div
                    className={`mt-2 text-sm font-semibold ${
                      footerLogoUploadMessage.includes("failed")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {footerLogoUploadMessage}
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="footer-logo-upload-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setFooterLogoUploadLoading(true);
                    setFooterLogoUploadMessage("");

                    // Create preview
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      handleInputChange("footerLogo", {
                        preview: event.target?.result as string,
                        file, // Store the file object for later upload
                      });
                      setFooterLogoUploadMessage(
                        "Preview loaded. Logo will be uploaded when you submit the form."
                      );
                      setFooterLogoUploadLoading(false);
                    };
                    reader.onerror = () => {
                      setFooterLogoUploadMessage("Preview failed");
                      setFooterLogoUploadLoading(false);
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                <button
                  className="bg-[#FFD400] px-3 py-1 mt-2 rounded text-black text-sm"
                  onClick={() =>
                    document.getElementById("footer-logo-upload-input")?.click()
                  }
                  type="button"
                >
                  Choose File
                </button>

                {formData.footerLogo?.preview && (
                  <div className="mt-3">
                    <img
                      src={formData.footerLogo.preview}
                      alt="Footer Logo Preview"
                      className="mx-auto max-h-32 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            </div>
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
              <button
                onClick={() => navigate("/create-portfolio/professional")}
                className="flex items-center gap-2 text-white hover:text-[#FFD400] transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Templates
              </button>
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
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      currentStep === index + 1
                        ? "bg-[#FF0000] text-white"
                        : currentStep > index + 1
                        ? "bg-[#FFD400] text-black"
                        : "bg-gray-200 text-gray-600"
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
                  onClick={() =>
                    setCurrentStep(Math.min(steps.length, currentStep + 1))
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF0000]/90 transition-colors"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              ) : (
                <div className="flex flex-col items-end">
                  {submitError && (
                    <p className="text-red-500 mb-2">{submitError}</p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-[#FFD400] text-black rounded-lg font-semibold hover:bg-[#FFD400]/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      "Creating..."
                    ) : (
                      <>
                        <Save size={20} />
                        Create Portfolio
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalForm;
