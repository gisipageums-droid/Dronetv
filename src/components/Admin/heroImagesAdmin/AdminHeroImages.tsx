import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Trash2, Loader2, AlertTriangle, ImageOff } from "lucide-react";
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
  label?: string;
  originalName?: string;
  width?: number;
  height?: number;
}

interface SlotSpec {
  label: string;
  width: number;
  height: number;
}

const CATEGORIES = ["Drone", "AI", "GIS"];
const SLOTS: Record<string, SlotSpec> = {
  hero_main: { label: "Main hero image", width: 1000, height: 1000 },
  hero_inset: { label: "Small inset image", width: 400, height: 400 },
};

function readDimensions(file: File): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

function SlotUploader({
  category, slot, spec, images, onChanged,
}: {
  category: string; slot: string; spec: SlotSpec; images: HeroImage[]; onChanged: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Pick an image file"); return; }
    if (file.size > 3 * 1024 * 1024) { toast.error("Image must be under 3 MB"); return; }

    const dims = await readDimensions(file);
    if (dims && (dims.w !== spec.width || dims.h !== spec.height)) {
      const ok = window.confirm(
        `This image is ${dims.w}×${dims.h}px. Recommended is ${spec.width}×${spec.height}px ` +
        `for the ${spec.label.toLowerCase()}. Upload anyway?`
      );
      if (!ok) return;
    }

    setBusy(true);
    try {
      const presignRes = await fetch(`${API}/upload-url`, {
        method: "POST",
        headers: adminAuthHeaders(),
        body: JSON.stringify({ category, slot, filename: file.name, contentType: file.type }),
      });
      const presign = await presignRes.json();
      if (!presignRes.ok || !presign.success) throw new Error(presign.detail || "Could not get an upload URL");

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to storage failed");

      const createRes = await fetch(API, {
        method: "POST",
        headers: adminAuthHeaders(),
        body: JSON.stringify({
          category, slot,
          imageUrl: presign.imageUrl,
          originalName: file.name,
          width: dims?.w, height: dims?.h,
        }),
      });
      if (!createRes.ok) {
        const e = await createRes.json().catch(() => ({}));
        throw new Error(e.detail || `Save failed (${createRes.status})`);
      }
      toast.success("Image added");
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [category, slot, spec, onChanged]);

  const remove = async (id: string) => {
    if (!window.confirm("Remove this image from the pool?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: adminAuthHeaders() });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      toast.success("Removed");
      onChanged();
    } catch (err: any) {
      toast.error(err.message || "Could not remove");
    }
  };

  return (
    <div className="border border-ink-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm font-semibold text-ink">{spec.label}</div>
          <div className="text-[11px] text-ink-caption">
            Recommended {spec.width}&times;{spec.height}px &middot; JPG or PNG &middot; max 3 MB
          </div>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-yellow text-ink hover:bg-brand-gold disabled:opacity-50"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        />
      </div>

      {images.length === 0 ? (
        <div className="flex items-center gap-2 text-[11px] text-ink-caption py-3">
          <ImageOff size={14} /> No images yet — the scraper's own result is used until you add some.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((img) => {
            const off = img.width && img.height && (img.width !== spec.width || img.height !== spec.height);
            return (
              <div key={img.id} className="relative group border border-ink-light rounded-md overflow-hidden bg-surface-main">
                <img src={img.imageUrl} alt={img.label || img.originalName || ""} className="w-full h-20 object-cover" />
                <button
                  onClick={() => remove(img.id)}
                  className="absolute top-1 right-1 p-1 rounded bg-ink/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <Trash2 size={12} />
                </button>
                <div className="px-1.5 py-1 text-[9.5px] text-ink-caption truncate" title={img.originalName || ""}>
                  {off && <AlertTriangle size={9} className="inline mr-0.5 text-status-warning" />}
                  {img.width && img.height ? `${img.width}×${img.height}` : (img.originalName || "image")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminHeroImages() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(API, { headers: adminAuthHeaders() })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load (${r.status})`);
        return r.json();
      })
      .then((data) => { setImages(data.images || []); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-5xl">
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-ink">Hero Fallback Images</h1>
        <p className="text-[13px] text-ink-paragraph mt-1">
          Curated 1st-section images used when a new company&rsquo;s website scrape can&rsquo;t produce a good hero
          image. One pool per category; a random image is picked at publish time. Super admin only.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-status-error/10 text-status-error text-sm">{error}</div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-ink-caption">
          <Loader2 className="w-5 h-5 animate-spin inline" /> Loading…
        </div>
      ) : (
        <div className="space-y-5">
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
