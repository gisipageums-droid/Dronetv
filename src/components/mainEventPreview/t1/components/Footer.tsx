import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

interface QuickLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface FooterContent {
  eventName: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
}

interface FooterProps {
  footerData?: FooterContent;
}

/** Default data structure */
const defaultFooterContent: FooterContent = {
  eventName: "demo Event",
  description: "Event description",
  quickLinksTitle: "Quick Links",
  quickLinks: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Speakers", href: "#speakers" },
    { name: "Agenda", href: "#agenda" },
    { name: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { icon: "Facebook", href: "https://facebook.com", label: "Facebook" },
    { icon: "Instagram", href: "https://instagram.com", label: "Instagram" },
    { icon: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { icon: "Youtube", href: "https://youtube.com", label: "YouTube" },
  ],
};

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  // Use prop data or default values
  const footerContent = footerData || defaultFooterContent;

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Facebook":
        return <Facebook size={20} />;
      case "Twitter":
        return <Twitter size={20} />;
      case "Instagram":
        return <Instagram size={20} />;
      case "Linkedin":
        return <Linkedin size={20} />;
      case "Youtube":
        return <Youtube size={20} />;
      default:
        return <Facebook size={20} />;
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-ink text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Event Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#FFD400] mb-4">
                {footerContent.eventName}
              </h2>
            </div>
            <p className="text-ink-caption mb-6 leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-[#FFD400] mb-4">
              {footerContent.quickLinksTitle}
            </h3>
            <ul className="space-y-2">
              {footerContent.quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-ink-caption hover:text-[#FFD400] transition-all duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links Section */}
        {/* <div className="border-t border-ink-charcoal pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="text-ink-caption">Follow us:</span>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                {footerContent.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-ink-charcoal rounded-full flex items-center justify-center text-ink-caption hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getSocialIcon(social.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          
          <div className="mt-8 pt-8 border-t border-ink-charcoal text-center text-ink-caption">
            <p>© {new Date().getFullYear()} {footerContent.eventName}. All rights reserved.</p>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;