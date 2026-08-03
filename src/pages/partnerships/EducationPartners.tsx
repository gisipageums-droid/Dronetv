import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, GraduationCap } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

const eduStats = [
  { num: '240+', label: 'DGCA-Approved\nRPTOs' },
  { num: '39,890', label: 'Certified Remote\nPilots Feb 2026' },
  { num: '₹50K–1L', label: 'Avg. Annual\nPilot Salary' },
  { num: '5 Days', label: 'Minimum DGCA\nCertification' },
];

const eduOffers = [
  { icon: '🎓', title: 'Verified Institute Listing', desc: "Your RPTO or training institute listed on DroneTv.in's Workshops and Professionals sections — reaching students actively searching for drone training programmes across India." },
  { icon: '🏆', title: 'Competition and Achievement Coverage', desc: 'DroneTv covers major drone competitions including SAE Aerothon, SUAS, and IRoC-U. Teams from partner institutions receive editorial coverage and social media promotion for competition milestones.' },
  { icon: '📹', title: 'Faculty and Course Interviews', desc: 'Video interviews with instructors and graduates published on DroneTv YouTube and social media — building credibility and organic reach for your institution.' },
  { icon: '📝', title: 'Workshop Listings Free', desc: "Submit your drone, GIS, or AI workshops for free listing on DroneTv.in's Events section — reaching students and professionals actively planning skill upgrades." },
];

export default function EducationPartnersPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchContent('education-partner', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General').filter(Boolean)))];
  const filtered = activeCategory === 'All' ? items : items.filter(i => (i.category || 'General') === activeCategory);

  return (
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Education <span>Partners</span></>}
        stats={[
          { n: items.length || '0', l: 'Partners' },
          { n: 'DGCA', l: 'Approved' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5">
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
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">RPTO</span>
          Education Partners
        </h2>
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading education partners...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {withInlineAds(filtered, item => (
              <ContentCard
                key={item.contentId}
                image={item.imageUrl}
                imageAlt={item.title}
                imageFallback={<GraduationCap className="w-10 h-10 text-brand-yellow" />}
              >
                {item.category && <span className="bg-status-success/15 text-status-success text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
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
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map(tag => <span key={tag} className="bg-ink-light text-ink-paragraph text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
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
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eduStats.map((s, i) => (
                <div key={i} className="bg-surface-card rounded-xl border border-ink-light p-5 text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-brand-gold leading-none mb-2">{s.num}</div>
                  <div className="text-xs font-semibold text-ink-caption whitespace-pre-line">{s.label}</div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-base font-bold text-ink mb-4">What DroneTv.in Offers Education Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eduOffers.map((o, i) => (
                  <div key={i} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{o.icon}</span>
                    <div>
                      <h3 className="font-bold text-ink text-sm mb-1">{o.title}</h3>
                      <p className="text-xs text-ink-caption leading-relaxed">{o.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ink rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Drone Academy Private Limited — DroneTv's Training Entity</h3>
                <p className="text-xs text-white/60 max-w-lg">DroneTv.in is operated by Drone Academy Private Limited, which is directly involved in drone training and certification. Education partnerships with DroneTv carry the credibility of an operating training entity — not just a media platform.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a href="/partnerships/become-a-partner" className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">Apply as Education Partner</a>
                <a href="/events/workshops" className="px-4 py-2 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors">List Your Workshop Free →</a>
              </div>
            </div>
          </div>
        )}

          <PostContentCTA contentType="education-partner" typeLabel="Education Partner Listing"
            ctaDescription="Run a drone education institute or program? List it directly." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
