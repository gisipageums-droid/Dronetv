import { Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    logoText: string;
    description: string;
    quickLinks: FooterLink[];
    moreLinks: FooterLink[];
    contactInfo: ContactItem[];
    copyright: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    bottomLinks: FooterLink[];
}

interface FooterProps {
    footerData?: any;
}

export function Footer({ footerData }: FooterProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);

    console.log('Footer component rendered with data:', footerData);

    const defaultFooterData: FooterData = {
        logoText: "EventPro 2025",
        description: "Creating unforgettable experiences through exceptional events. Join us in making memories that last a lifetime.",
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
        contactInfo: [
            { icon: 'Mail', text: 'hello@eventpro.com', href: 'mailto:hello@eventpro.com' },
            { icon: 'Phone', text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
            { icon: 'MapPin', text: '123 Event Street, City, State 12345' }
        ],
        copyright: "© 2025 EventPro. All rights reserved.",
        newsletterPlaceholder: "Enter your email",
        newsletterButton: "Subscribe",
        bottomLinks: [
            { id: '9', label: 'Privacy Policy', href: '#' },
            { id: '10', label: 'Terms of Service', href: '#' },
            { id: '11', label: 'Cookie Policy', href: '#' }
        ]
    };

    // Transform backend data to component format
    const transformFooterData = useCallback((data: any): FooterData => {
        if (!data) return defaultFooterData;
        
        // Check if data is already in FooterData format
        if (data.logoText && data.description) {
            return data;
        }
        
        // Transform from backend format to component format
        const footerContent = data.footerContent || data;
        
        return {
            logoText: footerContent.eventInfo?.name || defaultFooterData.logoText,
            description: footerContent.eventInfo?.description || defaultFooterData.description,
            quickLinks: (footerContent.quickLinks || defaultFooterData.quickLinks).map((link: any, index: number) => ({
                id: link.id || `quick-${index}`,
                label: link.label,
                href: link.href
            })),
            moreLinks: (footerContent.moreLinks || defaultFooterData.moreLinks).map((link: any, index: number) => ({
                id: link.id || `more-${index}`,
                label: link.label,
                href: link.href
            })),
            contactInfo: defaultFooterData.contactInfo,
            copyright: footerContent.bottomSection?.copyrightText || defaultFooterData.copyright,
            newsletterPlaceholder: defaultFooterData.newsletterPlaceholder,
            newsletterButton: defaultFooterData.newsletterButton,
            bottomLinks: [
                ...(footerContent.bottomSection?.privacyPolicy ? [{
                    id: 'privacy',
                    label: footerContent.bottomSection.privacyPolicy.label,
                    href: footerContent.bottomSection.privacyPolicy.href
                }] : []),
                ...(footerContent.bottomSection?.termsOfService ? [{
                    id: 'terms',
                    label: footerContent.bottomSection.termsOfService.label,
                    href: footerContent.bottomSection.termsOfService.href
                }] : [])
            ].length > 0 ? [
                ...(footerContent.bottomSection?.privacyPolicy ? [{
                    id: 'privacy',
                    label: footerContent.bottomSection.privacyPolicy.label,
                    href: footerContent.bottomSection.privacyPolicy.href
                }] : []),
                ...(footerContent.bottomSection?.termsOfService ? [{
                    id: 'terms',
                    label: footerContent.bottomSection.termsOfService.label,
                    href: footerContent.bottomSection.termsOfService.href
                }] : [])
            ] : defaultFooterData.bottomLinks
        };
    }, []);

    const [data, setData] = useState<FooterData>(() => transformFooterData(footerData));

    // Initialize data only once when component mounts
    useEffect(() => {
        if (footerData && !dataLoaded) {
            const transformedData = transformFooterData(footerData);
            setData(transformedData);
            setDataLoaded(true);
        }
    }, []); // Empty dependency array - runs only once

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
                setTimeout(() => resolve(transformFooterData(footerData)), 1200)
            );
            setData(response);
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
                    <div className="w-8 h-8 animate-spin mx-auto text-yellow-500">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <p className="text-gray-600 mt-4">Loading footer data...</p>
                </div>
            </footer>
        );
    }

    return (
        <footer ref={footerRef} className="bg-amber-50 border-t border-amber-200">
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
                                    <span className="text-white font-semibold text-lg uppercase">{data.logoText.charAt(0)}</span>
                                </div>
                                <span className="text-gray-900 text-xl font-semibold">{data.logoText}</span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">
                                {data.description}
                            </p>
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
                                {defaultFooterData.quickLinks.map((link) => (
                                    <li key={link.id}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 hover:text-yellow-600 transition-colors text-sm"
                                        >
                                            {link.label}
                                        </a>
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
                                {defaultFooterData.moreLinks.map((link) => (
                                    <li key={link.id}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 hover:text-yellow-600 transition-colors text-sm"
                                        >
                                            {link.label}
                                        </a>
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