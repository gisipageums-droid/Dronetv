import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Search } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';
import CompactHero from '../../components/common/CompactHero';
import ContentCard from '../../components/common/ContentCard';
import { withInlineAds, AdSidebarRail } from '../../components/common/adCreatives';
import PostContentCTA from '../../components/common/PostContentCTA';

export default function PressReleasesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    fetchContent('press-release', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = !search ? items : items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.source || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Press <span>Releases</span></>}
        stats={[
          { n: items.length || '0', l: 'Releases' },
          { n: 'Official', l: 'Sources Only' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
          <input type="text" placeholder="Search press releases..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-ink-light rounded-xl text-sm focus:outline-none focus:border-brand-yellow" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 lg:flex lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
          <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Latest</span>
          Press Releases
        </h2>
        {loading ? (
          <div className="text-center py-16 text-ink-caption">Loading press releases...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-caption">No press releases yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {withInlineAds(filtered, item => (
              <ContentCard key={item.contentId} image={item.imageUrl} imageAlt={item.title}>
                {item.category && <span className="bg-status-info/15 text-status-info text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
                <h3 className="text-sm font-bold text-ink mb-1 line-clamp-2">{item.title}</h3>
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
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-ink-caption min-w-0">
                    {item.company && <span className="font-semibold text-ink-paragraph truncate">{item.company}</span>}
                    {item.date && <span className="flex items-center gap-1 flex-shrink-0"><Calendar className="w-3 h-3" />{item.date}</span>}
                  </div>
                  {item.externalLink && (
                    <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs font-bold text-brand-gold hover:text-brand-yellow flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </ContentCard>
            ))}
          </div>
        )}

          <PostContentCTA contentType="press-release" typeLabel="Press Release"
            ctaDescription="Have company news or an announcement to distribute? Publish your press release here." />
        </div>
        <AdSidebarRail />
      </div>
    </div>
  );
}
