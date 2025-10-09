// Service.tsx (updated with proper state management and parent sync)
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Server,
} from "lucide-react";
import { toast } from "sonner";

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

export interface ServiceContent {
  subtitle: string;
  heading: string;
  description: string;
  services: Service[];
}

interface ServiceProps {
  content?: ServiceContent;
  onSave: (updatedContent: ServiceContent) => void;
}

const defaultContent: ServiceContent = {
  subtitle: "professional services to transform your business",
  heading: "What I Do ",
  description: "comprehensive services tailored to your needs",
  services: [],
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

/* ---------- ServiceForm Component (memoized) ---------- */
type FormData = Omit<Service, "id">;

const ServiceForm: React.FC<{
  initial: FormData;
  onCancel: () => void;
  onSave: (payload: FormData) => void;
  autoFocus?: boolean;
}> = React.memo(({ initial, onCancel, onSave, autoFocus = false }) => {
  const [local, setLocal] = useState<FormData>(() => ({
    title: initial.title ?? "",
    shortDescription: initial.shortDescription ?? "",
    fullDescription: initial.fullDescription ?? "",
    icon: initial.icon ?? "Code",
    color: initial.color ?? colorOptions[0],
    features:
      Array.isArray(initial.features) && initial.features.length > 0
        ? initial.features
        : [""],
    pricing: initial.pricing ?? "",
    deliveryTime: initial.deliveryTime ?? "",
  }));

  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => {
        titleRef.current?.focus();
        const el = titleRef.current;
        if (el) el.setSelectionRange(el.value.length, el.value.length);
      }, 40);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  useEffect(() => {
    setLocal({
      title: initial.title ?? "",
      shortDescription: initial.shortDescription ?? "",
      fullDescription: initial.fullDescription ?? "",
      icon: initial.icon ?? "Code",
      color: initial.color ?? colorOptions[0],
      features:
        Array.isArray(initial.features) && initial.features.length > 0
          ? initial.features
          : [""],
      pricing: initial.pricing ?? "",
      deliveryTime: initial.deliveryTime ?? "",
    });
  }, [initial]);

  const setField = (k: keyof FormData, v: any) => {
    setLocal((prev) => ({ ...prev, [k]: v }));
  };

  const updateFeature = (i: number, v: string) => {
    setLocal((prev) => {
      const arr = [...prev.features];
      arr[i] = v;
      return { ...prev, features: arr };
    });
  };

  const addFeature = () =>
    setLocal((prev) => ({ ...prev, features: [...prev.features, ""] }));

  const removeFeature = (i: number) =>
    setLocal((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== i),
    }));

  const handleSave = () => {
    const cleaned = {
      ...local,
      features: local.features.filter((f) => f.trim() !== ""),
    };
    onSave(cleaned);
  };

  return (
    <div
      className="p-6 bg-white border-2 border-orange-300 border-dashed rounded-2xl dark:bg-gray-900 dark:border-orange-600"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            ref={titleRef}
            type="text"
            placeholder="Service Title"
            value={local.title}
            onChange={(e) => setField("title", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          />
          <select
            value={local.icon}
            onChange={(e) => setField("icon", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          >
            {Object.keys({
              Globe,
              Smartphone,
              Database,
              Code,
              Palette,
              Zap,
              Monitor,
              Briefcase,
              Lightbulb,
              Cpu,
              Cloud,
              Shield,
              Server,
            }).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Short Description"
          value={local.shortDescription}
          onChange={(e) => setField("shortDescription", e.target.value)}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
        />

        <textarea
          placeholder="Full Description"
          value={local.fullDescription}
          onChange={(e) => setField("fullDescription", e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Pricing (e.g., Starting at $2,500)"
            value={local.pricing}
            onChange={(e) => setField("pricing", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          />
          <input
            type="text"
            placeholder="Delivery Time (e.g., 2-4 weeks)"
            value={local.deliveryTime}
            onChange={(e) => setField("deliveryTime", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Color Scheme:
          </label>
          <select
            value={local.color}
            onChange={(e) => setField("color", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          >
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color
                  .replace("from-", "")
                  .replace(" to-", " → ")
                  .replace(/-500|-400/g, "")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              Features :
            </label>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center px-3 py-1 space-x-1 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {local.features.map((f, idx) => (
              <div key={idx} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Feature"
                  value={f}
                  onChange={(e) => updateFeature(idx, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
                />
                {local.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
});
(ServiceForm as any).displayName = "ServiceFormMemo";

/* ---------- Main Service Component ---------- */
const Service: React.FC<ServiceProps> = ({ content, onSave }) => {
  const [serviceContent, setServiceContent] =
    useState<ServiceContent>(defaultContent);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  // Sync with parent content
  useEffect(() => {
    if (content) {
      const processedServices = (content.services ?? []).map((s) => ({
        ...s,
        id:
          typeof s.id === "number" ? Math.floor(s.id) : parseInt(String(s.id)),
        features: Array.isArray(s.features) ? s.features : [],
        icon: s.icon || "Code",
        color: s.color || "from-blue-500 to-cyan-500",
      }));

      setServiceContent({
        subtitle: content.subtitle ?? defaultContent.subtitle,
        heading: content.heading ?? defaultContent.heading,
        description: content.description ?? defaultContent.description,
        services: processedServices,
      });
    }
  }, [content]);

  const availableIcons = useMemo(
    () => ({
      Globe,
      Smartphone,
      Database,
      Code,
      Palette,
      Zap,
      Monitor,
      Briefcase,
      Lightbulb,
      Cpu,
      Cloud,
      Shield,
      Server,
    }),
    []
  );

  const handleContentChange = (field: keyof ServiceContent, value: string) => {
    const updated = { ...serviceContent, [field]: value };
    setServiceContent(updated);
    onSave(updated);
  };

  const handleAddService = (payload: Omit<Service, "id">) => {
    const id =
      serviceContent.services.length > 0
        ? Math.max(...serviceContent.services.map((s) => s.id)) + 1
        : 1;

    const newService: Service = {
      ...payload,
      id,
      features: payload.features.filter((f) => f.trim() !== ""),
    };

    const updatedServices = [...serviceContent.services, newService];
    const updatedContent = { ...serviceContent, services: updatedServices };

    setServiceContent(updatedContent);
    onSave(updatedContent);
    setIsAddingNew(false);
    toast.success("Service added successfully!");
  };

  const handleEditService = (payload: Omit<Service, "id">) => {
    if (editingId === null) return;

    const updatedServices = serviceContent.services.map((s) =>
      s.id === editingId
        ? {
            ...s,
            ...payload,
            features: payload.features.filter((f) => f.trim() !== ""),
          }
        : s
    );

    const updatedContent = { ...serviceContent, services: updatedServices };
    setServiceContent(updatedContent);
    onSave(updatedContent);
    setEditingId(null);
    toast.success("Service updated successfully!");
  };

  const handleDeleteService = (id: number) => {
    const updatedServices = serviceContent.services.filter((s) => s.id !== id);
    const updatedContent = { ...serviceContent, services: updatedServices };

    setServiceContent(updatedContent);
    onSave(updatedContent);

    if (editingId === id) {
      setEditingId(null);
    }

    toast.success("Service deleted successfully!");
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSaveSection = () => {
    onSave(serviceContent);
    setIsEditMode(false);
    setEditingId(null);
    setIsAddingNew(false);
    toast.success("Services section saved successfully!");
  };

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Edit Mode Toggle */}
        <div className="absolute top-0 right-0">
          {isEditMode ? (
            <div className="flex items-center gap-2">
              <button onClick={handleSaveSection} className="p-3 rounded-full bg-green-500">
                <SaveAll className="w-6 h-6" />
              </button>
              <button onClick={() => {
                toast.success("Cancel Update")
                setIsEditMode(false)
              }} className="p-3 rounded-full bg-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="p-3 rounded-full bg-gray-500">
              <Edit className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          {isEditMode ? (
            <div
              className="space-y-4"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={serviceContent.heading}
                onChange={(e) => handleContentChange("heading", e.target.value)}
                className="w-full max-w-lg p-2 mx-auto text-4xl font-bold text-gray-900 bg-gray-100 border-2 rounded-lg lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                placeholder="Section heading"
              />
              <textarea
                value={serviceContent.description}
                onChange={(e) =>
                  handleContentChange("description", e.target.value)
                }
                className="w-full max-w-3xl p-2 mx-auto text-xl text-gray-600 bg-gray-100 border-2 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                rows={2}
                placeholder="Section description"
              />
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                {serviceContent.heading.split(" ")[0]}{" "}
                <span className="text-orange-400">
                  {serviceContent.heading.split(" ").slice(1).join(" ")}
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                {serviceContent.description}
              </p>
            </>
          )}
        </motion.div>

        {/* Add New Button */}
        {isEditMode && (
          <div className="mb-8 text-center">
            <button
              onClick={() => {
                setIsAddingNew(true);
                setEditingId(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Service</span>
            </button>
          </div>
        )}

        {/* New Service Form */}
        <AnimatePresence>
          {isEditMode && isAddingNew && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <ServiceForm
                initial={{
                  title: "",
                  shortDescription: "",
                  fullDescription: "",
                  icon: "Code",
                  color: colorOptions[0],
                  features: [""],
                  pricing: "",
                  deliveryTime: "",
                }}
                autoFocus={true}
                onCancel={handleCancel}
                onSave={handleAddService}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Grid or Empty State */}
        {serviceContent.services.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              No services available yet.
            </p>
            {isEditMode && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-6 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Add Your First Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {serviceContent.services.map((service, index) => {
                const IconComponent =
                  availableIcons[service.icon as keyof typeof availableIcons] ||
                  Code;
                const isCardEditing = editingId === service.id;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    whileHover={
                      isEditMode || isCardEditing
                        ? undefined
                        : { y: -10, scale: 1.02 }
                    }
                    onHoverStart={
                      isEditMode || isCardEditing
                        ? undefined
                        : () => setHoveredService(service.id)
                    }
                    onHoverEnd={
                      isEditMode || isCardEditing
                        ? undefined
                        : () => setHoveredService(null)
                    }
                    className="relative p-8 transition-all duration-300 bg-white border border-gray-100 shadow-xl rounded-2xl group dark:bg-gray-900 hover:shadow-2xl dark:border-gray-800"
                  >
                    {/* Edit Controls */}
                    {isEditMode && !isCardEditing && (
                      <div className="absolute z-20 flex gap-2 top-3 right-3">
                        <button
                          onClick={() => setEditingId(service.id)}
                          className="p-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {isCardEditing ? (
                      <ServiceForm
                        initial={{
                          title: service.title,
                          shortDescription: service.shortDescription,
                          fullDescription: service.fullDescription,
                          icon: service.icon,
                          color: service.color,
                          features: service.features,
                          pricing: service.pricing,
                          deliveryTime: service.deliveryTime,
                        }}
                        autoFocus
                        onCancel={handleCancel}
                        onSave={handleEditService}
                      />
                    ) : (
                      <>
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${
                            service.color
                          } mb-6 ${
                            isEditMode ? "" : "group-hover:scale-110"
                          } transition-transform duration-300`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                          {service.title}
                        </h3>

                        <motion.p
                          layout
                          className="mb-6 leading-relaxed text-gray-600 transition-all duration-300 dark:text-gray-400"
                        >
                          {hoveredService === service.id
                            ? service.fullDescription
                            : service.shortDescription}
                        </motion.p>

                        <ul className="mb-6 space-y-2">
                          {service.features.map((feature, idx) => (
                            <motion.li
                              key={`${service.id}-feat-${idx}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={
                                hoveredService === service.id
                                  ? { opacity: 1, x: 0 }
                                  : { opacity: 0.9, x: 0 }
                              }
                              transition={{
                                delay:
                                  hoveredService === service.id
                                    ? idx * 0.06
                                    : 0,
                              }}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            >
                              <Check className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                              {feature}
                            </motion.li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Pricing
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

                        <motion.button
                          whileHover={isEditMode ? undefined : { scale: 1.05 }}
                          whileTap={isEditMode ? undefined : { scale: 0.95 }}
                          className={`w-full bg-orange-400 ${
                            service.color
                          } text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                            isEditMode ? "" : "group-hover:shadow-lg"
                          }`}
                        >
                          <span>Get Started</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.button>

                        {!isEditMode && (
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Why Choose Me Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="p-8 text-center bg-white shadow-xl rounded-3xl dark:bg-gray-900 lg:p-12"
        >
          <h3 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose My Services?
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                Quality Focused
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Clean, maintainable code following industry best practices and
                standards.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                Fast Delivery
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Efficient development process with regular updates and on-time
                delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                Full Support
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Ongoing maintenance and support to ensure your project stays
                up-to-date.
              </p>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default Service;
