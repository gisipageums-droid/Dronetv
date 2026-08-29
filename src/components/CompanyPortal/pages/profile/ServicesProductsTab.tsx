import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, Chip, ActionBar, inputCls } from "../../ui";
import { getCompanyContent, saveCompanyContent, savePortalProfileSection } from "../../api";
import type { TabProps } from "./CompanyProfilePage";

const INDUSTRIES = ["Agriculture", "Infrastructure", "Mining", "Energy / Power", "Oil & Gas", "Real Estate", "Defence / Security", "Government", "Railways", "Telecom", "Education", "Media / Entertainment", "Environment / Forestry"];

// Same category-based quick-add lists as the company registration form's
// Step 5 (Products & Services).
const SUGGESTED_SERVICES: Record<string, string[]> = {
  Drone: [
    "Drone Photography & Videography", "Aerial Surveying & Mapping", "Precision Agriculture Spraying",
    "Infrastructure Inspection", "Thermal Imaging Services", "3D Modeling & Photogrammetry",
    "LiDAR Scanning", "Search & Rescue Support", "Drone Training & Certification",
    "DGCA Consulting", "Drone Rental Services", "Pipeline & Powerline Inspection",
  ],
  AI: [
    "Machine Learning Development", "Computer Vision Solutions", "Natural Language Processing",
    "Predictive Analytics", "AI Process Automation", "Data Science & Analytics",
    "AI Integration & Consulting", "Deep Learning Solutions", "AI-Powered Surveillance",
    "Chatbot & Virtual Assistant", "AI Model Training", "Business Intelligence",
  ],
  GIS: [
    "GIS Mapping & Cartography", "Spatial Data Analysis", "Remote Sensing & Satellite Imagery",
    "Land Surveying & Measurement", "Urban Planning Consulting", "Environmental Impact Assessment",
    "GNSS / GPS Solutions", "GIS Software Development", "Geodatabase Management",
    "Fleet & Asset Tracking", "Topographic Surveying", "Cadastral Mapping",
  ],
};

const SUGGESTED_PRODUCTS: Record<string, string[]> = {
  Drone: [
    "Fixed-Wing Drone", "Multi-Rotor Drone", "Hybrid VTOL Drone", "Agricultural Sprayer Drone",
    "Inspection Drone", "FPV Racing Drone", "Drone Spare Parts & Accessories",
    "Ground Control Station", "Drone Payload Systems",
  ],
  AI: [
    "AI Analytics Platform", "Computer Vision SDK", "NLP Toolkit", "AI Edge Device",
    "ML Model Marketplace", "Data Labeling Tool", "AI Monitoring Dashboard",
  ],
  GIS: [
    "GNSS Receiver", "Total Station", "GIS Mobile App", "Survey-Grade GPS",
    "GIS Desktop Software", "Drone + GIS Bundle", "RTK GNSS System", "Ground Penetrating Radar",
  ],
};

interface Item {
  icon?: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
}

const MAX_DESC = 1000;

