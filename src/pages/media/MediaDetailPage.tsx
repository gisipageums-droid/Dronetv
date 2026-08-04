import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin, ExternalLink, Tag } from 'lucide-react';
import { fetchContent, MediaItem, ContentType } from '../../lib/mediaApi';

interface Props {
  contentType: ContentType;
  backPath: string;
  backLabel: string;
  externalLinkLabel?: string;
}

export default function MediaDetailPage({ contentType, backPath, backLabel, externalLinkLabel = 'View Original Source' }: Props) {
  const { contentId } = useParams<{ contentId: string }>();
  const location = useLocation();
  const [item, setItem] = useState<MediaItem | null>((location.state as { item?: MediaItem })?.item || null);
  const [loading, setLoading] = useState(!item);

  useEffect(() => {
    if (item || !contentId) { setLoading(false); return; }
    fetchContent(contentType)
      .then(items => setItem(items.find(i => i.contentId === contentId) || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [contentId]);

  if (loading) {
    return (
      <div className="pt-[104px] min-h-screen bg-surface-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-yellow" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-[104px] min-h-screen bg-surface-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-ink mb-3">Content Not Found</h2>
          <Link to={backPath} className="text-brand-gold font-bold text-sm hover:text-brand-yellow">← Back to {backLabel}</Link>
        </div>
      </div>
    );
  }

  const formatDate = (d?: string) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <div className="bg-ink text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link to={backPath} className="flex items-center gap-2 text-white/50 hover:text-brand-yellow text-sm font-semibold mb-5 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to {backLabel}
          </Link>
          {item.category && (
            <p className="text-xs font-bold text-brand-yellow uppercase tracking-widest mb-3">{item.category}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-5 mt-4">
            {item.date && (
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Calendar className="w-3.5 h-3.5" />{formatDate(item.date)}
              </span>
            )}
            {item.author && (
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <User className="w-3.5 h-3.5" />{item.author}
              </span>
            )}
            {item.source && (
              <span className="text-xs text-white/50">Source: <span className="text-white/70 font-semibold">{item.source}</span></span>
            )}
            {item.location && (
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <MapPin className="w-3.5 h-3.5" />{item.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="w-full max-h-96 object-cover rounded-xl mb-8 shadow-sm" />
        )}

        {item.description ? (
          <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8 mb-6">
            <p className="text-ink-paragraph leading-relaxed text-sm whitespace-pre-wrap">{item.description}</p>
          </div>
        ) : (
          <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8 mb-6">
            <p className="text-ink-caption text-sm italic">No description available.</p>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <Tag className="w-4 h-4 text-ink-caption" />
            {item.tags.map(tag => (
              <span key={tag} className="bg-ink-light text-ink-paragraph text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-ink-light">
          <Link to={backPath} className="flex items-center gap-2 text-ink-paragraph hover:text-brand-yellow text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to {backLabel}
          </Link>
          {item.externalLink && (
            <a
              href={item.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-ink font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              {externalLinkLabel} <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
