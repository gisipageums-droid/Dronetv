import { Edit2, Heart, Loader2, Save, X, Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Text limits for Footer only
const FOOTER_TEXT_LIMITS = {
    LOGO_TEXT: 30,
    TAGLINE: 80,
    DESCRIPTION: 300,
    LINK_LABEL: 40,
    COPYRIGHT: 100,
    BUILT_WITH: 80,
    CONTACT_FIELD: 60,
    SOCIAL_LABEL: 40,
    NEWSLETTER_PLACEHOLDER: 40,
    NEWSLETTER_BUTTON: 20,
};

// Custom Button component (consistent with other components)
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

interface FooterLink {
    id: string;
    href: string;
    label: string;
}

interface ContactItem {
    icon: string;
    text: string;
    href?: string;
}

interface FooterData {
    eventInfo: {
        name: string;
        description: string;
    };
    quickLinks: FooterLink[];
    moreLinks: FooterLink[];
    bottomSection: {
        copyrightText: string;
        afterCopyrightText?: string;
        privacyPolicy?: {
            href: string;
            label: string;
        };
        termsOfService?: {
            href: string;
            label: string;
        };
    };
}

interface FooterProps {
    footerData?: any;
    onStateChange?: (data: any) => void;
}

export function Footer({ footerData, onStateChange }: FooterProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);

    console.log('Footer component rendered with data:', footerData);

    const defaultFooterData: FooterData = {
        eventInfo: {
            name: "EventPro 2025",
            description: "Creating unforgettable experiences through exceptional events. Join us in making memories that last a lifetime."
        },
        quickLinks: [
            { id: '1', label: 'Home', href: '#home' },
            { id: '2', label: 'Events', href: '#events' },
            { id: '3', label: 'Highlights', href: '#highlights' },
            { id: '4', label: 'Speakers', href: '#speakers' }
        ],
        moreLinks: [
            { id: '5', label: 'Schedule', href: '#schedule' },
            { id: '6', label: 'Exhibitors', href: '#exhibitors' },
            { id: '7', label: 'Gallery', href: '#gallery' },
            { id: '8', label: 'Contact', href: '#contact' }
        ],
        bottomSection: {
            copyrightText: "© 2025 EventPro. All rights reserved.",
            afterCopyrightText: "Powered by DroneTV Events",
            privacyPolicy: {
                href: '#privacy',
                label: 'Privacy Policy'
            },
            termsOfService: {
                href: '#terms',
                label: 'Terms of Service'
            }
        }
    };

    // Use backend data directly
    const [data, setData] = useState<FooterData>(() => 
        footerData?.footerContent || defaultFooterData
    );
    const [tempData, setTempData] = useState<FooterData>(() => 
        footerData?.footerContent || defaultFooterData
    );

    // Initialize data only once when component mounts
    useEffect(() => {
        if (footerData && !dataLoaded) {
            const backendData = footerData || defaultFooterData;
            setData(backendData);
            setTempData(backendData);
            setDataLoaded(true);
        }
    }, []);

    // Footer EditableText component
    const FooterEditableText = useCallback(({
        value,
        onChange,
        charLimit,
        className = "",
        placeholder = "",
        multiline = false,
        rows = 3,
    }: {
        value: string;
        onChange: (value: string) => void;
        charLimit?: number;
        className?: string;
        placeholder?: string;
        multiline?: boolean;
        rows?: number;
    }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            if (charLimit && newValue.length > charLimit) {
                return;
            }
            onChange(newValue);
        };

        const currentLength = value?.length || 0;
        const isOverLimit = charLimit && currentLength > charLimit;

        const baseClasses = "w-full bg-white border-2 border-dashed border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-900 placeholder-gray-400 px-3 py-2";

        return (
            <div className="relative">
                {multiline ? (
                    <textarea
                        value={value || ''}
                        onChange={handleChange}
                        className={`${baseClasses} resize-none ${className} ${isOverLimit ? 'border-red-400' : ''
                            }`}
                        placeholder={placeholder}
                        rows={rows}
                    />
                ) : (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={handleChange}
                        className={`${baseClasses} ${className} ${isOverLimit ? 'border-red-400' : ''
                            }`}
                        placeholder={placeholder}
                    />
                )}
                {charLimit && (
                    <div className={`absolute -bottom-6 right-0 text-xs ${isOverLimit ? 'text-red-400' : 'text-gray-400'
                        }`}>
                        {currentLength}/{charLimit}
                    </div>
                )}
            </div>
        );
    }, []);

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
        if (footerRef.current) observer.observe(footerRef.current);
        return () => {
            if (footerRef.current) observer.unobserve(footerRef.current);
        };
    }, []);

    // Fake API fetch
    const fetchFooterData = async () => {
        setIsLoading(true);
        try {
            const response = await new Promise<FooterData>((resolve) =>
                setTimeout(() => resolve(footerData?.footerContent || defaultFooterData), 1200)
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
            fetchFooterData();
        }
    }, [isVisible, dataLoaded, isLoading]);

    const handleEdit = () => {
        setIsEditing(true);
        setTempData({ ...data });
    };

    // Save function - maintains backend structure
    const handleSave = async () => {
        try {
            setIsSaving(true);

            // Save the updated data
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call

            // Update both states with backend structure
            setData(tempData);

            setIsEditing(false);
            toast.success('Footer section saved successfully');

        } catch (error) {
            console.error('Error saving footer section:', error);
            toast.error('Error saving changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempData({ ...data });
        setIsEditing(false);
    };

    // Update functions with useCallback - using backend structure
    const updateEventInfo = useCallback((field: keyof FooterData['eventInfo'], value: string) => {
        setTempData(prev => ({
            ...prev,
            eventInfo: {
                ...prev.eventInfo,
                [field]: value
            }
        }));
    }, []);

    const updateQuickLink = useCallback((index: number, field: keyof FooterLink, value: string) => {
        const updatedLinks = [...tempData.quickLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        setTempData(prev => ({
            ...prev,
            quickLinks: updatedLinks
        }));
    }, [tempData.quickLinks]);

    const updateMoreLink = useCallback((index: number, field: keyof FooterLink, value: string) => {
        const updatedLinks = [...tempData.moreLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        setTempData(prev => ({
            ...prev,
            moreLinks: updatedLinks
        }));
    }, [tempData.moreLinks]);

    const updateBottomSection = useCallback((field: keyof FooterData['bottomSection'], value: string) => {
        setTempData(prev => ({
            ...prev,
            bottomSection: {
                ...prev.bottomSection,
                [field]: value
            }
        }));
    }, []);

    const updatePrivacyPolicy = useCallback((field: keyof FooterData['bottomSection']['privacyPolicy'], value: string) => {
        setTempData(prev => ({
            ...prev,
            bottomSection: {
                ...prev.bottomSection,
                privacyPolicy: {
                    ...prev.bottomSection.privacyPolicy,
                    [field]: value
                }
            }
        }));
    }, [tempData.bottomSection?.privacyPolicy]);

    const updateTermsOfService = useCallback((field: keyof FooterData['bottomSection']['termsOfService'], value: string) => {
        setTempData(prev => ({
            ...prev,
            bottomSection: {
                ...prev.bottomSection,
                termsOfService: {
                    ...prev.bottomSection.termsOfService,
                    [field]: value
                }
            }
        }));
    }, [tempData.bottomSection?.termsOfService]);

    const removeQuickLink = useCallback((index: number) => {
        if (tempData.quickLinks.length <= 1) {
            toast.error("You must have at least one quick link");
            return;
        }
        const updatedLinks = tempData.quickLinks.filter((_, i) => i !== index);
        setTempData(prev => ({
            ...prev,
            quickLinks: updatedLinks
        }));
    }, [tempData.quickLinks]);

    const removeMoreLink = useCallback((index: number) => {
        if (tempData.moreLinks.length <= 1) {
            toast.error("You must have at least one more link");
            return;
        }
        const updatedLinks = tempData.moreLinks.filter((_, i) => i !== index);
        setTempData(prev => ({
            ...prev,
            moreLinks: updatedLinks
        }));
    }, [tempData.moreLinks]);

    const displayData = isEditing ? tempData : data;

    // Helper function to get Lucide icons
    const getIconComponent = (iconName: string) => {
        const icons: Record<string, any> = {
            Mail: Mail,
            Phone: Phone,
            MapPin: MapPin,
            Send: Send
        };
        return icons[iconName] || Mail;
    };

    // Loading state
    if (isLoading) {
        return (
            <footer ref={footerRef} className="py-12 bg-amber-50 border-t border-amber-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
                    <p className="text-gray-600 mt-4">Loading footer data...</p>
                </div>
            </footer>
        );
    }

    return (
        <footer ref={footerRef} className="bg-amber-50 border-t border-amber-200">
            {/* Edit Controls */}
            <div className='container mx-auto px-4 sm:px-6 pt-6'>
                <div className='max-w-6xl mx-auto text-right'>
                    {!isEditing ? (
                        <Button
                            onClick={handleEdit}
                            size='sm'
                            className='bg-red-500 hover:bg-red-600 shadow-md text-gray-900'
                        >
                            <Edit2 className='w-4 h-4 mr-2' />
                            Edit Footer
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
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
                        {/* Brand Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg uppercase">{displayData.eventInfo.name.charAt(0)}</span>
                                </div>
                                {isEditing ? (
                                    <FooterEditableText
                                        value={displayData.eventInfo.name}
                                        onChange={(value) => updateEventInfo('name', value)}
                                        charLimit={FOOTER_TEXT_LIMITS.LOGO_TEXT}
                                        className="text-xl font-semibold flex-1"
                                        placeholder="Event Name"
                                    />
                                ) : (
                                    <span className="text-gray-900 text-xl font-semibold">{displayData.eventInfo.name}</span>
                                )}
                            </div>

                            {isEditing ? (
                                <FooterEditableText
                                    value={displayData.eventInfo.description}
                                    onChange={(value) => updateEventInfo('description', value)}
                                    charLimit={FOOTER_TEXT_LIMITS.DESCRIPTION}
                                    className="text-sm mb-4"
                                    placeholder="Event Description"
                                    multiline
                                    rows={3}
                                />
                            ) : (
                                <p className="text-gray-600 text-sm mb-4">
                                    {displayData.eventInfo.description}
                                </p>
                            )}
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1 ml-40"
                        >
                            <h3 className="text-gray-900 font-semibold text-lg mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                {displayData.quickLinks.map((link, index) => (
                                    <li key={link.id}>
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center">
                                                <FooterEditableText
                                                    value={link.label}
                                                    onChange={(value) => updateQuickLink(index, 'label', value)}
                                                    charLimit={FOOTER_TEXT_LIMITS.LINK_LABEL}
                                                    className="text-sm flex-1"
                                                    placeholder="Link Label"
                                                />
                                                <Button
                                                    onClick={() => removeQuickLink(index)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className="text-gray-600 hover:text-yellow-600 transition-colors text-sm"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* More Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1 ml-40"
                        >
                            <h3 className="text-gray-900 font-semibold text-lg mb-4">More Links</h3>
                            <ul className="space-y-3">
                                {displayData.moreLinks.map((link, index) => (
                                    <li key={link.id}>
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center">
                                                <FooterEditableText
                                                    value={link.label}
                                                    onChange={(value) => updateMoreLink(index, 'label', value)}
                                                    charLimit={FOOTER_TEXT_LIMITS.LINK_LABEL}
                                                    className="text-sm flex-1"
                                                    placeholder="Link Label"
                                                />
                                                <Button
                                                    onClick={() => removeMoreLink(index)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-red-50 hover:bg-red-100 text-red-700 p-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className="text-gray-600 hover:text-yellow-600 transition-colors text-sm"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}