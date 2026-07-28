import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AdSlot from './AdSlot';
import { MediaItem } from '../../lib/mediaApi';

// Populated once by AdsLoader on app mount. Plain module-level cache (not React
// state/context) since nothing here needs mid-session reactivity — ads don't
// change while a tab is open, and every consumer below reads this synchronously
// during its own render, so no call site across the ~33 pages using these
// helpers needs to change to start receiving real ads instead of dummies.
let realAdsCache: MediaItem[] = [];

export function setRealAdsCache(ads: MediaItem[]) {
  realAdsCache = ads;
}

export function getAdsFor(zone: string, pathname: string): MediaItem[] {
  const today = new Date().toISOString().slice(0, 10);
  return realAdsCache.filter(ad => {
    if (ad.zone !== zone) return false;
    const pages = ad.targetPages || [];
    if (!pages.includes('all') && !pages.includes(pathname)) return false;
    if (ad.startDate && ad.startDate > today) return false;
    if (ad.endDate && ad.endDate < today) return false;
    return true;
  });
}


// Shared sample dummy ad creatives — built as inline CSS/emoji graphics rather
// than downloaded stock images, so there's no copyright/licensing question and
// no external file to review before shipping. Reused across every page that
// carries ad placements so the same few creatives rotate consistently instead
// of every page inventing its own.
export const DroneAdCreative = () => (
  <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex flex-col items-center justify-center text-center p-4 gap-1">
    <span className="text-4xl">🚁</span>
    <span className="text-yellow-400 font-extrabold text-sm">DroneTech Pro Series</span>
    <span className="text-white/60 text-[11px]">Precision UAVs for Agriculture &amp; Survey</span>
    <span className="mt-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">Shop Now →</span>
  </div>
);

export const ExpoAdCreative = () => (
  <div className="w-full h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 flex items-center justify-center gap-3 px-4">
    <span className="text-2xl flex-shrink-0">🏛️</span>
    <div className="text-center min-w-0">
      <span className="block text-black font-extrabold text-sm truncate">Drone Expo 2026 — Bengaluru</span>
      <span className="block text-black/70 text-[11px] truncate">Register now — Early Bird Pricing Ends Soon</span>
    </div>
    <span className="bg-black text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">Register →</span>
  </div>
);

// Thin horizontal banner — fits short strip zones (~64-100px tall)
export const TrainingAdCreative = () => (
  <div className="w-full h-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 flex items-center justify-center gap-3 px-4">
    <span className="text-2xl flex-shrink-0">🎓</span>
    <div className="text-center min-w-0">
      <span className="block text-white font-extrabold text-sm truncate">DGCA RPTO Certification — Enroll Today</span>
      <span className="block text-white/70 text-[11px] truncate">5-day Small Category course · Job placement support</span>
    </div>
    <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">Enroll →</span>
  </div>
);

// Tall vertical creative — fits a 300x600 premium sidebar slot
export const PartnerAdCreative = () => (
  <div className="w-full h-full bg-gradient-to-b from-amber-500 via-yellow-400 to-amber-500 flex flex-col items-center justify-center text-center p-5 gap-2">
    <span className="text-5xl">🤝</span>
    <span className="text-black font-extrabold text-base leading-snug">Partner With DroneTv.in</span>
    <span className="text-black/70 text-xs leading-relaxed">Reach 39,890+ certified drone pilots and 500+ verified companies across India</span>
    <span className="mt-2 bg-black text-yellow-400 text-xs font-bold px-4 py-2 rounded-full">Get Started →</span>
  </div>
);

const INLINE_CREATIVES = [DroneAdCreative, ExpoAdCreative, TrainingAdCreative];

// Inserts a full-width inline ad card after every 3rd item in a listing grid,
// cycling through the sample creatives so repeated slots don't look identical.
// Caller's grid must be a CSS grid (col-span-full spans every column).
export function withInlineAds<T>(arr: T[], render: (item: T, i: number) => ReactNode): ReactNode[] {
  const realAds = getAdsFor('inline', window.location.pathname);
  const out: ReactNode[] = [];
  let adCount = 0;
  arr.forEach((item, i) => {
    out.push(render(item, i));
    if ((i + 1) % 3 === 0 && i !== arr.length - 1) {
      const realAd = realAds.length > 0 ? realAds[adCount % realAds.length] : null;
      const Creative = INLINE_CREATIVES[adCount % INLINE_CREATIVES.length];
      adCount++;
      out.push(
        <div key={`ad-${i}`} className="col-span-full">
          {realAd ? (
            <AdSlot image={realAd.imageUrl} href={realAd.externalLink} alt={realAd.title} aspect="1200/100" minHeight={56} className="w-full" />
          ) : (
            <AdSlot aspect="1200/100" minHeight={56} className="w-full"><Creative /></AdSlot>
          )}
        </div>
      );
    }
  });
  return out;
}

// Zone 2A/2B: a 3-slot sidebar ad rail (standard/premium/standard), hidden below
// `lg` so it never disturbs mobile/tablet single-column layouts. Drop this as a
// sibling of the main content column inside an `lg:flex lg:items-start lg:gap-6` row.
export function AdSidebarRail() {
  const { pathname } = useLocation();
  const realAds = getAdsFor('sidebar', pathname);
  const slots = [
    { height: 250, dummy: ExpoAdCreative },
    { height: 600, dummy: PartnerAdCreative },
    { height: 250, dummy: DroneAdCreative },
  ];
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[300px] lg:flex-shrink-0 gap-4">
      {slots.map((slot, i) => {
        const realAd = realAds[i];
        const Dummy = slot.dummy;
        return (
          <div key={i}>
            <span className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1">Advertisement</span>
            {realAd ? (
              <AdSlot image={realAd.imageUrl} href={realAd.externalLink} alt={realAd.title} width={300} height={slot.height} />
            ) : (
              <AdSlot width={300} height={slot.height}><Dummy /></AdSlot>
            )}
          </div>
        );
      })}
    </aside>
  );
}

// Zone 6: small "Sponsored" tag for one exclusive category on a filter-pill row.
// Usage: wrap the pill button's className with `relative` and render this as a child.
export function SponsorBadge() {
  const { pathname } = useLocation();
  const realAd = getAdsFor('sponsor-badge', pathname)[0];
  return (
    <span className="absolute -top-2 -right-1 bg-white text-red-600 border border-red-600 text-[8px] font-bold px-1 rounded leading-tight">
      {realAd ? `Sponsored by ${realAd.company || realAd.title}` : 'Sponsored'}
    </span>
  );
}

// Zone 4: full-width thin banner for a natural content break between sections
export function AdDetailBanner() {
  const { pathname } = useLocation();
  const realAd = getAdsFor('detail-banner', pathname)[0];
  return realAd ? (
    <AdSlot image={realAd.imageUrl} href={realAd.externalLink} alt={realAd.title} aspect="1200/90" minHeight={50} className="w-full" />
  ) : (
    <AdSlot aspect="1200/90" minHeight={50} className="w-full"><TrainingAdCreative /></AdSlot>
  );
}
