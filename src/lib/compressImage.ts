// Client-side image downscale + recompress, run right before an upload so a
// multi-MB phone photo (or a multi-MB logo — a real one found in production
// was 11.6MB, displayed at ~112px) never reaches storage at full size. A
// typical 12MP JPEG (~6MB) comes out around 150-300KB at 1920px/WebP 0.85 —
// WebP beats JPEG at the same visual quality for photos, and unlike JPEG it
// also keeps transparency, so logos/graphics no longer need a separate PNG
// branch to avoid losing it.
//
// Only touches raster images we can safely re-encode. PDFs, videos, SVGs and
// GIFs (animation would be lost) pass straight through untouched.

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.85;
const JPEG_QUALITY = 0.82; // fallback path only, if this browser can't encode WebP
const SKIP_BELOW_BYTES = 200 * 1024; // already small — not worth the work

function canReencode(file: File): boolean {
  return (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp"
  );
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = url;
  });
}

let webpSupported: boolean | null = null;
function supportsWebpEncoding(): Promise<boolean> {
  if (webpSupported !== null) return Promise.resolve(webpSupported);
  return new Promise((resolve) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    c.toBlob((blob) => {
      webpSupported = !!blob && blob.type === "image/webp";
      resolve(webpSupported);
    }, "image/webp");
  });
}

export async function compressImage(file: File): Promise<File> {
  if (!canReencode(file) || file.size < SKIP_BELOW_BYTES) return file;

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    // Nothing to gain if it's already small enough and reasonably sized.
    if (scale === 1 && file.size < 1024 * 1024) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // WebP first — smaller than both JPEG and PNG at equal visual quality,
    // and (unlike JPEG) keeps transparency, so it works for logos too.
    // Falls back to the old PNG/JPEG behaviour only on a browser that can't
    // encode WebP (effectively none still in use, but cheap to guard).
    const useWebp = await supportsWebpEncoding();
    const outType = useWebp ? "image/webp" : (file.type === "image/png" ? "image/png" : "image/jpeg");
    const quality = outType === "image/png" ? undefined : (outType === "image/webp" ? WEBP_QUALITY : JPEG_QUALITY);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, outType, quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const ext = outType === "image/webp" ? ".webp" : outType === "image/png" ? ".png" : ".jpg";
    const newName = file.name.replace(/\.(jpe?g|png|webp)$/i, ext);
    return new File([blob], newName, { type: outType, lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
