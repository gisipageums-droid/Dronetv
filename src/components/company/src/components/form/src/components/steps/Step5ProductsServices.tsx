import React from "react";
import { FormStep } from "../FormStep";
import { FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import { Plus, Minus, Package, Wrench, Zap } from "lucide-react";

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

const Step5ProductsServices: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSkip,
  showSkip,
  onStepClick,
  isValid,
  embedded,
}) => {
  const categories: string[] = formData.companyCategory || [];

  // Collect all suggestions for the selected categories
  const serviceSuggestions = categories.flatMap((cat) => SUGGESTED_SERVICES[cat] || []);
  const productSuggestions = categories.flatMap((cat) => SUGGESTED_PRODUCTS[cat] || []);

  const addedServiceTitles = new Set(formData.services.map((s) => s.title));
  const addedProductTitles = new Set(formData.products.map((p) => p.title));

  const addSuggestedService = (title: string) => {
    if (addedServiceTitles.has(title)) return;
    updateFormData({ services: [...formData.services, { icon: "service", title }] });
  };

  const addSuggestedProduct = (title: string) => {
    if (addedProductTitles.has(title)) return;
    updateFormData({ products: [...formData.products, { title }] });
  };

  const addService = () => {
    updateFormData({ services: [...formData.services, { icon: "service", title: "" }] });
  };

  const removeService = (index: number) => {
    updateFormData({ services: formData.services.filter((_, i) => i !== index) });
  };

  const updateService = (index: number, value: string) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], title: value, icon: "service" };
    updateFormData({ services: updated });
  };

  const updateServiceDescription = (index: number, value: string) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], description: value };
    updateFormData({ services: updated });
  };

  const addProduct = () => {
    updateFormData({ products: [...formData.products, { title: "" }] });
  };

  const removeProduct = (index: number) => {
    updateFormData({ products: formData.products.filter((_, i) => i !== index) });
  };

  const updateProduct = (index: number, value: string) => {
    const updated = [...formData.products];
    updated[index] = { ...updated[index], title: value };
    updateFormData({ products: updated });
  };

  const updateProductDescription = (index: number, value: string) => {
    const updated = [...formData.products];
    updated[index] = { ...updated[index], description: value };
    updateFormData({ products: updated });
  };

  return (
    <FormStep
      title="Products & Services"
      description="List your main services and products"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      onSkip={onSkip}
      showSkip={showSkip}
      onStepClick={onStepClick}
      currentStep={3}
      totalSteps={5}
      embedded={embedded}
    >
      <div className="space-y-6">

        {/* Services Section */}
        <div className="p-3 rounded-lg bg-blue-50">
          <h3 className="flex items-center mb-3 text-sm font-bold text-blue-900">
            <Wrench className="w-5 h-5 mr-2" />
            Services
          </h3>

          {/* Quick-add suggestions */}
          {serviceSuggestions.length > 0 && (
            <div className="mb-3 p-2 bg-white border border-blue-100 rounded-md">
              <p className="flex items-center gap-1 text-xs font-semibold text-blue-700 mb-2">
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
                          ? "bg-blue-100 border-blue-300 text-blue-400 cursor-default"
                          : "bg-white border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
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
              <h4 className="text-sm font-semibold text-blue-800">Your services:</h4>
              <button
                type="button"
                onClick={addService}
                className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Custom
              </button>
            </div>

            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="p-2 bg-white border rounded-md">
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
                      className="p-1 text-red-500 rounded-md hover:bg-red-50"
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
                      ? "text-red-500"
                      : (service.description || "").length >= 900
                      ? "text-yellow-500"
                      : "text-slate-400"
                  }`}>
                    {(service.description || "").length}/1000
                  </div>
                </div>
              ))}
            </div>

            {formData.services.length === 0 && (
              <div className="py-3 text-center bg-white border-2 border-blue-200 border-dashed rounded-md">
                <p className="text-sm text-blue-500">Click a suggestion above or "Add Custom" to add a service</p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="p-3 rounded-lg bg-green-50">
          <h3 className="flex items-center mb-3 text-sm font-bold text-green-900">
            <Package className="w-5 h-5 mr-2" />
            Products
          </h3>

          {/* Quick-add suggestions */}
          {productSuggestions.length > 0 && (
            <div className="mb-3 p-2 bg-white border border-green-100 rounded-md">
              <p className="flex items-center gap-1 text-xs font-semibold text-green-700 mb-2">
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
                          ? "bg-green-100 border-green-300 text-green-400 cursor-default"
                          : "bg-white border-green-300 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600"
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
              <h4 className="text-sm font-semibold text-green-800">Your products:</h4>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Custom
              </button>
            </div>

            <div className="space-y-2">
              {formData.products.map((product, index) => (
                <div key={index} className="p-2 bg-white border rounded-md">
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
                      className="p-1 text-red-500 rounded-md hover:bg-red-50"
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
                      ? "text-red-500"
                      : (product.description || "").length >= 900
                      ? "text-yellow-500"
                      : "text-slate-400"
                  }`}>
                    {(product.description || "").length}/1000
                  </div>
                </div>
              ))}
            </div>

            {formData.products.length === 0 && (
              <div className="py-3 text-center bg-white border-2 border-green-200 border-dashed rounded-md">
                <p className="text-sm text-green-500">Click a suggestion above or "Add Custom" to add a product</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {(formData.services.length > 0 || formData.products.length > 0) && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-bold text-blue-600">{formData.services.length}</div>
                <div className="text-sm text-slate-500">Services Listed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{formData.products.length}</div>
                <div className="text-sm text-slate-500">Products Listed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormStep>
  );
};

export default Step5ProductsServices;
