import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Minus, Package, Wrench, Zap } from "lucide-react";
import { ActionBar } from "../../ui";
import { getCompanyContent, saveCompanyContent } from "../../api";
import { FormInput } from "../../../company/src/components/form/src/components/FormInput";
import type { TabProps } from "./CompanyProfilePage";

// Same category-based quick-add lists as the company registration form's
// Step 5 (Products & Services).
const SUGGESTED_SERVICES: Record<string, string[]> = {
  Drone: [
    "Drone Photography & Videography",
    "Aerial Surveying & Mapping",
    "Precision Agriculture Spraying",
    "Infrastructure Inspection",
    "Thermal Imaging Services",
    "3D Modeling & Photogrammetry",
    "LiDAR Scanning",
    "Search & Rescue Support",
    "Drone Training & Certification",
    "DGCA Consulting",
    "Drone Rental Services",
    "Pipeline & Powerline Inspection",
  ],
  AI: [
    "Machine Learning Development",
    "Computer Vision Solutions",
    "Natural Language Processing",
    "Predictive Analytics",
    "AI Process Automation",
    "Data Science & Analytics",
    "AI Integration & Consulting",
    "Deep Learning Solutions",
    "AI-Powered Surveillance",
    "Chatbot & Virtual Assistant",
    "AI Model Training",
    "Business Intelligence",
  ],
  GIS: [
    "GIS Mapping & Cartography",
    "Spatial Data Analysis",
    "Remote Sensing & Satellite Imagery",
    "Land Surveying & Measurement",
    "Urban Planning Consulting",
    "Environmental Impact Assessment",
    "GNSS / GPS Solutions",
    "GIS Software Development",
    "Geodatabase Management",
    "Fleet & Asset Tracking",
    "Topographic Surveying",
    "Cadastral Mapping",
  ],
};

const SUGGESTED_PRODUCTS: Record<string, string[]> = {
  Drone: [
    "Fixed-Wing Drone",
    "Multi-Rotor Drone",
    "Hybrid VTOL Drone",
    "Agricultural Sprayer Drone",
    "Inspection Drone",
    "FPV Racing Drone",
    "Drone Spare Parts & Accessories",
    "Ground Control Station",
    "Drone Payload Systems",
  ],
  AI: [
    "AI Analytics Platform",
    "Computer Vision SDK",
    "NLP Toolkit",
    "AI Edge Device",
    "ML Model Marketplace",
    "Data Labeling Tool",
    "AI Monitoring Dashboard",
  ],
  GIS: [
    "GNSS Receiver",
    "Total Station",
    "GIS Mobile App",
    "Survey-Grade GPS",
    "GIS Desktop Software",
    "Drone + GIS Bundle",
    "RTK GNSS System",
    "Ground Penetrating Radar",
  ],
};

interface Item {
  icon?: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
}

