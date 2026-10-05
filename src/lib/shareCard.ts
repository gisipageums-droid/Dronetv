import { generateBrandedImage } from './brandedImage';
import type { GalleryEvent } from './galleryEvent';
import { updateContent, type MediaItem } from './mediaApi';

// The link preview of a shared gallery photo is the same branded template as the Download button.
// It is built here, in the browser, with the very same code, so the two always look identical, and stored
// with the photo: chat apps read the preview from the server and cannot run this code themselves.

const CARD_SIZE = 1200;
const MAX_BYTES = 290 * 1024;

async function toJpegCard(png: Blob, name: string): Promise<File> {
  const bmp = await createImageBitmap(png);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = CARD_SIZE;
    canvas.height = CARD_SIZE;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, CARD_SIZE, CARD_SIZE);
    let blob: Blob | null = null;
    for (const q of [0.9, 0.82, 0.74, 0.66]) {
      blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q));
      if (blob && blob.size <= MAX_BYTES) break;
    }
    if (!blob) throw new Error('Could not encode the share card');
    return new File([blob], name, { type: 'image/jpeg' });
  } finally {
    bmp.close();
  }
}

export async function buildShareCard(
  item: Pick<MediaItem, 'imageUrl' | 'title' | 'description'>,
  event: GalleryEvent | null,
): Promise<File> {
  if (!item.imageUrl) throw new Error('Photo has no image');
  const png = await generateBrandedImage({ photoUrl: item.imageUrl, caption: item.description || item.title || '', event });
  return toJpegCard(png, 'share-card.jpg');
}

// Builds the card and uploads it; returns its URL, or undefined when it could not be made
// (the photo itself must still save, and its link then previews the plain photo).
export async function makeShareCardUrl(
  item: Pick<MediaItem, 'imageUrl' | 'title' | 'description'>,
  event: GalleryEvent | null,
  upload: (file: File) => Promise<string>,
): Promise<string | undefined> {
  try {
    return await upload(await buildShareCard(item, event));
  } catch {
    return undefined;
  }
}

export async function refreshShareCard(
  item: Pick<MediaItem, 'contentId' | 'imageUrl' | 'title' | 'description'>,
  event: GalleryEvent | null,
  upload: (file: File) => Promise<string>,
): Promise<boolean> {
  const url = await makeShareCardUrl(item, event, upload);
  if (!url) return false;
  await updateContent({ contentType: 'gallery', contentId: item.contentId, shareImageUrl: url });
  return true;
}
