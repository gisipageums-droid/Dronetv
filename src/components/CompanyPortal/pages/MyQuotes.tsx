import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/context";
import { myQuotes, Quote } from "../../../lib/rfqApi";
import { PageHeader, Card, Badge, EmptyState } from "../ui";

const STATUS_TONE: Record<string, "info" | "success" | "neutral"> = {
  SUBMITTED: "info",
  AWARDED: "success",
  REJECTED: "neutral",
  WITHDRAWN: "neutral",
};

const MyQuotes: React.FC = () => {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    myQuotes(userId).then(setQuotes).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  return (
    <div>
      <PageHeader title="My Quotes" sub="Quotes you've submitted against buyer requirements" />
      {quotes.length === 0 ? (
        <Card><EmptyState text="You haven't submitted any quotes yet - check the RFQ Inbox for matching requirements." /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {quotes.map((q) => (
            <div key={q.quoteId} className="bg-ink border border-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-bold text-white">₹{q.priceAmount.toLocaleString("en-IN")}</div>
                <Badge tone={STATUS_TONE[q.status] || "neutral"}>{q.status}</Badge>
              </div>
              {q.deliveryDays && <div className="text-xs text-white/40 mt-1">{q.deliveryDays} day delivery</div>}
              {q.notes && <p className="text-xs text-white/50 mt-2 line-clamp-2">{q.notes}</p>}
              <div className="text-[11px] text-white/30 mt-2">Submitted {new Date(q.createdAt).toLocaleDateString("en-IN")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuotes;
