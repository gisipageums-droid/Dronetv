import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { adminListDisputes, adminResolveDispute, Dispute } from "../../lib/rfqApi";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
};

export default function RfqDisputes() {
  const [status, setStatus] = useState<string>("OPEN");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    adminListDisputes(status || undefined)
      .then(setDisputes)
      .catch(() => toast.error("Failed to load disputes"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const resolve = async (disputeId: string) => {
    const note = notes[disputeId]?.trim();
    if (!note) { toast.error("Add a resolution note"); return; }
    setResolvingId(disputeId);
    try {
      await adminResolveDispute(disputeId, note);
      toast.success("Dispute resolved");
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to resolve");
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1000px] mx-auto">
      <h1 className="text-lg sm:text-xl font-bold text-ink mb-1">RFQ Disputes</h1>
      <p className="text-sm text-ink-paragraph mb-5">
        Issues raised by buyers or vendors on awarded RFQ projects. No refund/payment logic here - that stays with the rest of the money layer until Razorpay Route is set up.
      </p>

      <div className="flex gap-2 mb-5">
        {[{ key: "OPEN", label: "Open" }, { key: "RESOLVED", label: "Resolved" }, { key: "", label: "All" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${status === t.key ? "border-brand-yellow bg-brand-yellow/10 text-ink" : "border-ink-light bg-white text-ink-paragraph hover:bg-surface-alt"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-caption">Loading...</div>
      ) : disputes.length === 0 ? (
        <div className="text-center py-16 text-ink-caption border border-dashed border-ink-light rounded-xl">No disputes.</div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.disputeId} className="bg-white border border-ink-light rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-ink">RFQ {d.rfqId}</div>
                    <div className="text-xs text-ink-caption mt-0.5">Raised by {d.raisedByUserId}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap ${STATUS_STYLE[d.status]}`}>{d.status}</span>
              </div>
              <p className="text-sm text-ink-paragraph mt-2">{d.reason}</p>

              {d.status === "RESOLVED" ? (
                <div className="mt-2 text-xs text-ink-caption flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600" /> Resolved by {d.resolvedBy}: {d.adminNotes}
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 border border-ink-light rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow"
                    placeholder="Resolution note..."
                    value={notes[d.disputeId] || ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [d.disputeId]: e.target.value }))}
                  />
                  <button
                    onClick={() => resolve(d.disputeId)}
                    disabled={resolvingId === d.disputeId}
                    className="px-3 py-1.5 bg-brand-yellow text-ink rounded-lg font-semibold text-xs hover:bg-brand-gold transition disabled:opacity-50 whitespace-nowrap"
                  >
                    {resolvingId === d.disputeId ? "Resolving..." : "Mark Resolved"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