export default function ServicesProductsTab({ publishedId, userId, profile }: TabProps) {
  const industriesInit = profile.servicesProducts?.industries || [];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Item[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [industries, setIndustries] = useState<string[]>(industriesInit);
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

  const serviceSuggestions = [...new Set(categories.flatMap(c => SUGGESTED_SERVICES[c] || []))];
  const productSuggestions = [...new Set(categories.flatMap(c => SUGGESTED_PRODUCTS[c] || []))];
  const serviceTitles = new Set(services.map(s => s.title));
  const productTitles = new Set(products.map(p => p.title));

  const toggleIndustry = (val: string) =>
    setIndustries(industries.includes(val) ? industries.filter(v => v !== val) : [...industries, val]);

  const addService = (title = "") => setServices(prev => prev.some(s => s.title === title && title) ? prev : [...prev, { icon: "service", title }]);
  const addProduct = (title = "") => setProducts(prev => prev.some(p => p.title === title && title) ? prev : [...prev, { title }]);
  const removeService = (i: number) => setServices(prev => prev.filter((_, idx) => idx !== i));
  const removeProduct = (i: number) => setProducts(prev => prev.filter((_, idx) => idx !== i));
  const patchService = (i: number, patch: Partial<Item>) => setServices(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const patchProduct = (i: number, patch: Partial<Item>) => setProducts(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await getCompanyContent(publishedId);
      const content = data.content || {};
      const cleanServices = services.filter(s => s.title.trim()).map(s => ({ ...s, icon: s.icon || "service" }));
      const cleanProducts = products.filter(p => p.title.trim());
      const nextContent = {
        ...content,
        services: { ...(content.services || {}), services: cleanServices },
        products: { ...(content.products || {}), products: cleanProducts },
      };
      await saveCompanyContent(userId, publishedId, nextContent);
      await savePortalProfileSection(publishedId, "servicesProducts", { ...(profile.servicesProducts || {}), industries });
      profile.servicesProducts = { ...(profile.servicesProducts || {}), industries };
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

  const counterCls = (len: number) =>
    len >= MAX_DESC ? "text-status-error" : len >= MAX_DESC - 100 ? "text-brand-gold" : "text-white/30";

  return (
    <div>
      {/* SERVICES */}
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Services</div>

      {serviceSuggestions.length > 0 && (
        <Card className="p-4 mb-4">
          <div className="text-[11px] font-semibold text-white/50 mb-2">Quick add — based on your company type ({categories.join(", ")})</div>
          <div className="flex flex-wrap gap-1.5">
            {serviceSuggestions.map(title => {
              const added = serviceTitles.has(title);
              return (
                <button
                  key={title}
                  type="button"
                  disabled={added}
                  onClick={() => addService(title)}
                  className={`px-2.5 py-1 text-[11.5px] rounded border transition-colors ${
                    added
                      ? "bg-brand-yellow/15 border-brand-yellow/40 text-brand-gold cursor-default"
                      : "bg-transparent border-white/20 text-white/60 hover:border-brand-yellow hover:text-brand-gold"
                  }`}
                >
                  {added ? "✓ " : "+ "}{title}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <div className="space-y-3 mb-3">
        {services.map((s, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  className={inputCls}
                  value={s.title}
                  onChange={e => patchService(i, { title: e.target.value })}
                  placeholder="e.g. Aerial Surveying & Mapping"
                />
                <textarea
                  className={inputCls}
                  rows={2}
                  value={s.description || ""}
                  onChange={e => e.target.value.length <= MAX_DESC && patchService(i, { description: e.target.value })}
                  placeholder="Brief description of this service..."
                />
                <div className={`text-[10.5px] text-right ${counterCls((s.description || "").length)}`}>
                  {(s.description || "").length}/{MAX_DESC}
                </div>
              </div>
              <button onClick={() => removeService(i)} className="text-status-error text-xs font-semibold px-2 py-1 shrink-0">Remove</button>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={() => addService()} className="text-xs font-semibold text-brand-gold mb-8">+ Add Custom Service</button>

      {/* PRODUCTS */}
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3 mt-2">Products</div>

      {productSuggestions.length > 0 && (
        <Card className="p-4 mb-4">
          <div className="text-[11px] font-semibold text-white/50 mb-2">Quick add — based on your company type ({categories.join(", ")})</div>
          <div className="flex flex-wrap gap-1.5">
            {productSuggestions.map(title => {
              const added = productTitles.has(title);
              return (
                <button
                  key={title}
                  type="button"
                  disabled={added}
                  onClick={() => addProduct(title)}
                  className={`px-2.5 py-1 text-[11.5px] rounded border transition-colors ${
                    added
                      ? "bg-brand-yellow/15 border-brand-yellow/40 text-brand-gold cursor-default"
                      : "bg-transparent border-white/20 text-white/60 hover:border-brand-yellow hover:text-brand-gold"
                  }`}
                >
                  {added ? "✓ " : "+ "}{title}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <div className="space-y-3 mb-3">
        {products.map((p, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  className={inputCls}
                  value={p.title}
                  onChange={e => patchProduct(i, { title: e.target.value })}
                  placeholder="e.g. Multi-Rotor Survey Drone"
                />
                <textarea
                  className={inputCls}
                  rows={2}
                  value={p.description || ""}
                  onChange={e => e.target.value.length <= MAX_DESC && patchProduct(i, { description: e.target.value })}
                  placeholder="Brief description of this product..."
                />
                <div className={`text-[10.5px] text-right ${counterCls((p.description || "").length)}`}>
                  {(p.description || "").length}/{MAX_DESC}
                </div>
              </div>
              <button onClick={() => removeProduct(i)} className="text-status-error text-xs font-semibold px-2 py-1 shrink-0">Remove</button>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={() => addProduct()} className="text-xs font-semibold text-brand-gold mb-8">+ Add Custom Product</button>

      {/* INDUSTRIES */}
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3 mt-2">Industries Served</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {INDUSTRIES.map(s => <Chip key={s} on={industries.includes(s)} onClick={() => toggleIndustry(s)}>{s}</Chip>)}
      </div>

      {(services.length > 0 || products.length > 0) && (
        <div className="grid grid-cols-2 gap-4 mt-6 max-w-xs">
          <div>
            <div className="text-xl font-bold text-brand-gold">{services.filter(s => s.title.trim()).length}</div>
            <div className="text-xs text-white/40">Services listed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-brand-gold">{products.filter(p => p.title.trim()).length}</div>
            <div className="text-xs text-white/40">Products listed</div>
          </div>
        </div>
      )}

      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
    </div>
  );
}
