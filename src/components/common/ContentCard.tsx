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
// children — end it with a `mt-auto pt-3 border-t border-ink-light` row so the
// footer bottom-aligns regardless of how much content is above it. Use
// `border-surface-cardborder` for that divider — design-system card border.
export default function ContentCard({
  image,
  imageAlt = '',
  imageFallback,
  imgHeight = 'h-40',
  children,
  className = '',
  onClick,
}: ContentCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const retriedRef = useRef(false);

  const handleImgError = () => {
    if (retriedRef.current) {
      setImgFailed(true);
      return;
    }
    retriedRef.current = true;
    // Many card images are hotlinked from third-party sites; a cold DNS/TLS
    // handshake to one on first paint can fail even though the URL is fine —
    // give it a moment then force one fresh request before giving up.
    setTimeout(() => setRetryNonce(n => n + 1), 800);
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col bg-surface-card rounded-[20px] border border-surface-cardborder shadow-sm hover:shadow-md transition-shadow overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {image && !imgFailed ? (
        <img key={retryNonce} src={image} alt={imageAlt} onError={handleImgError} className={`w-full ${imgHeight} object-cover flex-shrink-0`} />
      ) : imageFallback ? (
        <div className={`w-full ${imgHeight} bg-surface-darksection flex items-center justify-center flex-shrink-0`}>{imageFallback}</div>
      ) : null}
      <div className="p-5 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
