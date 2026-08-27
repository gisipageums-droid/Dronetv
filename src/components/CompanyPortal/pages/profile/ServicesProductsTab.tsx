import { useState } from "react";
import { Card, Field, FormGrid, Chip, ActionBar, Btn, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const SERVICES = ["Aerial Survey", "Mapping / Photogrammetry", "Topographic Survey", "LiDAR Scanning", "Agriculture Spraying", "Crop Monitoring", "Infrastructure Inspection", "Pipeline / Powerline Inspection", "Solar Farm Inspection", "Mining / Volumetric Analysis", "Surveillance / Security", "Cinematography / Videography", "GIS Data Processing", "Drone Training / RPTO", "Delivery / Logistics", "Search & Rescue", "Environmental Monitoring", "Consulting"];
const INDUSTRIES = ["Agriculture", "Infrastructure", "Mining", "Energy / Power", "Oil & Gas", "Real Estate", "Defence / Security", "Government", "Railways", "Telecom", "Education", "Media / Entertainment", "Environment / Forestry"];

export default function ServicesProductsTab({ profile, save }: TabProps) {
  const data = profile.servicesProducts || {};
  const [services, setServices] = useState<string[]>(data.services || []);
  const [industries, setIndustries] = useState<string[]>(data.industries || []);
  const [products, setProducts] = useState<any[]>(data.products || []);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", priceRange: "", description: "" });
  const [saving, setSaving] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) =>
    setList(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);

  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", category: "", priceRange: "", description: "" });
  };

  const removeProduct = (i: number) => setProducts(products.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    await save("servicesProducts", { services, industries, products });
    setSaving(false);
  };

  return (
    <div>
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Drone Services Offered</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {SERVICES.map(s => <Chip key={s} on={services.includes(s)} onClick={() => toggle(services, setServices, s)}>{s}</Chip>)}
      </div>

      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Industries Served</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {INDUSTRIES.map(s => <Chip key={s} on={industries.includes(s)} onClick={() => toggle(industries, setIndustries, s)}>{s}</Chip>)}
      </div>

      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Software / Products Offered</div>
      <Card className="p-6 mb-5">
        <FormGrid>
          <Field label="Product / Software Name" wide><input className={inputCls} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. DroneMap Pro" /></Field>
          <Field label="Category">
            <select className={inputCls} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
              <option value="">Select</option>
              <option>Hardware / Drone</option><option>Software / SaaS</option><option>Component / Part</option><option>Payload / Sensor</option><option>Service Package</option>
            </select>
          </Field>
          <Field label="Price Range">
            <select className={inputCls} value={newProduct.priceRange} onChange={e => setNewProduct({ ...newProduct, priceRange: e.target.value })}>
              <option value="">Select</option>
              <option>Contact for pricing</option><option>Under ₹50,000</option><option>₹50,000 - 2,00,000</option><option>₹2,00,000 - 10,00,000</option><option>Above ₹10,00,000</option>
            </select>
          </Field>
          <Field label="Description" wide><textarea className={inputCls} rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></Field>
        </FormGrid>
        <Btn onClick={addProduct} className="mt-3">+ Add Product</Btn>
      </Card>

      {products.length > 0 && (
        <div className="space-y-2 mb-5">
          {products.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-ink border border-white/10 rounded-md">
              <div>
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="text-xs text-white/40">{p.category} {p.priceRange && `· ${p.priceRange}`}</div>
              </div>
              <button onClick={() => removeProduct(i)} className="text-status-error text-xs font-semibold">Remove</button>
            </div>
          ))}
        </div>
      )}

      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
    </div>
  );
}
