import React, { useState } from "react";
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
  Edit
} from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
}

const Testimonials: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO, TechStart Inc.",
      company: "TechStart Inc.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and ability to understand our business needs made the entire process smooth and efficient.",
      rating: 5,
      project: "E-Commerce Platform",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "CTO, DataFlow Solutions",
      company: "DataFlow Solutions",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "Working with John was a game-changer for our company. He transformed our complex data requirements into an intuitive platform that our team loves using. Highly recommended!",
      rating: 5,
      project: "Data Analytics Dashboard",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Product Manager, InnovateLab",
      company: "InnovateLab",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "Johns expertise in both frontend and backend development allowed us to build a cohesive product. His communication skills and proactive approach made our collaboration seamless.",
      rating: 5,
      project: "Project Management Tool",
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Founder, EduTech Pro",
      company: "EduTech Pro",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "John built our learning management system from the ground up. The scalability and user experience he delivered have been crucial to our success. A true professional!",
      rating: 5,
      project: "Learning Management System",
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "Marketing Director, GrowthCo",
      company: "GrowthCo",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The mobile app John developed for us has received fantastic user feedback. His ability to translate our vision into a beautiful, functional product was impressive.",
      rating: 5,
      project: "Mobile Application",
    },
  ]);

  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id'>>({
    name: "",
    position: "",
    company: "",
    image: "",
    content: "",
    rating: 5,
    project: "",
  });

  const [editForm, setEditForm] = useState<Testimonial | null>(null);

  const handleAddNew = () => {
    if (newTestimonial.name && newTestimonial.content) {
      const id = Math.max(...testimonials.map(t => t.id), 0) + 1;
      setTestimonials([...testimonials, { ...newTestimonial, id }]);
      setNewTestimonial({
        name: "",
        position: "",
        company: "",
        image: "",
        content: "",
        rating: 5,
        project: "",
      });
      setIsAddingNew(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditForm({ ...testimonial });
    setEditingId(testimonial.id);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setTestimonials(testimonials.map(t => 
        t.id === editForm.id ? editForm : t
      ));
      setEditForm(null);
      setEditingId(null);
    }
  };

  const handleDelete = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleCancelEdit = () => {
    setEditForm(null);
    setEditingId(null);
    setIsAddingNew(false);
  };

  const TestimonialForm = ({ 
    data, 
    onChange, 
    isNew = false 
  }: { 
    data: Omit<Testimonial, 'id'> | Testimonial, 
    onChange: (field: string, value: string | number) => void,
    isNew?: boolean 
  }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-dashed border-orange-300 dark:border-orange-600">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Position"
            value={data.position}
            onChange={(e) => onChange('position', e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company"
            value={data.company}
            onChange={(e) => onChange('company', e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Project"
            value={data.project}
            onChange={(e) => onChange('project', e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
        
        <input
          type="url"
          placeholder="Image URL"
          value={data.image}
          onChange={(e) => onChange('image', e.target.value)}
          className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
        
        <textarea
          placeholder="Testimonial content"
          value={data.content}
          onChange={(e) => onChange('content', e.target.value)}
          rows={4}
          className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
        />
        
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 dark:text-gray-300 font-medium">Rating:</label>
          <select
            value={data.rating}
            onChange={(e) => onChange('rating', parseInt(e.target.value))}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={isNew ? handleAddNew : handleSaveEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isNew ? 'Add' : 'Save'}</span>
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
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Edit Mode Toggle */}
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`w-12 h-12 rounded-full flex items-center justify-center p-2 transition-alll ${
              isEditMode 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
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
            What Clients <span className="text-orange-400">Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say
            about working with me.
          </p>
        </motion.div>

        {/* Add New Button */}
        {isEditMode && (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Testimonial</span>
            </button>
          </div>
        )}

        {/* New Testimonial Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <TestimonialForm
                data={newTestimonial}
                onChange={(field, value) => 
                  setNewTestimonial(prev => ({ ...prev, [field]: value }))
                }
                isNew={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Edit Controls */}
                {isEditMode && (
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {editingId === testimonial.id ? (
                  <TestimonialForm
                    data={editForm!}
                    onChange={(field, value) => 
                      setEditForm(prev => prev ? ({ ...prev, [field]: value }) : null)
                    }
                  />
                ) : (
                  <>
                    {/* Quote Icon */}
                    <div className="flex justify-end mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-yellow to-accent-orange rounded-full flex items-center justify-center">
                        <Quote className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Rating */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-accent-yellow text-accent-yellow"
                        />
                      ))}
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-accent-orange font-medium text-sm">
                          {testimonial.position}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Project Tag */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-accent-yellow/20 to-accent-orange/20 border border-accent-orange/30 rounded-full">
                        <span className="text-accent-orange font-medium text-sm">
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

        {/* Client Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Trusted by Amazing Companies
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {Array.from(new Set(testimonials.map(t => t.company))).map((company, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-gray-700 dark:text-gray-300"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;