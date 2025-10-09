import { Edit2, Loader2, Plus, Quote, Save, Star, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Custom Button component
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${
        sizes[size || 'default']
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Define types for Testimonial data based on your JSON
interface Testimonial {
  id: number;
  name: string;
  position: string;
  content: string;
  rating: number;
  project: string;
  date: string;
}

interface TestimonialsData {
  subtitle: string;
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

// Empty default data for Testimonials section
const defaultTestimonialsData: TestimonialsData = {
  subtitle: "",
  heading: "",
  description: "",
  testimonials: []
};

// Props interface
interface TestimonialsProps {
  testimonialsData?: TestimonialsData;
  onStateChange?: (data: TestimonialsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Testimonials({ 
  testimonialsData, 
  onStateChange, 
  userId, 
  professionalId, 
  templateSelection 
}: TestimonialsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<TestimonialsData>(defaultTestimonialsData);
  const [tempData, setTempData] = useState<TestimonialsData>(defaultTestimonialsData);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    return () => {
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
    };
  }, []);

  // Fake API fetch
  const fetchTestimonialsData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<TestimonialsData>((resolve) =>
        setTimeout(() => resolve(testimonialsData || defaultTestimonialsData), 1200)
      );
      setData(response);
      setTempData(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchTestimonialsData();
    }
  }, [isVisible, dataLoaded, isLoading, testimonialsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  // Save function
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save the updated data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states
      setData(tempData);
      
      setIsEditing(false);
      toast.success('Testimonials section saved successfully');

    } catch (error) {
      console.error('Error saving testimonials section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  // Stable update functions with useCallback
  const updateTestimonial = useCallback((index: number, field: keyof Testimonial, value: any) => {
    const updatedTestimonials = [...tempData.testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    setTempData({ ...tempData, testimonials: updatedTestimonials });
  }, [tempData]);

  const updateRating = useCallback((index: number, rating: number) => {
    const updatedTestimonials = [...tempData.testimonials];
    updatedTestimonials[index].rating = rating;
    setTempData({ ...tempData, testimonials: updatedTestimonials });
  }, [tempData]);

  const addTestimonial = useCallback(() => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: 'New Client',
      position: 'Position',
      content: 'Add a testimonial review here...',
      rating: 5,
      project: 'Project Type',
      date: '2024'
    };
    setTempData({
      ...tempData,
      testimonials: [...tempData.testimonials, newTestimonial]
    });
  }, [tempData]);

  const removeTestimonial = useCallback((index: number) => {
    if (tempData.testimonials.length <= 1) {
      toast.error("You must have at least one testimonial");
      return;
    }
    
    const updatedTestimonials = tempData.testimonials.filter((_, i) => i !== index);
    setTempData({ ...tempData, testimonials: updatedTestimonials });
  }, [tempData]);

  const updateSection = useCallback((field: keyof Omit<TestimonialsData, 'testimonials'>, value: string) => {
    setTempData({
      ...tempData,
      [field]: value
    });
  }, [tempData]);

  const displayData = isEditing ? tempData : data;

  // Loading state
  if (isLoading) {
    return (
      <section ref={testimonialsRef} id="testimonials" className="relative py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading testimonials data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={testimonialsRef} id="testimonials" className="relative py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-20'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 text-white shadow-md'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit
            </Button>
          ) : (
            <div className='flex gap-2 justify-end'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                size='sm'
                className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                disabled={isSaving}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
              <Button
                onClick={addTestimonial}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Testimonial
              </Button>
            </div>
          )}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayData.subtitle}
                onChange={(e) => updateSection('subtitle', e.target.value)}
                className="text-lg text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                placeholder="Subtitle (e.g., client success stories and feedback)"
              />
              <input
                type="text"
                value={displayData.heading}
                onChange={(e) => updateSection('heading', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                placeholder="Heading (e.g., What Clients Say)"
              />
              <textarea
                value={displayData.description}
                onChange={(e) => updateSection('description', e.target.value)}
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={2}
                placeholder="Description (e.g., testimonials from satisfied clients)"
              />
            </>
          ) : (
            <>
              {displayData.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-yellow-500 mb-2"
                >
                  {displayData.subtitle}
                </motion.p>
              )}
              {displayData.heading && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl text-foreground mb-4"
                >
                  {displayData.heading.split(' ')[0]}{' '}
                  {displayData.heading.split(' ').length > 1 && (
                    <span className="text-yellow-500">
                      {displayData.heading.split(' ').slice(1).join(' ')}
                    </span>
                  )}
                </motion.h2>
              )}
              {displayData.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  {displayData.description}
                </motion.p>
              )}
            </>
          )}
        </motion.div>

        {/* Testimonials Grid */}
        {displayData.testimonials.length > 0 || isEditing ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayData.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              >
                {isEditing && (
                  <Button
                    onClick={() => removeTestimonial(index)}
                    size='sm'
                    variant='outline'
                    className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1 z-10'
                  >
                    <Trash2 className='w-3 h-3' />
                  </Button>
                )}

                {/* Quote Icon */}
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-gray-900" />
                </div>

                {/* Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => isEditing && updateRating(index, i + 1)}
                      className={isEditing ? "cursor-pointer" : "cursor-default"}
                    >
                      <Star
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>

                {/* Review */}
                {isEditing ? (
                  <textarea
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                    className="text-muted-foreground leading-relaxed mb-6 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                    rows={4}
                    placeholder="Testimonial content"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>
                )}

                {/* Project and Date */}
                {isEditing ? (
                  <div className="mb-4 space-y-2">
                    <input
                      type="text"
                      value={testimonial.project}
                      onChange={(e) => updateTestimonial(index, 'project', e.target.value)}
                      className="text-sm text-yellow-500 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                      placeholder="Project type"
                    />
                    <input
                      type="text"
                      value={testimonial.date}
                      onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                      className="text-sm text-gray-500 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                      placeholder="Date"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-yellow-500">{testimonial.project}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                )}

                {/* Client Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <span className="text-gray-900 text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          className="text-foreground mb-1 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                          placeholder="Client name"
                        />
                        <input
                          type="text"
                          value={testimonial.position}
                          onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                          className="text-sm text-muted-foreground w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                          placeholder="Position"
                        />
                      </>
                    ) : (
                      <>
                        <h4 className="text-foreground mb-1">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isEditing && displayData.testimonials.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No testimonials added yet</p>
                <Button
                  onClick={addTestimonial}
                  variant='outline'
                  size='lg'
                  className='bg-blue-50 hover:bg-blue-100 text-blue-700'
                >
                  <Plus className='w-5 h-5 mr-2' />
                  Add Your First Testimonial
                </Button>
              </div>
            )}
          </div>
        ) : (
          !isEditing && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No testimonials to display. Click "Edit" to add testimonials.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}