export default function ServicesProductsTab({ publishedId, userId }: TabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Item[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCompanyContent(publishedId);
        if (cancelled) return;
        const content = data.content || {};
        const svcItems = (content.services || {}).services;
        const prdItems = (content.products || {}).products;
        setServices(Array.isArray(svcItems) ? svcItems : []);
        setProducts(Array.isArray(prdItems) ? prdItems : []);
        const cats = data.companyInfo?.companyCategory;
        setCategories(Array.isArray(cats) && cats.length ? cats : ["Drone", "AI", "GIS"]);
      } catch {
        if (!cancelled) toast.error("Could not load services & products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [publishedId]);

  // Collect all suggestions for the selected categories
  const serviceSuggestions = categories.flatMap((cat) => SUGGESTED_SERVICES[cat] || []);
  const productSuggestions = categories.flatMap((cat) => SUGGESTED_PRODUCTS[cat] || []);

  const addedServiceTitles = new Set(services.map((s) => s.title));
  const addedProductTitles = new Set(products.map((p) => p.title));

  const addSuggestedService = (title: string) => {
    setServices((prev) => (prev.some((s) => s.title === title) ? prev : [...prev, { icon: "service", title }]));
  };

  const addSuggestedProduct = (title: string) => {
    setProducts((prev) => (prev.some((p) => p.title === title) ? prev : [...prev, { title }]));
  };

  const addService = () => setServices((prev) => [...prev, { icon: "service", title: "" }]);
  const removeService = (index: number) => setServices((prev) => prev.filter((_, i) => i !== index));
  const updateService = (index: number, value: string) =>
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, title: value, icon: "service" } : s)));
  const updateServiceDescription = (index: number, value: string) =>
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, description: value } : s)));

  const addProduct = () => setProducts((prev) => [...prev, { title: "" }]);
  const removeProduct = (index: number) => setProducts((prev) => prev.filter((_, i) => i !== index));
  const updateProduct = (index: number, value: string) =>
    setProducts((prev) => prev.map((p, i) => (i === index ? { ...p, title: value } : p)));
  const updateProductDescription = (index: number, value: string) =>
    setProducts((prev) => prev.map((p, i) => (i === index ? { ...p, description: value } : p)));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await getCompanyContent(publishedId);
      const content = data.content || {};
      const cleanServices = services.filter((s) => s.title.trim()).map((s) => ({ ...s, icon: s.icon || "service" }));
      const cleanProducts = products.filter((p) => p.title.trim());
      const nextContent = {
        ...content,
        services: { ...(content.services || {}), services: cleanServices },
        products: { ...(content.products || {}), products: cleanProducts },
      };
      await saveCompanyContent(userId, publishedId, nextContent);
      setServices(cleanServices);
      setProducts(cleanProducts);
      toast.success("Saved successfully");
    } catch {
      toast.error("Failed to save - please try again");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-sm text-white/40">Loading services & products...</div>;

  return (
    <div>
      <div className="space-y-6">

        {/* Services Section */}
        <div className="p-3 rounded-lg bg-status-info/10">
          <h3 className="flex items-center mb-3 text-sm font-bold text-status-info">
            <Wrench className="w-5 h-5 mr-2" />
            Services
          </h3>

          {/* Quick-add suggestions */}
          {serviceSuggestions.length > 0 && (
            <div className="mb-3 p-2 bg-surface-card border border-status-info/15 rounded-md">
              <p className="flex items-center gap-1 text-xs font-semibold text-status-info mb-2">
                <Zap className="w-3 h-3" />
                Quick add — based on your company type ({categories.join(", ")})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {serviceSuggestions.map((title) => {
                  const added = addedServiceTitles.has(title);
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => addSuggestedService(title)}
                      disabled={added}
                      className={`px-2 py-1 text-xs rounded border transition-all ${
                        added
                          ? "bg-status-info/15 border-status-info/40 text-status-info cursor-default"
                          : "bg-surface-card border-status-info/40 text-status-info hover:bg-status-info hover:text-white hover:border-status-info"
                      }`}
                    >
                      {added ? "✓ " : "+ "}
                      {title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-status-info">Your services:</h4>
              <button
                type="button"
                onClick={addService}
                className="flex items-center px-3 py-1 text-sm text-white bg-status-info rounded-md hover:bg-status-info"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Custom
              </button>
            </div>

            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="p-2 bg-surface-card border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        value={service.title}
                        onChange={(value) => updateService(index, value)}
                        placeholder="e.g., Drone Photography, AI Consulting, Land Surveying"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-1 text-status-error rounded-md hover:bg-status-error/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <FormInput
                    label="Description (max 1000 characters)"
                    type="textarea"
                    value={service.description || ""}
                    onChange={(value: string) => {
                      if (value.length <= 1000) updateServiceDescription(index, value);
                    }}
                    placeholder="Brief description of this service..."
                    rows={2}
                  />
                  <div className={`mt-1 text-xs ${
                    (service.description || "").length === 1000
                      ? "text-status-error"
                      : (service.description || "").length >= 900
                      ? "text-brand-gold"
                      : "text-ink-caption"
                  }`}>
                    {(service.description || "").length}/1000
                  </div>
                </div>
              ))}
            </div>

            {services.length === 0 && (
              <div className="py-3 text-center bg-surface-card border-2 border-status-info/25 border-dashed rounded-md">
                <p className="text-sm text-status-info">Click a suggestion above or "Add Custom" to add a service</p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="p-3 rounded-lg bg-status-success/10">
          <h3 className="flex items-center mb-3 text-sm font-bold text-status-success">
            <Package className="w-5 h-5 mr-2" />
            Products
          </h3>

          {/* Quick-add suggestions */}
          {productSuggestions.length > 0 && (
            <div className="mb-3 p-2 bg-surface-card border border-status-success/15 rounded-md">
              <p className="flex items-center gap-1 text-xs font-semibold text-status-success mb-2">
                <Zap className="w-3 h-3" />
                Quick add — based on your company type ({categories.join(", ")})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {productSuggestions.map((title) => {
                  const added = addedProductTitles.has(title);
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => addSuggestedProduct(title)}
                      disabled={added}
                      className={`px-2 py-1 text-xs rounded border transition-all ${
                        added
                          ? "bg-status-success/15 border-status-success/40 text-status-success cursor-default"
                          : "bg-surface-card border-status-success/40 text-status-success hover:bg-status-success hover:text-white hover:border-status-success"
                      }`}
                    >
                      {added ? "✓ " : "+ "}
                      {title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-status-success">Your products:</h4>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center px-3 py-1 text-sm text-white bg-status-success rounded-md hover:bg-status-success"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Custom
              </button>
            </div>

            <div className="space-y-2">
              {products.map((product, index) => (
                <div key={index} className="p-2 bg-surface-card border rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        value={product.title}
                        onChange={(value) => updateProduct(index, value)}
                        placeholder="e.g., Professional Drone X1, AI Analytics Software, GPS Survey Kit"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-1 text-status-error rounded-md hover:bg-status-error/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <FormInput
                    label="Description (max 1000 characters)"
                    type="textarea"
                    value={product.description || ""}
                    onChange={(value: string) => {
                      if (value.length <= 1000) updateProductDescription(index, value);
                    }}
                    placeholder="Brief description of this product..."
                    rows={2}
                  />
                  <div className={`mt-1 text-xs ${
                    (product.description || "").length === 1000
                      ? "text-status-error"
                      : (product.description || "").length >= 900
                      ? "text-brand-gold"
                      : "text-ink-caption"
                  }`}>
                    {(product.description || "").length}/1000
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-3 text-center bg-surface-card border-2 border-status-success/25 border-dashed rounded-md">
                <p className="text-sm text-status-success">Click a suggestion above or "Add Custom" to add a product</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {(services.length > 0 || products.length > 0) && (
          <div className="p-3 rounded-lg bg-ink-offwhite border border-ink-light">
            <h4 className="mb-2 text-sm font-semibold text-ink-paragraph">Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-bold text-status-info">{services.length}</div>
                <div className="text-sm text-ink-caption">Services Listed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-status-success">{products.length}</div>
                <div className="text-sm text-ink-caption">Products Listed</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
    </div>
  );
}
