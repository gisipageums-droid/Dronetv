import React, { useState, useEffect, useMemo } from 'react';
import { Search, BadgeCheck, MapPin, ChevronRight, ChevronLeft, SlidersHorizontal, X, Award, Crown, Share2, Heart, BarChart2, Star, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';
import { COMPANY_API, LAMBDA } from '../lib/apiConfig';
import { withInlineAds } from './common/adCreatives';

export interface Company {
  companyName: string;
  location?: string;
  sectors?: string[];
  previewImage?: string;
  aboutDescription?: string;
  companyDescription?: string;
  createdAt?: string;
  lastModified?: string;
  publishedDate?: string;
  templateSelection?: string;
  urlSlug?: string;
  servicesCount?: number;
  productsCount?: number;
  reviewStatus?: string;
  badgeStatus?: string;
  publishedId?: string;
  companyId?: string;
  realDescription?: string | null;
  tagline?: string | null;
  galleryImages?: { url: string; label?: string | null }[];
  heroStats?: { id?: string; value?: string; label?: string }[];
  quote?: string | null;
  yearsInBusiness?: string | null;
  teamSize?: string | null;
  [key: string]: any;
}

const TIER_STYLE: Record<string, { label: string; packageLabel: string; ribbonBg: string; ribbonColor: string; bannerBg: string; bannerColor: string; verifiedListing: boolean; highlightBg: string; dark?: boolean }> = {
  silver: { label: 'SILVER', packageLabel: 'Reach Package', ribbonBg: 'linear-gradient(135deg,#E8E8E8,#9A9A9A)', ribbonColor: '#ffffff', bannerBg: 'linear-gradient(135deg,#8a8a8a,#4a4a4a)', bannerColor: '#ffffff', verifiedListing: false, highlightBg: '#F0F0F0' },
  gold: { label: 'GOLD BRAND', packageLabel: 'Package', ribbonBg: 'linear-gradient(135deg,#FFE38A,#C99400)', ribbonColor: '#7A5B00', bannerBg: 'linear-gradient(135deg,#E8B400,#8a6400)', bannerColor: '#ffffff', verifiedListing: true, highlightBg: '#FFF3C4' },
  // Platinum renders on a dark card (see .pc-card-dark) per the approved
  // design - highlightBg switches to a translucent white overlay so the
  // callout/highlight chips still read on that dark background.
  platinum: { label: 'PLATINUM', packageLabel: 'Expand Package', ribbonBg: 'linear-gradient(135deg,#CBD5E1,#64748B)', ribbonColor: '#F8C400', bannerBg: 'linear-gradient(135deg,#1e293b,#0F172A)', bannerColor: '#ffffff', verifiedListing: true, highlightBg: 'rgba(255,255,255,.08)', dark: true },
};

// Silver comes from real Silver-badge verification. Gold/Platinum map to the
// paid Brand/Expand packages, but a company's paid package isn't linked to
// its company record yet (lives in a separate service) - so those two tiers
// render correctly whenever that data exists, they just don't fire on any
// company today. Not fabricated: no company currently gets Gold/Platinum.
function getTier(c: Company): keyof typeof TIER_STYLE | null {
  if (c.badgeStatus === 'SILVER') return 'silver';
  if (c.badgeStatus === 'GOLD') return 'gold';
  if (c.badgeStatus === 'PLATINUM') return 'platinum';
  return null;
}

function useSavedCompanies() {
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dronetv_saved_companies') || '[]')); }
    catch { return new Set(); }
  });
  const toggle = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('dronetv_saved_companies', JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };
  return { saved, toggle };
}

// Industry detection from company name (sectors API field is always "General")
const DRONE_KW = /drone|uav|uas|unmanned|aerial|aero(?:space)?|aviation|rotor|rpas|rpto|multicopter|quadcopter|drona/i;
const GIS_KW   = /gis|geospatial|spatial|mapping|lidar|survey|topograph|remote.?sensing|cartograph|photogramm/i;
const AI_KW    = /\bai\b|\bai\s+lab|\balgo|robot(?:ics)?|machine.?learn|deep.?learn|computer.?vision|neural|intelligence\b|automation/i;

function getIndustry(c: Company): 'drone' | 'gis' | 'ai' | 'all' {
  const s = `${c.companyName || ''} ${c.companyDescription || ''} ${c.aboutDescription || ''}`;
  if (AI_KW.test(s)) return 'ai';
  if (GIS_KW.test(s)) return 'gis';
  if (DRONE_KW.test(s)) return 'drone';
  return 'all';
}

// Sector detection from company name
const SECTOR_KW: Record<string, RegExp> = {
  'Agriculture': /agri|spray|crop|farm|precision|kisan/i,
  'Survey & Mapping': /survey|mapping|topograph|lidar|georef|photogramm|cadastral/i,
  'Defence': /defenc|defense|military|security|force|army|navy/i,
  'Infrastructure': /infra|construct|inspection|bridge|pipeline|power|railway|highway/i,
  'Aerial Media': /media|photo|film|cinema|video|content|studio|creative/i,
  'Training': /train|academy|institute|education|school|learn|certif/i,
};

function getSectors(c: Company): string[] {
  const s = `${c.companyName || ''} ${c.companyDescription || ''} ${c.aboutDescription || ''}`;
  return Object.entries(SECTOR_KW)
    .filter(([, rx]) => rx.test(s))
    .map(([k]) => k);
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

// Some scraped records have about.tagline == companyName, which just
// repeats the name a second time in the callout box - only show a tagline
// when it actually says something different from the name itself.
function realTagline(company: Company): string | null {
  const t = (company.tagline || '').trim();
  if (!t) return null;
  return t.toLowerCase() === (company.companyName || '').trim().toLowerCase() ? null : t;
}

const IND_COLORS: Record<string, string> = { drone: '#0B5CB5', gis: '#22C55E', ai: '#6B2FB5', all: '#444' };
const IND_LABELS: Record<string, string> = { all: 'All', drone: '🚁 Drone', gis: '🗺️ GIS', ai: '🤖 AI' };
const AV_COLORS = ['#0B5CB5','#22C55E','#DC2626','#6B2FB5','#c05800','#1a5a9a','#3a6a1a','#9a3a1a'];

function avColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}

