import { ReactNode } from 'react';

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
  return (
    <div
      onClick={onClick}
      className={`flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {image ? (
        <img src={image} alt={imageAlt} className={`w-full ${imgHeight} object-cover flex-shrink-0`} />
      ) : imageFallback ? (
        <div className={`w-full ${imgHeight} bg-zinc-900 flex items-center justify-center flex-shrink-0`}>{imageFallback}</div>
      ) : null}
      <div className="p-5 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
