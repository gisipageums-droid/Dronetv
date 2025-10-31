import React, { useState } from "react";
import { FormStep } from "../FormStep";
import { FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import { Plus, Minus, Package, Wrench } from "lucide-react";

const Step5ProductsServices: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSkip, // Add this line
  showSkip, // Add this line
  isValid,
}) => {
  const addService = () => {
    const newServices = [...formData.services, { icon: "service", title: "" }];
    updateFormData({ services: newServices });
  };

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    updateFormData({ services: newServices });
  };

  const updateService = (index: number, field: "title", value: string) => {
    const newServices = [...formData.services];
    newServices[index] = {
      ...newServices[index],
      [field]: value,
      icon: "service",
    };
    updateFormData({ services: newServices });
  };

  const updateServiceDescription = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], description: value };
    updateFormData({ services: newServices });
  };

  const addProduct = () => {
    const newProducts = [...formData.products, { title: "" }];
    updateFormData({ products: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    updateFormData({ products: newProducts });
  };

  const updateProduct = (index: number, field: "title", value: string) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    updateFormData({ products: newProducts });
  };

  const updateProductDescription = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index] = { ...newProducts[index], description: value };
    updateFormData({ products: newProducts });
  };

  return (
    <FormStep
      title="Products & Services"
      description="List your main services and products in simple terms"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      onSkip={onSkip}
      showSkip={showSkip}
      currentStep={4}
      totalSteps={6}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Main Categories */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">
              Selected Main Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.mainCategories?.map((main) => (
                <span
                  key={main}
                  className="inline-block px-2 py-1 text-xs font-medium text-blue-900 border border-blue-200 rounded bg-blue-50"
                >
                  {main}
                </span>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">
              Selected Subcategories
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.subCategories &&
                Object.entries(formData.subCategories).map(([main, subs]) =>
                  subs.map((sub) => (
                    <span
                      key={`${main}-${sub}`}
                      className="inline-block px-2 py-1 text-xs font-medium text-green-900 border border-green-200 rounded bg-green-50"
                    >
                      {sub} ({main})
                    </span>
                  ))
                )}
            </div>
          </div>

          {/* Sub-subcategories */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">
              Selected Sub-Subcategories
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.subSubCategories &&
                Object.entries(formData.subSubCategories).map(
                  ([sub, subSubs]) =>
                    subSubs.map((subSub) => (
                      <span
                        key={`${sub}-${subSub}`}
                        className="inline-block px-2 py-1 text-xs font-medium text-purple-900 border border-purple-200 rounded bg-purple-50"
                      >
                        {subSub} ({sub})
                      </span>
                    ))
                )}
            </div>
          </div>

          {/* Custom Categories */}
          {formData.otherMainCategories &&
            formData.otherMainCategories.trim() && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-800">
                  Custom Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.otherMainCategories
                    .split(",")
                    .map((item, index) => {
                      const trimmed = item.trim();
                      if (!trimmed) return null;
                      return (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium text-yellow-900 border border-yellow-200 rounded bg-yellow-50"
                        >
                          {trimmed}
                        </span>
                      );
                    })}
                </div>
              </div>
            )}
        </div>

        {/* Services Section */}
        <div className="p-3 rounded-lg bg-blue-50">
          <h3 className="flex items-center mb-2 text-sm font-bold text-blue-900">
            <Wrench className="w-5 h-5 mr-2" />
            Services
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-blue-800">
                List your main services:
              </h4>
              <button
                type="button"
                onClick={addService}
                className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
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
                        onChange={(value) =>
                          updateService(index, "title", value)
                        }
                        placeholder="e.g., Drone Photography, AI Consulting, Land Surveying"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-1 text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <FormInput
                      label="Service Description (max 1000 characters)"
                      type="textarea"
                      value={service.description || ""}
                      onChange={(value: string) => {
                        if (value.length <= 1000) {
                          updateServiceDescription(index, value);
                        }
                      }}
                      placeholder="Brief description of this service..."
                      rows={2}
                    />

                    <div
                      className={`mt-1 text-xs ${
                        (service.description || "").length === 1000
                          ? "text-red-500"
                          : (service.description || "").length >= 900
                          ? "text-yellow-500"
                          : "text-slate-500"
                      }`}
                    >
                      {(service.description || "").length}/1000 characters
                    </div>

                    {(service.description || "").length === 1000 && (
                      <div className="mt-1 text-xs text-red-500">
                        You have reached the 200 character limit
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {formData.services.length === 0 && (
              <div className="py-4 text-center bg-white border-2 border-blue-200 border-dashed rounded-md">
                <Wrench className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                <p className="text-sm font-medium text-blue-600">
                  No services added yet
                </p>
                <p className="text-xs text-blue-500">
                  Click "Add Service" to start listing your services
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="p-3 rounded-lg bg-green-50">
          <h3 className="flex items-center mb-2 text-sm font-bold text-green-900">
            <Package className="w-5 h-5 mr-2" />
            Products
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-green-800">
                List your main products:
              </h4>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
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
                        onChange={(value) =>
                          updateProduct(index, "title", value)
                        }
                        placeholder="e.g., Professional Drone X1, AI Analytics Software, GPS Survey Kit"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-1 text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <FormInput
                      label="Product Description (max 1000 characters)"
                      type="textarea"
                      value={product.description || ""}
                      onChange={(value: string) => {
                        if (value.length <= 1000) {
                          updateProductDescription(index, value);
                        }
                      }}
                      placeholder="Brief description of this product..."
                      rows={2}
                    />

                    <div
                      className={`mt-1 text-xs ${
                        (product.description || "").length === 1000
                          ? "text-red-500"
                          : (product.description || "").length >= 900
                          ? "text-yellow-500"
                          : "text-slate-500"
                      }`}
                    >
                      {(product.description || "").length}/1000 characters
                    </div>

                    {(product.description || "").length === 1000 && (
                      <div className="mt-1 text-xs text-red-500">
                        You have reached the 1000 character limit
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {formData.products.length === 0 && (
              <div className="py-4 text-center bg-white border-2 border-green-200 border-dashed rounded-md">
                <Package className="w-8 h-8 mx-auto mb-2 text-green-300" />
                <p className="text-sm font-medium text-green-600">
                  No products added yet
                </p>
                <p className="text-xs text-green-500">
                  Click "Add Product" to start listing your products
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 rounded-lg bg-slate-50">
          <h4 className="mb-2 text-sm font-semibold text-slate-800">
            Quick Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xl font-bold text-blue-600">
                {formData.services.length}
              </div>
              <div className="text-sm text-slate-600">Services Listed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">
                {formData.products.length}
              </div>
              <div className="text-sm text-slate-600">Products Listed</div>
            </div>
          </div>
          <div className="p-2 mt-3 rounded-md bg-blue-50">
            <p className="text-xs text-blue-800">
              <strong>💡 Tip:</strong> Keep your service and product names
              simple and clear. AI will generate detailed descriptions and
              beautiful content for your website!
            </p>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step5ProductsServices;