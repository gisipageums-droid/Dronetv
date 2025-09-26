import React from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';
import { Plus, Minus, Package, Wrench } from 'lucide-react';

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
    const newServices = [...formData.services, { icon: 'service', title: '' }];
    updateFormData({ services: newServices });
  };

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    updateFormData({ services: newServices });
  };

  const updateService = (index: number, field: 'title', value: string) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value, icon: 'service' };
    updateFormData({ services: newServices });
  };

  const updateServiceDescription = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], description: value };
    updateFormData({ services: newServices });
  };

  const addProduct = () => {
    const newProducts = [...formData.products, { title: '' }];
    updateFormData({ products: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    updateFormData({ products: newProducts });
  };

  const updateProduct = (index: number, field: 'title', value: string) => {
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
    <h4 className="text-sm font-semibold text-slate-800 mb-2">Selected Main Categories</h4>
    <div className="flex flex-wrap gap-2">
      {formData.mainCategories?.map((main) => (
        <span
          key={main}
          className="inline-block px-2 py-1 rounded border bg-blue-50 text-blue-900 border-blue-200 text-xs font-medium"
        >
          {main}
        </span>
      ))}
    </div>
  </div>

  {/* Subcategories */}
  <div>
    <h4 className="text-sm font-semibold text-slate-800 mb-2">Selected Subcategories</h4>
    <div className="flex flex-wrap gap-2">
      {formData.subCategories &&
        Object.entries(formData.subCategories).map(([main, subs]) =>
          subs.map((sub) => (
            <span
              key={`${main}-${sub}`}
              className="inline-block px-2 py-1 rounded border bg-green-50 text-green-900 border-green-200 text-xs font-medium"
            >
              {sub} ({main})
            </span>
          ))
        )}
    </div>
  </div>

  {/* Sub-subcategories */}
  <div>
    <h4 className="text-sm font-semibold text-slate-800 mb-2">Selected Sub-Subcategories</h4>
    <div className="flex flex-wrap gap-2">
      {formData.subSubCategories &&
        Object.entries(formData.subSubCategories).map(([sub, subSubs]) =>
          subSubs.map((subSub) => (
            <span
              key={`${sub}-${subSub}`}
              className="inline-block px-2 py-1 rounded border bg-purple-50 text-purple-900 border-purple-200 text-xs font-medium"
            >
              {subSub} ({sub})
            </span>
          ))
        )}
    </div>
  </div>

  {/* Custom Categories */}
  {formData.otherMainCategories && formData.otherMainCategories.trim() && (
    <div>
      <h4 className="text-sm font-semibold text-slate-800 mb-2">Custom Categories</h4>
      <div className="flex flex-wrap gap-2">
        {formData.otherMainCategories.split(',').map((item, index) => {
          const trimmed = item.trim();
          if (!trimmed) return null;
          return (
            <span
              key={index}
              className="inline-block px-2 py-1 rounded border bg-yellow-50 text-yellow-900 border-yellow-200 text-xs font-medium"
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
        <div className="bg-blue-50 rounded-lg p-3">
          <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Services
          </h3>
          
          
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-blue-800">List your main services:</h4>
              <button
                type="button"
                onClick={addService}
                className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="bg-white p-2 rounded-md border">
                  <div className="flex gap-2 items-center mb-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        value={service.title}
                        onChange={(value) => updateService(index, 'title', value)}
                        placeholder="e.g., Drone Photography, AI Consulting, Land Surveying"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <FormInput
                      label="Service Description (max 200 characters)"
                      type="textarea"
                      value={service.description || ''}
                      onChange={(value) => {
                        if (value.length <= 200) {
                          updateServiceDescription(index, value);
                        }
                      }}
                      placeholder="Brief description of this service..."
                      rows={2}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      {(service.description || '').length}/200 characters
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.services.length === 0 && (
              <div className="text-center py-4 bg-white rounded-md border-2 border-dashed border-blue-200">
                <Wrench className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <p className="text-blue-600 text-sm font-medium">No services added yet</p>
                <p className="text-blue-500 text-xs">Click "Add Service" to start listing your services</p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-green-50 rounded-lg p-3">
          <h3 className="text-sm font-bold text-green-900 mb-2 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Products
          </h3>
          
       
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-green-800">List your main products:</h4>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.products.map((product, index) => (
                <div key={index} className="bg-white p-2 rounded-md border">
                  <div className="flex gap-2 items-center mb-2">
                    <div className="flex-1">
                      <FormInput
                        label=""
                        value={product.title}
                        onChange={(value) => updateProduct(index, 'title', value)}
                        placeholder="e.g., Professional Drone X1, AI Analytics Software, GPS Survey Kit"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <FormInput
                      label="Product Description (max 200 characters)"
                      type="textarea"
                      value={product.description || ''}
                      onChange={(value) => {
                        if (value.length <= 200) {
                          updateProductDescription(index, value);
                        }
                      }}
                      placeholder="Brief description of this product..."
                      rows={2}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      {(product.description || '').length}/200 characters
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.products.length === 0 && (
              <div className="text-center py-4 bg-white rounded-md border-2 border-dashed border-green-200">
                <Package className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-green-600 text-sm font-medium">No products added yet</p>
                <p className="text-green-500 text-xs">Click "Add Product" to start listing your products</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Quick Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xl font-bold text-blue-600">{formData.services.length}</div>
              <div className="text-sm text-slate-600">Services Listed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">{formData.products.length}</div>
              <div className="text-sm text-slate-600">Products Listed</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <p className="text-blue-800 text-xs">
              <strong>💡 Tip:</strong> Keep your service and product names simple and clear. 
              AI will generate detailed descriptions and beautiful content for your website!
            </p>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step5ProductsServices;