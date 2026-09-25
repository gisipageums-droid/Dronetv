import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Send, Users, TrendingUp, Building2, Settings, Film, Newspaper, ThumbsUp, Share2, BarChart3, GraduationCap, Award, Briefcase, Compass, Calendar as CalendarIcon, Mic, ClipboardList, UserCheck, Network, Handshake, Megaphone } from 'lucide-react';
import ContentCard from '../../components/common/ContentCard';
import { AdSidebarRail } from '../../components/common/adCreatives';

// Fix + redesign for /partnerships, matching the reference's 6-type card
// grid (image-hero, overlay headline/tagline, icon-stat row, tag pills,
// View Details + Partner Now). Unlike Companies/Products/Events, this page
// has no backing API at all - it's DroneTv's own static partnership-offer
// copy, always has been. The reference's "219 partnership opportunities" +
// full filter sidebar + pagination implies a searchable directory of many
// individual listings, which doesn't exist here and isn't invented - there
// are only ever the 6 real partnership types DroneTv actually offers, so
// this shows exactly 6, no fake count, no filter theater over a 6-item set.
// Each card's headline/tagline/stats/tags is pulled directly from this
// site's own existing real copy (the old categories[]/whyPartner[] arrays
// below), reframed into the new visual anatomy - nothing invented from
// scratch, and the "sample" is simply having every one of the 6 real types
// fully fleshed out in the new card design, since there's no separate
// per-listing dataset to add a demo record to.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};

interface PartnerType {
  to: string;
  badge: string;
  badgeColor: string;
  headline: string;
  tagline: string;
  image: string;
  stats: { icon: any; label: string }[];
  tags: string[];
}

// Real facts pulled straight from this page's own existing copy (category
// counts, whyPartner benefit descriptions) - see file-top note.
const PARTNER_TYPES: PartnerType[] = [
  {
    to: '/partnerships/industry-players',
    badge: 'STRATEGIC PARTNERSHIP',
    badgeColor: '#b45309',
    headline: 'Grow Together',
    tagline: "Let's build a stronger drone ecosystem",
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=75',
    stats: [
      { icon: Building2, label: '515+ Companies' },
      { icon: TrendingUp, label: '5M+ Views' },
      { icon: Users, label: 'Full Ecosystem' },
    ],
    tags: ['Co-Marketing', 'Joint Initiatives', 'Ecosystem Growth'],
  },
  {
    to: '/partnerships/event-organizers',
    badge: 'MEDIA PARTNERSHIP',
    badgeColor: '#0369a1',
    headline: 'Amplify Your Story',
    tagline: 'Reach the right audience in the drone ecosystem',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=75',
    stats: [
      { icon: Film, label: 'Video Interviews' },
      { icon: Newspaper, label: 'News Coverage' },
      { icon: ThumbsUp, label: 'Content Promotion' },
      { icon: Share2, label: 'Social Media Reach' },
    ],
    tags: ['Interviews', 'Articles', 'Webinars', 'Event Coverage'],
  },
  {
    to: '/partnerships/ai-tech',
    badge: 'TECHNOLOGY PARTNERSHIP',
    badgeColor: '#15803d',
    headline: 'Innovate Together',
    tagline: 'Build the next generation of drone solutions',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=75',
    stats: [
      { icon: Eye, label: 'Product Showcase' },
      { icon: Settings, label: 'Technology Integration' },
      { icon: BarChart3, label: '50+ Tech Companies' },
    ],
    tags: ['AI & Automation', 'Software Integration', 'GIS & Analytics'],
  },
  {
    to: '/partnerships/education-partners',
    badge: 'TRAINING PARTNERSHIP',
    badgeColor: '#6d28d9',
    headline: 'Skills for a Bigger Tomorrow',
    tagline: 'Empower talent, build the future',
    image: 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=900&q=75',
    stats: [
      { icon: GraduationCap, label: 'Curriculum Support' },
      { icon: Award, label: 'Certification Programs' },
      { icon: Briefcase, label: '240+ RPTOs' },
    ],
    tags: ['DGCA Approved', 'Drone Training', 'Skill Development'],
  },
  {
    to: '/partnerships/event-organizers',
    badge: 'EVENT PARTNERSHIP',
    badgeColor: '#c2410c',
    headline: 'Bigger Events. Greater Impact.',
    tagline: "Let's create memorable industry experiences",
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=75',
    stats: [
      { icon: CalendarIcon, label: 'Co-organize Events' },
      { icon: Mic, label: 'Speaker Opportunities' },
      { icon: ClipboardList, label: '2 Current Partners' },
    ],
    tags: ['Expos', 'Conferences', 'Media Partner'],
  },
  {
    to: '/partnerships/drone-manufacturers',
    badge: 'COMMUNITY PARTNERSHIP',
    badgeColor: '#0e7490',
    headline: 'Stronger Together',
    tagline: 'Connect. Collaborate. Create more opportunities.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=75',
    stats: [
      { icon: Network, label: 'Community Access' },
      { icon: UserCheck, label: '180+ Manufacturers' },
      { icon: Handshake, label: 'Industry Network' },
    ],
    tags: ['Networking', 'Mentorship', 'Market Access'],
  },
];

