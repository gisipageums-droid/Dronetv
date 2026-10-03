import { fetchContent, type MediaItem } from './mediaApi';

export const MAX_PARTNER_LOGOS = 8;

export const DEFAULT_FOOTER = {
  website: 'www.dronetv.in',
  tagline: "India's #1 Drone Industry Platform",
  phone: '+91 75201 23555',
};

export interface GalleryEvent {
  id: string;
  name: string;
  logo: string;
  location: string;
  partners: string[];
  website: string;
  tagline: string;
  phone: string;
}

// An event is stored as a media-content item of type 'gallery-event':
// title = event name, imageUrl = event logo, location = venue,
// targetPages = partner logo URLs, source = footer tagline,
// author = footer phone, externalLink = footer website.
export function eventFromItem(item: MediaItem): GalleryEvent {
  return {
    id: item.contentId,
    name: item.title || '',
    logo: item.imageUrl || '',
    location: item.location || '',
    partners: (item.targetPages || []).filter(Boolean).slice(0, MAX_PARTNER_LOGOS),
    website: item.externalLink || DEFAULT_FOOTER.website,
    tagline: item.source || DEFAULT_FOOTER.tagline,
    phone: item.author || DEFAULT_FOOTER.phone,
  };
}

export function eventToFields(e: Omit<GalleryEvent, 'id'>) {
  return {
    contentType: 'gallery-event' as const,
    title: e.name.trim(),
    description: '',
    imageUrl: e.logo,
    location: e.location.trim(),
    targetPages: e.partners.slice(0, MAX_PARTNER_LOGOS),
    source: e.tagline.trim(),
    author: e.phone.trim(),
    externalLink: e.website.trim(),
    isPublished: true,
  };
}

export async function fetchGalleryEvents(signal?: AbortSignal): Promise<GalleryEvent[]> {
  const items = await fetchContent('gallery-event', signal);
  return items.map(eventFromItem);
}
