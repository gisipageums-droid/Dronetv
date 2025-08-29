import React, { useState } from "react";
import { FormStep } from "../FormStep";
import { FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import { Plus, Minus, Package, Wrench, X, Grid } from "lucide-react";

interface SectionItem {
  title: string;
  description?: string;
}

interface CustomSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SectionItem[];
}

const Step5ProductsServices: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSections, setCustomSections] = useState<CustomSection[]>(
    formData.sections || []
  );

  // --- Product / Service handlers ---
  const addService = () => {
    updateFormData({
      services: [...formData.services, { icon: "service", title: "" }],
    });
  };
  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    updateFormData({ services: newServices });
  };
  const updateService = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index].title = value;
    updateFormData({ services: newServices });
  };
  const updateServiceDescription = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index].description = value;
    updateFormData({ services: newServices });
  };

  const addProduct = () => {
    updateFormData({ products: [...formData.products, { title: "" }] });
  };
  const removeProduct = (index: number) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    updateFormData({ products: newProducts });
  };
  const updateProduct = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index].title = value;
    updateFormData({ products: newProducts });
  };
  const updateProductDescription = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index].description = value;
    updateFormData({ products: newProducts });
  };

  // --- Custom Section handlers ---
  const addCustomSection = () => {
    setCustomSections([
      ...customSections,
      {
        id: Date.now().toString(),
        title: "",
        icon: <Grid className="mr-2 w-5 h-5 text-purple-600" />,
        items: [],
      },
    ]);
  };

  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter((s) => s.id !== id));
  };

  const updateCustomSectionTitle = (id: string, value: string) => {
    setCustomSections(
      customSections.map((s) => (s.id === id ? { ...s, title: value } : s))
    );
  };

  const addCustomItem = (id: string) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === id
          ? { ...s, items: [...s.items, { title: "", description: "" }] }
          : s
      )
    );
  };

  const removeCustomItem = (sectionId: string, index: number) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  const updateCustomItem = (
    sectionId: string,
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? {
            ...s,
            items: s.items.map((item, i) =>
              i === index ? { ...item, [field]: value } : item
            ),
          }
          : s
      )
    );
  };

  const handleSaveModal = () => {
    updateFormData({ sections: customSections });
    setIsModalOpen(false);
  };

  return (
    <>
      <FormStep
        title="Products & Services"
        description="List your main services and products in simple terms"
        onNext={onNext}
        onPrev={onPrev}
        isValid={isValid}
        currentStep={4}
        totalSteps={6}
      >
        <div className="flex justify-end mb-4 w-full">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
          >
            ✏️ Edit Sections
          </button>
        </div>
        <div className="relative space-y-6">
          {/* Services Section */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="flex items-center mb-2 text-sm font-bold text-blue-900">
              <Wrench className="mr-2 w-5 h-5" />
              Services
            </h3>
            <div className="mb-2">
              <FormInput
                label={`What do you call your services section?`}
                value={formData.servicesTitle}
                onChange={(value) => updateFormData({ servicesTitle: value })}
                required
                placeholder="e.g., Our Services"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-blue-800">
                  List your main services:
                </h4>
                <button
                  type="button"
                  onClick={addService}
                  className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Plus className="mr-2 w-4 h-4" /> Add Service
                </button>
              </div>
              {formData.services.map((service, index) => (
                <div key={index} className="p-2 bg-white rounded-md border">
                  <div className="flex gap-2 items-center mb-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        value={service.title}
                        onChange={(value) => updateService(index, value)}
                        placeholder="e.g., Drone Photography, AI Consulting"
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
                  <FormInput
                    label="Service Description (max 200 characters)"
                    type="textarea"
                    value={service.description || ""}
                    onChange={(value) => {
                      if (value.length <= 200)
                        updateServiceDescription(index, value);
                    }}
                    placeholder="Brief description of this service..."
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="p-3 bg-green-50 rounded-lg">
            <h3 className="flex items-center mb-2 text-sm font-bold text-green-900">
              <Package className="mr-2 w-5 h-5" />
              Products
            </h3>
            <div className="mb-2">
              <FormInput
                label={`What do you call your products section?`}
                value={formData.productsTitle}
                onChange={(value) => updateFormData({ productsTitle: value })}
                required
                placeholder="e.g., Our Products"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-green-800">
                  List your main products:
                </h4>
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <Plus className="mr-2 w-4 h-4" /> Add Product
                </button>
              </div>
              {formData.products.map((product, index) => (
                <div key={index} className="p-2 bg-white rounded-md border">
                  <div className="flex gap-2 items-center mb-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        value={product.title}
                        onChange={(value) => updateProduct(index, value)}
                        placeholder="e.g., Professional Drone X1"
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
                  <FormInput
                    label="Product Description (max 200 characters)"
                    type="textarea"
                    value={product.description || ""}
                    onChange={(value) => {
                      if (value.length <= 200)
                        updateProductDescription(index, value);
                    }}
                    placeholder="Brief description of this product..."
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Sections */}
          {customSections.map((section) => (
            <div
              key={section.id}
              className="p-3 space-y-3 bg-purple-50 rounded-lg border border-purple-200"
            >
              {/* Section Title */}
              <h3 className="flex gap-2 items-center mb-2 text-sm font-bold text-purple-900">
                {section.icon || (
                  <span className="w-5 h-5 bg-purple-300 rounded-full" />
                )}
                {section.title || "Custom Section"}
              </h3>

              {/* Section Name Input */}
              <div className="mb-2">
                <FormInput
                  label={`What do you call your ${section.title || "custom"
                    } section?`}
                  value={section.title}
                  onChange={(value) =>
                    updateCustomSectionTitle(section.id, value)
                  }
                  placeholder={`e.g., ${section.title || "Custom Section"}`}
                  required
                />
              </div>

              {/* List heading */}
              <h4 className="mb-2 text-sm font-semibold text-purple-800">
                List your main {section.title || "custom"}:
              </h4>

              {/* Section Items */}
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-2 bg-white rounded-md border"
                  >
                    <div className="flex gap-2 items-center">
                      {/* Item Title */}
                      <div className="flex-1">
                        <FormInput
                          label=""
                          value={item.title}
                          onChange={(value) =>
                            updateCustomItem(section.id, idx, "title", value)
                          }
                          placeholder={`e.g., ${section.title || "Custom Item"
                            }`}
                        />
                      </div>
                      {/* Remove Item Button */}
                      <button
                        type="button"
                        onClick={() => removeCustomItem(section.id, idx)}
                        className="p-1 text-red-600 rounded-md hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Item Description */}
                    <FormInput
                      label={`${section.title || "Custom Item"
                        } Description (max 200 characters)`}
                      type="textarea"
                      value={item.description || ""}
                      onChange={(value) =>
                        updateCustomItem(section.id, idx, "description", value)
                      }
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                type="button"
                onClick={() => addCustomItem(section.id)}
                className="flex items-center px-3 py-1 mt-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                <Plus className="mr-2 w-4 h-4" /> Add Item
              </button>
            </div>
          ))}
        </div>
      </FormStep>

      {/* Modal */}
      {isModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 bg-purple-900 bg-opacity-30 backdrop-blur-sm">
          <div className="p-5 mt-8 w-full max-w-3xl bg-white rounded-lg border border-purple-100 shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-purple-800">Custom Sections</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {customSections.map((section) => (
                <div
                  key={section.id}
                  className="p-4 bg-purple-50 rounded-md border border-purple-200"
                >
                  <div className="flex gap-2 justify-between items-start mb-3">
                    <div className="flex-grow">
                      <FormInput
                        label="Section Title"
                        value={section.title}
                        onChange={(value) =>
                          updateCustomSectionTitle(section.id, value)
                        }
                        placeholder="Section title"
                        compact
                      />
                    </div>
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-md transition-colors mt-1"
                      title="Remove section"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3 space-y-2">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-md border border-purple-100"
                      >
                        <div className="flex gap-2 mb-2">
                          <div className="flex-grow">
                            <FormInput
                              label="Item Title"
                              value={item.title}
                              onChange={(value) =>
                                updateCustomItem(section.id, idx, "title", value)
                              }
                              placeholder="Item title"
                              compact
                            />
                          </div>
                          <button
                            onClick={() => removeCustomItem(section.id, idx)}
                            className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-md transition-colors self-start"
                            title="Remove item"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                        <FormInput
                          label="Description"
                          type="textarea"
                          value={item.description || ""}
                          onChange={(value) =>
                            updateCustomItem(
                              section.id,
                              idx,
                              "description",
                              value
                            )
                          }
                          placeholder="Description..."
                          rows={2}
                          compact
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addCustomItem(section.id)}
                    className="flex items-center px-3 py-1.5 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-md transition-colors border border-purple-200"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Add Item
                  </button>
                </div>
              ))}

              <button
                onClick={addCustomSection}
                className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add New Section
              </button>
            </div>

            <div className="flex gap-2 justify-end pt-4 mt-6 border-t border-purple-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-purple-700 rounded-md border border-purple-200 transition-colors hover:text-purple-900 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md shadow-sm transition-colors hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step5ProductsServices;