const whyPartner = [
  { icon: '🎯', title: '100% Drone, GIS & AI Audience', desc: 'Every visitor, viewer, and lead on DroneTv.in is from the drone, GIS & AI ecosystem. No dilution across unrelated industries.' },
  { icon: '📹', title: 'Professional Video Production', desc: 'In-house production team delivers 5-minute video interviews published on YouTube (@indiadronetv) and embedded permanently on your company profile.' },
  { icon: '🏛️', title: 'Expo Media Partnership', desc: 'DroneTv.in is the official Digital Broadcast Media Partner for major drone expos including Drone Expo 2026 Bengaluru.' },
  { icon: '📊', title: 'B2B Lead Generation', desc: 'Verified leads from buyers actively searching for your product or service category, with immediate notification.' },
  { icon: '📖', title: 'Magazine and Editorial Coverage', desc: "Brand and Expand partners receive advertising and editorial coverage in DroneTv's quarterly digital magazine." },
  { icon: '🌐', title: 'Dedicated Company Profile', desc: 'A single-page website on DroneTv.in with product listings, service descriptions, video embeds, and an active enquiry form.' },
];

const testimonials = [
  { quote: 'DroneTv covered our product launch at Drone Expo 2025 with a video interview that reached more qualified buyers than any other media we have tried. The ROI was immediate.', name: 'Dr. Pranay Kumar', role: 'COO — BBPL Aero Pvt Ltd' },
  { quote: 'Being listed on DroneTv.in gave our training institute credibility with industry partners. The enquiry quality is strong.', name: 'Training Partner', role: 'DGCA-Approved RPTO, Telangana' },
];

const packages = [
  { name: 'Reach', price: 'Rs.25,000/yr', highlight: false, headline: 'Verified profile + single-page website + 10 product listings' },
  { name: 'Brand', price: 'Rs.75,000/yr', highlight: true, headline: 'Everything in Reach + video interview + editorial article + monthly social posts' },
  { name: 'Expand', price: 'Rs.1,50,000/yr', highlight: false, headline: 'Everything in Brand + expo stall branding + priority placement + 4 posts/month' },
];

