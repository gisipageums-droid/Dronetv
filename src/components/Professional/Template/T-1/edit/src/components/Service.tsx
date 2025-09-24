import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Smartphone,
  Globe,
  Database,
  Palette,
  Zap,
  ArrowRight,
  Check,
  Star,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Monitor,
  Briefcase,
  Lightbulb,
  Cpu,
  Cloud,
  Shield,
  SaveAll,
  Edit,
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  color: string;
  features: string[];
  pricing: string;
  deliveryTime: string;
}

const Service: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Available icons for services
  const availableIcons = {
    Globe: Globe,
    Smartphone: Smartphone,
    Database: Database,
    Code: Code,
    Palette: Palette,
    Zap: Zap,
    Monitor: Monitor,
    Briefcase: Briefcase,
    Lightbulb: Lightbulb,
    Cpu: Cpu,
    Cloud: Cloud,
    Shield: Shield,
  };

  const colorOptions = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500",
    "from-red-500 to-pink-500",
    "from-emerald-500 to-teal-500",
  ];

  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Web Development",
      shortDescription: "Modern, responsive websites built with cutting-edge technologies",
      fullDescription: "Custom web applications using React, Next.js, and modern frameworks. Focus on performance, SEO, and user experience.",
      icon: "Globe",
      color: "from-blue-500 to-cyan-500",
      features: ["Responsive Design", "SEO Optimized", "Fast Performance", "Modern Frameworks"],
      pricing: "Starting at $2,500",
      deliveryTime: "2-4 weeks",
    },
    {
      id: 2,
      title: "Mobile App Development",
      shortDescription: "Native and cross-platform mobile applications",
      fullDescription: "iOS and Android apps built with React Native and Flutter. Native performance with cross-platform efficiency.",
      icon: "Smartphone",
      color: "from-purple-500 to-pink-500",
      features: ["Cross-Platform", "Native Performance", "App Store Ready", "Push Notifications"],
      pricing: "Starting at $5,000",
      deliveryTime: "4-8 weeks",
    },
    {
      id: 3,
      title: "Backend Development",
      shortDescription: "Scalable server-side solutions and APIs",
      fullDescription: "Robust backend systems using Node.js, Python, and cloud services. RESTful APIs and microservices architecture.",
      icon: "Database",
      color: "from-green-500 to-emerald-500",
      features: ["RESTful APIs", "Database Design", "Cloud Integration", "Scalable Architecture"],
      pricing: "Starting at $3,000",
      deliveryTime: "3-6 weeks",
    },
    {
      id: 4,
      title: "Full-Stack Development",
      shortDescription: "Complete end-to-end application development",
      fullDescription: "Comprehensive solutions covering frontend, backend, database, and deployment. One-stop development service.",
      icon: "Code",
      color: "from-orange-500 to-red-500",
      features: ["End-to-End Solution", "Database Integration", "DevOps Setup", "Maintenance Support"],
      pricing: "Starting at $7,500",
      deliveryTime: "6-12 weeks",
    },
    {
      id: 5,
      title: "UI/UX Design",
      shortDescription: "Beautiful, user-centered design solutions",
      fullDescription: "Modern interface design with focus on user experience. Wireframing, prototyping, and design systems.",
      icon: "Palette",
      color: "from-pink-500 to-rose-500",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      pricing: "Starting at $1,500",
      deliveryTime: "1-3 weeks",
    },
    {
      id: 6,
      title: "Performance Optimization",
      shortDescription: "Speed up and optimize existing applications",
      fullDescription: "Improve application performance, reduce loading times, and enhance user experience through optimization.",
      icon: "Zap",
      color: "from-yellow-500 to-orange-500",
      features: ["Speed Optimization", "Code Refactoring", "Bundle Analysis", "Performance Monitoring"],
      pricing: "Starting at $1,000",
      deliveryTime: "1-2 weeks",
    },
  ]);

  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    icon: "Code",
    color: "from-blue-500 to-cyan-500",
    features: [""],
    pricing: "",
    deliveryTime: "",
  });

  const [editForm, setEditForm] = useState<Service | null>(null);

  const handleAddNew = () => {
    if (newService.title && newService.shortDescription) {
      const id = Math.max(...services.map(s => s.id), 0) + 1;
      setServices([...services, { 
        ...newService, 
        id,
        features: newService.features.filter(f => f.trim() !== "")
      }]);
      setNewService({
        title: "",
        shortDescription: "",
        fullDescription: "",
        icon: "Code",
        color: "from-blue-500 to-cyan-500",
        features: [""],
        pricing: "",
        deliveryTime: "",
      });
      setIsAddingNew(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditForm({ ...service });
    setEditingId(service.id);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setServices(services.map(s => 
        s.id === editForm.id ? {
          ...editForm,
          features: editForm.features.filter(f => f.trim() !== "")
        } : s
      ));
      setEditForm(null);
      setEditingId(null);
    }
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleCancelEdit = () => {
    setEditForm(null);
    setEditingId(null);
    setIsAddingNew(false);
  };

  const updateFeature = (data: Service | Omit<Service, 'id'>, index: number, value: string, isEdit: boolean = false) => {
    const newFeatures = [...data.features];
    newFeatures[index] = value;
    
    if (isEdit && editForm) {
      setEditForm({ ...editForm, features: newFeatures });
    } else {
      setNewService({ ...newService, features: newFeatures });
    }
  };

  const addFeature = (isEdit: boolean = false) => {
    if (isEdit && editForm) {
      setEditForm({ ...editForm, features: [...editForm.features, ""] });
    } else {
      setNewService({ ...newService, features: [...newService.features, ""] });
    }
  };

  const removeFeature = (index: number, isEdit: boolean = false) => {
    if (isEdit && editForm) {
      setEditForm({ ...editForm, features: editForm.features.filter((_, i) => i !== index) });
    } else {
      setNewService({ ...newService, features: newService.features.filter((_, i) => i !== index) });
    }
  };

  const ServiceForm = ({ 
    data, 
    onChange, 
    isNew = false 
  }: { 
    data: Omit<Service, 'id'> | Service, 
    onChange: (field: string, value: string | string[]) => void,
    isNew?: boolean 
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-dashed border-orange-300 dark:border-orange-600">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Service Title"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <select
            value={data.icon}
            onChange={(e) => onChange('icon', e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          >
            {Object.keys(availableIcons).map(iconName => (
              <option key={iconName} value={iconName}>{iconName}</option>
            ))}
          </select>
        </div>
        
        <textarea
          placeholder="Short Description"
          value={data.shortDescription}
          onChange={(e) => onChange('shortDescription', e.target.value)}
          rows={2}
          className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
        />
        
        <textarea
          placeholder="Full Description"
          value={data.fullDescription}
          onChange={(e) => onChange('fullDescription', e.target.value)}
          rows={3}
          className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Pricing (e.g., Starting at $2,500)"
            value={data.pricing}
            onChange={(e) => onChange('pricing', e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Delivery Time (e.g., 2-4 weeks)"
            value={data.deliveryTime}
            onChange={(e) => onChange('deliveryTime', e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Color Scheme:</label>
          <select
            value={data.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          >
            {colorOptions.map(color => (
              <option key={color} value={color}>
                {color.replace('from-', '').replace(' to-', ' → ').replace(/-500|-400/g, '')}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-700 dark:text-gray-300 font-medium">Features:</label>
            <button
              type="button"
              onClick={() => addFeature(!isNew)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {data.features.map((feature, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Feature"
                  value={feature}
                  onChange={(e) => updateFeature(data, index, e.target.value, !isNew)}
                  className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                {data.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index, !isNew)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={isNew ? handleAddNew : handleSaveEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isNew ? 'Add Service' : 'Save Changes'}</span>
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Edit Mode Toggle */}
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              isEditMode 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-lg'
            }`}
          >
            {isEditMode ? <SaveAll className="h-6 w-6" /> : <Edit className="h-6 w-6" />}
          </button>
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My{" "}
            <span className="text-orange-400">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive development solutions tailored to bring your ideas to
            life with modern technologies and best practices.
          </p>
        </motion.div>

        {/* Add New Button */}
        {isEditMode && (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Service</span>
            </button>
          </div>
        )}

        {/* New Service Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <ServiceForm
                data={newService}
                onChange={(field, value) => 
                  setNewService(prev => ({ ...prev, [field]: value }))
                }
                isNew={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence>
            {services.map((service, index) => {
              const IconComponent = availableIcons[service.icon as keyof typeof availableIcons];
              const isHovered = hoveredService === service.id;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onHoverStart={() => setHoveredService(service.id)}
                  onHoverEnd={() => setHoveredService(null)}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                >
                  {/* Edit Controls */}
                  {isEditMode && (
                    <div className="absolute top-3 right-3 flex space-x-2 z-20">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {editingId === service.id ? (
                    <ServiceForm
                      data={editForm!}
                      onChange={(field, value) => 
                        setEditForm(prev => prev ? ({ ...prev, [field]: value }) : null)
                      }
                    />
                  ) : (
                    <>
                      {/* Service Icon */}
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Service Title */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <motion.p
                        layout
                        className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed transition-all duration-300"
                      >
                        {isHovered
                          ? service.fullDescription
                          : service.shortDescription}
                      </motion.p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              isHovered
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0.7, x: 0 }
                            }
                            transition={{ delay: isHovered ? idx * 0.1 : 0 }}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                          >
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>

                      {/* Pricing and Timeline */}
                      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Starting at
                          </p>
                          <p
                            className={`font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}
                          >
                            {service.pricing}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Delivery
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {service.deliveryTime}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full bg-gradient-to-r ${service.color} text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg`}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>

                      {/* Hover Effect Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                      />
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Why Choose Me Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-12 shadow-xl"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose My Services?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Quality Focused
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Clean, maintainable code following industry best practices and
                standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Fast Delivery
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Efficient development process with regular updates and on-time
                delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                Full Support
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Ongoing maintenance and support to ensure your project stays
                up-to-date.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Service;