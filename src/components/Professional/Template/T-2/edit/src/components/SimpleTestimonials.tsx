import { Edit2, Loader2, Plus, Quote, Save, Star, Trash2, X } from 'lucide-react';
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

// Define types for Testimonial data
interface Testimonial {
  id: string;
  name: string;
  position: string;
  rating: number;
  review: string;
}

interface TestimonialsData {
  testimonials: Testimonial[];
  sectionTitle: string;
  sectionDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
}

// Default data for Testimonials section
const defaultTestimonialsData: TestimonialsData = {
  testimonials: [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'CEO, TechCorp',
      rating: 5,
      review: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise helped us increase our conversion rate by 40%."
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'CTO, StartupCo',
      rating: 5,
      review: "Working with John was a game-changer for our startup. He built our entire tech stack from scratch and helped us scale from 0 to 10,000 users in just 6 months."
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'Product Manager, InnovateLabs',
      rating: 5,
      review: "John's ability to translate complex requirements into elegant solutions is remarkable. He developed our fintech dashboard that handles millions of transactions daily."
    }
  ],
  sectionTitle: 'What Clients Say',
  sectionDescription: "Don't just take my word for it. Here's what my clients have to say about working with me and the results we've achieved together.",
  ctaTitle: 'Ready to be the next success story?',
  ctaDescription: 'Join the growing list of satisfied clients who have transformed their businesses with innovative digital solutions.',
  ctaButton: 'Start Your Success Story'
};

// Props interface
interface TestimonialsProps {
  testimonialsData?: TestimonialsData;
  onStateChange?: (data: TestimonialsData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function SimpleTestimonials({ testimonialsData, onStateChange, userId, publishedId, templateSelection }: TestimonialsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<TestimonialsData>(defaultTestimonialsData);
  const [tempData, setTempData] = useState<TestimonialsData>(defaultTestimonialsData);

  // Notify parent of state changes - SAME AS HERO
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer - SAME AS HERO
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

  // Fake API fetch - SAME LOGIC AS HERO
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

  // Save function - SAME PATTERN AS HERO
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save the updated data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states - SAME AS HERO
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

  // Stable update functions with useCallback - SAME PATTERN AS HERO
  const updateTestimonial = useCallback((index: number, field: string, value: any) => {
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
      id: Date.now().toString(),
      name: 'New Client',
      position: 'Position, Company',
      rating: 5,
      review: 'Add a testimonial review here...'
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

  // Loading state - SAME PATTERN AS HERO
  if (isLoading || !displayData.testimonials || displayData.testimonials.length === 0) {
    return (
      <section ref={testimonialsRef} className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading testimonials data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={testimonialsRef} className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md text-white'
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
        <div className="text-center mb-16">
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayData.sectionTitle}
                onChange={(e) => updateSection('sectionTitle', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
              />
              <textarea
                value={displayData.sectionDescription}
                onChange={(e) => updateSection('sectionDescription', e.target.value)}
                className="text-lg text-muted-foreground max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={3}
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                {displayData.sectionTitle.split(' ')[0]}{' '}
                <span className="text-yellow-500">
                  {displayData.sectionTitle.split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {displayData.sectionDescription}
              </p>
            </>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative"
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
                  value={testimonial.review}
                  onChange={(e) => updateTestimonial(index, 'review', e.target.value)}
                  className="text-muted-foreground leading-relaxed mb-6 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.review}"
                </p>
              )}

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={testimonial.name.charAt(0)}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value + testimonial.name.slice(1))}
                      className="w-6 h-6 bg-transparent border-none text-gray-900 text-lg text-center p-0"
                      maxLength={1}
                    />
                  ) : (
                    <span className="text-gray-900 text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        className="text-foreground mb-1 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
                      />
                      <input
                        type="text"
                        value={testimonial.position}
                        onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                        className="text-sm text-muted-foreground w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1"
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
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={displayData.ctaTitle}
                  onChange={(e) => updateSection('ctaTitle', e.target.value)}
                  className="text-2xl text-foreground mb-4 w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                />
                <textarea
                  value={displayData.ctaDescription}
                  onChange={(e) => updateSection('ctaDescription', e.target.value)}
                  className="text-muted-foreground mb-6 max-w-xl mx-auto w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                  rows={3}
                />
                <input
                  type="text"
                  value={displayData.ctaButton}
                  onChange={(e) => updateSection('ctaButton', e.target.value)}
                  className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg bg-white/80 border-2 border-dashed border-blue-300 focus:border-blue-500 focus:outline-none text-center"
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl text-foreground mb-4">
                  {displayData.ctaTitle}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  {displayData.ctaDescription}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {displayData.ctaButton}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}