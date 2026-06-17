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
        <div className="pt-[104px] min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-black text-white relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Legal</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                        Privacy <span className="text-yellow-400">Policy</span>
                    </h1>
                    <p className="text-sm text-white/60 max-w-lg">Your privacy is important to us. Learn how we protect and manage your data.</p>
                    <p className="text-xs text-white/40 mt-2">Last Updated: November 2024</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        At Drone TV, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        By using Drone TV, you consent to the data practices described in this policy.
                        If you do not agree with this policy, please do not use our services.
                    </p>
                </div>

                <div className="space-y-4">
                    {sections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-black rounded-xl p-3 flex-shrink-0">
                                        <IconComponent className="h-6 w-6 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                                        <ul className="space-y-3">
                                            {section.content.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                                                    <span className="flex-shrink-0 h-1.5 w-1.5 bg-yellow-400 rounded-full mt-2"></span>
                                                    <span className="leading-relaxed text-sm">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We may update this Privacy Policy from time to time to reflect changes in our practices or for legal,
                        operational, or regulatory reasons. We will notify you of any material changes by posting the new
                        Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        We encourage you to review this Privacy Policy periodically to stay informed about how we are
                        protecting your information.
                    </p>
                </div>

                <div className="mt-6 bg-black rounded-xl p-8 text-center">
                    <Mail className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Privacy Questions or Concerns?</h3>
                    <p className="text-white/70 mb-6 text-sm">
                        If you have questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-200"
                    >
                        Contact Us
                    </a>
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={scrollToTop}
                        className="px-6 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 transition"
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