export const CSS = `
.co-page { background: #FFF8D6; font-family: 'Poppins', sans-serif; min-height: 100vh; padding-top: 60px; }
.co-hero { background: #111111; color: #fff; border-bottom: 2px solid #F8C400; }
.co-hero-i { max-width: 1280px; margin: 0 auto; padding: 10px 22px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.co-hero h1 { font-size: 15px; font-weight: 800; letter-spacing: -0.2px; line-height: 1.2; white-space: nowrap; }
.co-hero h1 span { color: #F8C400; }
.co-stats { display: flex; gap: 18px; flex-wrap: wrap; margin-left: auto; }
.co-stat-n { font-size: 15px; font-weight: 900; color: #F8C400; line-height: 1; }
.co-stat-l { font-size: 9.5px; color: rgba(255,255,255,.4); margin-top: 1px; }
.co-tabs { background: #111111; border-bottom: 3px solid #F8C400; position: sticky; top: 60px; z-index: 110; }
.co-tabs-i { max-width: 1280px; margin: 0 auto; padding: 0 22px; display: flex; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.co-tabs-i::-webkit-scrollbar { display: none; }
.co-tab { padding: 10px 18px; font-size: 12.5px; font-weight: 700; background: none; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 6px; transition: all .13s; border: none; border-bottom: 3px solid transparent; margin-bottom: -3px; }
.co-wrap { max-width: 1280px; margin: 0 auto; padding: 20px 22px; }

/* Sidebar layout */
.co-layout { display: grid; grid-template-columns: 240px 1fr; gap: 16px; align-items: start; }
.co-sidebar { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.06); position: sticky; top: 120px; }
.co-sidebar-title { font-size: 13px; font-weight: 800; color: #111111; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
.co-filter-grp { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #F0F0F0; }
.co-filter-grp:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.co-fl-label { font-size: 10px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 7px; }
.co-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.co-chip { padding: 4px 10px; border-radius: 14px; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all .12s; white-space: nowrap; font-family: 'Poppins',sans-serif; }
.co-main { min-width: 0; }
.co-search-bar { background: #fff; border: 1px solid #E5E5E5; border-radius: 8px; padding: 10px 12px; box-shadow: 0 1px 6px rgba(0,0,0,.06); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.co-search-bar input { border: none; background: none; font-size: 13px; width: 100%; outline: none; color: #111111; font-family: 'Poppins',sans-serif; }
.co-note { background: #FFFBE8; border: 1px solid #C9A010; border-radius: 8px; padding: 7px 12px; font-size: 11.5px; color: #7a5800; margin-bottom: 12px; }
.co-resbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 7px; }
.co-sort { padding: 6px 10px; border: 1.5px solid #E5E5E5; border-radius: 8px; font-size: 12.5px; color: #444; background: #fff; cursor: pointer; font-family: 'Poppins',sans-serif; }
.co-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 13px; }
.co-grid > * { min-width: 0; }
.co-empty { padding: 64px 0; text-align: center; }
.co-pages { display: flex; justify-content: center; margin-top: 28px; gap: 6px; flex-wrap: wrap; }
.co-page-btn { padding: 7px 13px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Poppins',sans-serif; }

/* Mobile sidebar toggle */
.co-filter-toggle { display: none; }
.co-mobile-overlay { display: none; }

/* Card */
.co-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); display: flex; flex-direction: column; transition: box-shadow .17s, transform .17s; cursor: pointer; position: relative; }
.co-card-save { position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,.9); border: 1px solid #E5E5E5; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; }
.co-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.14); transform: translateY(-2px); }
.co-card-top { padding: 13px 13px 0; display: flex; gap: 10px; align-items: flex-start; }
.co-avatar { width: 44px; height: 44px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 900; color: #fff; flex-shrink: 0; overflow: hidden; }
.co-avatar img { width: 44px; height: 44px; border-radius: 9px; object-fit: cover; }
.co-card-name { font-size: 12px; font-weight: 700; color: #111111; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.co-card-loc { display: flex; align-items: center; gap: 3px; font-size: 10px; color: #888; margin-top: 2px; min-width: 0; }
.co-card-loc svg { flex-shrink: 0; }
.co-card-loc-text { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1; min-width: 0; }
.co-card-desc { font-size: 12px; color: #777; line-height: 1.6; padding: 0 13px; margin-bottom: 9px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.co-card-foot { padding: 9px 13px; border-top: 1px solid #E5E5E5; background: #FAFAFA; display: flex; gap: 6px; }
.co-btn-out { flex: 1; background: #fff; color: #111111; border: 1.5px solid #E5E5E5; padding: 6px 8px; border-radius: 7px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 3px; font-family: 'Poppins',sans-serif; }
.co-btn-red { flex: 1; background: #DC2626; color: #fff; padding: 6px 8px; border-radius: 7px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: none; font-family: 'Poppins',sans-serif; }

@media (max-width: 960px) {
  .co-layout { grid-template-columns: 1fr; }
  .co-sidebar { position: static; display: none; }
  .co-sidebar.open { display: block; }
  .co-filter-toggle { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #111111; color: #F8C400; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: 'Poppins',sans-serif; margin-bottom: 10px; }
}
@media (max-width: 600px) {
  .co-hero-i { padding: 8px 14px; gap: 10px; }
  .co-hero h1 { font-size: 13px; }
  .co-stat-n { font-size: 13px; }
  .co-wrap { padding: 12px 14px; }
  .co-grid { grid-template-columns: 1fr; }
  .co-tabs-i { padding: 0 14px; }
  .co-tab { padding: 8px 12px; font-size: 12px; }
}

/* Premium (Silver / Gold / Platinum) verified-company spotlight card -
   full-width, matches the supplied mockups. Spans every column of .co-grid. */
.pc-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 14px; box-shadow: 0 3px 14px rgba(0,0,0,.07); padding: 14px; position: relative; cursor: pointer; transition: box-shadow .17s; display: flex; flex-direction: column; }
.pc-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,.12); }
.pc-top { display: flex; gap: 12px; align-items: flex-start; padding-right: 52px; }
.pc-logo { width: 64px; height: 64px; border: 1px solid #E0E0E0; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #FAFAFA; text-align: center; font-size: 9px; color: #999; font-weight: 700; overflow: hidden; line-height: 1.3; }
.pc-logo img { width: 100%; height: 100%; object-fit: contain; }
.pc-id { flex: 1; min-width: 50px; }
.pc-name { font-size: 15.5px; font-weight: 800; color: #111111; line-height: 1.25; }
.pc-tagline { font-size: 11.5px; color: #8a8a8a; margin-top: 2px; }
.pc-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px; }
.pc-tag { font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 5px; text-transform: uppercase; background: #F0F0F0; color: #444; }
.pc-tag-verified { background: #DFF5E4; color: #1DA34C; }
.pc-tag-premium { background: #F8C400; color: #1A1A1A; }
.pc-badge-wrap { position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; z-index: 3; }
.pc-ribbon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,.25); }
.pc-icons { display: flex; gap: 4px; }
.pc-icon-btn { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 1px solid #E5E5E5; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
.pc-icon-btn svg { width: 11px; height: 11px; }
.pc-desc-row { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
.pc-desc { flex: 1 1 100%; font-size: 12.5px; color: #333333; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.pc-callout { flex: 1 1 100%; background: #FFF3C4; border-radius: 9px; padding: 9px 12px; display: flex; gap: 8px; align-items: center; }
.pc-callout-icon { width: 28px; height: 28px; border-radius: 7px; background: #F8C400; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pc-callout-text { font-size: 11.5px; font-weight: 700; color: #333333; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pc-photos { position: relative; margin-top: 12px; padding: 0 20px; }
.pc-photos-track { display: flex; gap: 8px; }
.pc-photo-tile { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.pc-photo { border-radius: 8px; overflow: hidden; height: 60px; background: #EFEFEF; }
.pc-photo img { width: 100%; height: 100%; object-fit: cover; }
.pc-photo-cap { text-align: center; font-size: 10px; font-weight: 600; color: #333333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pc-carousel-btn { position: absolute; top: 19px; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,255,255,.95); border: 1px solid #E0E0E0; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; padding: 0; }
.pc-carousel-prev { left: -6px; }
.pc-carousel-next { right: -6px; }
.pc-carousel-dots { display: flex; justify-content: center; gap: 4px; margin-top: 6px; }
.pc-dot { width: 5px; height: 5px; border-radius: 50%; background: #DDDDDD; }
.pc-dot-active { background: #999999; }
.pc-highlights { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 7px; margin-top: 12px; }
.pc-hl-chip { display: flex; gap: 6px; align-items: center; border-radius: 8px; padding: 7px 10px; font-size: 10.5px; font-weight: 700; color: #333333; }
.pc-stats { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #F0F0F0; }
.pc-stat { display: flex; gap: 6px; align-items: center; background: #F5F5F5; border-radius: 8px; padding: 7px 12px; flex: 0 0 auto; }
.pc-stat-n { font-size: 13px; font-weight: 800; color: #111111; line-height: 1.2; }
.pc-stat-l { font-size: 9.5px; color: #888888; }
.pc-cta { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.pc-btn-outline { flex: 1 1 0; max-width: 45%; padding: 8px; border-radius: 7px; border: 1.5px solid #E0E0E0; background: #fff; font-size: 12px; font-weight: 700; color: #111111; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
.pc-btn-solid { flex: 1.3 1 0; padding: 8px; border-radius: 7px; border: none; background: #DC2626; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
.pc-quote { margin: 12px -14px -14px; padding: 10px 14px; background: #FFF8DC; text-align: center; font-style: italic; font-size: 12px; color: #6B5900; border-radius: 0 0 14px 14px; }

/* Platinum's dark card, per the approved design (the other 3 tiers stay
   on the light card - only Platinum switches the whole surface). */
.pc-card-dark { background: #0F172A; border-color: #1e293b; }
.pc-card-dark .pc-name, .pc-card-dark .pc-desc, .pc-card-dark .pc-callout-text, .pc-card-dark .pc-hl-chip, .pc-card-dark .pc-stat-n { color: #ffffff; }
.pc-card-dark .pc-tagline { color: #94a3b8; }
.pc-card-dark .pc-stat-l { color: #94a3b8; }
.pc-card-dark .pc-logo { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.15); }
.pc-card-dark .pc-tag:not(.pc-tag-verified):not(.pc-tag-premium) { background: rgba(255,255,255,.08); color: #cbd5e1; }
.pc-card-dark .pc-stat { background: rgba(255,255,255,.07); }
.pc-card-dark .pc-photo, .pc-card-dark .pc-carousel-btn { background: rgba(255,255,255,.08); }
.pc-card-dark .pc-carousel-btn { border-color: rgba(255,255,255,.2); }
.pc-card-dark .pc-carousel-btn svg { color: #fff; }
.pc-card-dark .pc-photo-cap { color: #cbd5e1; }
.pc-card-dark .pc-btn-outline { background: transparent; border-color: rgba(255,255,255,.25); color: #ffffff; }
.pc-card-dark .pc-icon-btn { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }
.pc-card-dark .pc-icon-btn svg { color: #fff; }
.pc-card-dark .pc-quote { background: rgba(255,255,255,.06); color: #fbbf24; }
.pc-card-dark .pc-dot { background: rgba(255,255,255,.25); }
.pc-card-dark .pc-dot-active { background: #ffffff; }
@media (max-width: 640px) {
  .pc-top { padding-right: 44px; }
  .pc-logo { width: 52px; height: 52px; font-size: 8px; }
  .pc-name { font-size: 14px; }
  .pc-badge-wrap { top: 8px; right: 8px; }
  .pc-ribbon { width: 26px; height: 26px; }
  .pc-photo { height: 46px; }
}

/* Share preview - the full branded card, shown when Share is tapped so
   what gets shared matches what the company owner was shown as the target
   design, independent of how compact the browsing grid card is. */
.spm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
.spm-modal { background: #FFF8D6; border-radius: 18px; max-width: 520px; width: 100%; max-height: 92vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
.spm-close { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.9); border: 1px solid #E5E5E5; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; }
.spm-card { background: #fff; border-radius: 16px; margin: 16px; padding: 20px; position: relative; }
.spm-top { display: flex; gap: 14px; align-items: flex-start; }
.spm-logo { width: 76px; height: 76px; border: 1px solid #E0E0E0; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #FAFAFA; overflow: hidden; font-weight: 900; font-size: 18px; color: #fff; }
.spm-logo img { width: 100%; height: 100%; object-fit: contain; }
.spm-id { flex: 1; min-width: 0; }
.spm-name { font-size: 19px; font-weight: 800; color: #111111; line-height: 1.25; }
.spm-tagline { font-size: 12.5px; color: #8a8a8a; margin-top: 3px; }
.spm-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.spm-badge { flex-shrink: 0; display: flex; align-items: center; }
.spm-ribbon { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,.25); z-index: 1; }
.spm-banner { padding: 7px 14px; border-radius: 0 9px 9px 9px; min-width: 110px; margin-left: -8px; box-shadow: 0 2px 6px rgba(0,0,0,.12); }
.spm-banner-tier { font-size: 13px; font-weight: 800; letter-spacing: .2px; }
.spm-banner-pkg { font-size: 9px; font-weight: 700; opacity: .85; text-transform: uppercase; }
.spm-verified-pill { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 5px; background: rgba(0,0,0,.25); color: #fff; margin-top: 3px; display: inline-flex; align-items: center; gap: 4px; }
.spm-desc-row { display: flex; gap: 14px; margin-top: 16px; flex-wrap: wrap; }
.spm-desc { flex: 2; min-width: 200px; font-size: 13px; color: #333333; line-height: 1.65; }
.spm-callout { flex: 1; min-width: 180px; background: #FFF3C4; border-radius: 10px; padding: 11px 13px; display: flex; gap: 9px; align-items: center; }
.spm-callout-icon { width: 32px; height: 32px; border-radius: 8px; background: #F8C400; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.spm-callout-text { font-size: 12px; font-weight: 700; color: #333333; line-height: 1.4; }
.spm-photos { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin-top: 16px; }
.spm-photo { border-radius: 10px; overflow: hidden; height: 90px; background: #EFEFEF; }
.spm-photo img { width: 100%; height: 100%; object-fit: cover; }
.spm-photo-cap { text-align: center; font-size: 11px; font-weight: 600; color: #333333; margin-top: 5px; }
.spm-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 8px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #F0F0F0; }
.spm-stat { text-align: center; background: #F5F5F5; border-radius: 9px; padding: 9px 8px; }
.spm-stat-n { font-size: 14px; font-weight: 800; color: #111111; }
.spm-stat-l { font-size: 9.5px; color: #888888; }
.spm-cta { display: flex; gap: 8px; margin-top: 16px; }
.spm-btn-outline { flex: 1; padding: 10px; border-radius: 8px; border: 1.5px solid #E0E0E0; background: #fff; font-size: 12.5px; font-weight: 700; color: #111111; cursor: pointer; }
.spm-btn-solid { flex: 1; padding: 10px; border-radius: 8px; border: none; background: #DC2626; color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.spm-quote { margin-top: 16px; padding: 12px 16px; background: #FFF8DC; text-align: center; font-style: italic; font-size: 12.5px; color: #6B5900; border-radius: 10px; }
.spm-actions { display: flex; gap: 8px; padding: 0 16px 16px; }
.spm-action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 9px; border: 1px solid rgba(0,0,0,.12); background: #fff; font-size: 12.5px; font-weight: 700; color: #111111; cursor: pointer; }
@media (max-width: 480px) {
  .spm-card { margin: 12px; padding: 14px; }
  .spm-logo { width: 60px; height: 60px; }
  .spm-name { font-size: 16px; }
}
`;

