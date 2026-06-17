import React from 'react';
import { FileText, Shield, Users, AlertCircle, Mail, Scale } from 'lucide-react';

const TermsAndConditionsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Drone TV's platform, you accept and agree to be bound by the terms and provisions of this agreement.",
        "If you do not agree to these Terms and Conditions, please do not use our services."
      ]
    },
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You may need to create an account to access certain features of our platform.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to provide accurate, current, and complete information during registration.",
        "You must notify us immediately of any unauthorized access to your account."
      ]
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "All content on Drone TV, including text, graphics, logos, images, and videos, is the property of Drone TV or its content suppliers.",
        "You may not reproduce, distribute, or create derivative works from our content without explicit permission.",
        "User-generated content remains the property of the respective users, but you grant us a license to use, display, and distribute such content on our platform."
      ]
    },
    {
      icon: AlertCircle,
      title: "Prohibited Activities",
      content: [
        "You shall not use our platform for any unlawful purpose or activity.",
        "You shall not attempt to interfere with the proper functioning of the platform.",
        "You shall not upload malicious code or engage in any form of hacking.",
        "You shall not impersonate another person or entity.",
        "You shall not collect or harvest any personally identifiable information from the platform."
      ]
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "Drone TV is provided 'as is' without warranties of any kind, either express or implied.",
        "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
        "Our total liability shall not exceed the amount you paid to us in the past 12 months.",
        "Some jurisdictions do not allow the exclusion of certain warranties, so some of these exclusions may not apply to you."
      ]
    },
    {
      icon: FileText,
      title: "Content Guidelines",
      content: [
        "Users must ensure that uploaded content does not violate any intellectual property rights.",
        "Content must not contain offensive, defamatory, or harmful material.",
        "We reserve the right to remove content that violates these guidelines.",
        "Repeated violations may result in account suspension or termination."
      ]
    },
    {
      icon: Mail,
      title: "Modifications to Terms",
      content: [
        "We reserve the right to modify these Terms and Conditions at any time.",
        "Changes will be effective immediately upon posting to the platform.",
        "Your continued use of the platform after changes constitutes acceptance of the modified terms.",
        "We encourage you to review these terms periodically."
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
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Legal</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            Terms &amp; <span className="text-yellow-400">Conditions</span>
          </h1>
          <p className="text-sm text-white/60 max-w-lg">Please read these terms carefully before using Drone TV.</p>
          <p className="text-xs text-white/40 mt-2">Last Updated: November 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Drone TV</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms and Conditions govern your use of the Drone TV platform and services.
            By accessing or using our website and services, you agree to comply with and be bound by these terms.
            Please review them carefully.
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

        <div className="mt-6 bg-black rounded-xl p-8 text-center">
          <Mail className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Questions About These Terms?</h3>
          <p className="text-white/70 mb-6 text-sm">
            If you have any questions or concerns regarding these Terms and Conditions, please contact us.
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

export default TermsAndConditionsPage;
