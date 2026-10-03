import { DEFAULT_FOOTER, type GalleryEvent } from './galleryEvent';

// Generates the approved DroneTV share template in the browser. The original
// photo is only read (never modified or re-uploaded); the branded image exists
// only as the generated download / share file.

const SIZE = 2160;
const GRID = 1254;
const YELLOW = '#FFD321';
const NAVY = '#0B2A6F';
const FONT = '"Poppins","Segoe UI",Roboto,Arial,sans-serif';
const LOGO_URL = '/images/Drone tv .in.png';

export interface BrandedInput {
  photoUrl: string;
  caption: string;
  event?: Pick<GalleryEvent, 'name' | 'logo' | 'location' | 'partners' | 'website' | 'tagline' | 'phone'> | null;
}

async function loadBitmap(url: string): Promise<ImageBitmap> {
  const res = await fetch(url, { mode: 'cors', cache: 'force-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return createImageBitmap(await res.blob());
}

async function tryBitmap(url?: string): Promise<ImageBitmap | null> {
  if (!url) return null;
  try { return await loadBitmap(url); } catch { return null; }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else { line = test; }
  }
  if (line) lines.push(line);
  return lines;
}

// Largest font (px, design units) at which the text fits maxLines within maxW.
function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, maxW: number, maxLines: number, from: number, to: number) {
  for (let size = from; size >= to; size -= 2) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    const lines = wrap(ctx, text, maxW);
    if (lines.length <= maxLines) return { size, lines };
  }
  ctx.font = `${weight} ${to}px ${FONT}`;
  const lines = wrap(ctx, text, maxW).slice(0, maxLines);
  if (lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/\s+\S*$/, '') + '…';
  return { size: to, lines };
}

function drawContain(ctx: CanvasRenderingContext2D, img: ImageBitmap, x: number, y: number, w: number, h: number, sx = 0, sy = 0, sw = img.width, sh = img.height) {
  const scale = Math.min(w / sw, h / sh);
  const dw = sw * scale, dh = sh * scale;
  ctx.drawImage(img, sx, sy, sw, sh, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawCover(ctx: CanvasRenderingContext2D, img: ImageBitmap, x: number, y: number, w: number, h: number, focusY = 0.4) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale, sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) * focusY;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawPhoto(ctx: CanvasRenderingContext2D, img: ImageBitmap, x: number, y: number, w: number, h: number, r: number) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  const ratio = img.width / img.height;
  const boxRatio = w / h;
  if (Math.abs(ratio / boxRatio - 1) <= 0.12) {
    drawCover(ctx, img, x, y, w, h);
  } else {
    // Photo shape differs a lot from the frame: show all of it (nothing cropped) over a blurred copy.
    ctx.filter = 'blur(28px)';
    drawCover(ctx, img, x - 40, y - 40, w + 80, h + 80);
    ctx.filter = 'none';
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(x, y, w, h);
    drawContain(ctx, img, x, y, w, h);
  }
  ctx.restore();
}

function drawPin(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.save();
  ctx.fillStyle = '#E11D1D';
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.15, s * 0.55, Math.PI * 0.85, Math.PI * 0.15, false);
  ctx.lineTo(cx, cy + s * 0.95);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx, cy - s * 0.15, s * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGlobe(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = r * 0.12;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.32, r * 0.72, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - r * 0.72, cy); ctx.lineTo(cx + r * 0.72, cy); ctx.stroke();
  ctx.restore();
}

function drawPhone(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  // handset: two ends joined by a curved grip
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineWidth = r * 0.34;
  ctx.beginPath();
  ctx.arc(cx + r * 0.1, cy - r * 0.1, r * 0.5, Math.PI * 0.95, Math.PI * 1.6, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - r * 0.1, cy + r * 0.1, r * 0.5, Math.PI * -0.05, Math.PI * 0.6, false);
  ctx.stroke();
  ctx.restore();
}

