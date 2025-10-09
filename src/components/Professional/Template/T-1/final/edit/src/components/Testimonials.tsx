// Testimonials.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  SaveAll,
  Edit,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
  date?: string;
}

export interface TestimonialContent {
  subtitle: string;
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

interface TestimonialsProps {
  content?: TestimonialContent;
  onSave: (updatedContent: TestimonialContent) => void;
  userId?: string;
}

const defaultContent: TestimonialContent = {
  subtitle: "client success stories and feedback",
  heading: "What Clients Say",
  description: "testimonials from satisfied clients",
  testimonials: [],
};

/* -----------------------
   Memoized TestimonialForm
   ----------------------- */
type FormData = Omit<Testimonial, "id">;

const TestimonialForm: React.FC<{
  initial: FormData;
  onCancel: () => void;
  onSave: (payload: FormData) => void | Promise<void>;
  autoFocus?: boolean;
  userId?: string;
}> = React.memo(({ initial, onCancel, onSave, autoFocus = false, userId }) => {
  const [local, setLocal] = useState<FormData>(() => ({
    name: initial.name ?? "",
    position: initial.position ?? "",
    company: initial.company ?? "",
    image: initial.image ?? "",
    content: initial.content ?? "",
    rating: initial.rating ?? 5,
    project: initial.project ?? "",
    date: initial.date ?? new Date().getFullYear().toString(),
  }));

  const [isUploading, setIsUploading] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  // Sync when initial changes
  useEffect(() => {
    setLocal({
      name: initial.name ?? "",
      position: initial.position ?? "",
      company: initial.company ?? "",
      image: initial.image ?? "",
      content: initial.content ?? "",
      rating: initial.rating ?? 5,
      project: initial.project ?? "",
      date: initial.date ?? new Date().getFullYear().toString(),
    });
  }, [initial]);

  // Auto-focus effect
  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => {
        nameRef.current?.focus();
        const el = nameRef.current;
        if (el) el.setSelectionRange(el.value.length, el.value.length);
      }, 40);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const setField = (k: keyof FormData, v: any) =>
    setLocal((p) => ({ ...p, [k]: v }));

  // Image upload handler - same as Hero.tsx
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // First set local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setLocal((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);

      setIsUploading(true);

      // Upload to S3
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId!);
      formData.append("fieldName", "testimonialImage");