const ALL_SECTORS = ['Agriculture', 'Survey & Mapping', 'Defence', 'Infrastructure', 'Aerial Media', 'Training'];

// Addresses often end "...City, State, Pincode" — the state is the last
// non-numeric, non-"India" comma segment, not simply the last segment
// (which is frequently the pincode itself, e.g. "Nellore, Andhra Pradesh,
// 524002" was showing "524002" as the state filter chip).
// Full street addresses ("3rd Floor, A Wing, Aurobindo Galaxy, Plot No. 1,
// Part of Sy. No. 83/1, TSIIC, Raidurg, NA Rangareddi Hyderabad Telangana
// 500081 India") blow out the compact card's height - show just city/state
// instead of the whole thing.
function shortLocation(location: string | undefined): string {
  const state = extractState(location);
  const parts = (location || '').split(',').map(p => p.trim()).filter(Boolean);
  const meaningful = parts.filter(p => p && !/^\d+$/.test(p) && p.toLowerCase() !== 'india');
  if (state) {
    // Best-effort city: skip whichever segment the state name was actually
    // found inside (usually the garbled tail with no internal commas) and
    // pick the nearest segment that still looks like a real locality name,
    // not another multi-word run-on chunk.
    let city = '';
    for (let i = meaningful.length - 1; i >= 0; i--) {
      if (meaningful[i].toLowerCase().includes(state.toLowerCase())) continue;
      if (meaningful[i].split(/\s+/).length <= 4 && meaningful[i].length < 30) { city = meaningful[i]; break; }
    }
    return city ? `${city}, ${state}` : state;
  }
  return meaningful.slice(-2).join(', ') || location || '';
}

