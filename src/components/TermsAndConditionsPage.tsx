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
                <Scale className="h-16 w-16 text-black" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 animate-fade-in-up">
              Terms and Conditions
            </h1>
            <p className="text-xl text-black/80 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Please read these terms carefully before using Drone TV
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Drone TV</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            These Terms and Conditions govern your use of the Drone TV platform and services. 
            By accessing or using our website and services, you agree to comply with and be bound by these terms. 
            Please review them carefully.
          </p>
        </div>

        {/* Terms Sections */}
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

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 rounded-2xl shadow-xl p-8 text-center">
          <Mail className="h-12 w-12 text-black mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-black mb-4">Questions About These Terms?</h3>
          <p className="text-black/80 mb-6 text-lg">
            If you have any questions or concerns regarding these Terms and Conditions, please contact us.
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

export default TermsAndConditionsPage;
