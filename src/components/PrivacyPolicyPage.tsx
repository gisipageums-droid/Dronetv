import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Bell, Globe, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            content: [
                "Personal Information: Name, email address, phone number, and other contact details you provide when creating an account or contacting us.",
                "Usage Data: Information about how you interact with our platform, including pages visited, time spent, and features used.",
                "Device Information: IP address, browser type, operating system, and device identifiers.",
                "Cookies and Tracking: We use cookies and similar technologies to enhance your experience and gather analytics."
            ]
        },
        {
            icon: Eye,
            title: "How We Use Your Information",
            content: [
                "To provide, maintain, and improve our services and platform functionality.",
                "To personalize your experience and deliver content tailored to your interests.",
                "To communicate with you about updates, newsletters, and promotional offers.",
                "To analyze usage patterns and improve our platform's performance.",
                "To detect, prevent, and address technical issues and fraudulent activities.",
                "To comply with legal obligations and enforce our Terms and Conditions."
            ]
        },
        {
            icon: Lock,
            title: "Data Security",
            content: [
                "We implement industry-standard security measures to protect your personal information.",
                "Data is encrypted during transmission using SSL/TLS protocols.",
                "Access to personal data is restricted to authorized personnel only.",
                "We regularly review and update our security practices to address emerging threats.",
                "However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security."
            ]
        },
        {
            icon: UserCheck,
            title: "Information Sharing",
            content: [
                "We do not sell your personal information to third parties.",
                "We may share information with trusted service providers who assist in operating our platform.",
                "Information may be disclosed if required by law or to protect our rights and safety.",
                "With your consent, we may share information for marketing purposes.",
                "Aggregated, non-personally identifiable data may be shared for analytics and research."
            ]
        },
        {
            icon: Globe,
            title: "Third-Party Services",
            content: [
                "Our platform may contain links to third-party websites and services.",
                "We are not responsible for the privacy practices of these third parties.",
                "We encourage you to read the privacy policies of any third-party services you visit.",
                "Social media integrations may collect data according to their own privacy policies."
            ]
        },
        {
            icon: Shield,
            title: "Your Rights and Choices",
            content: [
                "Access: You can request access to the personal information we hold about you.",
                "Correction: You can request correction of inaccurate or incomplete information.",
                "Deletion: You can request deletion of your personal information, subject to legal requirements.",
                "Opt-Out: You can opt out of marketing communications at any time.",
                "Cookie Management: You can control cookie preferences through your browser settings."
            ]
        },
        {
            icon: Bell,
            title: "Data Retention",
            content: [
                "We retain personal information for as long as necessary to provide our services.",
                "Account information is retained until you request deletion or close your account.",
                "Some information may be retained for legal, regulatory, or legitimate business purposes.",
                "Anonymized data may be retained indefinitely for analytics and research."
            ]
        },
        {
            icon: UserCheck,
            title: "Children's Privacy",
            content: [
                "Our platform is not intended for children under the age of 13.",
                "We do not knowingly collect personal information from children.",
                "If we learn that we have collected information from a child, we will delete it promptly.",
                "Parents or guardians should contact us if they believe their child has provided information."
            ]
        }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-200/30 rounded-full animate-pulse blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-600/30 rounded-full animate-pulse blur-3xl" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30">
                                <Shield className="h-16 w-16 text-black" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 animate-fade-in-up">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-black/80 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Your privacy is important to us. Learn how we protect and manage your data.
                        </p>
                        <p className="text-sm text-black/70 mt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Last Updated: November 2024
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Introduction */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        At Drone TV, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        By using Drone TV, you consent to the data practices described in this policy.
                        If you do not agree with this policy, please do not use our services.
                    </p>
                </div>

                {/* Privacy Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-100 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 group-hover:scale-110 transition-transform duration-300">
                                        <IconComponent className="h-8 w-8 text-black" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                                        <ul className="space-y-3">
                                            {section.content.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                                                    <span className="flex-shrink-0 h-2 w-2 bg-yellow-500 rounded-full mt-2"></span>
                                                    <span className="leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Updates Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h3>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                        operational, or regulatory reasons. We will notify you of any material changes by posting the new
                        Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        We encourage you to review this Privacy Policy periodically to stay informed about how we are
                        protecting your information.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 rounded-2xl shadow-xl p-8 text-center">
                    <Mail className="h-12 w-12 text-black mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-black mb-4">Privacy Questions or Concerns?</h3>
                    <p className="text-black/80 mb-6 text-lg">
                        If you have questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        Contact Us
                    </a>
                </div>

                {/* Back to Top */}
                <div className="text-center mt-12">
                    <button
                        onClick={scrollToTop}
                        className="bg-white/80 backdrop-blur-sm text-black px-6 py-3 rounded-full border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
