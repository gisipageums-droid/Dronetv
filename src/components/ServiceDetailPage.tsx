import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Star, Plane, Clock, Tag, CheckCircle, Activity, Layers, ShieldCheck } from "lucide-react";
import LoadingScreen from "./loadingscreen";


type ServiceFeature = {
  icon?: React.ReactNode;
  text: string;
};

type ServiceAPIItem = {
  image?: string;
  features?: string[];
  benefits?: string[];
  process?: string[];
  detailedDescription?: string;
  description?: string;
  timeline?: string;
  title?: string;
  category?: string;
  pricing?: string;
};

type Service = {
  id: string;
  name: string;
  shortDescription: string;
  price: string; // Service pricing might be a string like "Contact for pricing"
  rating: number;
  reviewCount: number;
  images: string[];
  features: ServiceFeature[];
  benefits: string[];
  process: string[];
  detailedDescription: string;
  timeline: string;
  category: string;
};

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [template, setTemplate] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"features" | "benefits" | "process">("features");


  const params = useParams()

  console.log("params", params.id)
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Using the same API structure as ProductDetailPage but for services
    // The user provided ID is likely the publishedId
    const API_URL = `https://f8wb4qay22.execute-api.ap-south-1.amazonaws.com/frontend-services-or-product/services/details/${id}`;

    axios
      .get(API_URL)
      .then((res) => {
        const responseData = res.data;
        if (!responseData?.status || !responseData?.data) {
          setError("Invalid response format from API");
          return;
        }

        const apiData = responseData.data;
        console.log("apiData", apiData.template)

        // Extract company name
        setCompanyName(apiData?.companyName || "");
        setTemplate(apiData?.template || "");

        // Access nested services array
        const serviceArray: ServiceAPIItem[] =
          apiData?.services?.services && apiData.services.services.length > 0
            ? apiData.services.services
            : [];

        if (!serviceArray.length) {
          setError("No service found in API response");
          return;
        }

        const s = serviceArray[0];

        const mapped: Service = {
          id: id ?? "unknown",
          name: s.title ?? "Untitled Service",
          shortDescription: s.description ?? "No description available",
          price: s.pricing?.trim() ? s.pricing : "Contact for pricing",
          rating: 4.8, // Default rating for services
          reviewCount: 85, // Default review count
          images: s.image ? [s.image] : ["/images/service-placeholder.jpg"],
          features: (s.features || []).map((f) => ({ icon: <Activity className="w-4 h-4" />, text: f })),
          benefits: s.benefits || [],
          process: s.process || [],
          detailedDescription: s.detailedDescription ?? s.description ?? "",
          timeline: s.timeline?.trim() ? s.timeline : "Flexible",
          category: s.category ?? "General",
        };

        setService(mapped);
      })
      .catch((err) => {
        console.error("API Error", err);
        setError("Failed to fetch service details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen logoSrc="images/logo.png" loadingText="Loading service..." />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-400 p-6">
        <div className="bg-white rounded-2xl p-8 shadow-md w-full max-w-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-3 bg-black text-white rounded-lg font-semibold">
            Try again
          </button>
        </div>
      </div>
    );

  if (!service)
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p className="text-lg font-semibold">Service not found.</p>
      </div>
    );

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}`} />
    ));

  return (
    <div className="pt-16 min-h-screen bg-yellow-400 border-[black]">

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-start">
          {/* LEFT: Images */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div
                className="relative w-full cursor-zoom-in bg-white"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleImageHover}
              >
                <img src={service.images[selectedImage]} alt={service.name} className="object-contain w-full h-full transition-transform duration-300" />

                {showZoom && (
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity"
                    style={{
                      backgroundImage: `url(${service.images[selectedImage]})`,
                      backgroundSize: "200%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      opacity: 1,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Thumbnails (Only if more than 1 image) */}
            {service.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {service.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-black shadow-lg" : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img src={img} alt={`${service.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-extrabold text-black">{service.name}</h1>
                  {companyName && (
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      <span className="text-black">{companyName}</span>
                    </p>
                  )}
                  <p className="mt-2 text-gray-600 text-justify">{service.shortDescription}</p>
                </div>
              </div>


            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="border-b">
                <nav className="flex overflow-x-auto" aria-label="Service tabs">
                  <button
                    onClick={() => setActiveTab("features")}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${activeTab === "features" ? "text-black bg-yellow-50 border-b-2 border-black" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Key Features
                  </button>
                  <button
                    onClick={() => setActiveTab("benefits")}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${activeTab === "benefits" ? "text-black bg-yellow-50 border-b-2 border-black" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab("process")}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${activeTab === "process" ? "text-black bg-yellow-50 border-b-2 border-black" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Process
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "features" && (
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="text-2xl font-bold text-black mb-4">Key Features</h3>
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex gap-3 items-start p-3 bg-yellow-50 rounded-xl">
                          <div className="mt-1 text-black/80">{f.icon}</div>
                          <div className="text-gray-700">{f.text}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="text-2xl font-bold text-black mb-4">Benefits</h3>
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {service.benefits.map((b, i) => (
                        <li key={i} className="flex gap-3 items-start p-3 bg-yellow-50 rounded-xl">
                          <div className="mt-1 text-green-600"><CheckCircle className="w-5 h-5" /></div>
                          <div className="text-gray-700">{b}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "process" && (
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="text-2xl font-bold text-black mb-4">Our Process</h3>
                    <div className="space-y-1">
                      {service.process.map((p, i) => (
                        <div key={i} className="flex gap-4 items-center p-3 bg-yellow-50 rounded-xl">
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full font-bold">
                            {i + 1}
                          </div>
                          <div className="text-gray-700 font-medium">{p}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="p-4 rounded-2xl shadow shadow-black mt-[5px] bg-white">
          <h4 className="font-semibold mb-3">Description</h4>
          <ul className="grid grid-cols-1 text-justify">
            <li>{service.detailedDescription}</li>
          </ul>
        </div>
        <div className="mt-8 flex justify-center">


          <Link to={template === "template-1" ? `/company/${companyName}` : `/companies/${companyName}`}>
            <button className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-lg hover:bg-[#2a2a2a] transition-all duration-200 shadow-md">
              Contact us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