const PartnershipsHubV2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-16" />

      <section aria-label="Partnership statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px]">
          <Handshake className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Partnership Types</small><strong className="text-lg leading-tight text-yellow-300">6</strong></span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px]">
          <Building2 className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Partner Companies</small><strong className="text-lg leading-tight text-yellow-300">515+</strong></span>
        </div>
        <div className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px]">
          <TrendingUp className="size-7 shrink-0 text-yellow-400" />
          <span className="flex flex-col"><small className="text-[10px] leading-tight">Platform Views</small><strong className="text-lg leading-tight text-yellow-300">5M+</strong></span>
        </div>
        <Link to="/partnerships/become-a-partner" className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">+ Become a Partner</Link>
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">Partner with DroneTv.in</strong>
          <span className="block text-[11px] text-sky-300">India&rsquo;s #1 Drone Industry Platform</span>
        </div>
      </section>

      <main className="mx-auto max-w-[1600px] px-3 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1 className="text-base font-extrabold">6 Ways to Partner with DroneTv.in</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PARTNER_TYPES.map((p, i) => (
            <PartnerCardV2 key={i} partner={p} onView={() => navigate(p.to)} />
          ))}
        </div>

        <div className="mt-10 space-y-8">
          <div>
            <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
              <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Packages</span>
              Partnership Tiers
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {packages.map(p => (
                <div key={p.name} className={`rounded-xl border bg-white p-5 shadow-sm ${p.highlight ? 'border-yellow-400' : 'border-slate-200'}`}>
                  {p.highlight && <span className="mb-3 inline-block rounded bg-yellow-400 px-2 py-0.5 text-xs font-extrabold text-slate-900">POPULAR</span>}
                  <h3 className="text-lg font-extrabold text-slate-900">{p.name}</h3>
                  <p className="mb-2 text-xl font-extrabold text-amber-600">{p.price}</p>
                  <p className="mb-4 text-xs leading-relaxed text-slate-500">{p.headline}</p>
                  <Link to="/advertising-plans" className="text-xs font-bold text-amber-600 hover:text-amber-700">See full features →</Link>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">All prices exclusive of GST. 100% advance payment. 12-month term.</p>
          </div>

          <div>
            <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
              <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Why</span>
              Why Partner with DroneTv.in
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {whyPartner.map((item, i) => (
                <ContentCard key={i}>
                  <div className="mb-3 text-2xl">{item.icon}</div>
                  <h3 className="mb-2 text-sm font-bold text-ink">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-ink-caption">{item.desc}</p>
                </ContentCard>
              ))}
            </div>
          </div>

          <div className="lg:flex lg:items-start lg:gap-6">
            <div className="min-w-0 flex-1">
              <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-900 after:h-0.5 after:flex-1 after:bg-slate-200 after:content-['']">
                <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-slate-900">Reviews</span>
                Partner Testimonials
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {testimonials.map((t, i) => (
                  <ContentCard key={i}>
                    <p className="mb-4 text-sm italic leading-relaxed text-ink-paragraph">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-auto">
                      <p className="text-sm font-bold text-ink">{t.name}</p>
                      <p className="text-xs text-ink-caption">{t.role}</p>
                    </div>
                  </ContentCard>
                ))}
              </div>
            </div>
            <AdSidebarRail />
          </div>

          <div className="rounded-xl bg-yellow-400 p-8 text-center">
            <h3 className="mb-2 text-2xl font-extrabold text-slate-900">Ready to join India&rsquo;s drone industry platform?</h3>
            <p className="mx-auto mb-6 max-w-xl text-sm text-slate-900/70">Submit your enquiry and our BD team will respond within 48 hours. Go live in 2 weeks.</p>
            <Link to="/partnerships/become-a-partner" className="inline-block rounded-xl bg-slate-900 px-8 py-3.5 text-base font-extrabold text-white transition-colors hover:bg-slate-800">Become a Partner →</Link>
          </div>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden lg:inline">│</span>
        <span>Connect │ Collaborate │ Grow</span>
      </footer>
    </div>
  );
};

const PartnerCardV2: React.FC<{ partner: PartnerType; onView: () => void }> = ({ partner, onView }) => {
  const [liked, setLiked] = React.useState(false);
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative flex h-44 shrink-0 flex-col justify-between overflow-hidden bg-slate-900 p-4">
        <img src={partner.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative z-10 flex items-start justify-between">
          <span className="rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: partner.badgeColor }}>{partner.badge}</span>
          <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${partner.headline}`} aria-pressed={liked} className={`grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
            <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-extrabold leading-tight text-white">{partner.headline}</h3>
          <p className="mt-1 text-sm font-medium text-white/90">{partner.tagline}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className={`grid gap-1.5 border-b border-slate-100 pb-2.5`} style={{ gridTemplateColumns: `repeat(${Math.min(partner.stats.length, 4)}, 1fr)` }}>
          {partner.stats.map((s, i) => (
            <div key={i} className="flex min-w-0 flex-col items-start gap-1">
              <s.icon className="size-4 shrink-0 text-slate-400" />
              <small className="block truncate text-[10px] font-semibold text-slate-600">{s.label}</small>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {partner.tags.map((t, i) => <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">{t}</span>)}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <button type="button" onClick={onView} className="rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900"><Eye className="mr-1 inline size-3.5" />View Details</button>
          <Link to="/partnerships/become-a-partner" className="flex items-center justify-center rounded-lg bg-red-600 py-2 text-xs font-bold text-white"><Send className="mr-1 inline size-3.5" />Partner Now</Link>
        </div>
      </div>
    </article>
  );
};

export default PartnershipsHubV2;
