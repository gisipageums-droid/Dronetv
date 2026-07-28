import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import AdSlot from './AdSlot';
import { ExpoAdCreative, getAdsFor } from './adCreatives';

// Pages excluded from ad placements entirely (per explicit user instruction):
// Home, About Us, Contact, Purchase (which is /partnerships/benefits) — plus
// internal editor/form/admin/dashboard routes where a fixed overlay would sit
// on top of active UI instead of content. Note "/professional/" (singular,
// trailing slash) only matches the form/edit/select/t1/t2 routes, not the
// public "/professionals/..." (plural) listing pages this strip should cover.
const EXCLUDED_EXACT_PATHS = ['/', '/about', '/contact', '/partnerships/benefits'];
const EXCLUDED_PREFIXES = ['/admin', '/company', '/professional/', '/template', '/edit', '/user', '/form', '/events/form', '/event/leads'];

// Zone 5: single site-wide bottom sticky strip, mounted once in App.tsx rather
// than duplicated per page — one dismiss covers the whole site for the session,
// and it never renders on excluded pages.
export default function AdStickyStrip() {
  const [dismissed, setDismissed] = useState(false);
  const { pathname } = useLocation();

  const isExcluded = EXCLUDED_EXACT_PATHS.includes(pathname) || EXCLUDED_PREFIXES.some(p => pathname.startsWith(p));
  if (dismissed || isExcluded) return null;

  const realAd = getAdsFor('sticky', pathname)[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999998] border-t-2 border-yellow-400 bg-white/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
        {realAd ? (
          <AdSlot image={realAd.imageUrl} href={realAd.externalLink} alt={realAd.title} aspect="1200/64" minHeight={40} className="flex-1 min-w-0" />
        ) : (
          <AdSlot aspect="1200/64" minHeight={40} className="flex-1 min-w-0"><ExpoAdCreative /></AdSlot>
        )}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close advertisement"
          className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
