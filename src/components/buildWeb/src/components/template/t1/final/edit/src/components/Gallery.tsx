import { Edit2, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/badge";

// Custom Button component (same as in EditableAbout)
const Button = ({
    children,
    onClick,
    variant,
    size,
    className,
    disabled,
    ...props
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
            className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default
                } ${className || ""}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default function EditableGallery({ galleryData, onStateChange, userId, publishedId, templateSelection }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const fileInputRefs = useRef([]);

    // Pending image files for S3 upload
    const [pendingImageFiles, setPendingImageFiles] = useState({});

    // Default content structure
    const defaultContent = {
        title: galleryData?.title || "Moments That Define Us",
        subtitle: galleryData?.subtitle || "Explore snapshots of our workspace, team, events, and the innovation that drives us every day.",
        badgeText: galleryData?.badgeText || "Our Gallery",
        images: galleryData?.images || [
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1560806883-642f26c2825d?w=600&h=600&fit=crop",
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=600&fit=crop",
        ]
    };

    // Consolidated state
    const [galleryState, setGalleryState] = useState(defaultContent);
    const [tempGalleryState, setTempGalleryState] = useState(defaultContent);

    // Notify parent of state changes
    useEffect(() => {
        if (onStateChange) {
            onStateChange(galleryState);
        }
    }, [galleryState, onStateChange]);

    // Intersection Observer for visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    // Simulate API call to fetch data from database
    const fetchGalleryData = async () => {
        setIsLoading(true);
        try {
            // Replace this with your actual API call
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(defaultContent);
                }, 1500); // Simulate network delay
            });

            setGalleryState(response);
            setTempGalleryState(response);
            setDataLoaded(true);
        } catch (error) {
            console.error("Error fetching gallery data:", error);
            // Keep default content on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when component becomes visible
    useEffect(() => {
        if (isVisible && !dataLoaded && !isLoading) {
            fetchGalleryData();
        }
    }, [isVisible, dataLoaded, isLoading]);

    const handleEdit = () => {
        setIsEditing(true);
        setTempGalleryState(galleryState);
        setPendingImageFiles({});
    };

    // Updated Save function with S3 upload
    const handleSave = async () => {
        try {
            setIsUploading(true);

            // Create a copy of tempGalleryState to update with S3 URLs
            let updatedState = { ...tempGalleryState };

            // Upload all pending images
            const uploadPromises = Object.entries(pendingImageFiles).map(
                async ([index, file]) => {
                    if (!userId || !publishedId || !templateSelection) {
                        throw new Error('Missing user information. Please refresh and try again.');
                    }

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('sectionName', 'gallery');
                    formData.append('imageField', `image-${index}`);
                    formData.append('templateSelection', templateSelection);

                    const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (uploadResponse.ok) {
                        const uploadData = await uploadResponse.json();
                        // Update the specific image URL
                        updatedState.images[index] = uploadData.imageUrl;
                        console.log(`Image ${index} uploaded to S3:`, uploadData.imageUrl);
                    } else {
                        const errorData = await uploadResponse.json();
                        throw new Error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
                    }
                }
            );

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

            // Clear pending files
            setPendingImageFiles({});

            // Save the updated state with S3 URLs
            setIsSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

            // Update both states with the new URLs
            setGalleryState(updatedState);
            setTempGalleryState(updatedState);

            setIsEditing(false);
            toast.success('Gallery section saved with S3 URLs ready for publish');

        } catch (error) {
            console.error('Error saving gallery section:', error);
            toast.error(error.message || 'Error saving changes. Please try again.');
        } finally {
            setIsUploading(false);
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempGalleryState(galleryState);
        setPendingImageFiles({});
        setIsEditing(false);
    };

    // Update functions
    const updateContent = useCallback((field, value) => {
        setTempGalleryState((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Add new image
    const addImage = useCallback(() => {
        setTempGalleryState((prev) => ({
            ...prev,
            images: [...prev.images, "https://via.placeholder.com/600x600?text=New+Image"],
        }));
    }, []);

    // Remove image
    const removeImage = useCallback((index) => {
        setTempGalleryState((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    }, []);

    // Image upload handler with validation
    const handleImageUpload = useCallback((index, event) => {
        const file = event.target.files[0];
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
        setPendingImageFiles((prev) => ({
            ...prev,
            [index]: file,
        }));

        // Show immediate local preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempGalleryState((prev) => {
                const updatedImages = [...prev.images];
                updatedImages[index] = e.target.result;
                return { ...prev, images: updatedImages };
            });
        };
        reader.readAsDataURL(file);
    }, []);

    const displayContent = isEditing ? tempGalleryState : galleryState;

    return (
        <section
            id="gallery"
            ref={sectionRef}
            className="py-24 bg-gradient-to-b from-yellow-50/30 via-white to-yellow-50/20 scroll-mt-20 relative"
        >
            {/* Loading Overlay */}
            {isLoading && (
                <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-20'>
                    <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
                        <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
                        <span className='text-gray-700'>Loading gallery...</span>
                    </div>
                </div>
            )}

            {/* Edit Controls - Only show after data is loaded */}
            {dataLoaded && (
                <div className='absolute top-4 right-4 z-10'>
                    {!isEditing ? (
                        <Button
                            onClick={handleEdit}
                            variant='outline'
                            size='sm'
                            className='bg-white hover:bg-gray-50 shadow-md'
                        >
                            <Edit2 className='w-4 h-4 mr-2' />
                            Edit
                        </Button>
                    ) : (
                        <div className='flex gap-2'>
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
                                variant='outline'
                                size='sm'
                                className='bg-white hover:bg-gray-50 shadow-md'
                                disabled={isSaving || isUploading}
                            >
                                <X className='w-4 h-4 mr-2' />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header — Animated */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-block mb-4"
                    >
                        {isEditing ? (
                            <input
                                type="text"
                                value={displayContent.badgeText}
                                onChange={(e) => updateContent('badgeText', e.target.value)}
                                className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                                placeholder="Badge text"
                            />
                        ) : (
                            <Badge className="bg-[#ffeb3b] text-gray-900 px-5 py-2 shadow-md">
                                {displayContent.badgeText}
                            </Badge>
                        )}
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                        className="text-3xl md:text-4xl font-extrabold text-gray-900"
                    >
                        {isEditing ? (
                            <input
                                type="text"
                                value={displayContent.title}
                                onChange={(e) => updateContent('title', e.target.value)}
                                className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl"
                                placeholder="Gallery title"
                            />
                        ) : (
                            displayContent.title
                        )}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                        className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
                    >
                        {isEditing ? (
                            <textarea
                                value={displayContent.subtitle}
                                onChange={(e) => updateContent('subtitle', e.target.value)}
                                className="bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full"
                                placeholder="Gallery subtitle"
                                rows={2}
                            />
                        ) : (
                            displayContent.subtitle
                        )}
                    </motion.p>
                </div>

                {/* Gallery Grid — with enhanced hover & animations */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {displayContent.images.map((src, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50, rotateX: 10 }}
                            animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                            transition={{
                                delay: 0.5 + i * 0.1,
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1], // easeOutQuart
                            }}
                            whileHover={{
                                scale: isEditing ? 1 : 1.05,
                                y: isEditing ? 0 : -10,
                                rotateX: 0,
                                boxShadow: isEditing ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "0 30px 40px -15px rgba(0,0,0,0.15)",
                                transition: { duration: 0.3, ease: "easeOut" },
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="overflow-hidden rounded-2xl bg-white border border-yellow-100 cursor-pointer group relative"
                            style={{ willChange: "transform, box-shadow" }}
                        >
                            {isEditing && (
                                <div className="absolute z-50 top-2 right-2 flex gap-1">
                                    <Button
                                        onClick={() => fileInputRefs.current[i]?.click()}
                                        size='sm'
                                        variant='outline'
                                        className='bg-white/90 backdrop-blur-sm shadow-md'
                                    >
                                        <Upload className='w-3 h-3' />
                                    </Button>
                                    <input
                                        ref={el => fileInputRefs.current[i] = el}
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => handleImageUpload(i, e)}
                                        className='hidden'
                                    />
                                    <Button
                                        onClick={() => removeImage(i)}
                                        size='sm'
                                        variant='outline'
                                        className='bg-red-50 hover:bg-red-100 text-red-700'
                                    >
                                        <Trash2 className='w-3 h-3' />
                                    </Button>
                                </div>
                            )}

                            <div className="relative overflow-hidden h-60 md:h-72">
                                {/* GRADIENT OVERLAY on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                                {/* IMAGE with grayscale → color on hover */}
                                <img
                                    src={src}
                                    alt={`Gallery image ${i + 1}`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                                    style={{ backfaceVisibility: "hidden" }}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop";
                                    }}
                                />

                                {!isEditing && (
                                    ''
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotateX: 10 }}
                            animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                            transition={{
                                delay: 0.5 + displayContent.images.length * 0.1,
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="overflow-hidden rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer flex items-center justify-center min-h-60 md:min-h-72"
                            onClick={addImage}
                        >
                            <div className="text-center p-4">
                                <Plus className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Add Image</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}