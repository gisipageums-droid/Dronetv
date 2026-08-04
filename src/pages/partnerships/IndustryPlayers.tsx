import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Layers } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

const playerTypes = [
  { icon: '🚁', title: 'Drone Service Operators', desc: "Companies providing drone-as-a-service across agriculture, infrastructure inspection, logistics, and surveillance. India's fastest-growing segment as commercial fleet sizes expand post-PLI scheme.", tags: ['DaaS', 'Commercial Ops', 'B2B Service'] },
  { icon: '⚓', title: 'Defence and Government Contractors', desc: "Defence contractors, system integrators, and government procurement organisations involved in India's ₹25B military drone modernisation programme and SVAMITVA/NHAI/Railways mandates.", tags: ['Defence', 'Government', 'Procurement'] },
  { icon: '🏗️', title: 'Infrastructure and Survey Companies', desc: 'GIS firms, survey companies, and infrastructure operators using drone data for mapping, inspection, and monitoring. Covers NHAI corridor monitoring, railway inspection, and smart city applications.', tags: ['Survey', 'GIS', 'Infrastructure'] },
  { icon: '🌱', title: 'Agri-Drone Service Providers', desc: 'Companies and cooperatives operating agriculture drones for precision spraying, NDVI mapping, and crop monitoring across India. Includes Namo Drone Didi SHG operators and commercial agri-drone fleets.', tags: ['Agriculture', 'Spraying', 'SHG Operators'] },
  { icon: '📦', title: 'Logistics and Delivery Operators', desc: "Last-mile delivery companies, healthcare logistics providers, and emergency response operators deploying drone delivery networks across India's tier-2 and tier-3 cities and remote areas.", tags: ['Delivery', 'Last Mile', 'Healthcare'] },
  { icon: '🎬', title: 'Media and Aerial Cinematography', desc: 'Professional aerial photography and cinematography operators for film, advertising, events, and real estate. India\'s most visible commercial drone use case with growing demand from OTT platforms and wedding industry.', tags: ['Cinematography', 'Aerial Photo', 'Film'] },
];

export default function IndustryPlayersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('industry-player', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];

  const filtered = items.filter(i => {
    const matchCat = activeCategory === 'All' || (i.category || 'General') === activeCategory;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Industry <span>Players</span></>}
        stats={[
          { n: items.length || '0', l: 'Players' },
          { n: 'India', l: 'Ecosystem' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-ink-light rounded-xl text-sm focus:outline-none focus:border-brand-yellow w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-brand-yellow border-brand-yellow text-ink' : 'border-ink-light text-ink-caption hover:border-brand-yellow'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Key</span>
          Industry Players
        </h2>
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading industry players...</div>
        ) : items.length > 0 ? (
          filtered.length === 0
            ? <div className="text-center py-8 text-ink-caption">No players match your search.</div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {withInlineAds(filtered, item => (
                  <ContentCard
                    key={item.contentId}
                    image={item.imageUrl}
                    imageAlt={item.title}
                    imageFallback={<Layers className="w-10 h-10 text-brand-yellow" />}
                  >
                    {item.category && <span className="bg-status-warning/15 text-status-warning text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
                    <h3 className="text-sm font-bold text-ink mb-2 line-clamp-2">{item.title}</h3>
                    {item.description && (
                      <div className="mb-3">
                        <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(item.contentId) ? '' : 'line-clamp-3'}`}>{item.description}</p>
                        {item.description.length > 140 && (
                          <button onClick={() => toggleExpanded(item.contentId)} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                            {expandedIds.has(item.contentId) ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="mt-auto pt-3 border-t border-ink-light flex items-center justify-between gap-2">
                      {item.location && <span className="flex items-center gap-1 text-xs text-ink-caption"><MapPin className="w-3 h-3" />{item.location}</span>}
                      {item.externalLink && (
                        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1 whitespace-nowrap">
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </ContentCard>
                ))}
              </div>
        ) : (
          <>
            <p className="text-xs text-ink-caption mb-4">Types of industry players that partner with DroneTv.in — from service operators to defence contractors.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {withInlineAds(playerTypes, (p, i) => (
                <ContentCard key={i}>
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h3 className="font-bold text-ink text-sm mb-2">{p.title}</h3>
                  <div className="mb-3">
                    <p className={`text-xs text-ink-caption leading-relaxed ${expandedIds.has(String(i)) ? '' : 'line-clamp-3'}`}>{p.desc}</p>
                    {p.desc.length > 140 && (
                      <button onClick={() => toggleExpanded(String(i))} className="text-xs font-bold text-brand-gold hover:text-brand-yellow mt-1">
                        {expandedIds.has(String(i)) ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tags.map(tag => <span key={tag} className="bg-status-warning/10 text-status-warning text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                  </div>
                  <div className="mt-auto pt-3 border-t border-ink-light">
                    <a href="/partnerships/become-a-partner" className="text-xs font-bold text-brand-gold hover:text-brand-yellow">Partner with DroneTv →</a>
                  </div>
                </ContentCard>
              ))}
            </div>
            <div className="mt-6 bg-ink rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Get Found by Buyers Actively Looking for Your Services</h3>
                <p className="text-xs text-white/60 max-w-lg">DroneTv.in's B2B marketplace connects verified buyers with drone service providers. Unlike generic directories, every visitor on DroneTv.in is from the drone industry — which means every lead is a qualified prospect for your services.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="/partnerships/become-a-partner" className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">Apply Now</a>
                <a href="/partnerships/partner-benefits" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">Compare Packages →</a>
              </div>
            </div>
          </>
        )}

          <PostContentCTA contentType="industry-player" typeLabel="Industry Player Listing"
            ctaDescription="Offer drone-related services or solutions? List your company directly." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
