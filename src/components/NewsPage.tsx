import { useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, ExternalLink, SlidersHorizontal, X } from 'lucide-react';
import { fetchContent, MediaItem } from '../lib/mediaApi';

export default function NewsPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
          <h1 className="text-base font-extrabold text-white m-0">News <span className="text-yellow-400">&amp; Insights</span> <span className="text-xs font-semibold text-white/50 ml-2">{items.length || '0'} Articles</span></h1>
        </div>
      </div>

      <style>{`
.nw-wrap{max-width:1280px;margin:0 auto;padding:20px 22px}
.nw-layout{display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:start}
.nw-sidebar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:14px;box-shadow:0 2px 12px rgba(0,0,0,.06);position:sticky;top:120px}
.nw-sidebar-title{font-size:13px;font-weight:800;color:#0A0A0A;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.nw-filter-grp{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #F0F0F0}
.nw-filter-grp:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.nw-fl-label{font-size:10px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
.nw-chip{padding:4px 10px;border-radius:14px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .12s;white-space:nowrap;border:1.5px solid #E5E5E5;background:#fff;color:#333;font-family:inherit}
.nw-chip.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.nw-chips{display:flex;gap:5px;flex-wrap:wrap}
.nw-main{min-width:0}
.nw-search-bar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:10px 12px;box-shadow:0 1px 6px rgba(0,0,0,.06);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.nw-search-bar input{border:none;background:none;font-size:13px;width:100%;outline:none;color:#1A1A1A;font-family:inherit}
.nw-resbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:7px}
.nw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:13px}
.nw-pages{display:flex;justify-content:center;margin-top:28px;gap:6px;flex-wrap:wrap}
.nw-page-btn{padding:7px 13px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #E5E5E5;background:#fff;color:#444;font-family:inherit}
.nw-page-btn.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.nw-filter-toggle{display:none}
@media(max-width:960px){
  .nw-layout{grid-template-columns:1fr}
  .nw-sidebar{position:static;display:none}
  .nw-sidebar.open{display:block}
  .nw-filter-toggle{display:flex;align-items:center;gap:6px;padding:7px 12px;background:#0A0A0A;color:#F5C518;border:none;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px}
}
@media(max-width:600px){.nw-wrap{padding:12px 14px}.nw-grid{grid-template-columns:1fr}}
`}</style>

      {/* Main content with sidebar */}
      <div className="nw-wrap">
        <div className="nw-layout">
          {/* Sidebar */}
          <aside className={`nw-sidebar${sidebarOpen ? ' open' : ''}`}>
            <div className="nw-sidebar-title"><SlidersHorizontal size={14} /> Filters</div>

            <div className="nw-filter-grp">
              <div className="nw-fl-label">Search</div>
              <div className="nw-search-bar">
                <Search size={14} color="#999" />
                <input placeholder="Search articles..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
                {search && <X size={13} color="#999" style={{cursor:'pointer',flexShrink:0}} onClick={() => setSearch('')} />}
              </div>
            </div>

            <div className="nw-filter-grp">
              <div className="nw-fl-label">Category</div>
              <div className="nw-chips">
                {categories.map(c => (
                  <button key={c} className={`nw-chip${selectedCategory === c ? ' active' : ''}`} onClick={() => { setSelectedCategory(c); setCurrentPage(1); }}>
                    {c === 'All' ? 'All' : c}
                  </button>
                ))}
              </div>
            </div>

            {(search || selectedCategory !== 'All') && (
              <button onClick={() => { setSearch(''); setSelectedCategory('All'); setCurrentPage(1); }}
                style={{width:'100%',padding:'7px',borderRadius:'8px',fontSize:'12px',fontWeight:700,background:'#0A0A0A',color:'#F5C518',border:'none',cursor:'pointer',fontFamily:'inherit'}}>
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main */}
          <div className="nw-main">
            <button className="nw-filter-toggle" onClick={() => setSidebarOpen(o => !o)}>
              <SlidersHorizontal size={14} /> Filters {(search || selectedCategory !== 'All') ? '(active)' : ''}
            </button>

            {loading ? (
              <div style={{textAlign:'center',padding:'64px 0',color:'#999'}}>Loading articles...</div>
            ) : filtered.length === 0 ? (
              <div style={{textAlign:'center',padding:'64px 0',color:'#999'}}>No articles found.</div>
            ) : (
              <>
                <div className="nw-resbar">
                  <span style={{fontSize:'13px',color:'#666'}}>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
                  {totalPages > 1 && <span style={{fontSize:'12px',color:'#999'}}>Page {currentPage} of {totalPages}</span>}
                </div>

                <div className="nw-grid">
                  {paginated.map(item => (
                    <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover" /> : (
                        <div className="w-full h-44 bg-zinc-900 flex items-center justify-center">
                          <span className="text-yellow-400 text-3xl font-extrabold">DTV</span>
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1">
                        {item.category && <span className="bg-black text-yellow-400 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block self-start">{item.category}</span>}
                        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{item.title}</h3>
                        {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3 flex-1">{item.description}</p>}
                        <div className="space-y-1 mt-auto">
                          {(item.source || item.author) && <div className="flex items-center gap-1.5 text-xs text-gray-400"><User className="w-3 h-3 flex-shrink-0" />{item.source || item.author}</div>}
                          {item.date && <div className="flex items-center gap-1.5 text-xs text-gray-400"><Calendar className="w-3 h-3 flex-shrink-0" />{item.date}</div>}
                          {item.readTime && <div className="flex items-center gap-1.5 text-xs text-gray-400"><Clock className="w-3 h-3 flex-shrink-0" />{item.readTime}</div>}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.tags.slice(0, 3).map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                          </div>
                        )}
                        {item.externalLink && (
                          <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700">
                            Read Article <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="nw-pages">
                    <button className="nw-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Prev</button>
                    {[...Array(totalPages)].map((_, i) => {
                      const pg = i + 1;
                      if (pg === currentPage || pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                        return <button key={pg} className={`nw-page-btn${pg === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(pg)}>{pg}</button>;
                      } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                        return <span key={pg} style={{alignSelf:'center',color:'#999'}}>…</span>;
                      }
                      return null;
                    })}
                    <button className="nw-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
