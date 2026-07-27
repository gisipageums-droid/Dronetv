import { useEffect } from 'react';
import { fetchContent } from '../../lib/mediaApi';
import { setRealAdsCache } from './adCreatives';

// Fetches all published ads once on app load and populates the shared
// realAdsCache read by withInlineAds/AdSidebarRail/AdDetailBanner/SponsorBadge/
// AdStickyStrip. Renders nothing — mounted once in App.tsx alongside AdStickyStrip.
export default function AdsLoader() {
  useEffect(() => {
    const controller = new AbortController();
    fetchContent('ad', controller.signal)
      .then(setRealAdsCache)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return null;
}
