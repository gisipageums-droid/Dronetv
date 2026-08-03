import { ReactNode } from 'react';

interface AdSlotProps {
  image?: string;
  href?: string;
  alt?: string;
  width?: number;
  height?: number;
  aspect?: string;
  /** Floor for `aspect`-sized slots so a fluid-width banner doesn't shrink its
   * text/emoji creative into illegibility on narrow mobile viewports. */
  minHeight?: number;
  className?: string;
  children?: ReactNode;
}

// Generic paid-ad placement unit, reused across every ad zone on a page.
// Renders a real creative when `image` is supplied, otherwise a clean
// "Advertise Here" placeholder sized to the same slot so empty zones don't
// collapse or look broken before they're sold.
export default function AdSlot({ image, href, alt = 'Advertisement', width, height, aspect, minHeight, className = '', children }: AdSlotProps) {
  // A fluid `aspect` slot has no intrinsic size of its own, so it's normally
  // forced to the zone's declared ratio. But a real uploaded creative rarely
  // matches that ratio exactly — forcing it anyway just letterboxes the image
  // with visible white gaps top/bottom. Once there's a real image, let it set
  // its own height instead; keep the forced ratio only for the empty
  // placeholder / dummy-creative state, which does need a defined box.
  const useNaturalHeight = !!(image && aspect);
  const style = useNaturalHeight
    ? {}
    : aspect ? { aspectRatio: aspect, minHeight } : { width, height };

  const inner = (
    <div
      className={`relative rounded-xl overflow-hidden border border-ink-light bg-surface-card flex-shrink-0 ${className}`}
      style={style}
    >
      <span className="absolute top-1.5 left-1.5 z-10 bg-ink/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
        Ad
      </span>
      {image ? (
        // object-contain (not cover) — real uploaded creatives can be any aspect
        // ratio and shouldn't get aggressively cropped into an unrecognizable
        // sliver just to fill a slot with a different shape.
        // For fluid `aspect` slots: `max-w-full` (not `w-full`) so a small
        // low-res upload is shown at its own size instead of being stretched
        // to fill the whole container and coming out huge and blurry; a wide
        // real banner still shrinks to fit the container exactly as before.
        // `maxHeight` is a safety net against an accidentally very tall upload
        // dominating the page's layout height.
        <img
          src={image}
          alt={alt}
          className={useNaturalHeight ? "max-w-full h-auto block mx-auto" : "w-full h-full object-contain bg-surface-card"}
          style={useNaturalHeight ? { maxHeight: 320 } : undefined}
        />
      ) : children ? (
        children
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-alt text-center p-3">
          <span className="text-xs font-semibold text-ink-caption uppercase tracking-wide">Advertise Here</span>
          {(width || height) && <span className="text-[10px] text-ink-caption mt-1">{width}×{height}</span>}
        </div>
      )}
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className="block">
      {inner}
    </a>
  ) : inner;
}
