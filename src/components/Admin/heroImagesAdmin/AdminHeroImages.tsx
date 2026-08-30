import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Trash2, Loader2, AlertTriangle, ImageOff, Info } from "lucide-react";
import { toast } from "react-toastify";
import { COMPANY_API } from "../../../lib/apiConfig";

const API = `${COMPANY_API}/hero-fallbacks`;

function adminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

interface HeroImage {
  id: string;
  category: string;
  slot: string;
  imageUrl: string;
  originalName?: string;
  width?: number;
  height?: number;
}

interface SlotSpec { label: string; max: number; }

const CATEGORIES = ["Drone", "AI", "GIS"];
const SLOTS: Record<string, SlotSpec> = {
  hero_main: { label: "Main hero image", max: 1000 },
  hero_inset: { label: "Small inset image", max: 400 },
};

// Downscale the longest side to `max` px and re-encode as JPEG so a multi-MB
// photo becomes ~100-250KB — fast to load on the public company page. Aspect
// ratio is preserved (no cropping); a smaller source is left as-is.
async function shrinkForHero(file: File, max: number): Promise<{ file: File; w: number; h: number }> {
  const supported = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  const dims = await new Promise<{ w: number; h: number } | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
  if (!supported || !dims) return { file, w: dims?.w || 0, h: dims?.h || 0 };

  const scale = Math.min(1, max / Math.max(dims.w, dims.h));
  if (scale === 1 && file.size < 300 * 1024) return { file, w: dims.w, h: dims.h };

  const w = Math.round(dims.w * scale);
  const h = Math.round(dims.h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { file, w: dims.w, h: dims.h };

  const bmp = await createImageBitmap(file).catch(() => null);
  if (bmp) { ctx.drawImage(bmp, 0, 0, w, h); bmp.close?.(); }
  else {
    await new Promise<void>((res) => { const i = new Image(); i.onload = () => { ctx.drawImage(i, 0, 0, w, h); res(); }; i.src = URL.createObjectURL(file); });
  }

  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
  if (!blob || blob.size >= file.size) return { file, w: dims.w, h: dims.h };
  const name = file.name.replace(/\.(jpe?g|png|webp)$/i, "") + ".jpg";
  return { file: new File([blob], name, { type: "image/jpeg" }), w, h };
}

function SlotUploader({
  category, slot, spec, images, backendReady, onChanged,
}: {
  category: string; slot: string; spec: SlotSpec; images: HeroImage[]; backendReady: boolean; onChanged: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const uploadOne = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error(`${file.name}: not an image`); return; }

    const { file: out, w, h } = await shrinkForHero(file, spec.max);

    const presignRes = await fetch(`${API}/upload-url`, {
      method: "POST",
      headers: adminAuthHeaders(),
      body: JSON.stringify({ category, slot, filename: out.name, contentType: out.type }),
    });
    const presign = await presignRes.json().catch(() => ({}));
    if (!presignRes.ok || !presign.success) throw new Error(presign.detail || `upload URL failed (${presignRes.status})`);

    const putRes = await fetch(presign.uploadUrl, { method: "PUT", headers: { "Content-Type": out.type }, body: out });
    if (!putRes.ok) throw new Error("storage upload failed");

    const createRes = await fetch(API, {
      method: "POST",
      headers: adminAuthHeaders(),
      body: JSON.stringify({ category, slot, imageUrl: presign.imageUrl, originalName: file.name, width: w, height: h }),
    });
    if (!createRes.ok) {
      const e = await createRes.json().catch(() => ({}));
      throw new Error(e.detail || `save failed (${createRes.status})`);
    }
  }, [category, slot, spec.max]);

  const onFiles = useCallback(async (files: FileList) => {
    const list = Array.from(files);
    let ok = 0;
    for (let i = 0; i < list.length; i++) {
      setProgress(list.length > 1 ? `Uploading ${i + 1} of ${list.length}…` : "Uploading…");
      try { await uploadOne(list[i]); ok++; }
      catch (err: any) { toast.error(err.message || `${list[i].name} failed`); }
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    if (ok) { toast.success(ok === 1 ? "Image added" : `${ok} images added`); onChanged(); }
  }, [uploadOne, onChanged]);

  const remove = async (id: string) => {
    if (!window.confirm("Remove this image from the pool?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: adminAuthHeaders() });
      if (!res.ok) throw new Error(`delete failed (${res.status})`);
      toast.success("Removed");
      onChanged();
    } catch (err: any) { toast.error(err.message || "could not remove"); }
  };

  return (
    <div className="border border-ink-light rounded-lg p-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <div className="text-sm font-semibold text-ink">{spec.label}</div>
          <div className="text-[11px] text-ink-caption">
            Best around {spec.max}px on the long side &middot; auto-shrunk &amp; compressed on upload &middot; pick several at once
          </div>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={!!progress || !backendReady}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-yellow text-ink hover:bg-brand-gold disabled:opacity-50 flex-shrink-0"
        >
          {progress ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {progress || "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) onFiles(e.target.files); }}
        />
      </div>

      {images.length === 0 ? (
        <div className="flex items-center gap-2 text-[11px] text-ink-caption py-2">
          <ImageOff size={13} /> {backendReady ? "Nothing here yet." : " "}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
          {images.map((img) => (
            <div key={img.id} className="relative group border border-ink-light rounded overflow-hidden bg-surface-main">
              <img src={img.imageUrl} alt="" className="w-full h-16 object-cover" />
              <button
                onClick={() => remove(img.id)}
                className="absolute top-0.5 right-0.5 p-1 rounded bg-ink/70 text-white opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminHeroImages() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(API, { headers: adminAuthHeaders() })
      .then(async (r) => {
        if (r.status === 404) { setBackendReady(false); return { images: [] }; }
        setBackendReady(true);
        if (!r.ok) throw new Error(`load failed (${r.status})`);
        return r.json();
      })
      .then((data) => setImages(data.images || []))
      .catch(() => toast.error("Could not load the pool"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-5xl">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-ink">Hero Fallback Images</h1>
        <p className="text-[13px] text-ink-paragraph mt-1">
          Curated 1st-section images used when a new company&rsquo;s website scrape can&rsquo;t produce a good hero
          image. One pool per category; a random image is picked at publish time. Super admin only.
        </p>
      </div>

      {!backendReady && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-brand-yellow/10 text-ink text-[13px]">
          <Info size={15} className="flex-shrink-0 mt-0.5 text-brand-gold" />
          <span>
            The company service hasn&rsquo;t been redeployed with this feature yet, so uploads are disabled.
            Redeploy <code className="font-mono">dronetv-company-dev</code> and reload this page.
          </span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-ink-caption">
          <Loader2 className="w-5 h-5 animate-spin inline" /> Loading…
        </div>
      ) : (
        <div className="space-y-4">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="bg-surface-card border border-ink-light rounded-xl p-4">
              <div className="text-sm font-bold text-ink mb-3">{cat}</div>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(SLOTS).map(([slot, spec]) => (
                  <SlotUploader
                    key={slot}
                    category={cat}
                    slot={slot}
                    spec={spec}
                    backendReady={backendReady}
                    images={images.filter((i) => i.category === cat && i.slot === slot)}
                    onChanged={load}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
