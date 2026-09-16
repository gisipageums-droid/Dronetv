import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/context";
import { getMyCompany } from "../api";
import { availableRfqs, Rfq } from "../../../lib/rfqApi";
import { PageHeader, Card, Badge, EmptyState } from "../ui";

const RfqInbox: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedOn, setMatchedOn] = useState<{ category?: string; location?: string }>({});

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const company = await getMyCompany(userId);
        const cat = company?.sectors?.[0];
        const loc = company?.location;
        setMatchedOn({ category: cat, location: loc });
        const rows = await availableRfqs(cat, loc);
        setRfqs(rows);
      } catch { /* leave empty */ }
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  return (
    <div>
      <PageHeader title="RFQ Inbox" sub="Requirements posted by buyers that match your company's category and location" />
      {matchedOn.category && (
        <div className="mb-4 text-xs text-white/40">Matched on: <span className="text-white/70 font-medium">{matchedOn.category}</span>{matchedOn.location ? <> · <span className="text-white/70 font-medium">{matchedOn.location}</span></> : ""}</div>
      )}
      {rfqs.length === 0 ? (
        <Card><EmptyState text="No matching requirements right now - check back later, or make sure your company profile has a category and location set." /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {rfqs.map((r) => (
            <button
              key={r.rfqId}
              onClick={() => navigate(`/company-portal/rfq/${r.rfqId}`)}
              className="text-left bg-ink border border-white/10 rounded-lg p-4 hover:border-brand-yellow/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{r.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{r.category}{r.location ? ` · ${r.location}` : ""}</div>
                </div>
                <Badge tone="info">{r.quoteCount} {r.quoteCount === 1 ? "quote" : "quotes"} so far</Badge>
              </div>
              <p className="text-xs text-white/50 mt-2 line-clamp-2">{r.description}</p>
              {(r.budgetMin || r.budgetMax) && (
                <div className="text-xs text-white/40 mt-2">
                  Budget: {r.budgetMin ? `₹${r.budgetMin.toLocaleString("en-IN")}` : ""}{r.budgetMin && r.budgetMax ? " – " : ""}{r.budgetMax ? `₹${r.budgetMax.toLocaleString("en-IN")}` : ""}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RfqInbox;
