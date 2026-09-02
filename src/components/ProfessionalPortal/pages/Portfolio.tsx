import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, Trash2, Pencil } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getPortalProfile, savePortalProfileSection, uploadPortfolioFile } from "../api";
import { PageHeader, Card, KpiRow, KpiCard, Field, inputCls, Btn, Badge, EmptyState } from "../ui";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileType: string;
  views: number;
  createdAt: string;
}

const CATEGORIES = ["Survey", "Agriculture", "Spraying", "Inspection", "Cinematography", "Mapping"];

export default function Portfolio() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState("");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [pendingFile, setPendingFile] = useState<{ url: string; type: string } | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const card = await getMyProfessional(userId);
        if (!card) { setLoading(false); return; }
        setProfessionalId(card.professionalId);
        const portal = await getPortalProfile(card.professionalId);
        setItems(portal.portfolioItems || []);
      } catch {
        toast.error("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const persist = async (next: PortfolioItem[]) => {
    setItems(next);
    await savePortalProfileSection(professionalId, "portfolioItems", next);
  };

  const handleFilePicked = async (file: File) => {
    setUploading(true);
    setUploadPct(0);
    try {
      const url = await uploadPortfolioFile(professionalId, file, setUploadPct);
      setPendingFile({ url, type: file.type });
      toast.success("File uploaded — add a title and description, then save");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const savePendingItem = async () => {
    if (!pendingFile || !title) {
      toast.error("Add a title before saving");
      return;
    }
    const item: PortfolioItem = {
      id: `port-${Date.now()}`,
      title, category, description,
      fileUrl: pendingFile.url,
      fileType: pendingFile.type,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    await persist([item, ...items]);
    toast.success("Portfolio item published");
    setPendingFile(null);
    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);
  };

  const removeItem = async (id: string) => {
    await persist(items.filter(i => i.id !== id));
    toast.success("Portfolio item deleted");
  };

  const totalViews = items.reduce((sum, i) => sum + (i.views || 0), 0);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!professionalId) return <Card className="text-center py-16 text-white/40">No professional profile found for this account.</Card>;

  return (
    <div>
      <PageHeader title="My Portfolio" sub="Showcase your best drone work — visible to recruiters and companies on your DroneTv.in profile" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,video/mp4"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFilePicked(f); }}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/15 rounded-lg p-10 text-center cursor-pointer hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors mb-5"
      >
        <UploadCloud size={36} className="mx-auto mb-3 text-white/40" />
        <div className="text-[15px] font-bold text-white mb-1.5">{uploading ? `Uploading... ${uploadPct}%` : "Upload New Portfolio Item"}</div>
        <div className="text-[12.5px] text-white/40">Aerial maps · NDVI outputs · Survey reports · Inspection photos · Cinematic reels<br />Supported: JPG, PNG, PDF, MP4 · Max 50MB</div>
      </div>

      {pendingFile && (
        <Card className="mb-5">
          <div className="p-4">
            <div className="text-sm font-bold text-white mb-3">Finish this upload</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <Field label="Title" required><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="500 Ha Boundary Mapping — Telangana" /></Field>
              <Field label="Category">
                <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Description" wide><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Medium Category Mission · 3 Days · Sub-5cm accuracy" /></Field>
            </div>
            <div className="flex gap-3">
              <Btn onClick={savePendingItem}>Publish Item</Btn>
              <Btn variant="outline" onClick={() => setPendingFile(null)}>Discard</Btn>
            </div>
          </div>
        </Card>
      )}

      <KpiRow>
        <KpiCard label="Portfolio Items" value={items.length} />
        <KpiCard label="Total Views" value={totalViews} accent="blue" />
      </KpiRow>

      {items.length === 0 ? (
        <EmptyState text="No portfolio items yet — upload your first work sample above." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-white/5 flex items-center justify-center">
                {item.fileType?.startsWith("image/") ? (
                  <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/30 text-3xl">📄</div>
                )}
              </div>
              <div className="p-3.5">
                <div className="text-[13px] font-bold text-white mb-1 truncate">{item.title}</div>
                <div className="text-[11px] text-white/40 mb-2 truncate">{item.description}</div>
                <div className="flex items-center justify-between">
                  <Badge tone="success">{item.category}</Badge>
                  <span className="text-[11px] text-white/40">Views: <b className="text-white">{item.views || 0}</b></span>
                </div>
              </div>
              <div className="px-3.5 py-2.5 border-t border-white/10 flex justify-end gap-2">
                <button onClick={() => removeItem(item.id)} className="text-status-error/70 hover:text-status-error" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
