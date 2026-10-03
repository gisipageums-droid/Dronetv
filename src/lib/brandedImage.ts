import { MEDIA_API } from './apiConfig';
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

async function fetchBlob(url: string): Promise<Blob> {
  const res = await fetch(url, { mode: 'cors', cache: 'force-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}

// Some image hosts send no CORS headers, which makes the browser refuse to read them into a canvas.
// Fall back to our own image proxy (allow-listed hosts only) in that case.
let fontsReady: Promise<void> | null = null;
// Poppins is bundled in /fonts so the image looks the same on every device.
function ensureFonts(): Promise<void> {
  if (!fontsReady) {
    fontsReady = Promise.all([500, 600, 700, 800].map(async w => {
      const face = new FontFace('Poppins', `url(/fonts/Poppins-${w}.woff2)`, { weight: String(w) });
      document.fonts.add(await face.load());
    })).then(() => undefined).catch(() => undefined);
  }
  return fontsReady;
}

async function loadBitmap(url: string): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(await fetchBlob(url));
  } catch (err) {
    if (!MEDIA_API || url.startsWith('/') || url.startsWith(window.location.origin)) throw err;
    return createImageBitmap(await fetchBlob(`${MEDIA_API}/image-proxy?url=${encodeURIComponent(url)}`));
  }
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

type IconPart = { d: string } | { circle: [number, number, number] } | { rect: [number, number, number, number, number] };

// Vector paths copied from the Lucide icon set (24x24 grid, drawn as strokes).
const ICONS: Record<string, IconPart[]> = {
  handshake: [
    { d: 'm11 17 2 2a1 1 0 1 0 3-3' },
    { d: 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4' },
    { d: 'm21 3 1 11h-2' },
    { d: 'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3' },
    { d: 'M3 4h8' },
  ],
  calendar: [
    { d: 'M8 2v4' }, { d: 'M16 2v4' }, { rect: [3, 4, 18, 18, 2] }, { d: 'M3 10h18' },
    { d: 'M8 14h.01' }, { d: 'M12 14h.01' }, { d: 'M16 14h.01' }, { d: 'M8 18h.01' }, { d: 'M12 18h.01' }, { d: 'M16 18h.01' },
  ],
  pin: [{ d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }, { circle: [12, 10, 3] }],
  globe: [{ circle: [12, 12, 10] }, { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' }, { d: 'M2 12h20' }],
  phone: [{ d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' }],
};

function drawIcon(ctx: CanvasRenderingContext2D, name: keyof typeof ICONS, x: number, y: number, size: number, color: string, weight = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const part of ICONS[name]) {
    if ('d' in part) ctx.stroke(new Path2D(part.d));
    else if ('circle' in part) { ctx.beginPath(); ctx.arc(part.circle[0], part.circle[1], part.circle[2], 0, Math.PI * 2); ctx.stroke(); }
    else { roundRect(ctx, ...part.rect); ctx.stroke(); }
  }
  ctx.restore();
}

function drawPhoneBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  drawIcon(ctx, 'phone', cx - r * 0.55, cy - r * 0.55, r * 1.1, '#fff', 2.4);
}

// Venue split like the approved template: "Yashobhoomi" / "New Delhi, India" / "at the DroneTV Podium".
function venueLines(venue: string): string[] {
  const [place, ...rest] = venue.split(/\s+at\s+/i);
  const parts = place.split(',').map(t => t.trim()).filter(Boolean);
  const lines = [parts[0] || '', parts.slice(1).join(', ')];
  if (rest.length) lines.push(`at ${rest.join(' at ')}`.trim());
  return lines.filter(Boolean);
}

export async function generateBrandedImage(input: BrandedInput): Promise<Blob> {
  await ensureFonts();
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
  ctx.textRendering = 'geometricPrecision';
  ctx.fontKerning = 'normal';

  // Background with the subtle dot pattern of the approved template
  ctx.fillStyle = YELLOW;
  ctx.fillRect(0, 0, GRID, GRID);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (let y = 12; y < GRID; y += 24) {
    for (let x = ((y / 24) % 2) * 12 + 6; x < GRID; x += 24) {
      ctx.beginPath(); ctx.arc(x, y, 1.7, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Header: DroneTV logo (left, graphic only) + tagline, and the two header lines (right)
  if (brand) drawContain(ctx, brand, 62, 8, 362, 118, 10, 150, 484, 178);
  ctx.fillStyle = '#111';
  ctx.textAlign = 'left';
  const tagText = 'VOICE OF DRONE TECHNOLOGY, FOR ALL TECHNOLOGIES';
  let tagSize = 14;
  ctx.font = `800 ${tagSize}px ${FONT}`;
  tagSize = Math.max(9, Math.min(16, (tagSize * 350) / ctx.measureText(tagText).width));
  ctx.font = `800 ${tagSize}px ${FONT}`;
  ctx.fillText(tagText, 70, 140);
  ctx.textAlign = 'right';
  ctx.font = `600 28px ${FONT}`;
  ctx.fillText('Connect  |  Explore  |  Do Business', 1190, 76);
  ctx.font = `600 25px ${FONT}`;
  ctx.fillText('Drones  |  GIS  |  AI  |  People  |  Opportunities', 1190, 112);

  // Layout depends on whether there are partner logos to show
  const hasPartners = partners.length > 0;
  const photoH = hasPartners ? 682 : 782;
  const infoY = 176 + photoH + 8;
  const infoH = 144;
  const partnersY = infoY + infoH + 12;
  const frameBottom = hasPartners ? 1150 : infoY + infoH + 16;
  const footerY = Math.max(frameBottom, 1150);
  const hasEvent = !!(ev && (ev.logo || ev.location || ev.name));

  // White frame + photo
  ctx.fillStyle = '#fff';
  roundRect(ctx, 22, 160, 1210, frameBottom - 160, 38);
  ctx.fill();
  drawPhoto(ctx, photo, 38, 176, 1178, photoH, 24);

  // Info strip: handshake + caption | calendar + event logo | pin + venue
  ctx.fillStyle = '#FFF6D6';
  roundRect(ctx, 36, infoY, 1182, infoH, 22);
  ctx.fill();
  const mid = infoY + infoH / 2;
  drawIcon(ctx, 'handshake', 54, mid - 44, 88, NAVY, 2.5);
  const capX = 160;
  const capRight = hasEvent ? 700 : 1196;
  ctx.textAlign = 'left';
  ctx.fillStyle = NAVY;
  const caption = (input.caption || '').trim();
  const cap = fitText(ctx, caption, 700, capRight - capX, 3, 36, 22);
  const capLineH = cap.size * 1.2;
  const capTop = mid - (capLineH * cap.lines.length) / 2 + cap.size * 0.84;
  cap.lines.forEach((line, i) => {
    // bold lead lines, lighter final line - like the approved template
    const lighter = cap.lines.length >= 2 && i === cap.lines.length - 1;
    ctx.font = `${lighter ? 500 : 700} ${cap.size}px ${FONT}`;
    ctx.fillText(line, capX, capTop + i * capLineH);
  });

  if (hasEvent) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    for (const x of [712, 982]) { ctx.beginPath(); ctx.moveTo(x, infoY + 22); ctx.lineTo(x, infoY + infoH - 22); ctx.stroke(); }
    drawIcon(ctx, 'calendar', 724, mid - 29, 58, '#111', 2.5);
    if (eventLogo) {
      drawContain(ctx, eventLogo, 794, infoY + 10, 180, infoH - 20);
    } else if (ev?.name) {
      ctx.fillStyle = NAVY;
      ctx.textAlign = 'center';
      const nm = fitText(ctx, ev.name, 800, 170, 3, 30, 18);
      const lh = nm.size * 1.2;
      nm.lines.forEach((l, i) => ctx.fillText(l, 884, mid - (lh * nm.lines.length) / 2 + nm.size * 0.85 + i * lh));
    }
    if (ev?.location) {
      drawIcon(ctx, 'pin', 996, mid - 24, 48, '#E11D1D', 2);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1a1a1a';
      const lines = venueLines(ev.location);
      const sizes = [30, 25, 22];
      const weights = [500, 500, 500];
      const lineH = 1.2;
      const total = lines.reduce((h, _, i) => h + (sizes[i] ?? 22) * lineH, 0);
      let y = mid - total / 2;
      lines.forEach((text, i) => {
        let size = sizes[i] ?? 22;
        ctx.font = `${weights[i] ?? 500} ${size}px ${FONT}`;
        while (ctx.measureText(text).width > 150 && size > 13) { size -= 1; ctx.font = `${weights[i] ?? 500} ${size}px ${FONT}`; }
        y += (sizes[i] ?? 22) * lineH;
        ctx.fillText(text, 1046, y - (sizes[i] ?? 22) * 0.22);
      });
    }
  }

  // Industry partners strip (up to 8 logos)
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

  // Footer: globe + website | tagline | phone
  const footer = {
    website: ev?.website || DEFAULT_FOOTER.website,
    tagline: ev?.tagline || DEFAULT_FOOTER.tagline,
    phone: ev?.phone || DEFAULT_FOOTER.phone,
  };
  const fy = footerY + (GRID - footerY) / 2;
  ctx.fillStyle = '#111';
  ctx.textAlign = 'left';
  drawIcon(ctx, 'globe', 46, fy - 27, 54, '#111', 2.2);
  ctx.font = `600 30px ${FONT}`;
  ctx.fillText(footer.website, 112, fy + 11);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2;
  for (const x of [392, 872]) { ctx.beginPath(); ctx.moveTo(x, fy - 28); ctx.lineTo(x, fy + 28); ctx.stroke(); }
  const tag = fitText(ctx, footer.tagline, 600, 440, 1, 31, 20);
  ctx.font = `600 ${tag.size}px ${FONT}`;
  ctx.fillText(tag.lines[0] || '', 412, fy + 11);
  drawPhoneBadge(ctx, 916, fy, 26);
  ctx.font = `600 31px ${FONT}`;
  ctx.fillText(footer.phone, 956, fy + 11);

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
