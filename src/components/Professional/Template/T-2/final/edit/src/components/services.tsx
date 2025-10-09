import { Briefcase, ChevronLeft, ChevronRight, Edit2, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Custom Button component (same as Projects.tsx)
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
    id: number;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description: string;
}

interface ServicesData {
    subtitle: string;
    heading: string;
    description: string;
    services: Service[];
}

// Default data for Services section
const defaultServicesData: ServicesData = {
    subtitle: "",
    heading: "",
    description: "",
    services: []
};

interface ServicesProps {
    servicesData?: ServicesData;
    onStateChange?: (data: ServicesData) => void;
    userId?: string;
    publishedId?: string;
    templateSelection?: string;
}

export function Services({ servicesData, onStateChange, userId, publishedId, templateSelection }: ServicesProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const [data, setData] = useState<ServicesData>(defaultServicesData);
    const [tempData, setTempData] = useState<ServicesData>(defaultServicesData);
    const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});

    // Pending image files for S3 upload
    const [pendingImageFiles, setPendingImageFiles] = useState<Record<string, File>>({});

    const displayData = isEditing ? tempData : data;

    // Notify parent of state changes
    useEffect(() => {
        if (onStateChange) {
            onStateChange(data);
        }
    }, [data]);

    // Fake API fetch
    const fetchServicesData = async () => {
        setIsLoading(true);
        try {
            const response = await new Promise<ServicesData>((resolve) =>
                setTimeout(() => resolve(servicesData || defaultServicesData), 1200)
            );
            setData(response);
            setTempData(response);
            setDataLoaded(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!dataLoaded && !isLoading) {
            fetchServicesData();
        }
    }, [dataLoaded, isLoading, servicesData]);

    const handleEdit = () => {
        setIsEditing(true);
        setTempData({ ...data });
        setPendingImageFiles({});
    };

    const handleSave = async () => {
        try {
            setIsUploading(true);

            let updatedData = { ...tempData };

            // Upload images for services with pending files
            for (const [serviceId, file] of Object.entries(pendingImageFiles)) {
                if (!userId || !publishedId || !templateSelection) {
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
                        service.id.toString() === serviceId ? { ...service, image: uploadData.s3Url } : service
                    );
                } else {
                    const errorData = await uploadResponse.json();
                    toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
                    return;
                }
            }

            setPendingImageFiles({});
            setIsSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setData(updatedData);
            setTempData(updatedData);

            setIsEditing(false);
            toast.success('Services section saved successfully');

        } catch (error) {
            console.error('Error saving services section:', error);
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

    // Image upload handler
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, serviceId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setPendingImageFiles(prev => ({ ...prev, [serviceId]: file }));

        const reader = new FileReader();
        reader.onload = (e) => {
            const updatedServices = tempData.services.map(service =>
                service.id.toString() === serviceId ? { ...service, image: e.target?.result as string } : service
            );
            setTempData({ ...tempData, services: updatedServices });
        };
        reader.readAsDataURL(file);
    };

    // Update functions
    const updateService = useCallback((index: number, field: keyof Service, value: any) => {
        const updatedServices = [...tempData.services];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setTempData({ ...tempData, services: updatedServices });
    }, [tempData]);

    const updateSection = useCallback((field: keyof Omit<ServicesData, 'services'>, value: string) => {
        setTempData({
            ...tempData,
            [field]: value
        });
    }, [tempData]);

    const addService = useCallback(() => {
        const newService: Service = {
            id: Date.now(),
            title: 'New Service',
            issuer: 'Service Provider',
            date: '2024 - Present',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
            description: 'Add a description for your service here'
        };
        setTempData({
            ...tempData,
            services: [...tempData.services, newService]
        });
    }, [tempData]);

    const removeService = useCallback((index: number) => {
        if (tempData.services.length <= 1) {
            toast.error("You must have at least one service");
            return;
        }
        const updatedServices = tempData.services.filter((_, i) => i !== index);
        setTempData({ ...tempData, services: updatedServices });

        // Adjust current index if needed
        if (currentIndex >= updatedServices.length) {
            setCurrentIndex(updatedServices.length - 1);
        }
    }, [tempData, currentIndex]);

    // Safe string splitting for heading
    const renderHeading = () => {
        const heading = displayData?.heading || "My Services";
        const words = heading.split(' ');

        if (words.length > 1) {
            return (
                <>
                    {words[0]}{' '}
                    <span className="text-red-500">
                        {words.slice(1).join(' ')}
                    </span>
                </>
            );
        }
        return heading;
    };

    // Slider functions
    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % displayData.services.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + displayData.services.length) % displayData.services.length);
    };

    const goToSlide = (index: number) => {
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

    // Loading state
    if (isLoading) {
        return (
            <section id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" />
                    <p className="text-muted-foreground mt-4">Loading services data...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="py-20 bg-gradient-to-br from-red-50 to-background dark:from-red-900/20 dark:to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Edit Controls */}
                <div className='text-right mb-8'>
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
                            <>
                                <input
                                    type="text"
                                    value={displayData.heading || ""}
                                    onChange={(e) => updateSection('heading', e.target.value)}
                                    className="text-3xl sm:text-4xl lg:text-5xl text-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
                                    placeholder="Heading"
                                />
                            </>
                        ) : (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground">
                                {renderHeading()}
                            </h2>
                        )}
                    </div>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={displayData.subtitle || ""}
                                onChange={(e) => updateSection('subtitle', e.target.value)}
                                className="text-lg text-red-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-md mx-auto"
                                placeholder="Subtitle"
                            />
                            <textarea
                                value={displayData.description || ""}
                                onChange={(e) => updateSection('description', e.target.value)}
                                className="text-xl text-muted-foreground max-w-3xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                                rows={2}
                                placeholder="Description"
                            />
                        </>
                    ) : (
                        <>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-lg text-red-500 mb-2"
                            >
                                {displayData.subtitle}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                viewport={{ once: true }}
                                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                            >
                                {displayData.description}
                            </motion.p>
                        </>
                    )}
                </motion.div>

                {/* Services Slider */}
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
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                {/* Service Card Content */}
                                <div className="w-full h-full flex bg-gradient-to-br from-card to-red-50 dark:from-card dark:to-red-900/20">
                                    {isEditing && (
                                        <Button
                                            onClick={() => removeService(currentIndex)}
                                            size='sm'
                                            variant='outline'
                                            className='absolute top-4 right-4 bg-red-50 hover:bg-red-100 text-red-700 z-10'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </Button>
                                    )}

                                    {/* Service Image */}
                                    <div className="w-1/2 relative">
                                        <motion.div transition={{ duration: 0.3 }}>
                                            {isEditing && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <Button
                                                        onClick={() => fileInputRefs.current[displayData.services[currentIndex]?.id.toString()]?.click()}
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-white/90 backdrop-blur-sm shadow-md text-black hover:bg-gray-100"
                                                    >
                                                        <Upload className="w-4 h-4 mr-2 text-black" />
                                                        Upload
                                                    </Button>
                                                    <input
                                                        ref={el => fileInputRefs.current[displayData.services[currentIndex]?.id.toString()] = el as HTMLInputElement}
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(e) => handleImageUpload(e, displayData.services[currentIndex]?.id.toString())}
                                                        className='hidden'
                                                    />
                                                    {pendingImageFiles[displayData.services[currentIndex]?.id.toString()] && (
                                                        <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                                                            {pendingImageFiles[displayData.services[currentIndex]?.id.toString()].name}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            <ImageWithFallback
                                                src={displayData.services[currentIndex]?.image}
                                                alt={displayData.services[currentIndex]?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Service Content */}
                                    <div className="w-1/2 p-8 flex flex-col items-center justify-center">
                                        {/* Service Title */}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={displayData.services[currentIndex]?.title || ""}
                                                onChange={(e) => updateService(currentIndex, 'title', e.target.value)}
                                                className="text-3xl lg:text-4xl text-foreground mb-4 text-center bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                                                placeholder="Service Title"
                                            />
                                        ) : (
                                            <motion.h3
                                                className="text-3xl lg:text-4xl text-foreground mb-4 text-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {displayData.services[currentIndex]?.title}
                                            </motion.h3>
                                        )}

                                        {/* Service Description */}
                                        {isEditing ? (
                                            <textarea
                                                value={displayData.services[currentIndex]?.description || ""}
                                                onChange={(e) => updateService(currentIndex, 'description', e.target.value)}
                                                className="text-muted-foreground mb-4 leading-relaxed text-center bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full h-24"
                                                placeholder="Service Description"
                                            />
                                        ) : (
                                            <motion.p
                                                className="text-muted-foreground mb-4 leading-relaxed text-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {displayData.services[currentIndex]?.description}
                                            </motion.p>
                                        )}

                                        {/* Service Details */}
                                        <motion.div
                                            className="text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={displayData.services[currentIndex]?.issuer || ""}
                                                        onChange={(e) => updateService(currentIndex, 'issuer', e.target.value)}
                                                        className="text-lg text-red-600 dark:text-red-400 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full mb-2"
                                                        placeholder="Service Issuer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={displayData.services[currentIndex]?.date || ""}
                                                        onChange={(e) => updateService(currentIndex, 'date', e.target.value)}
                                                        className="text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full"
                                                        placeholder="Service Date"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-lg text-red-600 dark:text-red-400">
                                                        {displayData.services[currentIndex]?.issuer}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {displayData.services[currentIndex]?.date}
                                                    </p>
                                                </>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
                        disabled={isEditing}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 transition-all duration-300 hover:scale-110 z-10"
                        disabled={isEditing}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 space-x-3">
                        {displayData.services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-red-500 scale-125'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                disabled={isEditing}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}