import { MEDIA_API, LAMBDA } from './apiConfig';
const BASE = MEDIA_API ? `${MEDIA_API}` : `${LAMBDA.media}/media-content`;

export interface MediaItem {
  contentType: string;
  contentId: string;
  title: string;
  description: string;
  imageUrl?: string;
  externalLink?: string;
  videoUrl?: string;
  source?: string;
  author?: string;
  tags?: string[];
  category?: string;
  location?: string;
  date?: string;
  price?: string;
  salary?: string;
  company?: string;
  platform?: string;
  readTime?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentType =
  | 'news' | 'magazine' | 'video' | 'impact-story'
  | 'market-intelligence' | 'tech-trends' | 'press-release' | 'industry-report'
  | 'gallery'
  | 'competition' | 'webinar' | 'meetup'
  | 'job' | 'training' | 'certification' | 'networking' | 'community'
  | 'applications' | 'manufacturer' | 'ai-company' | 'event-organizer'
  | 'education-partner' | 'industry-player';

export async function fetchContent(type: ContentType, signal?: AbortSignal): Promise<MediaItem[]> {
  const res = await fetch(`${BASE}?type=${type}&isPublished=true`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

export async function fetchAdminContent(signal?: AbortSignal, type?: ContentType): Promise<MediaItem[]> {
  const url = type ? `${BASE}/admin?type=${type}` : `${BASE}/admin`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

export async function createContent(item: Omit<MediaItem, 'contentId' | 'createdAt' | 'updatedAt'>): Promise<MediaItem> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || body?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.item;
}

export async function updateContent(item: Partial<MediaItem> & { contentType: string; contentId: string }): Promise<void> {
  const res = await fetch(BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || body?.message || `HTTP ${res.status}`);
  }
}

export async function deleteContent(type: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}?type=${type}&id=${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || body?.message || `HTTP ${res.status}`);
  }
}
