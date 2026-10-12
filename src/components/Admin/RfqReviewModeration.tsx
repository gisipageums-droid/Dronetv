import { useEffect, useState } from "react";
import { Flag, Star, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { adminListFlaggedReviews, adminModerateReview, Review } from "../../lib/rfqApi";

// Fixes-doc #9: a vendor flagging a review as false doesn't hide it - only
// an admin upholding the flag here does (excludes it from the vendor's
// rating average). Mirrors RfqDisputes.tsx's layout/pattern.
export default function RfqReviewModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyRfqId, setBusyRfqId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    adminListFlaggedReviews()
      .then(setReviews)
      .catch(() => toast.error("Failed to load flagged reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const moderate = async (rfqId: string, uphold: boolean) => {
    setBusyRfqId(rfqId);
    try {
      await adminModerateReview(rfqId, uphold, notes[rfqId]?.trim() || undefined);
      toast.success(uphold ? "Review removed from vendor's rating" : "Flag dismissed, review stands");
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to moderate");
    } finally {
      setBusyRfqId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1000px] mx-auto">
      <h1 className="text-lg sm:text-xl font-bold text-ink mb-1">Flagged Reviews</h1>
      <p className="text-sm text-ink-paragraph mb-5">
        Reviews a vendor has flagged as false or bad-faith. Upholding a flag excludes it from that vendor's rating average - it does not delete the review or notify the reviewer automatically.
      </p>

      {loading ? (
        <div className="text-center py-16 text-ink-caption">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-ink-caption border border-dashed border-ink-light rounded-xl">No pending flags.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.rfqId} className="bg-white border border-ink-light rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <Flag size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-ink">RFQ {r.rfqId} · {r.revieweeCompanyName || r.revieweeUserId}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-brand-yellow text-brand-yellow" : "text-ink-light"} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap bg-amber-100 text-amber-800">FLAGGED</span>
                  {/* Reviews Policy Section 5 / Advisory Item 17 - 5-working-day SLA */}
                  {r.flaggedAt && (() => {
                    const days = Math.floor((Date.now() - new Date(r.flaggedAt).getTime()) / 86400000);
                    const overdue = days > 5;
                    return <span className={`text-[10px] font-semibold ${overdue ? "text-status-error" : "text-ink-caption"}`}>{days}d since flagged{overdue ? " · overdue (5-day SLA)" : ""}</span>;
                  })()}
                </div>
              </div>

              {r.comment && (
                <div className="mt-2">
                  <div className="text-[10px] font-bold text-ink-caption uppercase tracking-wide">Review</div>
                  <p className="text-sm text-ink-paragraph">{r.comment}</p>
                </div>
              )}
              {r.flagReason && (
                <div className="mt-2">
                  <div className="text-[10px] font-bold text-ink-caption uppercase tracking-wide">Vendor's flag reason</div>
                  <p className="text-sm text-ink-paragraph">{r.flagReason}</p>
                </div>
              )}
              {r.vendorReply && (
                <div className="mt-2">
                  <div className="text-[10px] font-bold text-ink-caption uppercase tracking-wide">Vendor's public reply</div>
                  <p className="text-sm text-ink-paragraph">{r.vendorReply}</p>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 border border-ink-light rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow"
                  placeholder="Moderation note (optional)..."
                  value={notes[r.rfqId] || ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [r.rfqId]: e.target.value }))}
                />
                <button
                  onClick={() => moderate(r.rfqId, true)}
                  disabled={busyRfqId === r.rfqId}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-status-error text-white rounded-lg font-semibold text-xs hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                >
                  <XCircle size={13} /> Uphold - Remove
                </button>
                <button
                  onClick={() => moderate(r.rfqId, false)}
                  disabled={busyRfqId === r.rfqId}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow text-ink rounded-lg font-semibold text-xs hover:bg-brand-gold transition disabled:opacity-50 whitespace-nowrap"
                >
                  <CheckCircle2 size={13} /> Dismiss - Keep
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
