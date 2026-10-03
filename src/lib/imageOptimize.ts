// Re-encodes uploads as WebP in the browser before they are stored. WebP files are
// ordinary images (<img> tags, downloads, share sheets all work unchanged) but
// typically 25-35% smaller than JPEG at the same visual quality, and the long
// edge is capped so a 12 MB phone photo does not stay 12 MB. A small preview is
// made for grids so a page of photos does not download full-size files.
// Browsers that cannot encode WebP (older Safari) fall back to JPEG.

const MASTER_MAX = 3000;
const MASTER_QUALITY = 0.85;
const THUMB_MAX = 640;
const THUMB_QUALITY = 0.78;
const LOGO_MAX = 800;

export interface OptimizedPhoto {
  master: File;
  thumb: File;
  originalBytes: number;
}

async function decode(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: 'from-image' });
}

async function encode(bmp: ImageBitmap, maxDim: number, quality: number, keepAlpha: boolean): Promise<Blob> {
  const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  if (!keepAlpha) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const webp = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/webp', quality));
  if (webp && webp.type === 'image/webp') return webp;
  const jpeg = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', Math.max(quality, 0.85)));
  if (!jpeg) throw new Error('Could not encode image');
  return jpeg;
}

function renamed(name: string, blob: Blob): string {
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  return `${name.replace(/\.[^.]+$/, '')}.${ext}`;
}

export async function optimizePhoto(file: File): Promise<OptimizedPhoto> {
  const bmp = await decode(file);
  try {
    const masterBlob = await encode(bmp, MASTER_MAX, MASTER_QUALITY, false);
    const thumbBlob = await encode(bmp, THUMB_MAX, THUMB_QUALITY, false);
    // A file that is already smaller than its re-encode (small, heavily compressed) is kept as is.
    const useOriginal = masterBlob.size >= file.size && bmp.width <= MASTER_MAX && bmp.height <= MASTER_MAX;
    const master = useOriginal ? file : new File([masterBlob], renamed(file.name, masterBlob), { type: masterBlob.type });
    return {
      master,
      thumb: new File([thumbBlob], `thumb-${renamed(file.name, thumbBlob)}`, { type: thumbBlob.type }),
      originalBytes: file.size,
    };
  } finally {
    bmp.close();
  }
}

// Logos: capped at 800 px and re-encoded as WebP with transparency kept. SVG and GIF pass through.
export async function optimizeLogo(file: File): Promise<File> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return file;
  try {
    const bmp = await decode(file);
    try {
      const blob = await encode(bmp, LOGO_MAX, 0.9, true);
      return blob.size < file.size ? new File([blob], renamed(file.name, blob), { type: blob.type }) : file;
    } finally {
      bmp.close();
    }
  } catch {
    return file;
  }
}

export function formatBytes(n: number): string {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}
