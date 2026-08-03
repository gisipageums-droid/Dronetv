import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Heart, ArrowUp } from 'lucide-react';
import { mediaItems, eventsItems, professionalsItems, partnershipsItems, plainNavItems, NavItem } from '../lib/navLinks';

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/dronetv.in' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/dronetv.in/' },
  { name: 'X', icon: XIcon, href: 'https://x.com/indiadronetv' },
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@indiadronetv' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-and-conditions' },
  { name: 'Contact', href: '/contact' },
];

const FooterColumn = ({ title, indexPath, items }: { title: string; indexPath: string; items: NavItem[] }) => (
  <div>
    <Link to={indexPath} className="text-sm font-bold text-white uppercase tracking-wide hover:text-brand-yellow transition-colors">
      {title}
    </Link>
    <ul className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li key={item.path}>
          <Link to={item.path} className="text-sm text-white/70 hover:text-white transition-colors">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-darksection relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-yellow/10 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-gold/10 rounded-full animate-pulse blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link to="/">
              <img src="/images/logo.png" alt="Drone TV" className="h-9 w-auto" />
            </Link>
            <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-sm">
              India's drone industry platform — connecting manufacturers, pilots, GIS &amp; AI companies, buyers, and policymakers across the ecosystem.
            </p>

            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
              {plainNavItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Media Hub" indexPath="/media" items={mediaItems} />
          <FooterColumn title="Events" indexPath="/events" items={eventsItems} />
          <FooterColumn title="Professionals" indexPath="/professionals" items={professionalsItems} />
          <FooterColumn title="Partnerships" indexPath="/partnerships" items={partnershipsItems} />
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5 text-xs text-white/70 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Drone TV. Built with <Heart className="h-3.5 w-3.5 text-brand-yellow fill-brand-yellow" /> for the global drone community.
          </p>

          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-xs text-white/70 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
