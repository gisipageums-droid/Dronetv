import { Edit2, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

// Custom Button component
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

// Custom Badge component
const Badge = ({ children, className }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
        {children}
    </span>
);

export default function EditableCompanyProfile({ profileData, onStateChange, userId, publishedId, templateSelection }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const fileInputRef = useRef(null);

    // Pending image file for S3 upload
    const [pendingImageFile, setPendingImageFile] = useState(null);

    // Animation counters
    const hasAnimated = useRef(false);
    const [animatedCounters, setAnimatedCounters] = useState({
        growth: 0,
        team: 0,
        projects: 0,
    });

    // Default content structure
    const defaultContent = {
        companyName: profileData?.companyName || "Innovative Labs",
        establishedYear: profileData?.establishedYear || 2015,
        growthThisYear: profileData?.growthThisYear || 42,
        satisfiedCustomers: profileData?.satisfiedCustomers || 20,
        teamSize: profileData?.teamSize || 150,
        projectsDelivered: profileData?.projectsDelivered || 25,
        description: profileData?.description || "Founded in 2015, we are a global innovation studio crafting digital experiences, scalable platforms, and future-ready strategies for industry leaders.",
        coreValues: profileData?.coreValues || [
            "Innovation First",
            "Client Obsessed",
            "Ownership & Accountability",
            "Grow Together"
        ],
        companyImage: profileData?.companyImage || "https://images.unsplash.com/photo-1529533520516-5e45b20d07a5?w=800&h=600&fit=crop"
    };

    // Consolidated state
    const [profileState, setProfileState] = useState(defaultContent);
    const [tempProfileState, setTempProfileState] = useState(defaultContent);

    // Notify parent of state changes
    useEffect(() => {
        if (onStateChange) {
            onStateChange(profileState);
        }
    }, [profileState, onStateChange]);

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

    // Animate counters when section becomes visible
    useEffect(() => {
        if (!isVisible || hasAnimated.current) return;

        hasAnimated.current = true;

        const duration = 2000;

        const animateCounter = (start, end, setter) => {
            const increment = end > start ? 1 : -1;
            const totalSteps = Math.abs(end - start);
            const stepTime = Math.floor(duration / totalSteps);

            let current = start;
            const timer = setInterval(() => {
                current += increment;
                setter(current);
                if (current === end) clearInterval(timer);
            }, stepTime);

            return () => clearInterval(timer);
        };

        const timers = [
            animateCounter(animatedCounters.growth, tempProfileState.growthThisYear, (v) =>
                setAnimatedCounters((prev) => ({ ...prev, growth: v }))
            ),
            animateCounter(animatedCounters.team, tempProfileState.teamSize, (v) =>
                setAnimatedCounters((prev) => ({ ...prev, team: v }))
            ),
            animateCounter(animatedCounters.projects, tempProfileState.projectsDelivered, (v) =>
                setAnimatedCounters((prev) => ({ ...prev, projects: v }))
            ),
        ];

        return () => timers.forEach((clear) => clear && clear());
    }, [isVisible, tempProfileState.growthThisYear, tempProfileState.teamSize, tempProfileState.projectsDelivered]);

    // Simulate API call to fetch data from database
    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            // Replace this with your actual API call
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(defaultContent);
                }, 1500); // Simulate network delay
            });

            setProfileState(response);
            setTempProfileState(response);
            setDataLoaded(true);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            // Keep default content on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when component becomes visible
    useEffect(() => {
        if (isVisible && !dataLoaded && !isLoading) {
            fetchProfileData();
        }
    }, [isVisible, dataLoaded, isLoading]);

    const handleEdit = () => {
        setIsEditing(true);
        setTempProfileState(profileState);
        setPendingImageFile(null);
        // Reset animation for editing
        hasAnimated.current = false;
        setAnimatedCounters({
            growth: 0,
            team: 0,
            projects: 0,
        });
    };

    // Updated Save function with S3 upload
    const handleSave = async () => {
        try {
            setIsUploading(true);

            // Create a copy of tempProfileState to update with S3 URLs
            let updatedState = { ...tempProfileState };

            // Upload company image if there's a pending file
            if (pendingImageFile) {
                if (!userId || !publishedId || !templateSelection) {
                    toast.error('Missing user information. Please refresh and try again.');
                    return;
                }

                const formData = new FormData();
                formData.append('file', pendingImageFile);
                formData.append('sectionName', 'companyProfile');
                formData.append('imageField', 'companyImage');
                formData.append('templateSelection', templateSelection);

                const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    updatedState.companyImage = uploadData.imageUrl;
                    console.log('Company image uploaded to S3:', uploadData.imageUrl);
                } else {
                    const errorData = await uploadResponse.json();
                    toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
                    return;
                }
            }

            // Clear pending file
            setPendingImageFile(null);

            // Save the updated state with S3 URLs
            setIsSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

            // Update both states with the new URLs
            setProfileState(updatedState);
            setTempProfileState(updatedState);

            setIsEditing(false);
            toast.success('Company profile saved with S3 URLs ready for publish');

        } catch (error) {
            console.error('Error saving company profile:', error);
            toast.error('Error saving changes. Please try again.');
        } finally {
            setIsUploading(false);
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempProfileState(profileState);
        setPendingImageFile(null);
        setIsEditing(false);
    };

    // Stable update function with useCallback
    const updateTempContent = useCallback((field, value) => {
        setTempProfileState((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Update functions for arrays
    const updateCoreValue = useCallback((index, value) => {
        setTempProfileState((prev) => {
            const updatedCoreValues = [...prev.coreValues];
            updatedCoreValues[index] = value;
            return { ...prev, coreValues: updatedCoreValues };
        });
    }, []);

    // Add new items to arrays
    const addCoreValue = useCallback(() => {
        setTempProfileState((prev) => ({
            ...prev,
            coreValues: [...prev.coreValues, "New Value"],
        }));
    }, []);

    // Remove items from arrays
    const removeCoreValue = useCallback((index) => {
        setTempProfileState((prev) => ({
            ...prev,
            coreValues: prev.coreValues.filter((_, i) => i !== index),
        }));
    }, []);

    // Image upload handler with validation
    const handleImageUpload = useCallback((event) => {
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
        setPendingImageFile(file);

        // Show immediate local preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempProfileState((prev) => ({
                ...prev,
                companyImage: e.target.result,
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    // Memoized EditableText component to prevent recreation
    const EditableText = useMemo(() => {
        return ({
            value,
            field,
            multiline = false,
            className = "",
            placeholder = "",
            onChange = null, // Allow custom onChange handler
        }) => {
            const handleChange = (e) => {
                if (onChange) {
                    onChange(e); // Use custom handler if provided
                } else {
                    updateTempContent(field, e.target.value); // Use default handler
                }
            };

            const baseClasses =
                "w-full bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none";

            if (multiline) {
                return (
                    <textarea
                        value={value}
                        onChange={handleChange}
                        className={`${baseClasses} p-2 resize-none ${className}`}
                        placeholder={placeholder}
                        rows={3}
                    />
                );
            }

            return (
                <input
                    type='text'
                    value={value}
                    onChange={handleChange}
                    className={`${baseClasses} p-1 ${className}`}
                    placeholder={placeholder}
                />
            );
        };
    }, [updateTempContent]);

    const displayContent = isEditing ? tempProfileState : profileState;
    const displayCounters = isEditing ? {
        growth: displayContent.growthThisYear,
        team: displayContent.teamSize,
        projects: displayContent.projectsDelivered
    } : animatedCounters;

    return (
        <section
            id="profile"
            ref={sectionRef}
            className="py-24 bg-gradient-to-b from-white to-yellow-50/30 scroll-mt-20 relative"
        >
            {/* Loading Overlay */}
            {isLoading && (
                <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-20'>
                    <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3'>
                        <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
                        <span className='text-gray-700'>Loading content...</span>
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
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT SIDE — Company Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        {isEditing && (
                            <div className='absolute top-2 right-2 z-10'>
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    size='sm'
                                    variant='outline'
                                    className='bg-white/90 backdrop-blur-sm shadow-md'
                                >
                                    <Upload className='w-4 h-4 mr-2' />
                                    Change Image
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    className='hidden'
                                />
                                {pendingImageFile && (
                                    <p className='text-xs text-orange-600 mt-1 bg-white p-1 rounded'>
                                        Image selected: {pendingImageFile.name}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="rounded-3xl overflow-hidden shadow-xl border border-yellow-100">
                            <img
                                src={displayContent.companyImage}
                                alt={`${displayContent.companyName} Office`}
                                className="w-full h-auto object-cover"
                                onError={(e) => {
                                    // Fallback if image fails
                                    e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop";
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE — Company Info */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.7 }}
                        >
                            <Badge className="bg-[#ffeb3b] text-gray-900 px-4 py-1.5 mb-4">
                                Since {isEditing ? (
                                    <EditableText
                                        value={displayContent.establishedYear}
                                        field='establishedYear'
                                        className="w-16 ml-1"
                                        placeholder="Year"
                                    />
                                ) : (
                                    displayContent.establishedYear
                                )}
                            </Badge>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                {isEditing ? (
                                    <EditableText
                                        value={displayContent.companyName}
                                        field='companyName'
                                        className="text-4xl md:text-5xl"
                                        placeholder="Company name"
                                    />
                                ) : (
                                    displayContent.companyName
                                )}
                            </h2>

                            {isEditing ? (
                                <EditableText
                                    value={displayContent.description}
                                    field='description'
                                    multiline={true}
                                    className="text-lg text-gray-700 mt-4 max-w-xl"
                                    placeholder="Company description"
                                />
                            ) : (
                                <p className="text-lg text-gray-700 mt-4 max-w-xl">
                                    {displayContent.description}
                                </p>
                            )}
                        </motion.div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            {[
                                {
                                    label: "Growth This Year",
                                    value: `${displayCounters.growth}%`,
                                    field: "growthThisYear",
                                    delay: 0.4,
                                },
                                {
                                    label: "Happy Clients",
                                    value: `${displayContent.satisfiedCustomers}+`,
                                    field: "satisfiedCustomers",
                                    delay: 0.6,
                                },
                                {
                                    label: "Team Members",
                                    value: displayCounters.team,
                                    field: "teamSize",
                                    delay: 0.8,
                                },
                                {
                                    label: "Projects Delivered",
                                    value: displayCounters.projects,
                                    field: "projectsDelivered",
                                    delay: 1.0,
                                },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: stat.delay, duration: 0.6 }}
                                    className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border border-yellow-100 hover:shadow-md transition-shadow"
                                >
                                    {isEditing ? (
                                        <div className="flex flex-col items-center">
                                            <EditableText
                                                value={stat.field === "growthThisYear" ?
                                                    displayContent[stat.field] :
                                                    stat.field === "satisfiedCustomers" ?
                                                        displayContent[stat.field] :
                                                        displayContent[stat.field]
                                                }
                                                field={stat.field}
                                                className="text-3xl md:text-4xl font-extrabold text-gray-900 w-20 text-center mb-1"
                                                placeholder="Value"
                                            />
                                            <div className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wide">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-3xl md:text-4xl font-extrabold text-gray-900">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs md:text-sm text-gray-600 mt-2 uppercase tracking-wide">
                                                {stat.label}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Core Values */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isVisible ? { opacity: 1 } : {}}
                            transition={{ delay: 1.2, duration: 0.7 }}
                            className="mt-8 space-y-4"
                        >
                            <h3 className="text-xl font-bold text-gray-900">Our Core Values</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {displayContent.coreValues.map((value, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={isVisible ? { x: 0, opacity: 1 } : {}}
                                        transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                                        className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl"
                                    >
                                        <div className="w-2 h-2 bg-[#ffeb3b] rounded-full"></div>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2 w-full">
                                                <EditableText
                                                    value={value}
                                                    onChange={(e) => updateCoreValue(i, e.target.value)}
                                                    className="flex-1"
                                                    placeholder="Core value"
                                                />
                                                <Button
                                                    onClick={() => removeCoreValue(i)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-800 font-medium">{value}</span>
                                        )}
                                    </motion.div>
                                ))}
                                {isEditing && (
                                    <Button
                                        onClick={addCoreValue}
                                        size="sm"
                                        variant="outline"
                                        className="bg-green-50 hover:bg-green-100 text-green-700 w-full"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Value
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}