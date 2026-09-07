import React from 'react';
import { useLocation } from 'react-router-dom';
import { Megaphone, Zap, Target, Clock } from 'lucide-react';
import { getAdsFor } from './common/adCreatives';

// DroneTv-owned house links shown when the admin has no "sticky" zone ad
// published. Deliberately NOT third-party-branded promos - the old hardcoded
// list ("Drogo Drone", "Corteva", "IPage UMS"...) looked like paid ads the
// admin couldn't take down, since the ticker was never wired to the CMS.
const houseLinks = [
  { icon: Zap, text: "Drone TV Expo 2026 - India's Biggest Drone Event", url: "/events" },
  { icon: Target, text: "DroneTv.in - India's #1 Drone Industry Platform", url: "/companies" },
  { icon: Clock, text: "Explore verified drone products & services", url: "/products" },
];

const ScrollingFooter = () => {
  const { pathname } = useLocation();
  // Real admin-managed "sticky" zone ads (the media dashboard's Ads tab).
  // When the admin publishes ads they drive the ticker; when everything is
  // drafted/unpublished the ticker falls back to DroneTv's own house links,
  // so nothing that looks like a live sponsor ad is left showing.
  const realAds = getAdsFor('sticky', pathname).map(ad => ({
    icon: Megaphone,
    text: ad.title,
    url: ad.externalLink || '/',
  }));
  const rotation = realAds.length > 0 ? realAds : houseLinks;

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