      try {
        const uploadResponse = await fetch(
          `https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          setLocal((prev) => ({
            ...prev,
            image: uploadData.s3Url,
          }));
          toast.success("Image uploaded successfully!");
        } else {
          const errorData = await uploadResponse.json();
          toast.error(
            `Image upload failed: ${errorData.message || "Unknown error"}`
          );
          return;
        }
      } catch (error) {
        toast.error("Image upload failed due to network error");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!local.name.trim() || !local.content.trim()) {
      toast.error("Please provide name and testimonial content.");
      return;
    }

    try {
      await onSave(local);
    } catch (err) {
      console.error("Error saving testimonial form:", err);
      toast.error("Save failed.");
    }
  };

  return (
    <div
      className="p-6 border-2 border-orange-300 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl dark:border-orange-600"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            ref={nameRef}
            type="text"
            placeholder="Name *"
            value={local.name}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Position"
            value={local.position}
            onChange={(e) => setField("position", e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Company"
            value={local.company}
            onChange={(e) => setField("company", e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Project"
            value={local.project}
            onChange={(e) => setField("project", e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <input
              type="url"
              placeholder="Image URL"
              value={local.image}
              onChange={(e) => setField("image", e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">
                {isUploading ? "Uploading..." : "Upload Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <textarea
          placeholder="Testimonial content *"
          value={local.content}
          onChange={(e) => setField("content", e.target.value)}
          rows={4}
          className="w-full p-3 bg-white border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />

        <div className="flex items-center space-x-2">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Rating:
          </label>
          <select
            value={local.rating}
            onChange={(e) => setField("rating", parseInt(e.target.value))}
            className="p-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg ${
              isUploading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isUploading ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={onCancel}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
});
(TestimonialForm as any).displayName = "TestimonialFormMemo";

/* -----------------------
   Main Testimonials component
   ----------------------- */
const Testimonials: React.FC<TestimonialsProps> = ({
  content,
  onSave,
  userId,
}) => {
  const [testimonialContent, setTestimonialContent] =
    useState<TestimonialContent>(defaultContent);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Store original content for cancel functionality
  const [originalContent, setOriginalContent] = useState<TestimonialContent>(defaultContent);
  const [originalTestimonials, setOriginalTestimonials] = useState<Testimonial[]>([]);

  // Initialize content
  useEffect(() => {
    if (!content) return;

    const processedTestimonials = (content.testimonials ?? []).map((t) => ({
      ...t,
      id: typeof t.id === "number" ? Math.floor(t.id) : parseInt(String(t.id)),
      rating: Math.floor(t.rating || 5),
    }));

    const newContent = {
      subtitle: content.subtitle ?? defaultContent.subtitle,
      heading: content.heading ?? defaultContent.heading,
      description: content.description ?? defaultContent.description,
      testimonials: processedTestimonials,
    };

    setTestimonialContent(newContent);
    setTestimonials(processedTestimonials);
    
    // Store original content for cancel functionality
    setOriginalContent(newContent);
    setOriginalTestimonials(processedTestimonials);
  }, [content]);

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setIsAddingNew(false);
  };

  const handleAddNew = async (payload?: Omit<Testimonial, "id">) => {
    const source = payload ?? {
      name: "",
      position: "",
      company: "",
      image: "",
      content: "",
      rating: 5,
      project: "",
      date: new Date().getFullYear().toString(),
    };

    if (!source.name.trim() || !source.content.trim()) {
      toast.error("Please provide a name and testimonial content.");
      return;
    }

    const id =
      testimonials.length > 0
        ? Math.max(...testimonials.map((t) => t.id)) + 1
        : 1;
    const created: Testimonial = { ...source, id };
    const updated = [...testimonials, created];

    setTestimonials(updated);
    setTestimonialContent((p) => ({ ...p, testimonials: updated }));
    setIsAddingNew(false);

    toast.success("Testimonial added.");
    onSave?.({ ...testimonialContent, testimonials: updated });
  };

  const handleSaveEdit = (payload: FormData) => {
    if (editingId == null) return;

    const updated = testimonials.map((t) =>
      t.id === editingId ? { ...t, ...payload } : t
    );

    setTestimonials(updated);
    setTestimonialContent((p) => ({ ...p, testimonials: updated }));
    setEditingId(null);

    toast.success("Testimonial updated.");
    // onSave?.({ ...testimonialContent, testimonials: updated });
  };

  const handleDelete = (id: number) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    setTestimonialContent((p) => ({ ...p, testimonials: updated }));
    toast.success("Testimonial removed.");
    onSave?.({ ...testimonialContent, testimonials: updated });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleContentChange = (
    field: keyof TestimonialContent,
    value: string
  ) => {
    const updated = { ...testimonialContent, [field]: value };
    setTestimonialContent(updated);
    // Auto-save section content changes
    // onSave?.({ ...updated, testimonials });
  };

  const handleSaveSection = () => {
    onSave?.({ ...testimonialContent, testimonials });
    setIsEditMode(false);
    toast.success("Testimonials section saved.");
    
    // Update original content after saving
    setOriginalContent(testimonialContent);
    setOriginalTestimonials(testimonials);
  };

  const handleCancelSection = () => {
    // Revert to original content when canceling
    setTestimonialContent(originalContent);
    setTestimonials(originalTestimonials);
    setIsEditMode(false);
    toast.success("Changes cancelled.");
  };

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 px-4 py-2 flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleSaveSection}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                title="Save Changes"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={handleCancelSection}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Cancel Editing"
              >
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-lg"
              title="Edit Skills"
            >
              <Edit className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          {isEditMode ? (
            <div className="space-y-4">
              <input
                type="text"
                value={testimonialContent.heading}
                onChange={(e) => handleContentChange("heading", e.target.value)}
                className="w-full max-w-2xl p-2 mx-auto text-4xl font-bold text-gray-900 bg-gray-100 border-2 rounded-lg lg:text-5xl dark:bg-gray-800 dark:text-white focus:border-purple-500 dark:focus:border-yellow-400 focus:outline-none"
                placeholder="Section heading"
              />
              <textarea
                value={testimonialContent.description}
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
                {testimonialContent.heading.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-orange-400">
                  {testimonialContent.heading.split(" ").slice(-1)}
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                {testimonialContent.description}
              </p>
            </>
          )}
        </motion.div>

        {isEditMode && (
          <div className="mb-8 text-center">
            <button
              onClick={() => {
                setIsAddingNew(true);
                setEditingId(null);
              }}
              className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Testimonial</span>
            </button>
          </div>
        )}

        <AnimatePresence>
          {isEditMode && isAddingNew && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <TestimonialForm
                initial={{
                  name: "",
                  position: "",
                  company: "",
                  image: "",
                  content: "",
                  rating: 5,
                  project: "",
                  date: new Date().getFullYear().toString(),
                }}
                autoFocus
                userId={userId}
                onCancel={() => setIsAddingNew(false)}
                onSave={handleAddNew}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {testimonials.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
              No testimonials available yet.
            </p>
            {isEditMode && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-6 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Add Your First Testimonial
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative p-6 transition-all duration-300 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl hover:shadow-2xl"
                >
                  {isEditMode && (
                    <div className="absolute flex space-x-2 top-3 right-3">
                      <button
                        onClick={() => startEdit(testimonial)}
                        className="p-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {editingId === testimonial.id ? (
                    <TestimonialForm
                      initial={{
                        name: testimonial.name,
                        position: testimonial.position,
                        company: testimonial.company,
                        image: testimonial.image,
                        content: testimonial.content,
                        rating: testimonial.rating,
                        project: testimonial.project,
                        date:
                          testimonial.date ??
                          new Date().getFullYear().toString(),
                      }}
                      autoFocus
                      userId={userId}
                      onCancel={handleCancelEdit}
                      onSave={handleSaveEdit}
                    />
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Quote className="w-5 h-5 text-black dark:text-white" />
                        </div>
                      </div>

                      <blockquote className="mb-6 italic leading-relaxed text-gray-700 dark:text-gray-300">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex mb-4 space-x-1">
                        {[...Array(Math.max(0, testimonial.rating))].map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-yellow-500"
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="object-cover w-12 h-12 rounded-full"
                          onError={(e) => {
                            // Fallback for broken images
                            (
                              e.target as HTMLImageElement
                            ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              testimonial.name
                            )}&background=random`;
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm font-medium text-orange-500">
                            {testimonial.position}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="inline-flex items-center px-3 py-1 border rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-orange-500/30">
                          <span className="text-sm font-medium text-orange-500">
                            {testimonial.project}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Trusted by Amazing Companies
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {Array.from(new Set(testimonials.map((t) => t.company))).map(
                (company, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="px-6 py-3 font-bold text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300"
                  >
                    {company}
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;