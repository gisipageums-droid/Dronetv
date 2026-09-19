import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Ban, Loader2, CheckCircle2, Truck, Star, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import {
  getRfq, rfqQuotes, awardQuote, cancelRfq, confirmCompleted, getReview, submitReview,
  raiseDispute, listDisputes, Rfq, Quote, Review, Dispute,
} from "../../../lib/rfqApi";

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-status-info/15 text-status-info",
  AWARDED: "bg-status-success/15 text-status-success",
  CANCELLED: "bg-white/10 text-white/40",
  CLOSED: "bg-white/10 text-white/40",
};

const DELIVERY_LABEL: Record<string, string> = {
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered - awaiting your confirmation",
  COMPLETED: "Completed",
};

const RfqDetail: React.FC = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [review, setReview] = useState<Review | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyQuoteId, setBusyQuoteId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const load = () => {
    if (!rfqId) return;
    Promise.all([getRfq(rfqId), rfqQuotes(rfqId)])
      .then(([r, q]) => {
        setRfq(r);
        setQuotes(q);
        if (r.status === "AWARDED") {
          listDisputes(rfqId).then(setDisputes).catch(() => {});
          if (r.deliveryStatus === "COMPLETED") getReview(rfqId).then(setReview).catch(() => {});
        }
      })
      .catch(() => toast.error("Could not load this requirement"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [rfqId]);

  const handleAward = async (quoteId: string) => {
    if (!rfqId) return;
    if (!confirm("Award this quote? All other quotes on this requirement will be rejected.")) return;
    setBusyQuoteId(quoteId);
    try {
      const updated = await awardQuote(rfqId, quoteId);
      setRfq(updated);
      toast.success("Quote awarded");
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to award quote");
    } finally {
      setBusyQuoteId(null);
    }
  };

  const handleCancel = async () => {
    if (!rfqId) return;
    if (!confirm("Cancel this requirement? Vendors won't be able to quote on it anymore.")) return;
    setCancelling(true);
    try {
      const updated = await cancelRfq(rfqId);
      setRfq(updated);
      toast.success("Requirement cancelled");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmCompleted = async () => {
    if (!rfqId) return;
    setConfirming(true);
    try {
      const updated = await confirmCompleted(rfqId);
      setRfq(updated);
      toast.success("Marked as completed");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to confirm");
    } finally {
      setConfirming(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rfqId) return;
    if (rating < 1) { toast.error("Pick a star rating"); return; }
    setSubmittingReview(true);
    try {
      const r = await submitReview(rfqId, rfq!.buyerUserId, rating, comment.trim() || undefined);
      setReview(r);
      toast.success("Review submitted");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!rfqId || !rfq) return;
    if (!disputeReason.trim()) { toast.error("Describe the issue"); return; }
    setSubmittingDispute(true);
    try {
      const d = await raiseDispute(rfqId, rfq.buyerUserId, disputeReason.trim());
      setDisputes((prev) => [d, ...prev]);
      setDisputeReason("");
      setShowDisputeForm(false);
      toast.success("Dispute raised - our team will review it");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to raise dispute");
    } finally {
      setSubmittingDispute(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-white/40">Loading...</div>;
  if (!rfq) return <div className="p-6 text-white/40">Requirement not found.</div>;

  const sortedQuotes = [...quotes].sort((a, b) => a.priceAmount - b.priceAmount);
  const lowestPrice = sortedQuotes[0]?.priceAmount;

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <button onClick={() => navigate("/user-rfq")} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white mb-4">
        <ArrowLeft size={14} /> Back to My Requirements
      </button>

      <div className="flex items-start justify-between gap-3 mb-1">
        <h1 className="text-xl font-black text-white">{rfq.title}</h1>
        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap ${STATUS_STYLE[rfq.status]}`}>{rfq.status}</span>
      </div>
      <div className="text-xs text-white/40 mb-4">{rfq.category}{rfq.location ? ` · ${rfq.location}` : ""} · Posted {new Date(rfq.createdAt).toLocaleDateString("en-IN")}</div>

      <div className="bg-ink border border-white/8 rounded-xl p-4 mb-6">
        <p className="text-sm text-white/70 whitespace-pre-wrap">{rfq.description}</p>
        {(rfq.budgetMin || rfq.budgetMax) && (
          <div className="text-xs text-white/50 mt-3">
            Budget: {rfq.budgetMin ? `₹${rfq.budgetMin.toLocaleString("en-IN")}` : ""}{rfq.budgetMin && rfq.budgetMax ? " – " : ""}{rfq.budgetMax ? `₹${rfq.budgetMax.toLocaleString("en-IN")}` : ""}
          </div>
        )}
        {rfq.status === "OPEN" && (
          <button onClick={handleCancel} disabled={cancelling}
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-status-error hover:underline disabled:opacity-50">
            <Ban size={13} /> {cancelling ? "Cancelling..." : "Cancel this requirement"}
          </button>
        )}
      </div>

      {/* Post-award project status - no money involved, just tracking */}
      {rfq.status === "AWARDED" && rfq.deliveryStatus && (
        <div className="bg-ink border border-white/8 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Truck size={15} className="text-brand-yellow" /> Project Status
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap ${
              rfq.deliveryStatus === "COMPLETED" ? "bg-status-success/15 text-status-success" : "bg-status-info/15 text-status-info"
            }`}>{DELIVERY_LABEL[rfq.deliveryStatus]}</span>
          </div>

          {rfq.deliveryStatus === "DELIVERED" && (
            <button onClick={handleConfirmCompleted} disabled={confirming}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow text-ink rounded-lg font-semibold text-xs hover:bg-brand-gold transition disabled:opacity-50">
              {confirming ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              Confirm delivery received
            </button>
          )}

          {rfq.deliveryStatus === "COMPLETED" && (
            <div className="mt-3">
              {review ? (
                <div className="text-xs text-white/50">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < review.rating ? "fill-brand-yellow text-brand-yellow" : "text-white/15"} />
                    ))}
                  </div>
                  {review.comment && <p>{review.comment}</p>}
                  {/* Fixes-doc #9 - the vendor's right-of-reply is visible to
                      the buyer too, same as any public review thread. */}
                  {review.vendorReply && (
                    <div className="mt-2 pl-3 border-l-2 border-white/10">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-wide mb-0.5">Vendor's reply</div>
                      <p>{review.vendorReply}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  <div className="text-xs font-bold text-white/50 uppercase tracking-wide mb-1.5">Rate this vendor</div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} onClick={() => setRating(i + 1)}>
                        <Star size={20} className={i < rating ? "fill-brand-yellow text-brand-yellow" : "text-white/20"} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition"
                    rows={2} value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="How was your experience? (optional)" />
                  <button onClick={handleSubmitReview} disabled={submittingReview}
                    className="mt-2 px-3 py-1.5 bg-brand-yellow text-ink rounded-lg font-semibold text-xs hover:bg-brand-gold transition disabled:opacity-50">
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/10">
            {disputes.length > 0 && (
              <div className="mb-2 space-y-1.5">
                {disputes.map((d) => (
                  <div key={d.disputeId} className="text-xs flex items-start gap-1.5">
                    <AlertTriangle size={12} className={d.status === "OPEN" ? "text-status-warning mt-0.5" : "text-white/30 mt-0.5"} />
                    <div>
                      <span className="text-white/60">{d.reason}</span>
                      <span className={`ml-1.5 font-bold ${d.status === "OPEN" ? "text-status-warning" : "text-status-success"}`}>· {d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showDisputeForm ? (
              <div>
                <textarea
                  className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition"
                  rows={2} value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe the issue..." />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleRaiseDispute} disabled={submittingDispute}
                    className="px-3 py-1.5 bg-status-error/15 text-status-error rounded-lg font-semibold text-xs hover:bg-status-error/25 transition disabled:opacity-50">
                    {submittingDispute ? "Submitting..." : "Submit Dispute"}
                  </button>
                  <button onClick={() => setShowDisputeForm(false)} className="px-3 py-1.5 text-xs text-white/40 hover:text-white">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDisputeForm(true)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-status-error transition">
                <AlertTriangle size={12} /> Report an issue with this project
              </button>
            )}
          </div>
        </div>
      )}

      <h2 className="text-sm font-bold text-white mb-3">
        Quotes ({quotes.length})
        {rfq.status === "OPEN" && quotes.length > 0 && <span className="text-white/30 font-normal ml-2">- pick one to award</span>}
      </h2>

      {quotes.length === 0 ? (
        <div className="text-sm text-white/40 border border-dashed border-white/10 rounded-xl py-10 text-center">
          No quotes yet - matched vendors will see this in their RFQ inbox.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedQuotes.map((q) => (
            <div key={q.quoteId}
              className={`bg-ink border rounded-xl p-4 ${q.status === "AWARDED" ? "border-status-success/50" : "border-white/8"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{q.vendorCompanyName || "Vendor"}</div>
                  <div className="text-xs text-white/40 mt-0.5">
                    ₹{q.priceAmount.toLocaleString("en-IN")}
                    {q.priceAmount === lowestPrice && quotes.length > 1 && <span className="text-status-success ml-1.5">· lowest</span>}
                    {q.deliveryDays ? ` · ${q.deliveryDays} day delivery` : ""}
                  </div>
                  {/* Fixes-doc #3/#19 - documentation completeness + availability,
                      so this is visible at a glance without opening the vendor's
                      profile separately. Absent (not fetchable / vendor hasn't
                      filled anything in) just shows nothing, not a fake 0%. */}
                  {(q.vendorDocumentation || q.vendorCapacityStatus) && (
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {q.vendorDocumentation && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                          {q.vendorDocumentation.score}% documented
                        </span>
                      )}
                      {q.vendorCapacityStatus === "AVAILABLE" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">Available</span>
                      )}
                      {q.vendorCapacityStatus === "LIMITED" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-yellow/10 text-brand-yellow">Limited capacity</span>
                      )}
                      {q.vendorCapacityStatus === "UNAVAILABLE" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-status-error/10 text-status-error">Not taking new work</span>
                      )}
                    </div>
                  )}
                </div>
                {q.status === "AWARDED" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-status-success/15 text-status-success flex items-center gap-1 whitespace-nowrap">
                    <Award size={11} /> Awarded
                  </span>
                )}
                {q.status === "REJECTED" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white/10 text-white/30 whitespace-nowrap">Not selected</span>
                )}
              </div>
              {q.notes && <p className="text-xs text-white/60 mt-2 whitespace-pre-wrap">{q.notes}</p>}
              {rfq.status === "OPEN" && q.status === "SUBMITTED" && (
                <button
                  onClick={() => handleAward(q.quoteId)}
                  disabled={busyQuoteId === q.quoteId}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-yellow text-ink rounded-lg font-semibold text-xs hover:bg-brand-gold transition disabled:opacity-50"
                >
                  {busyQuoteId === q.quoteId ? <Loader2 size={13} className="animate-spin" /> : <Award size={13} />}
                  Award this quote
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RfqDetail;
