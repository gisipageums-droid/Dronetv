import { Award, Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  variant?: 'outline' | 'default';
  size?: 'sm' | 'default';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${sizes[size || 'default']
        } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description: string;
  credentialUrl?: string;
}

interface CertificationsData {
  subtitle: string;
  heading: string;
  description: string;
  certifications: Certification[];
}

const defaultData: CertificationsData = {
  subtitle: "",
  heading: "",
  description: "",
  certifications: []
};

interface CertificationsProps {
  certData?: CertificationsData;
  onStateChange?: (data: CertificationsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Certifications({ certData, onStateChange, userId, professionalId, templateSelection }: CertificationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const certificationsRef = useRef<HTMLDivElement>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

  // Initialize with props data or empty structure
  const [data, setData] = useState<CertificationsData>(certData || defaultData);
  const [tempData, setTempData] = useState<CertificationsData>(certData || defaultData);

  // FIX: Use ref for onStateChange to prevent infinite loops
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // FIX: Track previous data to avoid unnecessary updates
  const prevDataRef = useRef<CertificationsData>();

  // Sync with props data when it changes
  useEffect(() => {
    if (certData) {
      setData(certData);
      setTempData(certData);
    }
  }, [certData]);

  // FIX: Safe state change notification without infinite loop
  useEffect(() => {
    if (onStateChangeRef.current && prevDataRef.current !== data) {
      onStateChangeRef.current(data);
      prevDataRef.current = data;
    }
  }, [data]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (certificationsRef.current) observer.observe(certificationsRef.current);
    return () => {
      if (certificationsRef.current) observer.unobserve(certificationsRef.current);
    };
  }, []);

  // Calculate displayData based on editing state
  const displayData = isEditing ? tempData : data;

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFiles({});
  };

  // Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload images for certifications with pending files
      for (const [certId, file] of Object.entries(pendingImageFiles)) {
        if (!userId || !professionalId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('fieldName', `certification_${certId}`);

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the certification image with the S3 URL
          updatedData.certifications = updatedData.certifications.map(cert =>
            cert.id === certId ? { ...cert, image: uploadData.s3Url } : cert
          );
          console.log('Certification image uploaded to S3:', uploadData.s3Url);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending files
      setPendingImageFiles({});

      // Save the updated data with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update both states with the new URLs
      setData(updatedData);
      setTempData(updatedData);

      setIsEditing(false);
      toast.success('Certifications saved successfully');

    } catch (error) {
      console.error('Error saving certifications:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingImageFiles({});
    setIsEditing(false);
  };

  // Image upload handler with validation
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, certId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImageFiles(prev => ({ ...prev, [certId]: file }));

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData(prevData => ({
        ...prevData,
        certifications: prevData.certifications.map(cert =>
          cert.id === certId ? { ...cert, image: e.target?.result as string } : cert
        )
      }));
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback
  const updateCertification = useCallback((index: number, field: keyof Certification, value: string) => {
    setTempData(prevData => {
      const updatedCerts = [...prevData.certifications];
      updatedCerts[index] = { ...updatedCerts[index], [field]: value };
      return { ...prevData, certifications: updatedCerts };
    });
  }, []);

  const updateHeader = useCallback((field: keyof Omit<CertificationsData, 'certifications'>, value: string) => {
    setTempData(prevData => ({
      ...prevData,
      [field]: value
    }));
  }, []);

  // Memoized functions
  const addCertification = useCallback(() => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: "New Certification",
      issuer: "Issuer Name",
      date: "2024",
      image: "",
      description: "Certification description",
      credentialUrl: ""
    };
    setTempData(prevData => ({
      ...prevData,
      certifications: [...prevData.certifications, newCert]
    }));
    // Set current index to the new certification
    setCurrentIndex(tempData.certifications.length);
  }, [tempData.certifications.length]);

