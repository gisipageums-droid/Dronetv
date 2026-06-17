import { useState, useEffect } from 'react';
import { Search, ChevronDown, Calendar, User, Clock, ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../lib/mediaApi';

export default function NewsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('news', controller.signal).then(setItems).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filtered = items.filter(item => {
    const matchSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      (item.source || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / articlesPerPage);
  const paginated = filtered.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">News <span className="text-yellow-400">&amp; Insights</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Latest trends and insights in drone technology, AI, and the UAV industry.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{items.length || '0'}</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Articles</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Live</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-700 sm:min-w-[160px]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading articles...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No articles found.</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover" />
                  )}
                  {!item.imageUrl && (
                    <div className="w-full h-44 bg-zinc-900 flex items-center justify-center">
                      <span className="text-yellow-400 text-3xl font-extrabold">DTV</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    {item.category && (
                      <span className="bg-black text-yellow-400 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3 flex-1">{item.description}</p>
                    )}
                    <div className="space-y-1 mt-auto">
                      {(item.source || item.author) && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <User className="w-3 h-3 flex-shrink-0" />
                          {item.source || item.author}
                        </div>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {item.date}
                        </div>
                      )}
                      {item.readTime && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {item.readTime}
                        </div>
                      )}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    {item.externalLink && (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700"
                      >
                        Read Article <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === currentPage || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${page === currentPage ? 'bg-black text-yellow-400 border border-black' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-gray-400 self-center">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
