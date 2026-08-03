import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchContent, ContentType } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';

const hubs: {
  to: string; icon: string; title: string; desc: string; tags: string[];
  countType?: ContentType; countLabel?: (n: number) => string; update?: string;
}[] = [
  {
    to: '/media/news-pulse',
    icon: '📰',
    title: 'News Pulse',
    desc: 'Daily coverage of India\'s drone industry — policy, market, defence, agriculture.',
    tags: ['Market', 'Policy', 'Defence'],
    countType: 'news',
    countLabel: (n) => `${n} article${n === 1 ? '' : 's'} published`,
  },
  {
    to: '/media/magazine',
    icon: '📖',
    title: 'Magazine',
    desc: 'In-depth quarterly analysis of the drone market, technology, and company profiles.',
    tags: ['Quarterly', 'Analysis', 'Data'],
    countType: 'magazine',
    countLabel: (n) => `${n} issue${n === 1 ? '' : 's'} published`,
  },
  {
    to: '/media/video-spotlight',
    icon: '🎬',
    title: 'Video Spotlight',
    desc: 'Video interviews with India\'s top drone manufacturers, pilots, and policymakers.',
    tags: ['Interviews', 'Expo', 'YouTube'],
    countType: 'video',
    countLabel: (n) => `${n} interview${n === 1 ? '' : 's'}`,
  },
  {
    to: '/gallery',
    icon: '📷',
    title: 'Gallery',
    desc: 'Photo and video coverage from India\'s major drone events and exhibitions.',
    tags: ['Photos', 'Events', '2025'],
    update: 'Drone Expo 2025 Mumbai',
  },
  {
    to: '/media/impact-stories',
    icon: '💡',
    title: 'Impact Stories',
    desc: 'Verified outcomes from real drone deployments — agriculture, infrastructure, defence.',
    tags: ['Agriculture', 'Survey', 'Defence'],
    countType: 'impact-story',
    countLabel: (n) => `${n} stor${n === 1 ? 'y' : 'ies'} published`,
  },
  {
    to: '/media/market-intelligence',
    icon: '📊',
    title: 'Market Intelligence',
    desc: 'Data-backed market analysis — growth charts, sector breakdown, key indicators.',
    tags: ['IBEF Data', '2030 Projections'],
    update: 'IBEF data June 2026',
  },
  {
    to: '/media/tech-trends',
    icon: '🚀',
    title: 'Tech Trends',
    desc: 'The technologies defining India\'s drone industry in 2026 — BVLOS, AI, swarms.',
    tags: ['AI', 'BVLOS', 'Swarm'],
    countType: 'tech-trends',
    countLabel: (n) => `${n} trend${n === 1 ? '' : 's'} for 2026`,
  },
  {
    to: '/media/press-releases',
    icon: '📣',
    title: 'Press Releases',
    desc: 'Official announcements from government, industry associations, and companies.',
    tags: ['Government', 'Companies'],
    update: 'Submit free',
  },
  {
    to: '/media/industry-reports',
    icon: '📋',
    title: 'Industry Reports',
    desc: 'Curated research from IBEF, DGCA, NITI Aayog, and DroneTv editorial.',
    tags: ['IBEF', 'DGCA', 'Research'],
    countType: 'industry-report',
    countLabel: (n) => `${n} report${n === 1 ? '' : 's'} available`,
  },
];

export default function MediaHubPage() {
  const [counts, setCounts] = useState<Partial<Record<ContentType, number>>>({});

  useEffect(() => {
    const controller = new AbortController();
    const types = Array.from(new Set(hubs.map(h => h.countType).filter((t): t is ContentType => !!t)));
    Promise.all(types.map(t => fetchContent(t, controller.signal).then(items => [t, items.length] as const).catch(() => [t, 0] as const)))
      .then(results => setCounts(Object.fromEntries(results)));
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>DroneTv <span>Media Hub</span></>}
        stats={[
          { n: counts.video ?? '…', l: 'Videos' },
          { n: 'Daily', l: 'Updates' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Explore</span>
          All Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {withInlineAds(hubs, (h) => (
            <Link
              key={h.to}
              to={h.to}
              className="bg-surface-card rounded-xl border border-ink-light shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="bg-ink px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-sm group-hover:text-brand-yellow transition-colors">{h.title}</h3>
                  <p className="text-white/40 text-xs">
                    {h.countType
                      ? (counts[h.countType] !== undefined ? h.countLabel!(counts[h.countType]!) : '…')
                      : h.update}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-ink-paragraph leading-relaxed mb-3">{h.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {h.tags.map((t) => (
                    <span key={t} className="bg-ink-light text-ink-caption text-xs font-semibold px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-ink-light px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-ink-caption">Explore section</span>
                <span className="text-brand-yellow font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
