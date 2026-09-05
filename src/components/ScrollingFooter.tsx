import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Zap, Target, Award, Truck, Star, Clock,
  Users, Gift, Wrench, Smartphone, Megaphone
} from 'lucide-react';
import { getAdsFor } from './common/adCreatives';

const advertisements = [
  { icon: Zap, text: "Drone TV Expo 2026 - India's Biggest Drone Event!", url: "/events" },
  { icon: Target, text: "DroneTv.in - India's #1 Drone Industry Platform", url: "/" },
  { icon: Award, text: "Corteva: Advanced GIS Mapping Services - Contact Us Now!", url: "/contact" },
  { icon: Zap, text: "AI-Powered Flight Controllers - Revolutionary Technology!", url: "/" },
  { icon: Star, text: "IDA Aerial Workshop", url: "/companies/india-drone-academy" },
  { icon: Clock, text: "Extended Battery Life - Up to 60 Minutes Flight Time!", url: "/products" },
  { icon: Award, text: "IPage UMS: Award-Winning Drone Solutions - Trusted by 1000+ Companies!", url: "/companies/ipage-ums" },
  { icon: Truck, text: "Drogo Drone: Free Shipping - Limited Time Offer!", url: "/products" },
  { icon: Wrench, text: "Professional Maintenance Services - Keep Your Drones Flying!", url: "/products" },
  { icon: Smartphone, text: "Drogo Drone: New Mobile App - Control Your Fleet from Anywhere!", url: "/services" },
  { icon: Users, text: "Corteva: Join 10,000+ Professionals in Our Community!", url: "/professionals" },
];

const ScrollingFooter = () => {
  const { pathname } = useLocation();
  // Real admin-managed "sticky" zone ads (the same content type the media
  // dashboard's Ads tab publishes) get spliced into the rotation as real,
  // clickable entries alongside the fixed ones - previously this ticker was
  // 100% hardcoded and publishing/unpublishing an ad in the admin panel had
  // no effect on it at all, which is what looked like ads "not unpublishing".
  const realAds = getAdsFor('sticky', pathname).map(ad => ({
    icon: Megaphone,
    text: ad.title,
    url: ad.externalLink || '/',
  }));
  const rotation = [...realAds, ...advertisements];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-yellow text-ink h-10 overflow-hidden border-t-2 border-ink shadow-lg">
      <div className="flex items-center h-full">
        <div className="animate-scroll whitespace-nowrap flex items-center">
          {[...rotation, ...rotation].map((ad, index) => (
            <a
              key={index}
              href={ad.url}
              className="inline-flex items-center px-6 text-sm font-bold"
              target={ad.url.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
            >
              <ad.icon className="h-4 w-4 mr-2 flex-shrink-0" />
              {ad.text}
              <span className="mx-4 text-ink/60">•</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingFooter;
