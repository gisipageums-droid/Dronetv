// Re-encodes uploads as WebP in the browser before they are stored. WebP files are
// ordinary images (<img> tags, downloads, share sheets all work unchanged) but
// much smaller than the camera JPEG at the same visual quality. A small preview is
// made for grids so a page of photos does not download full-size files.
// Browsers that cannot encode WebP (older Safari) fall back to JPEG.

// The website copy is plenty sharp for the viewer and the branded share image; the untouched
// original is stored separately and is what "Download original photo" returns.
const MASTER_MAX = 2400;
const MASTER_QUALITY = 0.85;
const THUMB_MAX = 640;
const THUMB_QUALITY = 0.78;
const LOGO_MAX = 800;

// Chosen by the admin in bulk upload: how big the website copy is and what shape it is cut to.
export interface PhotoOptions {
  maxDim: number;      // long edge in px; 0 keeps the original pixel size
  aspect: number | 0;  // width / height to centre-crop to; 0 keeps the photo's own shape
  // Exact pixel box typed by the admin. fill = crop the edges so the photo fills the box shape,
  // otherwise the whole photo is kept and shrunk to fit inside it. Never enlarges a photo.
  box?: { w: number; h: number; fill: boolean };
}

export const SIZE_CHOICES: { label: string; value: number }[] = [
  { label: 'Large - 2400 px (recommended)', value: 2400 },
  { label: 'Standard - 1600 px', value: 1600 },
  { label: 'Small - 1200 px (fastest to load)', value: 1200 },
  { label: 'Original pixel size', value: 0 },
];

export const SHAPE_CHOICES: { label: string; value: number }[] = [
  { label: 'Keep each photo\'s own shape', value: 0 },
  { label: 'Landscape 16:9', value: 16 / 9 },
  { label: 'Classic 4:3', value: 4 / 3 },
  { label: 'Square 1:1', value: 1 },
  { label: 'Portrait 3:4', value: 3 / 4 },
];

export const DEFAULT_PHOTO_OPTIONS: PhotoOptions = { maxDim: MASTER_MAX, aspect: 0 };

export interface OptimizedPhoto {
  master: File;       // website copy (WebP, long edge <= 2400px); may be the original file itself if that is already smaller
  thumb: File;        // grid preview
  original: File;     // the untouched upload
  originalBytes: number;
}

async function decode(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: 'from-image' });
}

async function encode(bmp: ImageBitmap, maxDim: number, quality: number, keepAlpha: boolean, aspect = 0, box?: PhotoOptions['box']): Promise<Blob> {
  // centre-crop to the requested shape first, then scale the result down to maxDim (0 = no scaling)
  let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
  if (aspect > 0) {
    if (bmp.width / bmp.height > aspect) { sw = Math.round(bmp.height * aspect); sx = Math.round((bmp.width - sw) / 2); }
    else { sh = Math.round(bmp.width / aspect); sy = Math.round((bmp.height - sh) / 2); }
  }
  let scale = maxDim > 0 ? Math.min(1, maxDim / Math.max(sw, sh)) : 1;
  if (box) scale = Math.min(1, box.w / sw, box.h / sh);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sw * scale));
  canvas.height = Math.max(1, Math.round(sh * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  if (!keepAlpha) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
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

export async function optimizePhoto(file: File, opts: PhotoOptions = DEFAULT_PHOTO_OPTIONS): Promise<OptimizedPhoto> {
  const bmp = await decode(file);
  try {
    const boxAspect = opts.box && opts.box.fill ? opts.box.w / opts.box.h : 0;
    const aspect = boxAspect || opts.aspect;
    const masterBlob = await encode(bmp, opts.box ? 0 : opts.maxDim, MASTER_QUALITY, false, aspect, opts.box);
    const thumbBlob = await encode(bmp, THUMB_MAX, THUMB_QUALITY, false, aspect);
    // A file that is already smaller than its re-encode (small, heavily compressed) is kept as is,
    // but only when no resize or reshape was asked for.
    const unchanged = !opts.box && opts.aspect === 0 && (opts.maxDim === 0 || (bmp.width <= opts.maxDim && bmp.height <= opts.maxDim));
    const useOriginal = unchanged && masterBlob.size >= file.size;
    const master = useOriginal ? file : new File([masterBlob], renamed(file.name, masterBlob), { type: masterBlob.type });
    return {
      master,
      thumb: new File([thumbBlob], `thumb-${renamed(file.name, thumbBlob)}`, { type: thumbBlob.type }),
      original: file,
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

export const MIN_BOX = 100;
export const MAX_BOX = 8000;

export function describeOptions(o: PhotoOptions): string {
  if (o.box) return `${o.box.w} x ${o.box.h} px (${o.box.fill ? 'crops edges to fill' : 'whole photo, fitted'})`;
  const size = SIZE_CHOICES.find(c => c.value === o.maxDim)?.label.split(' - ')[0] || `${o.maxDim} px`;
  const shape = SHAPE_CHOICES.find(c => Math.abs(c.value - o.aspect) < 0.001)?.label.replace(/^Keep each photo's own shape$/, 'own shape') || 'own shape';
  return `${size}, ${shape}`;
}