// The comma-split heuristic below assumed a clean "City, State, Pincode,
// Country" address - real typed-in addresses are often one unpunctuated
// run ("...Hyderabad Hyderabad Telangana 500032 India"), which made the
// "last segment" come out as that whole messy chunk instead of the real
// state, so the company never matched the clean state filter chips.
// Matching a known Indian state/UT name directly out of the raw text is
// far more reliable than trusting comma placement. Longest names first so
// "Uttar Pradesh" matches before the "Uttar" in "Uttarakhand" would.
const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu and Kashmir', 'Arunachal Pradesh', 'Himachal Pradesh', 'Madhya Pradesh',
  'Andhra Pradesh', 'Uttar Pradesh', 'Uttarakhand', 'Chhattisgarh',
  'West Bengal', 'Maharashtra', 'Puducherry', 'Tamil Nadu', 'Telangana',
  'Meghalaya', 'Rajasthan', 'Karnataka', 'Jharkhand', 'Nagaland', 'Chandigarh',
  'Lakshadweep', 'Mizoram', 'Manipur', 'Haryana', 'Gujarat', 'Tripura',
  'Sikkim', 'Punjab', 'Odisha', 'Kerala', 'Ladakh', 'Assam', 'Bihar',
  'Delhi', 'Goa',
].sort((a, b) => b.length - a.length);

function extractState(location: string | undefined): string {
  const text = location || '';
  for (const state of INDIAN_STATES) {
    if (new RegExp(`\\b${state.replace(/ /g, '\\s+')}\\b`, 'i').test(text)) return state;
  }
  // Fall back to the old last-comma-segment guess for anything that isn't
  // a recognizable Indian state (e.g. a foreign address, if that ever
  // shows up), so this never regresses to blank for those.
  const parts = text.split(',').map(p => p.trim()).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (p && !/^\d+$/.test(p) && p.toLowerCase() !== 'india') return p;
  }
  return '';
}

const CompaniesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [listedTotal, setListedTotal] = useState(0);
  const [industry, setIndustry] = useState<string>('all');
  const [states, setStates] = useState<string[]>([]);
  const [selSectors, setSelSectors] = useState<string[]>([]);
  const [selStates, setSelStates] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { saved: savedCompanies, toggle: toggleSaved } = useSavedCompanies();
  const perPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    // limit=1000 so every approved company is actually browsable here, not
    // just the backend's page-size default (that used to silently cap the
    // directory at 100 while hundreds more sat approved and unreachable).
    const url = COMPANY_API
      ? `${COMPANY_API}/dashboard-cards?viewType=main&limit=1000`
      : `${LAMBDA.company}/dashboard-cards?viewType=main&limit=1000`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const rawAll: Company[] = Array.isArray(d.cards) ? d.cards : [];
        // The Aug-2025 migration imported some companies more than once, so
        // the same listing (identical slug) can come back 2-4 times. Collapse
        // them by slug/name, keeping the copy with the most content.
        const score = (c: Company) =>
          (Number(c.servicesCount) || 0) + (Number(c.productsCount) || 0) +
          (Number(c.completionPercentage) || 0) / 1000 +
          new Date(c.lastModified || c.createdAt || 0).getTime() / 1e15;
        const bySlug = new Map<string, Company>();
        rawAll.forEach(c => {
          const key = (c.urlSlug || c.companyName || c.publishedId || '').toLowerCase().trim();
          const prev = bySlug.get(key);
          if (!prev || score(c) > score(prev)) bySlug.set(key, c);
        });
        const raw = Array.from(bySlug.values());
        setAllCompanies(raw);
        setListedTotal(typeof d.totalCount === 'number' ? Math.min(d.totalCount, raw.length) : raw.length);
        const stateSet = new Set<string>();
        raw.forEach(c => {
          const st = extractState(c.location);
          if (st && st.length > 1 && st.length < 30) stateSet.add(st);
        });
        setStates(Array.from(stateSet).slice(0, 10));
      })
      .catch(() => setAllCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = allCompanies;
    if (industry !== 'all') list = list.filter(c => getIndustry(c) === industry);
    if (selSectors.length) list = list.filter(c => selSectors.some(s => getSectors(c).includes(s)));
    if (selStates.length) {
      list = list.filter(c => selStates.includes(extractState(c.location)));
    }
    if (verifiedOnly) list = list.filter(c => c.reviewStatus === 'approved');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.companyName?.toLowerCase().includes(q) ||
        c.companyDescription?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
      );
    }
    const recency = (c: Company) => new Date(c.lastModified || c.createdAt || 0).getTime();
    return [...list].sort((a, b) => {
      if (sortBy === 'companyName') return (a.companyName || '').localeCompare(b.companyName || '');
      // "Newest first" = most recently listed or updated first, matching the
      // backend's public-directory ordering, so a freshly published listing
      // shows at the top instead of behind everything created after it.
      if (sortBy === 'createdAt') return recency(b) - recency(a);
      if (sortBy === 'featured') return ((b.reviewStatus === 'approved') ? 0 : 1) - ((a.reviewStatus === 'approved') ? 0 : 1);
      return 0;
    });
  }, [allCompanies, industry, selSectors, selStates, verifiedOnly, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSector = (s: string) => {
    setSelSectors(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    setPage(1);
  };
  const toggleState = (s: string) => {
    setSelStates(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    setPage(1);
  };

  const handleCardClick = (c: Company) => {
    const slug = c.urlSlug || c.publishedId || c.companyId;
    if (!slug) return;
    // Real stored values are bare "1"/"2", not "template-1"/"template-2" —
    // checking only the prefixed form meant every company, regardless of
    // its real template, was routed to /company/ (template-1) here. Each
    // preview route has its own redirect-guard as a second safety net, but
    // that guard doing all the work meant an extra redirect round-trip
    // every time, or a blank-page crash for real template-2 companies
    // whose own guard had the identical bug (fixed alongside this).
    if (c.templateSelection === 'template-2' || c.templateSelection === '2') navigate(`/companies/${slug}`);
    else navigate(`/company/${slug}`);
  };

  const handleEnquireClick = (c: Company) => {
    const slug = c.urlSlug || c.publishedId || c.companyId;
    if (!slug) return;
    const seg = (c.templateSelection === 'template-2' || c.templateSelection === '2') ? 'companies' : 'company';
    navigate(`/${seg}/${slug}#contact`);
  };

  const chipStyle = (on: boolean): React.CSSProperties => ({
    background: on ? '#111111' : 'transparent',
    color: on ? '#F8C400' : '#555',
    border: `1.5px solid ${on ? '#111111' : '#E0E0E0'}`,
  });

  const activeFiltersCount = selSectors.length + selStates.length + (verifiedOnly ? 1 : 0);

  const verifiedCount = allCompanies.filter(c => c.reviewStatus === 'approved').length;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | '...')[]>((acc, p, i, arr) => {
      if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
      acc.push(p); return acc;
    }, []);

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Companies..." />;

  const indryCounts: Record<string, number> = { all: allCompanies.length };
  for (const ind of ['drone', 'gis', 'ai'] as const) {
    indryCounts[ind] = allCompanies.filter(c => getIndustry(c) === ind).length;
  }

  const Sidebar = () => (
    <aside className={`co-sidebar${sidebarOpen ? ' open' : ''}`}>
      <div className="co-sidebar-title">
        <SlidersHorizontal size={14} /> Filters
        {activeFiltersCount > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, background: '#DC2626', color: '#fff', padding: '1px 7px', borderRadius: 10 }}>
            {activeFiltersCount}
          </span>
        )}
      </div>

      {/* Package Tier */}
      <div className="co-filter-grp">
        <div className="co-fl-label">Package Tier</div>
        <div className="co-chips">
          {[{ l: '📌 Reach', v: 'reach' }, { l: '⭐ Brand', v: 'scale' }, { l: '🔵 Expand', v: 'brand' }].map(t => (
            <button key={t.v} className="co-chip" style={chipStyle(false)} disabled>{t.l}</button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#aaa', marginTop: 5 }}>Coming soon</div>
      </div>

      {/* Sector */}
      <div className="co-filter-grp">
        <div className="co-fl-label">Sector</div>
        <div className="co-chips">
          {ALL_SECTORS.map(s => (
            <button key={s} className="co-chip" onClick={() => toggleSector(s)} style={chipStyle(selSectors.includes(s))}>{s}</button>
          ))}
        </div>
      </div>

      {/* State */}
      {states.length > 0 && (
        <div className="co-filter-grp">
          <div className="co-fl-label">State</div>
          <div className="co-chips">
            {states.map(st => (
              <button key={st} className="co-chip" onClick={() => toggleState(st)} style={chipStyle(selStates.includes(st))}>{st}</button>
            ))}
          </div>
        </div>
      )}

      {/* Verification */}
      <div className="co-filter-grp">
        <div className="co-fl-label">Verification</div>
        <div className="co-chips">
          <button className="co-chip" onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }} style={chipStyle(verifiedOnly)}>
            ✓ DGCA-Verified only
          </button>
        </div>
      </div>

      {/* Clear */}
      {activeFiltersCount > 0 && (
        <button onClick={() => { setSelSectors([]); setSelStates([]); setVerifiedOnly(false); setPage(1); }}
          style={{ width: '100%', padding: '7px', borderRadius: 7, border: '1.5px solid #E5E5E5', background: 'none', fontSize: 12, fontWeight: 700, color: '#DC2626', cursor: 'pointer', marginTop: 4, fontFamily: 'Poppins,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <X size={12} /> Clear all filters
        </button>
      )}
    </aside>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="co-page">

        {/* HERO */}
        <section className="co-hero">
          <div className="co-hero-i">
            <h1>Find verified <span>Drone, GIS &amp; AI</span> companies</h1>
            <a href="/form" style={{ flexShrink: 0, padding: '5px 14px', background: '#F8C400', color: '#111111', borderRadius: 6, fontSize: 12, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'Poppins,sans-serif' }}>+ List Your Company</a>
            <div className="co-stats">
              {[
                { n: listedTotal || allCompanies.length, l: 'Listed' },
                { n: verifiedCount, l: 'Verified' },
                { n: allCompanies.reduce((s, c) => s + (Number(c.productsCount) || 0), 0), l: 'Products' },
                { n: allCompanies.reduce((s, c) => s + (Number(c.servicesCount) || 0), 0), l: 'Services' },
              ].map(st => (
                <div key={st.l}>
                  <div className="co-stat-n">{st.n}</div>
                  <div className="co-stat-l">{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRY TABS */}
        <nav className="co-tabs">
          <div className="co-tabs-i">
            {(['all', 'drone', 'gis', 'ai'] as const).map(ind => {
              const active = industry === ind;
              return (
                <button key={ind} className="co-tab"
                  onClick={() => { setIndustry(ind); setPage(1); }}
                  style={{ color: active ? '#F8C400' : 'rgba(255,255,255,.48)', borderBottomColor: active ? '#F8C400' : 'transparent' }}>
                  {IND_LABELS[ind]}
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10, background: active ? '#F8C400' : 'rgba(255,255,255,.1)', color: active ? '#111111' : 'rgba(255,255,255,.7)' }}>
                    {indryCounts[ind] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="co-wrap">
          {/* Search bar */}
          <div className="co-search-bar">
            <Search size={14} style={{ color: '#777', flexShrink: 0 }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search companies, names, locations..." />
          </div>

          {/* Mobile filter toggle */}
          <button className="co-filter-toggle" onClick={() => setSidebarOpen(o => !o)}>
            <SlidersHorizontal size={14} /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <div className="co-layout">
            <Sidebar />

            <div className="co-main">
              <div className="co-note">⭐ Verified companies appear first. Get your company verified by submitting GST documents in your dashboard.</div>

              <div className="co-resbar">
                <div style={{ fontSize: 12.5, color: '#777' }}>
                  <b style={{ color: '#111111' }}>{filtered.length}</b> {filtered.length === 1 ? 'company' : 'companies'}
                  {industry !== 'all' && <span style={{ color: IND_COLORS[industry], fontWeight: 600 }}> · {IND_LABELS[industry]}</span>}
                </div>
                <select className="co-sort" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                  <option value="featured">Verified first</option>
                  <option value="createdAt">Newest first</option>
                  <option value="companyName">A – Z</option>
                </select>
              </div>

              {current.length === 0 ? (
                <div className="co-empty">
                  <Search size={48} style={{ color: '#ccc', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111111', marginBottom: 6 }}>No companies found</div>
                  <div style={{ fontSize: 13, color: '#777' }}>Try adjusting your filters or search</div>
                </div>
              ) : (
                <div className="co-grid">
                  {withInlineAds(current, (c, i) => {
                    const tier = getTier(c);
                    const id = c.publishedId || c.companyId || c.companyName;
                    return tier ? (
                      <PremiumCompanyCard
                        key={`${c.companyName}-${i}`}
                        company={c}
                        tier={tier}
                        onClick={() => handleCardClick(c)}
                        onEnquire={() => handleEnquireClick(c)}
                        saved={savedCompanies.has(id)}
                        onToggleSave={() => toggleSaved(id)}
                      />
                    ) : (
                      <CompanyCard
                        key={`${c.companyName}-${i}`}
                        company={c}
                        onClick={() => handleCardClick(c)}
                        onEnquire={() => handleEnquireClick(c)}
                        saved={savedCompanies.has(c.publishedId || c.companyId || c.companyName)}
                        onToggleSave={() => toggleSaved(c.publishedId || c.companyId || c.companyName)}
                      />
                    );
                  })}
                </div>
              )}

              {totalPages > 1 && (
                <div className="co-pages">
                  <button className="co-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ border: '1.5px solid #E5E5E5', background: '#fff', color: '#111111', opacity: page === 1 ? .4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                    Previous
                  </button>
                  {pages.map((p, i) => p === '...' ? (
                    <span key={`e${i}`} style={{ padding: '7px 4px', color: '#777' }}>…</span>
                  ) : (
                    <button key={p} className="co-page-btn" onClick={() => setPage(p as number)}
                      style={{ border: `1.5px solid ${page === p ? '#111111' : '#E5E5E5'}`, background: page === p ? '#111111' : '#fff', color: page === p ? '#F8C400' : '#111111', cursor: 'pointer' }}>
                      {p}
                    </button>
                  ))}
                  <button className="co-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ border: '1.5px solid #E5E5E5', background: '#fff', color: '#111111', opacity: page === totalPages ? .4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CompanyCard: React.FC<{ company: Company; onClick: () => void; onEnquire: () => void; saved?: boolean; onToggleSave?: () => void }> = ({ company, onClick, onEnquire, saved, onToggleSave }) => {
  const ind = getIndustry(company);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = company.reviewStatus === 'approved';
  const silver = company.badgeStatus === 'SILVER';
  const bg = avColor(company.companyName);
  const [imgErr, setImgErr] = useState(false);
  const detectedSectors = getSectors(company);

  return (
    <div className="co-card" onClick={onClick}>
      <div style={{ height: 4, background: indColor }} />

      {onToggleSave && (
        <button className="co-card-save" onClick={e => { e.stopPropagation(); onToggleSave(); }} title="Save">
          <Heart size={12} color={saved ? '#DC2626' : '#999'} fill={saved ? '#DC2626' : 'none'} />
        </button>
      )}

      <div className="co-card-top" style={{ paddingRight: 34 }}>
        <div className="co-avatar" style={{ background: bg }}>
          {company.previewImage && !imgErr ? (
            <img src={company.previewImage} alt="" onError={() => setImgErr(true)} />
          ) : getInitials(company.companyName)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="co-card-name">{company.companyName}</span>
            {verified && <BadgeCheck size={14} style={{ color: '#22C55E', flexShrink: 0 }} />}
            {silver && (
              <Award
                size={14}
                style={{ color: '#8A8A8A', flexShrink: 0 }}
                aria-label="Silver - Profile verified by DroneTV team"
                title="Silver - Profile verified by DroneTV team"
              />
            )}
          </div>
          {company.location && (
            <div className="co-card-loc"><MapPin size={10} /><span className="co-card-loc-text">{shortLocation(company.location)}</span></div>
          )}
        </div>
      </div>

      <div style={{ padding: '7px 13px', display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        {verified && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 7, background: '#e8f5ec', color: '#22C55E', textTransform: 'uppercase' as const }}>Verified</span>}
        {silver && <span title="Silver - Profile verified by DroneTV team" style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 7, background: '#EFEFEF', color: '#6B6B6B', textTransform: 'uppercase' as const }}>Silver</span>}
        {ind !== 'all' && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: ind === 'drone' ? '#E7F0FB' : ind === 'gis' ? '#e8f5ec' : '#EFE7FB', color: indColor, textTransform: 'uppercase' as const }}>{ind.toUpperCase()}</span>}
        {detectedSectors.slice(0, 1).map(s => (
          <span key={s} style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 7, background: '#F8F8F8', color: '#555', border: '1px solid #E5E5E5' }}>{s}</span>
        ))}
      </div>

      <p className="co-card-desc">{company.companyDescription || company.aboutDescription || 'No description available.'}</p>

      {((Number(company.servicesCount) || 0) > 0 || (Number(company.productsCount) || 0) > 0) && (
        <div style={{ padding: '0 13px 9px', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(Number(company.productsCount) || 0) > 0 && <span style={{ fontSize: 10.5, color: '#444', background: '#F8F8F8', padding: '2px 7px', borderRadius: 5 }}>📦 {company.productsCount} products</span>}
          {(Number(company.servicesCount) || 0) > 0 && <span style={{ fontSize: 10.5, color: '#444', background: '#F8F8F8', padding: '2px 7px', borderRadius: 5 }}>🔧 {company.servicesCount} services</span>}
        </div>
      )}

      <div className="co-card-foot">
        <button className="co-btn-out" onClick={e => { e.stopPropagation(); onClick(); }}>View Profile <ChevronRight size={11} /></button>
        <button className="co-btn-red" onClick={e => { e.stopPropagation(); onEnquire(); }}>Enquire</button>
      </div>
    </div>
  );
};

const PremiumCompanyCard: React.FC<{ company: Company; tier: keyof typeof TIER_STYLE; onClick: () => void; onEnquire: () => void; saved: boolean; onToggleSave: () => void }> = ({ company, tier, onClick, onEnquire, saved, onToggleSave }) => {
  const style = TIER_STYLE[tier];
  const ind = getIndustry(company);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = company.reviewStatus === 'approved';
  const bg = avColor(company.companyName);
  const [imgErr, setImgErr] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const detectedSectors = getSectors(company);
  const description = company.realDescription || company.companyDescription || company.aboutDescription || 'No description available.';
  const sinceYear = company.yearsInBusiness ? (String(company.yearsInBusiness).match(/\d{4}/) || [null])[0] : null;
  // "Survey | Mapping | GIS | Data Analytics"-style specialty line under the
  // name - real detected sectors, not fabricated, falls back to location.
  // "Since <year>" rides on the same line instead of its own row so it
  // doesn't waste a whole strip of card height for one small fact.
  const specialty = [
    detectedSectors.length > 0 ? detectedSectors.slice(0, 4).join(' | ') : shortLocation(company.location),
    sinceYear ? `Since ${sinceYear}` : null,
  ].filter(Boolean).join(' • ');

  const photos = (company.galleryImages && company.galleryImages.length > 0)
    ? company.galleryImages
    : [company.previewImage, company.heroImage].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).map(url => ({ url: url as string, label: null }));
  const visiblePhotos = photos.slice(photoIdx, photoIdx + 2);

  // Text-only highlight chips (e.g. "Expert Team", "Global Presence") only
  // render from a real hero.stats entry that has a label but no numeric
  // value - never fabricated placeholder highlights.
  const highlights = (company.heroStats || []).filter(s => s.label && !s.value).slice(0, 6);
  const numericStats = (company.heroStats && company.heroStats.some(s => s.value))
    ? company.heroStats.filter(s => s.value).slice(0, 5).map(s => ({ n: s.value as string, l: s.label || '' }))
    : [
        (Number(company.productsCount) || 0) > 0 ? { n: String(company.productsCount), l: 'Products' } : null,
        (Number(company.servicesCount) || 0) > 0 ? { n: String(company.servicesCount), l: 'Services' } : null,
        company.teamSize ? { n: String(company.teamSize), l: 'Team Size' } : null,
      ].filter(Boolean) as { n: string; l: string }[];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareOpen(true);
  };

  return (
    <div className={`pc-card${style.dark ? ' pc-card-dark' : ''}`} onClick={onClick}>
      <div className="pc-top">
        <div className="pc-logo" style={{ background: company.headerLogo || company.previewImage ? undefined : bg, color: '#fff' }}>
          {(company.headerLogo || company.previewImage) && !imgErr ? (
            <img src={company.headerLogo || company.previewImage} alt="" onError={() => setImgErr(true)} />
          ) : getInitials(company.companyName)}
        </div>
        <div className="pc-id">
          <div className="pc-name">{company.companyName}</div>
          {specialty && <div className="pc-tagline">{specialty}</div>}
          <div className="pc-tags">
            {verified && <span className="pc-tag pc-tag-verified">Verified</span>}
            {ind !== 'all' && <span className="pc-tag" style={{ background: ind === 'drone' ? '#E7F0FB' : ind === 'gis' ? '#e8f5ec' : '#EFE7FB', color: indColor }}>{ind.toUpperCase()}</span>}
            {detectedSectors.slice(0, 2).map(s => <span key={s} className="pc-tag">{s}</span>)}
            {tier !== 'silver' && <span className="pc-tag pc-tag-premium">Premium</span>}
          </div>
        </div>

        <div className="pc-badge-wrap">
          <div className="pc-icons">
            <button className="pc-icon-btn" onClick={handleShare} title="Share"><Share2 size={11} color="#555" /></button>
            <button className="pc-icon-btn" onClick={e => { e.stopPropagation(); onToggleSave(); }} title="Save">
              <Heart size={11} color={saved ? '#DC2626' : '#555'} fill={saved ? '#DC2626' : 'none'} />
            </button>
          </div>
          <div
            className="pc-ribbon"
            style={{ background: style.ribbonBg }}
            title={`${style.label} - Profile verified by DroneTV team`}
          >
            {tier === 'silver' ? <Award size={22} color={style.ribbonColor} /> : <Crown size={22} color={style.ribbonColor} />}
          </div>
        </div>
      </div>

      <div className="pc-desc-row">
        <p className="pc-desc">{description}</p>
        {realTagline(company) && (
          <div className="pc-callout" style={{ background: style.highlightBg }}>
            <div className="pc-callout-icon" style={{ background: tier === 'silver' ? '#D9D9D9' : '#F8C400' }}>
              <BarChart2 size={17} color={tier === 'silver' ? '#555' : '#7A5B00'} />
            </div>
            <div className="pc-callout-text">{realTagline(company)}</div>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="pc-photos">
          <div className="pc-photos-track">
            {visiblePhotos.map((p, i) => (
              <div key={photoIdx + i} className="pc-photo-tile">
                <div className="pc-photo"><img src={p.url} alt={p.label || ''} /></div>
                {p.label && <div className="pc-photo-cap">{p.label}</div>}
              </div>
            ))}
          </div>
          {photos.length > 2 && (
            <>
              <button
                className="pc-carousel-btn pc-carousel-prev"
                onClick={e => { e.stopPropagation(); setPhotoIdx(i => (i === 0 ? Math.max(0, photos.length - 2) : Math.max(0, i - 2))); }}
              ><ChevronLeft size={13} /></button>
              <button
                className="pc-carousel-btn pc-carousel-next"
                onClick={e => { e.stopPropagation(); setPhotoIdx(i => (i + 2 >= photos.length ? 0 : i + 2)); }}
              ><ChevronRight size={13} /></button>
              <div className="pc-carousel-dots">
                {Array.from({ length: Math.ceil(photos.length / 2) }).map((_, d) => (
                  <span key={d} className={`pc-dot${Math.floor(photoIdx / 2) === d ? ' pc-dot-active' : ''}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="pc-highlights">
          {highlights.map((h, i) => (
            <div key={i} className="pc-hl-chip" style={{ background: style.highlightBg }}>
              <Star size={14} color={tier === 'silver' ? '#777' : '#92700A'} /> {h.label}
            </div>
          ))}
        </div>
      )}

      {numericStats.length > 0 && (
        <div className="pc-stats">
          {numericStats.map((s, i) => (
            <div key={i} className="pc-stat">
              <div>
                <div className="pc-stat-n">{s.n}</div>
                <div className="pc-stat-l">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pc-cta">
        <button className="pc-btn-outline" onClick={e => { e.stopPropagation(); onClick(); }}>View {tier === 'silver' ? 'Profile' : 'Company Profile'} <ChevronRight size={13} /></button>
        <button className="pc-btn-solid" onClick={e => { e.stopPropagation(); onEnquire(); }}>Enquire Now</button>
      </div>

      {company.quote && <div className="pc-quote">&ldquo;{company.quote}&rdquo;</div>}

      {shareOpen && (
        <ShareCardModal
          company={company}
          tier={tier}
          onClose={() => setShareOpen(false)}
          onViewProfile={onClick}
          onEnquire={onEnquire}
        />
      )}
    </div>
  );
};

const ShareCardModal: React.FC<{ company: Company; tier: keyof typeof TIER_STYLE; onClose: () => void; onViewProfile: () => void; onEnquire: () => void }> = ({ company, tier, onClose, onViewProfile, onEnquire }) => {
  const style = TIER_STYLE[tier];
  const ind = getIndustry(company);
  const indColor = IND_COLORS[ind] || '#444';
  const verified = company.reviewStatus === 'approved';
  const bg = avColor(company.companyName);
  const [imgErr, setImgErr] = useState(false);
  const [copied, setCopied] = useState(false);
  const detectedSectors = getSectors(company);
  const description = company.realDescription || company.companyDescription || company.aboutDescription || 'No description available.';
  const sinceYear = company.yearsInBusiness ? (String(company.yearsInBusiness).match(/\d{4}/) || [null])[0] : null;
  const specialty = [
    detectedSectors.length > 0 ? detectedSectors.slice(0, 4).join(' | ') : shortLocation(company.location),
    sinceYear ? `Since ${sinceYear}` : null,
  ].filter(Boolean).join(' • ');
  const photos = (company.galleryImages && company.galleryImages.length > 0)
    ? company.galleryImages
    : [company.previewImage, company.heroImage].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).map(url => ({ url: url as string, label: null }));
  const highlights = (company.heroStats || []).filter(s => s.label && !s.value).slice(0, 6);
  const numericStats = (company.heroStats && company.heroStats.some(s => s.value))
    ? company.heroStats.filter(s => s.value).slice(0, 5).map(s => ({ n: s.value as string, l: s.label || '' }))
    : [
        (Number(company.productsCount) || 0) > 0 ? { n: String(company.productsCount), l: 'Products' } : null,
        (Number(company.servicesCount) || 0) > 0 ? { n: String(company.servicesCount), l: 'Services' } : null,
        company.teamSize ? { n: String(company.teamSize), l: 'Team Size' } : null,
      ].filter(Boolean) as { n: string; l: string }[];

  const shareUrl = `${window.location.origin}/${company.templateSelection === 'template-2' || company.templateSelection === '2' ? 'companies' : 'company'}/${company.urlSlug || company.publishedId}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };
  const handleNativeShare = () => {
    if (navigator.share) navigator.share({ title: company.companyName, url: shareUrl }).catch(() => {});
    else handleCopy();
  };

  return (
    <div className="spm-overlay" onClick={onClose}>
      <div className="spm-modal" onClick={e => e.stopPropagation()}>
        <button className="spm-close" onClick={onClose} title="Close"><X size={16} /></button>

        <div className="spm-card">
          <div className="spm-top">
            <div className="spm-logo" style={{ background: company.headerLogo || company.previewImage ? undefined : bg }}>
              {(company.headerLogo || company.previewImage) && !imgErr ? (
                <img src={company.headerLogo || company.previewImage} alt="" onError={() => setImgErr(true)} />
              ) : getInitials(company.companyName)}
            </div>
            <div className="spm-id">
              <div className="spm-name">{company.companyName}</div>
              {specialty && <div className="spm-tagline">{specialty}</div>}
              <div className="spm-tags">
                {verified && <span className="pc-tag pc-tag-verified">Verified</span>}
                {ind !== 'all' && <span className="pc-tag" style={{ background: ind === 'drone' ? '#E7F0FB' : ind === 'gis' ? '#e8f5ec' : '#EFE7FB', color: indColor }}>{ind.toUpperCase()}</span>}
                {detectedSectors.slice(0, 2).map(s => <span key={s} className="pc-tag">{s}</span>)}
                {tier !== 'silver' && <span className="pc-tag pc-tag-premium">Premium</span>}
              </div>
            </div>
            <div className="spm-badge">
              <div className="spm-ribbon" style={{ background: style.ribbonBg }}>
                {tier === 'silver' ? <Award size={24} color={style.ribbonColor} /> : <Crown size={24} color={style.ribbonColor} />}
              </div>
              <div className="spm-banner" style={{ background: style.bannerBg, color: style.bannerColor }}>
                <div className="spm-banner-tier">{style.label}</div>
                <div className="spm-banner-pkg">{style.packageLabel}</div>
                {style.verifiedListing && <div className="spm-verified-pill">Verified Listing</div>}
              </div>
            </div>
          </div>

          <div className="spm-desc-row">
            <p className="spm-desc">{description}</p>
            {realTagline(company) && (
              <div className="spm-callout" style={{ background: style.highlightBg }}>
                <div className="spm-callout-icon" style={{ background: tier === 'silver' ? '#D9D9D9' : '#F8C400' }}>
                  <BarChart2 size={16} color={tier === 'silver' ? '#555' : '#7A5B00'} />
                </div>
                <div className="spm-callout-text">{realTagline(company)}</div>
              </div>
            )}
          </div>

          {photos.length > 0 && (
            <div className="spm-photos">
              {photos.slice(0, 4).map((p, i) => (
                <div key={i}>
                  <div className="spm-photo"><img src={p.url} alt={p.label || ''} /></div>
                  {p.label && <div className="spm-photo-cap">{p.label}</div>}
                </div>
              ))}
            </div>
          )}

          {highlights.length > 0 && (
            <div className="pc-highlights" style={{ marginTop: 16 }}>
              {highlights.map((h, i) => (
                <div key={i} className="pc-hl-chip" style={{ background: style.highlightBg }}>
                  <Star size={14} color={tier === 'silver' ? '#777' : '#92700A'} /> {h.label}
                </div>
              ))}
            </div>
          )}

          {numericStats.length > 0 && (
            <div className="spm-stats">
              {numericStats.map((s, i) => (
                <div key={i} className="spm-stat">
                  <div className="spm-stat-n">{s.n}</div>
                  <div className="spm-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          <div className="spm-cta">
            <button className="spm-btn-outline" onClick={onViewProfile}>View Profile</button>
            <button className="spm-btn-solid" onClick={onEnquire}>Enquire Now</button>
          </div>

          {company.quote && <div className="spm-quote">&ldquo;{company.quote}&rdquo;</div>}
        </div>

        <div className="spm-actions">
          <button className="spm-action-btn" onClick={handleCopy}>
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button className="spm-action-btn" onClick={handleNativeShare}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
