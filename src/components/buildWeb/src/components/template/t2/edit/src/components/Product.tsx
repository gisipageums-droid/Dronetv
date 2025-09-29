import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Monitor,
  Smartphone,
  Cloud,
  BarChart3,
  Zap,
  X,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";

export default function Product({productData, onStateChange,userId, publishedId, templateSelection}) {
  const [isEditing, setIsEditing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Consolidated state
  const [contentState, setContentState] = useState(productData);

    // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // Update function for simple fields
  const updateField = (section, field, value) => {
    setContentState(prev => ({ 
      ...prev, 
      [section]: { ...prev[section], [field]: value } 
    }));
  };

  // Update function for products
  const updateProductField = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  // Update function for product features
  const updateFeature = (index, fIndex, value) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.map((f, fi) => fi === fIndex ? value : f)
            }
          : p
      )
    }));
  };

  // Add a new feature to a product
  const addFeature = (index) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, features: [...p.features, "New Feature"] } : p
      )
    }));
  };

  // Remove a feature from a product
  const removeFeature = (index, fIndex) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index
          ? {
              ...p,
              features: p.features.filter((_, fi) => fi !== fIndex)
            }
          : p
      )
    }));
  };

  // Image selection - only shows local preview, no upload yet
  const handleProductImageSelect = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImages(prev => ({ ...prev, [index]: file }));
    
    // Show immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProductField(index, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Updated Save button handler - uploads images and stores S3 URLs
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Upload all pending images
      for (const [indexStr, file] of Object.entries(pendingImages)) {
        const index = parseInt(indexStr);
        
        if (!userId || !publishedId || !templateSelection) {
          console.error('Missing required props:', { userId, publishedId, templateSelection });
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', 'products');
        formData.append('imageField', `products[${index}].image`);
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Replace local preview with S3 URL
          updateProductField(index, "image", uploadData.imageUrl);
          console.log('Image uploaded to S3:', uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          console.error('Image upload failed:', errorData);
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return; // Don't exit edit mode
        }
      }
      
      // Clear pending images
      setPendingImages({});
      // Exit edit mode
      setIsEditing(false);
      toast.success('Products section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving products section:', error);
      toast.error('Error saving changes. Please try again.');
      // Keep in edit mode so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  // Add a new product
const addProduct = () => {
  setContentState(prev => ({
    ...prev,
    products: [
      ...prev.products,
      {
        icon: Monitor,
        title: "New Product",
        category: "New Category",
        image: null, // Set to null instead of a placeholder URL
        description: "New product description...",
        features: ["New Feature"],
        isPopular: false,
        categoryColor: "bg-gray-100 text-gray-800",
        detailedDescription: "Detailed description for new product...",
        pricing: "TBD",
        timeline: "TBD",
      },
    ]
  }));
};

  // Remove a product
  const removeProduct = (index) => {
    setContentState(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Update function for benefits
  const updateBenefit = (index, field, value) => {
    setContentState(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? { ...b, [field]: value } : b)
    }));
  };

  // Add a new benefit
  const addBenefit = () => {
    setContentState(prev => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        {
          icon: "",
          color: "primary",
          title: "New Benefit",
          desc: "Benefit description...",
        },
      ]
    }));
  };

  // Remove a benefit
  const removeBenefit = (index) => {
    setContentState(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const openModal = (index) => {
    setSelectedProductIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
  };

  return (
    <motion.section
      id="product"
      className="py-20 bg-secondary theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit/Save Buttons */}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <motion.button 
              whileTap={{scale:0.9}}
              whileHover={{y:-1,scaleX:1.1}}
              onClick={handleSave}
              disabled={isUploading}
              className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:shadow-2xl'} text-white px-4 py-2 rounded shadow-xl hover:font-semibold`}
            >
              {isUploading ? 'Uploading...' : 'Save'}
            </motion.button>
          ) : (
            <motion.button 
              whileTap={{scale:0.9}}
              whileHover={{y:-1,scaleX:1.1}}
              onClick={() => setIsEditing(true)} 
              className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold"
            >
              Edit
            </motion.button>
          )}
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {isEditing ? (
            <>
              <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
                <Zap className="w-4 h-4 mr-2" />
                <input
                  type="text"
                  value={contentState.heading.title}
                  onChange={(e) => updateField("heading", "title", e.target.value)}
                  className="border-b font-medium bg-transparent"
                />
              </div>

              <input
                type="text"
                value={contentState.heading.heading}
                onChange={(e) => updateField("heading", "heading", e.target.value)}
                className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
              />
              <input
                type="text"
                className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
                value={contentState.heading.description}
                onChange={(e) => updateField("heading", "description", e.target.value)}
              />

              <input
                type="text"
                value={contentState.heading.trust}
                onChange={(e) => updateField("heading", "trust", e.target.value)}
                className="border-b font-medium bg-transparent block w-full text-3xl md:text-4xl text-foreground mb-4"
              />
            </>
          ) : (
            <>
              <div className="inline-flex items-center px-4 py-2 bg-red-accent/10 rounded-full text-red-accent mb-4">
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium"> {contentState.heading.title}</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                {contentState.heading.heading}
              </h2>

              <p className="text-lg text-muted-foreground inline">
                {contentState.heading.description}
              </p>
              <p className="text-lg text-muted-foreground inline font-bold text-foreground">
                {" "}
                {contentState.heading.trust}
              </p>
            </>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contentState.products.slice(0, visibleCount).map((product, index) => {
              return (
              <Card
                key={index}
                className="group h-full relative overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <motion.div
                      animate={{opacity:[0,1], scale:[0.8,1]}}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{scale:0.9}}
                      transition={{ duration: 0.3 }}
                      className="absolute mx-2 bottom-2 left-2  z-50 bg-white/80 p-1 rounded"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs w-full cursor-pointer"
                        onChange={(e) => handleProductImageSelect(index, e)}
                      />
                      {pendingImages[index] && (
                        <p className="text-xs text-orange-600 mt-1">
                          Image selected: {pendingImages[index].name} (will upload on save)
                        </p>
                      )}
                    </motion.div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${product.categoryColor} border-0 text-xs`}
                    >
                      {isEditing ? (
                        <input
                          value={product.category}
                          onChange={(e) =>
                            updateProductField(index, "category", e.target.value)
                          }
                          className="border-b text-xs bg-transparent"
                        />
                      ) : (
                        product.category
                      )}
                    </Badge>
                  </div>
                  {product.isPopular && (
                    <div className="absolute top-2 right-2 bg-red-accent text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Zap className="w-2 h-2 mr-1" /> Bestseller
                    </div>
                  )}
                  
                </div>
                <CardHeader>
                  {isEditing ? (
                    <input
                      value={product.title}
                      onChange={(e) =>
                        updateProductField(index, "title", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <CardTitle>{product.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <textarea
                      value={product.description}
                      onChange={(e) =>
                        updateProductField(index, "description", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  <ul className="space-y-1 mt-3">
                    {product.features.map((f, fi) => (
                      <li
                        key={fi}
                        className="text-xs text-muted-foreground flex items-center"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {isEditing ? (
                          <div className="flex flex-col gap-1 w-full">
                            <input
                              value={f}
                              onChange={(e) =>
                                updateFeature(index, fi, e.target.value)
                              }
                              className="border-b w-full"
                            />
                            <motion.button
                            whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                              onClick={() => removeFeature(index, fi)}
                              className="text-xs cursor-pointer text-red-500"
                            >
                              ✕ Remove
                            </motion.button>
                          </div>
                        ) : (
                          <span>{f}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditing && (
                    <motion.button
                     whileHover={{scale:1.1}}
                     whileTap={{scale:0.9}}
                      onClick={() => addFeature(index)}
                      className="text-xs text-green-600 mt-2"
                    >
                      + Add Feature
                    </motion.button>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="hover:scale-105" onClick={() => openModal(index)}>
                      View Details
                    </Button>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="hover:scale-105"
                        variant="destructive"
                        onClick={() => removeProduct(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {isEditing && (
            <Card className=" flex items-center justify-center border-dashed">
              <Button onClick={addProduct} className="hover:scale-105 text-green-600">
                + Add Product
              </Button>
            </Card>
          )}
        </div>

        {/* Load More / Show Less */}
        <div className="flex justify-center mt-6">
          {visibleCount < contentState.products.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 4)}>
              Load More
            </Button>
          )}
          {visibleCount >= contentState.products.length && contentState.products.length > 4 && (
            <Button
              onClick={() => setVisibleCount(4)}
              variant="secondary"
              className="ml-4"
            >
              Show Less
            </Button>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProductIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              {isEditing ? (
                <input
                  value={contentState.products[selectedProductIndex].title}
                  onChange={(e) =>
                    updateProductField(selectedProductIndex, "title", e.target.value)
                  }
                  className="border-b w-full text-2xl font-bold mb-4"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-4">
                  {contentState.products[selectedProductIndex].title}
                </h2>
              )}

              {isEditing ? (
                <textarea
                  value={contentState.products[selectedProductIndex].detailedDescription}
                  onChange={(e) =>
                    updateProductField(selectedProductIndex, "detailedDescription", e.target.value)
                  }
                  className="border-b w-full mb-4"
                />
              ) : (
                <p className="text-muted-foreground mb-4">
                  {contentState.products[selectedProductIndex].detailedDescription}
                </p>
              )}

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  {isEditing ? (
                    <input
                      value={contentState.products[selectedProductIndex].pricing}
                      onChange={(e) =>
                        updateProductField(selectedProductIndex, "pricing", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p>{contentState.products[selectedProductIndex].pricing}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  {isEditing ? (
                    <input
                      value={contentState.products[selectedProductIndex].timeline}
                      onChange={(e) =>
                        updateProductField(selectedProductIndex, "timeline", e.target.value)
                      }
                      className="border-b w-full"
                    />
                  ) : (
                    <p>{contentState.products[selectedProductIndex].timeline}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
