import { Briefcase, Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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

interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    icon?: string;
}

interface ServicesData {
    subtitle: string;
    heading: string;
    description: string;
    services: Service[];
}

interface ServicesProps {
    servicesData?: ServicesData;
    onStateChange?: (data: ServicesData) => void;
    userId?: string;
    professionalId?: string;
    templateSelection?: string;
}

export function Services({ servicesData, onStateChange, userId, professionalId, templateSelection }: ServicesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
    
    // Pending image files for S3 upload
    const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

    // Initialize with props data or empty structure matching your JSON format
    const [data, setData] = useState<ServicesData>(servicesData || {
        subtitle: "",
        heading: "",
        description: "",
        services: []
    });
    const [tempData, setTempData] = useState<ServicesData>(servicesData || {
        subtitle: "",
        heading: "",
        description: "",
        services: []
    });

    // Use ref for onStateChange to prevent infinite loops
    const onStateChangeRef = useRef(onStateChange);
    useEffect(() => {
        onStateChangeRef.current = onStateChange;
    }, [onStateChange]);

    // Track previous data to avoid unnecessary updates
    const prevDataRef = useRef<ServicesData>();

    // Sync with props data when it changes
    useEffect(() => {
        if (servicesData) {
            setData(servicesData);
            setTempData(servicesData);
        }
    }, [servicesData]);

    // Safe state change notification without infinite loop
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
        if (servicesRef.current) observer.observe(servicesRef.current);
        return () => {
            if (servicesRef.current) observer.unobserve(servicesRef.current);
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
            
            let updatedData = { ...tempData };

            // Upload images for services with pending files
            for (const [serviceId, file] of Object.entries(pendingImageFiles)) {
                if (!userId || !professionalId || !templateSelection) {
                    toast.error('Missing user information. Please refresh and try again.');
                    return;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('userId', userId);
                formData.append('fieldName', `service_${serviceId}`);

                const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    updatedData.services = updatedData.services.map(service =>
                        service.id === serviceId ? { ...service, image: uploadData.s3Url } : service
                    );
                    console.log('Service image uploaded to S3:', uploadData.s3Url);
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
            toast.success('Services saved successfully');

        } catch (error) {
            console.error('Error saving services:', error);
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
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, serviceId: string) => {
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
        setPendingImageFiles(prev => ({ ...prev, [serviceId]: file }));

        // Show immediate local preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempData(prevData => ({
                ...prevData,
                services: prevData.services.map(service =>
                    service.id === serviceId ? { ...service, image: e.target?.result as string } : service
                )
            }));
        };
        reader.readAsDataURL(file);
    };

    // Stable update functions with useCallback
    const updateService = useCallback((index: number, field: keyof Service, value: string) => {
        setTempData(prevData => {
            const updatedServices = [...prevData.services];
            updatedServices[index] = { ...updatedServices[index], [field]: value };
            return { ...prevData, services: updatedServices };
        });
    }, []);

    const updateHeader = useCallback((field: keyof Omit<ServicesData, 'services'>, value: string) => {
        setTempData(prevData => ({
            ...prevData,
            [field]: value
        }));
    }, []);

    // Memoized functions
    const addService = useCallback(() => {
        const newService: Service = {
            id: Date.now().toString(),
            title: "New Service",
            description: "Service description",
            image: ""
        };
        setTempData(prevData => ({
            ...prevData,
            services: [...prevData.services, newService]
        }));
        // Set current index to the new service
        setCurrentIndex(tempData.services.length);
    }, [tempData.services.length]);

    const removeService = useCallback((index: number) => {
        setTempData(prevData => {
            if (prevData.services.length <= 1) {
                toast.error("You must have at least one service");
                return prevData;
            }
            
            const updatedServices = prevData.services.filter((_, i) => i !== index);
            
            // Adjust current index if needed
            if (currentIndex >= updatedServices.length) {
                setCurrentIndex(Math.max(0, updatedServices.length - 1));
            }
            
            return { ...prevData, services: updatedServices };
        });
    }, [currentIndex]);

    // Navigation functions
    const nextSlide = () => {
        if (!displayData.services || displayData.services.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % displayData.services.length);
    };

    const prevSlide = () => {
        if (!displayData.services || displayData.services.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + displayData.services.length) % displayData.services.length);
    };

    const goToSlide = (index: number) => {
        if (!displayData.services || displayData.services.length === 0) return;
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
    const hasData = data.services.length > 0 || 
                    data.subtitle || 
                    data.heading || 
                    data.description;

    // No data state - show empty state with option to add data
    if (!isEditing && !hasData) {
        return (
            <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Edit Controls */}
                    <div className='text-right mb-8'>
                        <Button
                            onClick={handleEdit}
                            size='sm'
                            className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                        >
                            <Edit2 className='w-4 h-4 mr-2' />
                            Add Services
                        </Button>
                    </div>

                    {/* Empty State */}
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground mb-4">
                                No Services Found
                            </h3>
                            <p className="text-muted-foreground mb-8">
                                Showcase your professional services and expertise to attract potential clients and demonstrate your capabilities.
                            </p>
                            <Button
                                onClick={handleEdit}
                                size='lg'
                                className='bg-red-500 hover:bg-red-600 text-white shadow-lg'
                            >
                                <Plus className='w-5 h-5 mr-2' />
                                Add Your First Service
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
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
                                onClick={addService}
                                variant='outline'
                                size='sm'
                                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
                            >
                                <Plus className='w-4 h-4 mr-2' />
                                Add Service
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
                        <Briefcase className="w-8 h-8 text-red-500 mr-3" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={displayData.heading || ""}
                                onChange={(e) => updateHeader('heading', e.target.value)}
                                className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                                placeholder="Services"
                            />
                        ) : (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                                {displayData.heading || "Services"}
                            </h2>
                        )}
                    </div>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={displayData.subtitle || ""}
                                onChange={(e) => updateHeader('subtitle', e.target.value)}
                                className="text-xl text-red-600 mb-4 max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full text-center"
                                placeholder="Subtitle (e.g., Professional Services)"
                            />
                            <textarea
                                value={displayData.description || ""}
                                onChange={(e) => updateHeader('description', e.target.value)}
                                className="text-lg text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                                rows={2}
                                placeholder="Description of your services"
                            />
                        </>
                    ) : (
                        <>
                            {displayData.subtitle && (
                                <p className="text-xl text-red-600 mb-4 max-w-3xl mx-auto">
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

                {/* Services Slider - Only show if there are services or we're editing */}
                {(displayData.services.length > 0 || isEditing) ? (
                    <div className="relative max-w-5xl mx-auto">
                        <div className="relative h-96 overflow-hidden rounded-2xl bg-card shadow-2xl">
                            <AnimatePresence initial={false} custom={direction}>
                                {displayData.services.length > 0 ? (
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
                                        {/* Service Image */}
                                        <div className="relative">
                                            {isEditing && (
                                                <div className='absolute top-2 right-2 z-10'>
                                                    <Button
                                                        onClick={() => fileInputRefs.current[displayData.services[currentIndex]?.id]?.click()}
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                                                    >
                                                        <Upload className='w-4 h-4 mr-2' />
                                                        Change Image
                                                    </Button>
                                                    <input
                                                        ref={el => {
                                                            if (displayData.services[currentIndex]?.id) {
                                                                fileInputRefs.current[displayData.services[currentIndex].id] = el as HTMLInputElement;
                                                            }
                                                        }}
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(e) => handleImageUpload(e, displayData.services[currentIndex]?.id || '')}
                                                        className='hidden'
                                                    />
                                                    {pendingImageFiles[displayData.services[currentIndex]?.id || ''] && (
                                                        <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                                                            {pendingImageFiles[displayData.services[currentIndex]?.id || '']?.name}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            {displayData.services[currentIndex]?.image ? (
                                                <img
                                                    src={displayData.services[currentIndex]?.image}
                                                    alt={displayData.services[currentIndex]?.title || 'Service image'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                    <p className="text-gray-400 text-sm">No image uploaded</p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                                        </div>

                                        {/* Service Details */}
                                        <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
                                            {isEditing && (
                                                <Button
                                                    onClick={() => removeService(currentIndex)}
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
                                                        value={displayData.services[currentIndex]?.title || ''}
                                                        onChange={(e) => updateService(currentIndex, 'title', e.target.value)}
                                                        className="w-full text-2xl lg:text-3xl text-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                                                        placeholder="Service Title"
                                                    />
                                                ) : (
                                                    <h3 className="text-2xl lg:text-3xl text-foreground mb-2">
                                                        {displayData.services[currentIndex]?.title || ''}
                                                    </h3>
                                                )}
                                            </div>

                                            {isEditing ? (
                                                <textarea
                                                    value={displayData.services[currentIndex]?.description || ''}
                                                    onChange={(e) => updateService(currentIndex, 'description', e.target.value)}
                                                    className="w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-muted-foreground mb-6 leading-relaxed"
                                                    rows={4}
                                                    placeholder="Service description"
                                                />
                                            ) : (
                                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                                    {displayData.services[currentIndex]?.description || ''}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    // Empty state when editing but no services added yet
                                    <div className="absolute inset-0 flex items-center justify-center bg-card">
                                        <div className="text-center p-8">
                                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                                No Services Added
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                Add your first service to showcase your offerings.
                                            </p>
                                            <Button
                                                onClick={addService}
                                                size='lg'
                                                className='bg-red-500 hover:bg-red-600 text-white'
                                            >
                                                <Plus className='w-5 h-5 mr-2' />
                                                Add First Service
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation Arrows - Only show if there are services */}
                        {displayData.services.length > 0 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots Indicator - Only show if there are services */}
                                {displayData.services.length > 1 && (
                                    <div className="flex justify-center mt-8 space-x-3">
                                        {displayData.services.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                        ? 'bg-red-500 scale-125'
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
                    // Message when there are headers but no services
                    !isEditing && data.services.length === 0 && (
                        <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-foreground mb-2">
                                    No Services Added
                                </h4>
                                <p className="text-muted-foreground mb-6">
                                    You have section headers configured but no services. Add services to showcase your offerings.
                                </p>
                                <Button
                                    onClick={handleEdit}
                                    size='md'
                                    className='bg-red-500 hover:bg-red-600 text-white'
                                >
                                    <Plus className='w-4 h-4 mr-2' />
                                    Add Services
                                </Button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}