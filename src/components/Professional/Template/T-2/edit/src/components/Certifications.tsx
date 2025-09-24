import { Award, Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
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

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description: string;
  credentialUrl?: string;
}

interface CertificationsData {
  certificates: Certificate[];
  stats: {
    certificationsCount: string;
    hoursLearning: string;
    skillsMastered: string;
    successRate: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
}

const defaultData: CertificationsData = {
  certificates: [
    {
      id: '1',
      title: "Full Stack Web Development",
      issuer: "Tech Academy",
      date: "2023",
      image: "https://images.unsplash.com/photo-1752937326758-f130e633b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNl",
      description: "Comprehensive certification covering React, Node.js, databases, and modern web development practices. Intensive 6-month program with hands-on projects.",
      credentialUrl: "#"
    },
    {
      id: '2',
      title: "Advanced JavaScript Programming",
      issuer: "Code Institute",
      date: "2022",
      image: "https://images.unsplash.com/photo-1565229284535-2cbbe3049123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBjZXJ0aWZpY2F0aW9uJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNTc1ODc1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "In-depth study of JavaScript ES6+, async programming, design patterns, and performance optimization techniques for modern web applications.",
      credentialUrl: "#"
    },
    {
      id: '3',
      title: "React Developer Certification",
      issuer: "Meta (Facebook)",
      date: "2023",
      image: "https://images.unsplash.com/photo-1554306274-f23873d9a26c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvdXJzZSUyMGNvbXBsZXRpb258ZW58MXx8fHwxNzU3NTkxMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Official Meta certification covering React fundamentals, hooks, state management, testing, and advanced patterns for building scalable applications.",
      credentialUrl: "#"
    },
    {
      id: '4',
      title: "Cloud Computing AWS",
      issuer: "Amazon Web Services",
      date: "2024",
      image: "https://images.unsplash.com/photo-1752937326758-f130e633b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJ0aWZpY2F0ZSUyMGRpcGxvbWElMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3NTc1ODc1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "AWS Solutions Architect certification covering cloud infrastructure, serverless computing, security, and scalable application deployment.",
      credentialUrl: "#"
    }
  ],
  stats: {
    certificationsCount: "4+",
    hoursLearning: "500+",
    skillsMastered: "15+",
    successRate: "100%"
  },
  header: {
    title: "Certifications & Achievements",
    subtitle: "Continuous learning and professional development through industry-recognized certifications"
  }
};

interface CertificationsProps {
  certData?: CertificationsData;
  onStateChange?: (data: CertificationsData) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Certifications({ certData, onStateChange, userId, publishedId, templateSelection }: CertificationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

  const [data, setData] = useState<CertificationsData>(defaultData);
  const [tempData, setTempData] = useState<CertificationsData>(defaultData);

  // Load data from backend or props
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (certData) {
          setData(certData);
          setTempData(certData);
        } else if (userId && publishedId) {
          // Only fetch from backend if we have the required IDs
          const response = await fetch(`/api/certifications/${userId}/${publishedId}`);
          if (response.ok) {
            const backendData = await response.json();
            setData(backendData);
            setTempData(backendData);
          } else {
            // Use default data if fetch fails
            setData(defaultData);
            setTempData(defaultData);
          }
        } else {
          // Use default data if no props or IDs provided
          setData(defaultData);
          setTempData(defaultData);
        }
      } catch (error) {
        console.error('Error loading certifications data:', error);
        setData(defaultData);
        setTempData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [certData, userId, publishedId]);

  const nextSlide = () => {
    if (!tempData.certificates || tempData.certificates.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % tempData.certificates.length);
  };

  const prevSlide = () => {
    if (!tempData.certificates || tempData.certificates.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + tempData.certificates.length) % tempData.certificates.length);
  };

