import { useEffect, useState } from 'react';
import AdSlot from './AdSlot';
import { LAMBDA, PAYMENT_API } from '../../lib/apiConfig';

const TOKEN_SPEND = LAMBDA.tokenSpend;

interface PagePlacementSlotProps {
  /** Must match a slotId in PagePlacements.tsx's SLOT_DEFINITIONS. */
  slotId: string;
  width?: number;
  height?: number;
  aspect?: string;
  minHeight?: number;
  className?: string;
}

// Renders a user-booked, paid page placement (Homepage/Category/Media Hub
// slots sold via the User Dashboard's "Page Placements" page) if one is
// currently active for this slot, using the same AdSlot presentation as
// every other ad unit on the site. Renders AdSlot's own "Advertise Here"
// placeholder when the slot is unsold or has no creative uploaded yet —
// never blank, never breaks layout.
export default function PagePlacementSlot({ slotId, width, height, aspect, minHeight, className }: PagePlacementSlotProps) {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [href, setHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    const url = PAYMENT_API
      ? `${PAYMENT_API}/placements/active?slotId=${encodeURIComponent(slotId)}`
      : `${TOKEN_SPEND}/placement/active?slotId=${encodeURIComponent(slotId)}`;
    fetch(url, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.active && data?.imageUrl) {
          setImage(data.imageUrl);
          setHref(data.linkUrl || undefined);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [slotId]);

  return (
    <AdSlot image={image} href={href} width={width} height={height} aspect={aspect} minHeight={minHeight} className={className} alt={`${slotId} sponsored placement`} />
  );
}
