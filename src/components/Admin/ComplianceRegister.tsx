import { useEffect, useState } from "react";
import { ClipboardCheck, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { ADMIN_API } from "../../lib/apiConfig";
import { authHeader } from "../../lib/authService";

// Master Checklist Section 8 (Governance): "convert the 23-point tracker
// into a standing Compliance Register" - this page IS that register, a
// real editable copy of the actual Master Implementation Checklist
// document (10 sections, ~60 lines, seeded verbatim server-side).
const API = `${ADMIN_API}/compliance-register`;

interface Item {
  id: string;
  section: string;
  item: string;
  sourceDoc: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
  owner: string | null;
  notes: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
}

const STATUS_STYLE: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  DONE: "bg-emerald-100 text-emerald-800",
};

export default function ComplianceRegister() {
  const [items, setItems] = useState<Item[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { owner: string; notes: string }>>({});

  const load = () => {
    setLoading(true);
    fetch(`${API}${sectionFilter ? `?section=${encodeURIComponent(sectionFilter)}` : ""}`, { headers: authHeader() })
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setCounts(d.counts || {});
        const nextDrafts: Record<string, { owner: string; notes: string }> = {};
        (d.items || []).forEach((i: Item) => { nextDrafts[i.id] = { owner: i.owner || "", notes: i.notes || "" }; });
        setDrafts(nextDrafts);
      })
      .catch(() => toast.error("Failed to load compliance register"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [sectionFilter]);

  const seed = async () => {
    try {
      const res = await fetch(`${API}/seed`, { method: "POST", headers: authHeader() });
      const data = await res.json();
      toast.success(data.inserted > 0 ? `Added ${data.inserted} new item(s)` : "Already up to date");
      load();
    } catch {
      toast.error("Failed to seed");
    }
  };

  const updateItem = async (id: string, patch: Partial<Pick<Item, "status" | "owner" | "notes">>) => {
    setSavingId(id);
    try {
      const res = await fetch(`${API}/${id}`, { method: "PATCH", headers: authHeader(), body: JSON.stringify(patch) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? data.item : i)));
      setCounts((prev) => {
        const next = { ...prev };
        const old = items.find((i) => i.id === id);
        if (old) next[old.status] = (next[old.status] || 1) - 1;
        next[data.item.status] = (next[data.item.status] || 0) + 1;
        return next;
      });
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const sections = Array.from(new Set(items.map((i) => i.section))).sort();

  if (loading && items.length === 0) return <div className="p-6 text-center text-ink-caption">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <h1 className="text-lg sm:text-xl font-bold text-ink">Compliance Register</h1>
        <button onClick={seed} className="flex items-center gap-1.5 px-3 py-1.5 border border-ink-light rounded-lg text-xs font-semibold text-ink-paragraph hover:bg-surface-alt transition">
          <RefreshCw size={13} /> Sync from checklist
        </button>
      </div>
      <p className="text-sm text-ink-paragraph mb-5">
        The Master Implementation Checklist document, seeded verbatim (10 sections, {items.length} items) and tracked here going forward - update status/owner/notes as work actually happens, per the document's own instruction.
      </p>

      <div className="flex gap-3 mb-5 flex-wrap">
        {(["NOT_STARTED", "IN_PROGRESS", "DONE"] as const).map((s) => (
          <div key={s} className="flex items-center gap-2 border border-ink-light rounded-lg px-3 py-2">
            <ClipboardCheck size={14} className="text-ink-caption" />
            <span className="text-sm font-bold text-ink">{counts[s] || 0}</span>
            <span className="text-[10.5px] text-ink-caption uppercase tracking-wide">{s.replace("_", " ")}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setSectionFilter("")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${!sectionFilter ? "border-brand-yellow bg-brand-yellow/10 text-ink" : "border-ink-light bg-white text-ink-paragraph"}`}>All sections</button>
        {sections.map((s) => (
          <button key={s} onClick={() => setSectionFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${sectionFilter === s ? "border-brand-yellow bg-brand-yellow/10 text-ink" : "border-ink-light bg-white text-ink-paragraph"}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="bg-white border border-ink-light rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-ink">{i.item}</div>
                <div className="text-[10.5px] text-ink-caption mt-1">{i.section} · {i.sourceDoc}</div>
              </div>
              <select
                value={i.status}
                onChange={(e) => updateItem(i.id, { status: e.target.value as Item["status"] })}
                disabled={savingId === i.id}
                className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border-none outline-none cursor-pointer ${STATUS_STYLE[i.status]}`}
              >
                <option value="NOT_STARTED">NOT STARTED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <input
                className="border border-ink-light rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow"
                placeholder="Owner..."
                value={drafts[i.id]?.owner ?? ""}
                onChange={(e) => setDrafts((p) => ({ ...p, [i.id]: { ...p[i.id], owner: e.target.value } }))}
                onBlur={() => { if ((drafts[i.id]?.owner ?? "") !== (i.owner || "")) updateItem(i.id, { owner: drafts[i.id].owner }); }}
              />
              <input
                className="border border-ink-light rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow"
                placeholder="Notes..."
                value={drafts[i.id]?.notes ?? ""}
                onChange={(e) => setDrafts((p) => ({ ...p, [i.id]: { ...p[i.id], notes: e.target.value } }))}
                onBlur={() => { if ((drafts[i.id]?.notes ?? "") !== (i.notes || "")) updateItem(i.id, { notes: drafts[i.id].notes }); }}
              />
            </div>
            {i.updatedBy && <div className="text-[10px] text-ink-caption mt-2">Last updated by {i.updatedBy}{i.updatedAt ? ` · ${new Date(i.updatedAt).toLocaleString("en-IN")}` : ""}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