  const goToSlide = (index: number) => {
    if (!tempData.certificates || tempData.certificates.length === 0) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingImageFiles({});
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload images for certificates with pending files
      for (const [certId, file] of Object.entries(pendingImageFiles)) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', 'certifications');
        formData.append('imageField', `certificate_${certId}`);
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the certificate image with the S3 URL
          updatedData.certificates = updatedData.certificates.map(cert =>
            cert.id === certId ? { ...cert, image: uploadData.imageUrl } : cert
          );
          console.log('Certificate image uploaded to S3:', uploadData.imageUrl);
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

      // Save to backend API
      const response = await fetch(`/api/certifications/${userId}/${publishedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: updatedData,
          templateSelection
        })
      });

      if (response.ok) {
        const savedData = await response.json();
        setData(savedData);
        if (onStateChange) {
          onStateChange(savedData);
        }
        setIsEditing(false);
        toast.success('Certifications saved successfully');
      } else {
        throw new Error('Failed to save data');
      }

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, certId: string) => {
    const file = event.target.files?.[0];
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
    setPendingImageFiles(prev => ({ ...prev, [certId]: file }));

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedCerts = tempData.certificates.map(cert =>
        cert.id === certId ? { ...cert, image: e.target?.result as string } : cert
      );
      setTempData({ ...tempData, certificates: updatedCerts });
    };
    reader.readAsDataURL(file);
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: string) => {
    const updatedCerts = [...tempData.certificates];
    updatedCerts[index] = { ...updatedCerts[index], [field]: value };
    setTempData({ ...tempData, certificates: updatedCerts });
  };

  const addCertificate = () => {
    const newCert: Certificate = {
      id: Date.now().toString(),
      title: "New Certification",
      issuer: "Issuer Name",
      date: "2024",
      image: "https://via.placeholder.com/500x300?text=Certificate+Image",
      description: "Certificate description",
      credentialUrl: "#"
    };
    setTempData({
      ...tempData,
      certificates: [...tempData.certificates, newCert]
    });
    setCurrentIndex(tempData.certificates.length); // Navigate to the new certificate
  };

  const removeCertificate = (index: number) => {
    if (!tempData.certificates || tempData.certificates.length <= 1) {
      toast.error("You must have at least one certificate");
      return;
    }

    const updatedCerts = tempData.certificates.filter((_, i) => i !== index);
    setTempData({ ...tempData, certificates: updatedCerts });

    // Adjust current index if needed
    if (currentIndex >= updatedCerts.length) {
      setCurrentIndex(updatedCerts.length - 1);
    }
  };

  const updateStat = (field: keyof CertificationsData['stats'], value: string) => {
    setTempData({
      ...tempData,
      stats: { ...tempData.stats, [field]: value }
    });
  };

  const updateHeader = (field: keyof CertificationsData['header'], value: string) => {
    setTempData({
      ...tempData,
      header: { ...tempData.header, [field]: value }
    });
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

  const displayData = isEditing ? tempData : data;

  // Add a check to prevent accessing undefined data
  if (isLoading || !displayData.certificates || displayData.certificates.length === 0) {
    return (
      <section id="certifications" className="py-20 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading certifications data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-20 bg-gradient-to-br from-yellow-50 to-background dark:from-yellow-900/20 dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md'
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
                className='bg-red-500 hover:bg-red-600 shadow-md'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
              <Button
                onClick={addCertificate}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Certificate
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
                value={displayData.header.title}
                onChange={(e) => updateHeader('title', e.target.value)}
                className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
              />
            ) : (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                {displayData.header.title}
              </h2>
            )}
          </div>
          {isEditing ? (
            <textarea
              value={displayData.header.subtitle}
              onChange={(e) => updateHeader('subtitle', e.target.value)}
              className="text-xl text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
              rows={2}
            />
          ) : (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {displayData.header.subtitle}
            </p>
          )}
        </motion.div>

        {/* Certification Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
            <AnimatePresence initial={false} custom={direction}>
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
                {/* Certificate Image */}
                <div className="relative">
                  {isEditing && (
                    <div className='absolute top-2 right-2 z-10'>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        variant="outline" // 👈 prevents default blue/white styling
                        className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                      >
                        <Upload className='w-4 h-4 mr-2' />
                        Change Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e, displayData.certificates[currentIndex]?.id || '')}
                        className='hidden'
                      />
                      {pendingImageFiles[displayData.certificates[currentIndex]?.id || ''] && (
                        <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                          Image selected: {pendingImageFiles[displayData.certificates[currentIndex]?.id || '']?.name}
                        </p>
                      )}
                    </div>
                  )}
                  <ImageWithFallback
                    src={displayData.certificates[currentIndex]?.image || ''}
                    alt={displayData.certificates[currentIndex]?.title || 'Certificate image'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>

                {/* Certificate Details */}
                <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-yellow-50 dark:from-card dark:to-yellow-900/20">
                  {isEditing && (
                    <Button
                      onClick={() => removeCertificate(currentIndex)}
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
                        value={displayData.certificates[currentIndex]?.title || ''}
                        onChange={(e) => updateCertificate(currentIndex, 'title', e.target.value)}
                        className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      />
                    ) : (
                      <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
                        {displayData.certificates[currentIndex]?.title || ''}
                      </h3>
                    )}

                    <div className="flex items-center text-yellow-600 mb-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={displayData.certificates[currentIndex]?.issuer || ''}
                            onChange={(e) => updateCertificate(currentIndex, 'issuer', e.target.value)}
                            className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg"
                          />
                          <span>•</span>
                          <input
                            type="text"
                            value={displayData.certificates[currentIndex]?.date || ''}
                            onChange={(e) => updateCertificate(currentIndex, 'date', e.target.value)}
                            className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-lg w-20"
                          />
                        </div>
                      ) : (
                        <span className="text-lg">{displayData.certificates[currentIndex]?.issuer || ''} • {displayData.certificates[currentIndex]?.date || ''}</span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={displayData.certificates[currentIndex]?.description || ''}
                      onChange={(e) => updateCertificate(currentIndex, 'description', e.target.value)}
                      className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground mb-6 leading-relaxed"
                      rows="4"
                    />
                  ) : (
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {displayData.certificates[currentIndex]?.description || ''}
                    </p>
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      value={displayData.certificates[currentIndex]?.credentialUrl || ''}
                      onChange={(e) => updateCertificate(currentIndex, 'credentialUrl', e.target.value)}
                      className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                      placeholder="Credential URL"
                    />
                  ) : (
                    <button className="inline-flex items-center text-yellow-600 hover:text-yellow-700 transition-colors group">
                      <span className="mr-2">View Credential</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
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

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {displayData.certificates.map((_, index) => (
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
        </div>

        {/* Certificate Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { key: 'certificationsCount' as const, label: 'Certifications' },
            { key: 'hoursLearning' as const, label: 'Hours of Learning' },
            { key: 'skillsMastered' as const, label: 'Skills Mastered' },
            { key: 'successRate' as const, label: 'Success Rate' }
          ].map((stat) => (
            <div key={stat.key} className="text-center hover:scale-105 transition-transform duration-300">
              {isEditing ? (
                <input
                  type="text"
                  value={displayData.stats[stat.key]}
                  onChange={(e) => updateStat(stat.key, e.target.value)}
                  className="w-20 text-3xl sm:text-4xl text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                />
              ) : (
                <div className="text-3xl sm:text-4xl text-yellow-500 mb-2">{displayData.stats[stat.key]}</div>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => { }}
                  className="text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center w-full"
                  disabled
                />
              ) : (
                <p className="text-muted-foreground">{stat.label}</p>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}