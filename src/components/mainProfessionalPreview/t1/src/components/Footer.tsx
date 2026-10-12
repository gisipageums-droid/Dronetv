import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface LinkItem {
  href: string;
  label: string;
}

export interface FooterContent {
  personalInfo: {
    name: string;
    description: string;
  };
  quickLinks: LinkItem[];
  moreLinks: LinkItem[];
}

interface FooterProps {
  content: FooterContent;
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(
    null
  );

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setFooterContent(content);
  }, [content]);

  return (
    <footer className="bg-dark-300 text-justify border-t border-ink-light dark:border-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Info Section */}
          <div className="col-span-1 lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer min-w-0 flex-shrink-0 text-status-info dark:text-orange-500 mb-4"
              onClick={() => scrollToSection("#home")}
            >
              <div className="rounded-full bg-brand-gold text-ink h-10 w-10 text-2xl font-extrabold flex items-center justify-center p-2">
                <span className="uppercase">
                  {(footerContent?.personalInfo?.name || (footerContent as any)?.logoText || "P")[0]}
                </span>
              </div>
              <span className="text-2xl font-bold truncate capitalize text-brand-gold">
                {footerContent?.personalInfo?.name || (footerContent as any)?.logoText || "MyLogo"}
              </span>
            </motion.div>

            <p className="text-ink-caption mb-6 leading-relaxed max-w-md">
              {content?.personalInfo?.description || (content as any)?.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-ink-paragraph dark:text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerContent?.quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-ink-caption hover:text-accent-orange transition"
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-ink-paragraph dark:text-white font-semibold mb-4">
              More
            </h3>
            <ul className="space-y-2 mb-6">
              {footerContent?.moreLinks.map((link, index) => (
                <li key={index}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-ink-caption hover:text-accent-orange transition"
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