export async function generateBrandedImage(input: BrandedInput): Promise<Blob> {
  const photo = await loadBitmap(input.photoUrl);
  const ev = input.event || null;
  const partnerUrls = (ev?.partners || []).slice(0, 8);
  const [brand, eventLogo, ...partnerBitmaps] = await Promise.all([
    tryBitmap(LOGO_URL),
    tryBitmap(ev?.logo),
    ...partnerUrls.map(tryBitmap),
  ]);
  const partners = partnerBitmaps.filter((b): b is ImageBitmap => !!b);

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const k = SIZE / GRID;
  ctx.scale(k, k);
  ctx.imageSmoothingQuality = 'high';
  ctx.textBaseline = 'alphabetic';

  // Background
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, GRID, GRID);

  // Header
  if (brand) drawContain(ctx, brand, 56, 8, 330, 140, 8, 150, 484, 215);
  ctx.fillStyle = '#111';
  ctx.textAlign = 'right';
  ctx.font = `700 29px ${FONT}`;
  ctx.fillText('Connect  |  Explore  |  Do Business', 1190, 74);
  ctx.font = `600 26px ${FONT}`;
  ctx.fillText('Drones  |  GIS  |  AI  |  People  |  Opportunities', 1190, 112);

  // Layout depends on whether there are partner logos to show
  const hasPartners = partners.length > 0;
  const hasEvent = !!(ev && (ev.logo || ev.location || ev.name));
  const photoH = hasPartners ? 682 : 782;
  const infoY = 176 + photoH + 8;
  const infoH = 144;
  const partnersY = infoY + infoH + 12;
  const frameBottom = hasPartners ? 1150 : infoY + infoH + 16;
  const footerY = Math.max(frameBottom, 1150);

  // White frame + photo
  ctx.fillStyle = '#fff';
  roundRect(ctx, 22, 160, 1210, frameBottom - 160, 38);
  ctx.fill();
  drawPhoto(ctx, photo, 38, 176, 1178, photoH, 24);

  // Info strip: caption | event logo | location
  ctx.fillStyle = '#FFF6D6';
  roundRect(ctx, 36, infoY, 1182, infoH, 22);
  ctx.fill();
  const captionRight = hasEvent ? 700 : 1190;
  ctx.textAlign = 'left';
  ctx.fillStyle = NAVY;
  const caption = (input.caption || '').trim();
  const cap = fitText(ctx, caption, 700, captionRight - 70, 3, 38, 22);
  const capLineH = cap.size * 1.22;
  const capTop = infoY + (infoH - capLineH * cap.lines.length) / 2 + cap.size * 0.86;
  cap.lines.forEach((line, i) => ctx.fillText(line, 62, capTop + i * capLineH));

  if (hasEvent) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    for (const x of [712, 978]) { ctx.beginPath(); ctx.moveTo(x, infoY + 22); ctx.lineTo(x, infoY + infoH - 22); ctx.stroke(); }
    if (eventLogo) {
      drawContain(ctx, eventLogo, 728, infoY + 12, 236, infoH - 24);
    } else if (ev?.name) {
      ctx.fillStyle = NAVY;
      ctx.textAlign = 'center';
      const nm = fitText(ctx, ev.name, 800, 220, 3, 30, 18);
      const lh = nm.size * 1.2;
      nm.lines.forEach((l, i) => ctx.fillText(l, 846, infoY + (infoH - lh * nm.lines.length) / 2 + nm.size * 0.85 + i * lh));
    }
    if (ev?.location) {
      drawPin(ctx, 1014, infoY + infoH / 2 - 4, 26);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1a1a1a';
      const loc = fitText(ctx, ev.location, 600, 150, 4, 26, 18);
      const lh = loc.size * 1.22;
      loc.lines.forEach((l, i) => ctx.fillText(l, 1046, infoY + (infoH - lh * loc.lines.length) / 2 + loc.size * 0.86 + i * lh));
    }
  }

  // Industry partners strip
  if (hasPartners) {
    ctx.fillStyle = NAVY;
    ctx.beginPath();
    ctx.moveTo(36, partnersY + 16);
    ctx.arcTo(36, partnersY, 52, partnersY, 16);
    ctx.lineTo(206, partnersY);
    ctx.lineTo(236, partnersY + 55);
    ctx.lineTo(206, partnersY + 110);
    ctx.lineTo(52, partnersY + 110);
    ctx.arcTo(36, partnersY + 110, 36, partnersY + 94, 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.font = `800 27px ${FONT}`;
    ctx.fillText('Industry', 52, partnersY + 48);
    ctx.fillText('Partners', 52, partnersY + 86);
    ctx.beginPath();
    ctx.moveTo(196, partnersY + 42); ctx.lineTo(210, partnersY + 55); ctx.lineTo(196, partnersY + 68);
    ctx.lineWidth = 7; ctx.strokeStyle = YELLOW; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();

    const areaX = 246, areaW = 972, gap = 8;
    const n = partners.length;
    const slotW = Math.min(124, (areaW - gap * (n - 1)) / n);
    const startX = areaX + (areaW - (slotW * n + gap * (n - 1))) / 2;
    partners.forEach((logo, i) => {
      const x = startX + i * (slotW + gap);
      ctx.fillStyle = '#fff';
      roundRect(ctx, x, partnersY, slotW, 110, 16);
      ctx.fill();
      ctx.strokeStyle = '#E3E3E3';
      ctx.lineWidth = 2;
      ctx.stroke();
      drawContain(ctx, logo, x + 12, partnersY + 12, slotW - 24, 86);
    });
  }

  // Footer
  const footer = {
    website: ev?.website || DEFAULT_FOOTER.website,
    tagline: ev?.tagline || DEFAULT_FOOTER.tagline,
    phone: ev?.phone || DEFAULT_FOOTER.phone,
  };
  const fy = footerY + (GRID - footerY) / 2;
  ctx.fillStyle = '#111';
  ctx.textAlign = 'left';
  ctx.font = `700 34px ${FONT}`;
  drawGlobe(ctx, 78, fy, 25);
  ctx.fillText(footer.website, 118, fy + 12);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2;
  for (const x of [376, 868]) { ctx.beginPath(); ctx.moveTo(x, fy - 28); ctx.lineTo(x, fy + 28); ctx.stroke(); }
  const tag = fitText(ctx, footer.tagline, 700, 440, 1, 34, 22);
  ctx.font = `700 ${tag.size}px ${FONT}`;
  ctx.fillText(tag.lines[0] || '', 400, fy + 12);
  drawPhone(ctx, 912, fy, 25);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText(footer.phone, 952, fy + 12);

  const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.92));
  if (!blob) throw new Error('Could not create the image');
  return blob;
}

export function brandedFileName(title: string): string {
  const base = (title || 'dronetv-photo').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'dronetv-photo';
  return `dronetv-${base}.jpg`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Opens the native share sheet with the branded image attached (WhatsApp, LinkedIn,
// Facebook apps on phones). Returns false when the device cannot share files.
export async function shareBlob(blob: Blob, filename: string, title: string, text: string, url: string): Promise<boolean> {
  const file = new File([blob], filename, { type: 'image/jpeg' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (!nav.share || !nav.canShare || !nav.canShare({ files: [file] })) return false;
  try {
    await nav.share({ files: [file], title, text: `${text}\n${url}`.trim() });
    return true;
  } catch (err) {
    if ((err as Error).name === 'AbortError') return true;
    return false;
  }
}
