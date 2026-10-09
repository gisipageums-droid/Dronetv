import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "react-toastify";
import { adminListAllRfqs, Rfq } from "../../lib/rfqApi";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  AWARDED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-ink-light text-ink-paragraph",
  CANCELLED: "bg-rose-100 text-rose-800",
};

function formatBudget(r: Rfq): string {
  if (!r.budgetMin && !r.budgetMax) return "—";
  if (r.budgetMin && r.budgetMax) return `₹${r.budgetMin.toLocaleString("en-IN")} – ₹${r.budgetMax.toLocaleString("en-IN")}`;
  return `₹${(r.budgetMin || r.budgetMax)!.toLocaleString("en-IN")}`;
}

export default function RfqListings() {
  const [status, setStatus] = useState<string>("");
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminListAllRfqs(status || undefined)
      .then((d) => { setRfqs(d.rfqs); setTotal(d.total); })
      .catch(() => toast.error("Failed to load requirements"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  return (
    <div className="p-4 sm:p-6 max-w-[1100px] mx-auto">
      <h1 className="text-lg sm:text-xl font-bold text-ink mb-1">RFQ Requirements</h1>
      <p className="text-sm text-ink-paragraph mb-5">
        Every requirement posted by buyers on DroneTv.in, newest first. Matched vendors see these in their own RFQ inbox.
      </p>

      <div className="flex gap-2 mb-5">
        {[{ key: "", label: "All" }, { key: "OPEN", label: "Open" }, { key: "AWARDED", label: "Awarded" }, { key: "CLOSED", label: "Closed" }, { key: "CANCELLED", label: "Cancelled" }].map((t) => (
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
        <p className="text-sm text-ink-paragraph">Loading...</p>
      ) : rfqs.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-ink-light rounded-lg">
          <ClipboardList className="w-8 h-8 mx-auto mb-2 text-ink-caption" />
          <p className="text-sm text-ink-paragraph">No requirements found.</p>
        </div>
      ) : (
        <div className="border border-ink-light rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-paragraph">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Requirement</th>
                <th className="text-left px-4 py-2.5 font-semibold">Category</th>
                <th className="text-left px-4 py-2.5 font-semibold">Buyer</th>
                <th className="text-left px-4 py-2.5 font-semibold">Budget</th>
                <th className="text-left px-4 py-2.5 font-semibold">Quotes</th>
                <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold">Posted</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((r) => (
                <tr key={r.rfqId} className="border-t border-ink-light">
                  <td className="px-4 py-2.5 font-medium text-ink">{r.title}</td>
                  <td className="px-4 py-2.5 text-ink-paragraph">{r.category}</td>
                  <td className="px-4 py-2.5 text-ink-paragraph">{r.buyerUserId}</td>
                  <td className="px-4 py-2.5 text-ink-paragraph">{formatBudget(r)}</td>
                  <td className="px-4 py-2.5 text-ink-paragraph">{r.quoteCount}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_STYLE[r.status] || "bg-ink-light text-ink-paragraph"}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-paragraph whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > rfqs.length && (
        <p className="mt-3 text-xs text-ink-caption">Showing {rfqs.length} of {total}.</p>
      )}
    </div>
  );
}
