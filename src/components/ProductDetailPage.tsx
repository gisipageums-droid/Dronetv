

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Star, Plane, Truck, ShieldCheck } from "lucide-react";
import LoadingScreen from "./loadingscreen";
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';
import { slugify } from '../lib/slugify';

type ProductFeature = {
  icon?: React.ReactNode;
  text: string;
};

type ProductAPIItem = {
  image?: string;
  features?: string[];
  detailedDescription?: string;
  description?: string;
  isPopular?: boolean;
  timeline?: string;
  title?: string;
  category?: string;
  pricing?: string;
};

type Product = {
  id: string;
  name: string;
  shortDescription: string;
  price: number | null;
  originalPrice: number | null;
  discount?: number | null;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  images: string[];
  features: ProductFeature[];
  specifications: Record<string, string>;
  description: string;
  detailedDescription?: string;
  shipping: { standard: string; express: string; free: string };
  warranty: string;
  category: string;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [template, setTemplate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"features" | "specifications">("features");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // id is a composite "<companyPublishedId>-<indexWithinCompanysProductArray>"
    // built by ProductsPage.tsx; split off the trailing numeric index so we
    // fetch by the real publishedId but still show the specific item clicked.
    const lastDash = id.lastIndexOf("-");
    const publishedId = lastDash >= 0 ? id.slice(0, lastDash) : id;
    const itemIndex = lastDash >= 0 ? parseInt(id.slice(lastDash + 1), 10) : 0;

    const API_URL = COMPANY_API ? `${COMPANY_API}/product/details/${publishedId}` : `${LAMBDA.products}/product/details/${publishedId}`;

    axios
      .get(API_URL)
      .then((res) => {
        const responseData = res.data;
        if (!responseData?.status || !responseData?.data) {
          setError("Invalid response format from API");
          return;
        }

        const apiData = responseData.data;

        // Extract company name
        setCompanyName(apiData?.companyName || "");
        setTemplate(apiData?.template || "");

        // Prefer products -> products array, fallback to services
        const productArray: ProductAPIItem[] =
          apiData?.products?.products && apiData.products.products.length > 0
            ? apiData.products.products
            : apiData?.services?.services && apiData.services.services.length > 0
              ? apiData.services.services
              : [];

        if (!productArray.length) {
          setError("No product or service found in API response");
          return;
        }

        const p = productArray[itemIndex] ?? productArray[0];

        const parsedPrice = (() => {
          const priceStr = p.pricing ?? "";
          const num = parseFloat((priceStr || "").replace(/[^0-9.]/g, ""));
          return Number.isFinite(num) && num > 0 ? num : null;
        })();

        const mapped: Product = {
          id: id ?? "unknown",
          name: p.title ?? "Untitled Product",
          shortDescription: p.description ?? p.detailedDescription ?? "No description available",
          price: parsedPrice,
          originalPrice: parsedPrice ? Math.round((parsedPrice || 0) * 1.2) : null,
          discount: parsedPrice ? 20 : null,
          rating: 4.5,
          reviewCount: 120,
          inStock: true,
          images: p.image ? [p.image] : ["/images/product1.png"],
          features: (p.features || []).map((f) => ({ icon: <Plane className="w-4 h-4" />, text: f })),
          specifications: {
            Category: p.category ?? "General",
            Timeline: p.timeline?.trim() ? p.timeline! : "N/A",
            Pricing: p.pricing?.trim() ? p.pricing! : "Contact for pricing",
          },
          description: p.detailedDescription ?? p.description ?? "",
          detailedDescription: p.detailedDescription,
          shipping: { standard: "5-7 business days", express: "2-3 business days", free: "Free shipping" },
          warranty: "1 Year Manufacturer Warranty",
          category: p.category ?? "Products",
        };

        setProduct(mapped);
      })
      .catch(() => {
        setError("Failed to fetch product details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading product..." />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center  p-6">
        <div className="bg-surface-card rounded-2xl p-8 shadow-md w-full max-w-xl text-center">
          <h2 className="text-2xl font-bold text-status-error mb-4">Error</h2>
          <p className="mb-6 text-ink-paragraph">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-3 bg-ink text-white rounded-lg font-semibold">
            Try again
          </button>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-main">
        <p className="text-lg font-semibold">Product not found.</p>
      </div>
    );

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const formatPrice = (p: number | null) => (p === null ? "—" : `₹ ${p.toLocaleString("en-IN")}`);

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-brand-gold" : "text-ink-light"}`} />
    ));

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT: Images + Thumbnails */}
          <div className="space-y-6">
            <div className="bg-surface-card rounded-2xl shadow overflow-hidden">
              <div
                className="relative w-full  cursor-zoom-in bg-surface-card"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleImageHover}
              >
                <img src={product.images[selectedImage]} alt={product.name} className="object-contain w-full h-full transition-transform duration-300" />

                {showZoom && (
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity"
                    style={{
                      backgroundImage: `url(${product.images[selectedImage]})`,
                      backgroundSize: "200%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      opacity: 1,
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-ink shadow-lg" : "border-ink-light hover:border-ink-light"
                    }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Left-side Key Features (compact) */}


          </div>

          {/* RIGHT: Info */}
          <div className="space-y-6">
            <div className="bg-surface-card p-6 rounded-2xl shadow">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-extrabold text-ink">{product.name}</h1>
                  {companyName && (
                    <p className="mt-2 text-lg font-semibold text-ink-charcoal">
                      <span className="text-ink">{companyName}</span>
                    </p>
                  )}
                  <p className="mt-2 text-ink-paragraph text-justify">{product.shortDescription}</p>
                </div>
              </div>


            </div>

            {/* Tabs */}
            <div className="bg-surface-card rounded-2xl shadow overflow-hidden">
              <div className="border-b">
                <nav className="flex" aria-label="Product tabs">
                  <button
                    onClick={() => setActiveTab("features")}
                    className={`px-6 py-4 font-semibold w-full text-left ${activeTab === "features" ? "text-ink bg-surface-main border-b-2 border-ink" : "text-ink-paragraph hover:bg-ink-offwhite"}`}
                  >
                    Key Features
                  </button>
                  <button
                    onClick={() => setActiveTab("specifications")}
                    className={`px-6 py-4 font-semibold w-full text-left ${activeTab === "specifications" ? "text-ink bg-surface-main border-b-2 border-ink" : "text-ink-paragraph hover:bg-ink-offwhite"}`}
                  >
                    Specifications
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "features" && (
                  <div className="prose max-w-none text-ink-paragraph">
                    <h3 className="text-2xl font-bold text-ink mb-4">Key Features</h3>

                    {/* Show features as a clean list with icons */}
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex gap-3 items-start p-3 bg-surface-main rounded-xl">
                          <div className="mt-1 text-ink/80">{f.icon ?? <Plane className="w-5 h-5" />}</div>
                          <div className="text-ink-paragraph">{f.text}</div>
                        </li>
                      ))}
                    </ul>

                    {/* If there's as longer description (optional), show it below */}

                  </div>
                )}

                {activeTab === "specifications" && (
                  <div>
                    <h3 className="text-2xl font-bold text-ink mb-4">Technical Specifications</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 ">
                      {Object.entries(product.specifications).map(([k, v]) => (
                        <div key={k} className="p-4 bg-surface-main rounded-xl flex justify-between items-start text-[12px] gap-3">
                          <div className="font-semibold text-ink">{k}</div>
                          <div className="text-ink-paragraph">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
        <div className=" p-4 rounded-2xl shadow shadow-ink mt-[5px] bg-surface-card ">
          <h4 className="font-semibold mb-3">Description</h4>
          <ul className="grid grid-cols-1 text-justify">
            <li>{product.detailedDescription}</li>
          </ul>
        </div>
        <div className="mt-8 flex justify-center">
          <Link to={template === "template-1" ? `/company/${slugify(companyName)}#contact` : `/companies/${slugify(companyName)}#contact`}>
            <button className="px-6 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-[#2a2a2a] transition-all duration-200 shadow-md">
              Contact us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


