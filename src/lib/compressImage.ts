// Client-side image downscale + recompress, run right before an upload so a
// multi-MB phone photo doesn't have to travel the wire at full size. A typical
// 12MP JPEG (~6MB) comes out around 300-500KB at 1920px/0.82 quality — roughly
// a 10x smaller PUT with no visible quality loss at the sizes these images are
// actually displayed (portfolio cards, profile photos, hero images).
//
// Only touches raster images we can safely re-encode. PDFs, videos, SVGs and
// GIFs (animation would be lost) pass straight through untouched.

const MAX_DIMENSION = 1920;
const QUALITY = 0.82;
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

    // PNGs may carry transparency — keep them as PNG (canvas re-encode still
    // strips metadata and the downscale alone is the win). Everything else
    // goes out as JPEG.
    const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, outType, outType === "image/jpeg" ? QUALITY : undefined)
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.(jpe?g|png|webp)$/i, outType === "image/png" ? ".png" : ".jpg");
    return new File([blob], newName, { type: outType, lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
