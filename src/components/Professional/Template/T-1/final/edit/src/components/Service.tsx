import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  SaveAll,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  color?: string;
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
    features:
      Array.isArray(initial.features) && initial.features.length > 0
        ? initial.features
        : [""],
    pricing: initial.pricing ?? "",
    deliveryTime: initial.deliveryTime ?? "",
  }));

  // Character limits
  const CHAR_LIMITS = {
    title: 100,
    shortDescription: 200,
    fullDescription: 1000,
    feature: 100,
    pricing: 50,
    deliveryTime: 50,
  };

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
      features:
        Array.isArray(initial.features) && initial.features.length > 0
          ? initial.features
          : [""],
      pricing: initial.pricing ?? "",
      deliveryTime: initial.deliveryTime ?? "",
    });
  }, [initial]);

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

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
        <div className="space-y-1">
          <input
            ref={titleRef}
            type="text"
            placeholder="Service Title"
            value={local.title}
            onChange={(e) => setField("title", e.target.value)}
            maxLength={CHAR_LIMITS.title}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          />
          <div
            className={`text-sm text-right ${getCharCountColor(
              local.title.length,
              CHAR_LIMITS.title
            )}`}
          >
            {local.title.length}/{CHAR_LIMITS.title}
          </div>
        </div>

        <div className="space-y-1">
          <textarea
            placeholder="Short Description"
            value={local.shortDescription}
            onChange={(e) => setField("shortDescription", e.target.value)}
            maxLength={CHAR_LIMITS.shortDescription}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          />
          <div
            className={`text-sm text-right ${getCharCountColor(
              local.shortDescription.length,
              CHAR_LIMITS.shortDescription
            )}`}
          >
            {local.shortDescription.length}/{CHAR_LIMITS.shortDescription}
          </div>
        </div>

        <div className="space-y-1">
          <textarea
            placeholder="Full Description"
            value={local.fullDescription}
            onChange={(e) => setField("fullDescription", e.target.value)}
            maxLength={CHAR_LIMITS.fullDescription}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
          />
          <div
            className={`text-sm text-right ${getCharCountColor(
              local.fullDescription.length,
              CHAR_LIMITS.fullDescription
            )}`}
          >
            {local.fullDescription.length}/{CHAR_LIMITS.fullDescription}
          </div>
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
              <div key={idx} className="space-y-1">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Feature"
                    value={f}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    maxLength={CHAR_LIMITS.feature}
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
                <div
                  className={`text-xs text-right ${getCharCountColor(
                    f.length,
                    CHAR_LIMITS.feature
                  )}`}
                >
                  {f.length}/{CHAR_LIMITS.feature}
                </div>
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

  // Character limits for section headers
  const CHAR_LIMITS = {
    heading: 100,
    description: 500,
  };

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

  const getCharCountColor = (current: number, max: number) => {
    if (current >= max) return "text-red-500";
    if (current >= max * 0.9) return "text-yellow-500";
    return "text-gray-500";
  };

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
              <button
                onClick={handleSaveSection}
                className="p-3 rounded-full bg-green-500"
              >
                <SaveAll className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  toast.success("Cancel Update");
                  setIsEditMode(false);
                }}
                className="p-3 rounded-full bg-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-500"
            >
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
              <div className="space-y-1">
                <input
                  type="text"
                  value={serviceContent.heading}
                  onChange={(e) =>
                    handleContentChange("heading", e.target.value)
                  }
                  maxLength={CHAR_LIMITS.heading}
                  className="w-full max-w-lg p-2 mx-auto text-4xl font-bold text-gray-900 bg-gray-100 border-2 rounded-lg lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  placeholder="Section heading"
                />
                <div
                  className={`text-sm text-right max-w-lg mx-auto ${getCharCountColor(
                    serviceContent.heading.length,
                    CHAR_LIMITS.heading
                  )}`}
                >
                  {serviceContent.heading.length}/{CHAR_LIMITS.heading}
                </div>
              </div>
              <div className="space-y-1">
                <textarea
                  value={serviceContent.description}
                  onChange={(e) =>
                    handleContentChange("description", e.target.value)
                  }
                  maxLength={CHAR_LIMITS.description}
                  className="w-full max-w-3xl p-2 mx-auto text-xl text-gray-600 bg-gray-100 border-2 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-400 focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                  rows={2}
                  placeholder="Section description"
                />
                <div
                  className={`text-sm text-right max-w-3xl mx-auto ${getCharCountColor(
                    serviceContent.description.length,
                    CHAR_LIMITS.description
                  )}`}
                >
                  {serviceContent.description.length}/{CHAR_LIMITS.description}
                </div>
              </div>
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
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${
                            service.color
                          } mb-6 ${
                            isEditMode ? "" : "group-hover:scale-110"
                          } transition-transform duration-300 bg-yellow-500 text-xl font-extrabold`}
                        >
                          <span className="uppercase text-white">
                            {service.title[0]}
                          </span>
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

                        <motion.a
                          href="#contact"
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
                        </motion.a>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Service;