  const removeCertification = useCallback((index: number) => {
    setTempData(prevData => {
      if (prevData.certifications.length <= 1) {
        toast.error("You must have at least one certification");
        return prevData;
      }

      const updatedCerts = prevData.certifications.filter((_, i) => i !== index);

      // Adjust current index if needed
      if (currentIndex >= updatedCerts.length) {
        setCurrentIndex(Math.max(0, updatedCerts.length - 1));
      }

      return { ...prevData, certifications: updatedCerts };
    });
  }, [currentIndex]);

  // Navigation functions
  const nextSlide = () => {
    if (!displayData.certifications || displayData.certifications.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayData.certifications.length);
  };

  const prevSlide = () => {
    if (!displayData.certifications || displayData.certifications.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + displayData.certifications.length) % displayData.certifications.length);
  };

  const goToSlide = (index: number) => {
    if (!displayData.certifications || displayData.certifications.length === 0) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Check if there's any meaningful data to display
  const hasData = data.certifications.length > 0 ||
    data.subtitle ||
    data.heading ||
    data.description;

  // No data state - show empty state with option to add data
  if (!isEditing && !hasData) {
    return (
      <section ref={certificationsRef} id="certifications" className="py-5 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Controls */}
          <div className='text-right mb-8'>
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md text-white'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Add Certifications
            </Button>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No Certifications Found
              </h3>
              <p className="text-muted-foreground mb-8">
                Showcase your professional certifications, awards, and achievements to build credibility and trust with your audience.
              </p>
              <Button
                onClick={handleEdit}
                size='lg'
                className='bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
              >
                <Plus className='w-5 h-5 mr-2' />
                Add Your First Certification
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={certificationsRef} id="certifications" className="py-5 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
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
                disabled={isSaving || isUploading}
              >
                {isUploading ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                size='sm'
                className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
              <Button
                onClick={addCertification}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Certification
              </Button>
            </div>
          )}
        </div>

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-500 mr-3" />
            {isEditing ? (
              <input
                type="text"
                value={displayData.heading || ""}
                onChange={(e) => updateHeader('heading', e.target.value)}
                className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                placeholder="Certifications & Awards"
              />
            ) : (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                {displayData.heading || "Certifications & Awards"}
              </h2>
            )}
          </div>
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayData.subtitle || ""}
                onChange={(e) => updateHeader('subtitle', e.target.value)}
                className="text-xl text-yellow-600 mb-4 max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full text-center"
                placeholder="Subtitle (e.g., Professional Credentials)"
              />
              <textarea
                value={displayData.description || ""}
                onChange={(e) => updateHeader('description', e.target.value)}
                className="text-lg text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                rows={2}
                placeholder="Description of your certifications and achievements"
              />
            </>
          ) : (
            <>
              {displayData.subtitle && (
                <p className="text-xl text-yellow-600 mb-4 max-w-3xl mx-auto">
                  {displayData.subtitle}
                </p>
              )}
              {displayData.description && (
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {displayData.description}
                </p>
              )}
            </>
          )}
        </motion.div>

        {/* Certification Slider - Only show if there are certifications or we're editing */}
        {(displayData.certifications.length > 0 || isEditing) ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
              <AnimatePresence initial={false} custom={direction}>
                {displayData.certifications.length > 0 ? (
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 grid md:grid-cols-2 gap-0"
                  >
                    {/* Certification Image */}
                    <div className="relative">
                      {isEditing && (
                        <div className='absolute top-2 right-2 z-10'>
                          <Button
                            onClick={() => fileInputRefs.current[displayData.certifications[currentIndex]?.id]?.click()}
                            size="sm"
                            variant="outline"
                            className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                          >
                            <Upload className='w-4 h-4 mr-2' />
                            Change Image
                          </Button>
                          <input
                            ref={el => {
                              if (displayData.certifications[currentIndex]?.id) {
                                fileInputRefs.current[displayData.certifications[currentIndex].id] = el as HTMLInputElement;
                              }
                            }}
                            type='file'
                            accept='image/*'
                            onChange={(e) => handleImageUpload(e, displayData.certifications[currentIndex]?.id || '')}
                            className='hidden'
                          />
                          {pendingImageFiles[displayData.certifications[currentIndex]?.id || ''] && (
                            <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                              {pendingImageFiles[displayData.certifications[currentIndex]?.id || '']?.name}
                            </p>
                          )}
                        </div>
                      )}
                      {displayData.certifications[currentIndex]?.image ? (
                        <img
                          src={displayData.certifications[currentIndex]?.image}
                          alt={displayData.certifications[currentIndex]?.title || 'Certification image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="300"%3E%3Crect fill="%23f3f4f6" width="500" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ECertificate Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <p className="text-gray-400 text-sm">No image uploaded</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    </div>

                    {/* Certification Details */}
                    <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-yellow-50 dark:from-card dark:to-yellow-900/20">
                      {isEditing && (
                        <Button
                          onClick={() => removeCertification(currentIndex)}
                          size='sm'
                          variant='outline'
                          className='absolute top-2 right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      )}

                      <div className="mb-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={displayData.certifications[currentIndex]?.title || ''}
                            onChange={(e) => updateCertification(currentIndex, 'title', e.target.value)}
                            className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                            placeholder="Certification Title"
                          />
                        ) : (
                          <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
                            {displayData.certifications[currentIndex]?.title || ''}
                          </h3>
                        )}

                        <div className="flex items-center text-yellow-600 mb-4">
                          <Calendar className="w-5 h-5 mr-2" />
                          {isEditing ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={displayData.certifications[currentIndex]?.issuer || ''}
                                onChange={(e) => updateCertification(currentIndex, 'issuer', e.target.value)}
                                className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg"
                                placeholder="Issuer"
                              />
                              <span>•</span>
                              <input
                                type="text"
                                value={displayData.certifications[currentIndex]?.date || ''}
                                onChange={(e) => updateCertification(currentIndex, 'date', e.target.value)}
                                className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg w-20"
                                placeholder="Date"
                              />
                            </div>
                          ) : (
                            <span className="text-lg">{displayData.certifications[currentIndex]?.issuer || ''} • {displayData.certifications[currentIndex]?.date || ''}</span>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <textarea
                          value={displayData.certifications[currentIndex]?.description || ''}
                          onChange={(e) => updateCertification(currentIndex, 'description', e.target.value)}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground mb-6 leading-relaxed"
                          rows={4}
                          placeholder="Certification description"
                        />
                      ) : (
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {displayData.certifications[currentIndex]?.description || ''}
                        </p>
                      )}

                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.certifications[currentIndex]?.credentialUrl || ''}
                          onChange={(e) => updateCertification(currentIndex, 'credentialUrl', e.target.value)}
                          className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                          placeholder="Credential URL (optional)"
                        />
                      ) : displayData.certifications[currentIndex]?.credentialUrl && displayData.certifications[currentIndex]?.credentialUrl !== '#' ? (
                        <a
                          href={displayData.certifications[currentIndex]?.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 transition-colors group"
                        >
                          <span className="mr-2">View Credential</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ) : null}
                    </div>
                  </motion.div>
                ) : (
                  // Empty state when editing but no certifications added yet
                  <div className="absolute inset-0 flex items-center justify-center bg-card">
                    <div className="text-center p-8">
                      <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Certifications Added
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Add your first certification to showcase your achievements.
                      </p>
                      <Button
                        onClick={addCertification}
                        size='lg'
                        className='bg-yellow-500 hover:bg-yellow-600 text-white'
                      >
                        <Plus className='w-5 h-5 mr-2' />
                        Add First Certification
                      </Button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Arrows - Only show if there are certifications */}
            {displayData.certifications.length > 0 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Indicator - Only show if there are certifications */}
                {displayData.certifications.length > 1 && (
                  <div className="flex justify-center mt-8 space-x-3">
                    {displayData.certifications.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                          ? 'bg-yellow-500 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Message when there are headers but no certifications
          !isEditing && data.certifications.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  No Certifications Added
                </h4>
                <p className="text-muted-foreground mb-6">
                  You have section headers configured but no certifications. Add certifications to showcase your achievements.
                </p>
                <Button
                  onClick={handleEdit}
                  size='md'
                  className='bg-yellow-500 hover:bg-yellow-600 text-white'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Certifications
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
