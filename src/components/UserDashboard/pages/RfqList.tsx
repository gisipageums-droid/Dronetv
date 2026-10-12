import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { myRfqs, Rfq } from "../../../lib/rfqApi";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-status-info/15 text-status-info",
  AWARDED: "bg-status-success/15 text-status-success",
  CANCELLED: "bg-white/10 text-white/40",
  CLOSED: "bg-white/10 text-white/40",
};

const RfqList: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const userId = (user as any)?.email || (user as any)?.userData?.email || "";
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    myRfqs(userId).then(setRfqs).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="flex items-center justify-center h-64 text-white/40">Loading...</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ClipboardList size={22} className="text-brand-yellow" /> My Requirements
          </h1>
          <p className="text-sm text-white/40 mt-1">Post a requirement, compare quotes from matched vendors, and award the one you want.</p>
        </div>
        <button
          onClick={() => navigate("/user-rfq/new")}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-yellow text-ink rounded-lg font-semibold text-sm hover:bg-brand-gold transition"
        >
          <Plus size={16} /> Post Requirement
        </button>
      </div>

      {rfqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-white/40 border border-dashed border-white/10 rounded-xl">
          <ClipboardList size={32} className="text-white/20" />
          <p className="text-sm">You haven't posted any requirements yet.</p>
          <button
            onClick={() => navigate("/user-rfq/new")}
            className="px-4 py-2 bg-brand-yellow text-ink rounded-lg font-semibold text-sm hover:bg-brand-gold transition"
          >
            Post your first requirement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {rfqs.map((r) => (
            <button
              key={r.rfqId}
              onClick={() => navigate(`/user-rfq/${r.rfqId}`)}
              className="text-left bg-ink border border-white/8 rounded-xl p-4 hover:border-brand-yellow/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{r.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{r.category}{r.location ? ` · ${r.location}` : ""}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap ${STATUS_STYLE[r.status] || STATUS_STYLE.CLOSED}`}>
                  {r.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                <span>{r.quoteCount} {r.quoteCount === 1 ? "quote" : "quotes"}</span>
                {(r.budgetMin || r.budgetMax) && (
                  <span>Budget: {r.budgetMin ? `₹${r.budgetMin.toLocaleString("en-IN")}` : ""}{r.budgetMin && r.budgetMax ? " – " : ""}{r.budgetMax ? `₹${r.budgetMax.toLocaleString("en-IN")}` : ""}</span>
                )}
                <span>Posted {new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RfqList;
