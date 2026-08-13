import { ReactNode, useRef, useState } from 'react';

interface ContentCardProps {
  image?: string;
  imageAlt?: string;
  imageFallback?: ReactNode;
  imgHeight?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Shared chrome for every content-card grid on the site (media, events,
// partnerships, professionals pages). Centralizing the outer card + image
// slot + equal-height flex behavior here means a card-height/consistency fix
// only has to happen once instead of drifting across ~26 near-duplicate
// implementations. Callers own their own title/description/footer markup as
// children — end it with a `mt-auto pt-3 border-t border-gray-100` row so the
// footer bottom-aligns regardless of how much content is above it.
export default function ContentCard({
  image,
  imageAlt = '',
  imageFallback,
  imgHeight = 'h-40',
  children,
  className = '',
  onClick,
}: ContentCardProps) {
  const retriedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!retriedRef.current) {
      retriedRef.current = true;
      // Transient network/CDN blips are common — retry once with a
      // cache-busting param before giving up and showing the fallback.
      const target = e.currentTarget;
      const separator = image!.includes('?') ? '&' : '?';
      setTimeout(() => {
        target.src = `${image}${separator}retry=${Date.now()}`;
      }, 400);
      return;
    }
    setFailed(true);
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {image && !failed ? (
        <img src={image} alt={imageAlt} onError={handleImageError} className={`w-full ${imgHeight} object-cover flex-shrink-0`} />
      ) : imageFallback ? (
        <div className={`w-full ${imgHeight} bg-zinc-900 flex items-center justify-center flex-shrink-0`}>{imageFallback}</div>
      ) : null}
      <div className="p-5 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
