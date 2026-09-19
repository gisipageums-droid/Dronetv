import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Truck, Loader2, AlertTriangle, Star, Flag } from "lucide-react";
import { useUserAuth } from "../../context/context";
import {
  vendorAwardedProjects, markDelivered, raiseDispute, listDisputes,
  getReview, flagReview, replyToReview, Rfq, Dispute, Review,
} from "../../../lib/rfqApi";
import { PageHeader, Card, Badge, Btn, EmptyState } from "../ui";

// Fixes-doc #9: verified-transaction-only review, with a flag ("this is
// false") and a right-of-reply, so one bad-faith review can't sit
// unchallenged. Flagging never hides the review itself - only an admin
// upholding the flag does (see the admin Flagged Reviews queue).
const ReviewSection: React.FC<{ rfqId: string; userId: string }> = ({ rfqId, userId }) => {
  const [review, setReview] = useState<Review | null | undefined>(undefined);
  const [flagging, setFlagging] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getReview(rfqId).then(setReview).catch(() => setReview(null));
  }, [rfqId]);

  if (review === undefined || review === null) return null;

  const submitFlag = async () => {
    if (!flagReason.trim()) { toast.error("Explain why this review is false"); return; }
    setBusy(true);
    try {
      const r = await flagReview(rfqId, userId, flagReason.trim());
      setReview(r);
      setFlagging(false);
      setFlagReason("");
      toast.success("Flagged for admin review");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to flag review");
    } finally {
      setBusy(false);
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      const r = await replyToReview(rfqId, userId, replyText.trim());
      setReview(r);
      setReplying(false);
      setReplyText("");
      toast.success("Reply posted");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to post reply");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <div className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-1.5">Customer Review</div>
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} className={i < review.rating ? "fill-brand-yellow text-brand-yellow" : "text-white/15"} />
        ))}
        {review.flagStatus === "FLAGGED" && <Badge tone="warning">Flag pending review</Badge>}
        {review.flagStatus === "UPHELD" && <Badge tone="success">Removed by admin</Badge>}
        {review.flagStatus === "DISMISSED" && <Badge tone="neutral">Flag dismissed</Badge>}
      </div>
      {review.comment && <p className="text-xs text-white/60 mb-2">{review.comment}</p>}

      {review.vendorReply ? (
        <div className="pl-3 border-l-2 border-white/10 mb-2">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-wide mb-0.5">Your reply</div>
          <p className="text-xs text-white/60">{review.vendorReply}</p>
        </div>
      ) : replying ? (
        <div className="mb-2">
          <textarea
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition"
            rows={2} value={replyText} onChange={(e) => setReplyText(e.target.value)}
            placeholder="Respond to this review..." />
          <div className="flex gap-2 mt-2">
            <Btn size="sm" disabled={busy} onClick={submitReply}>{busy ? "Posting..." : "Post Reply"}</Btn>
            <button onClick={() => setReplying(false)} className="px-3 py-1.5 text-xs text-white/40 hover:text-white">Cancel</button>
          </div>
        </div>
      ) : null}

      {review.flagStatus === "FLAGGED" ? null : flagging ? (
        <div>
          <textarea
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition"
            rows={2} value={flagReason} onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Why is this review false or bad-faith?" />
          <div className="flex gap-2 mt-2">
            <Btn size="sm" variant="danger" disabled={busy} onClick={submitFlag}>{busy ? "Submitting..." : "Submit Flag"}</Btn>
            <button onClick={() => setFlagging(false)} className="px-3 py-1.5 text-xs text-white/40 hover:text-white">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {!review.vendorReply && (
            <button onClick={() => setReplying(true)} className="text-xs text-white/40 hover:text-white transition">Reply</button>
          )}
          {review.flagStatus !== "UPHELD" && review.flagStatus !== "DISMISSED" && (
            <button onClick={() => setFlagging(true)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-status-error transition">
              <Flag size={12} /> Flag as false
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const DELIVERY_LABEL: Record<string, string> = {
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered - awaiting buyer confirmation",
  COMPLETED: "Completed",
};

const MyProjects: React.FC = () => {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [projects, setProjects] = useState<Rfq[]>([]);
  const [disputesByRfq, setDisputesByRfq] = useState<Record<string, Dispute[]>>({});
  const [loading, setLoading] = useState(true);
  const [busyRfqId, setBusyRfqId] = useState<string | null>(null);
  const [disputeFormFor, setDisputeFormFor] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  const load = () => {
    if (!userId) { setLoading(false); return; }
    vendorAwardedProjects(userId)
      .then(async (rows) => {
        setProjects(rows);
        const entries = await Promise.all(rows.map(async (r) => [r.rfqId, await listDisputes(r.rfqId).catch(() => [])] as const));
        setDisputesByRfq(Object.fromEntries(entries));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [userId]);

  const handleMarkDelivered = async (rfqId: string) => {
    setBusyRfqId(rfqId);
    try {
      const updated = await markDelivered(rfqId);
      setProjects((prev) => prev.map((p) => (p.rfqId === rfqId ? updated : p)));
      toast.success("Marked as delivered - waiting for buyer to confirm");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to update");
    } finally {
      setBusyRfqId(null);
    }
  };

  const handleRaiseDispute = async (rfqId: string) => {
    if (!disputeReason.trim()) { toast.error("Describe the issue"); return; }
    setBusyRfqId(rfqId);
    try {
      const d = await raiseDispute(rfqId, userId, disputeReason.trim());
      setDisputesByRfq((prev) => ({ ...prev, [rfqId]: [d, ...(prev[rfqId] || [])] }));
      setDisputeReason("");
      setDisputeFormFor(null);
      toast.success("Dispute raised - our team will review it");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to raise dispute");
    } finally {
      setBusyRfqId(null);
    }
  };

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  return (
    <div>
      <PageHeader title="My Projects" sub="Requirements you've been awarded - track delivery here" />
      {projects.length === 0 ? (
        <Card><EmptyState text="No awarded projects yet - check the RFQ Inbox and submit quotes to win one." /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.map((p) => (
            <Card key={p.rfqId}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{p.title}</div>
                    <div className="text-xs text-white/40 mt-0.5">{p.category}{p.location ? ` · ${p.location}` : ""}</div>
                  </div>
                  <Badge tone={p.deliveryStatus === "COMPLETED" ? "success" : "info"}>
                    {p.deliveryStatus ? DELIVERY_LABEL[p.deliveryStatus] : "—"}
                  </Badge>
                </div>

                {p.deliveryStatus === "IN_PROGRESS" && (
                  <Btn size="sm" className="mt-3" disabled={busyRfqId === p.rfqId} onClick={() => handleMarkDelivered(p.rfqId)}>
                    {busyRfqId === p.rfqId ? <Loader2 size={13} className="animate-spin" /> : <Truck size={13} />}
                    Mark as Delivered
                  </Btn>
                )}

                {p.deliveryStatus === "COMPLETED" && <ReviewSection rfqId={p.rfqId} userId={userId} />}

                {(disputesByRfq[p.rfqId] || []).length > 0 && (
                  <div className="mt-3 space-y-1">
                    {disputesByRfq[p.rfqId].map((d) => (
                      <div key={d.disputeId} className="text-xs flex items-start gap-1.5">
                        <AlertTriangle size={12} className={d.status === "OPEN" ? "text-status-warning mt-0.5" : "text-white/30 mt-0.5"} />
                        <span className="text-white/60">{d.reason}<span className={`ml-1.5 font-bold ${d.status === "OPEN" ? "text-status-warning" : "text-status-success"}`}>· {d.status}</span></span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-white/10">
                  {disputeFormFor === p.rfqId ? (
                    <div>
                      <textarea
                        className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition"
                        rows={2} value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)}
                        placeholder="Describe the issue..." />
                      <div className="flex gap-2 mt-2">
                        <Btn size="sm" variant="danger" disabled={busyRfqId === p.rfqId} onClick={() => handleRaiseDispute(p.rfqId)}>
                          {busyRfqId === p.rfqId ? "Submitting..." : "Submit Dispute"}
                        </Btn>
                        <button onClick={() => setDisputeFormFor(null)} className="px-3 py-1.5 text-xs text-white/40 hover:text-white">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setDisputeFormFor(p.rfqId)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-status-error transition">
                      <AlertTriangle size={12} /> Report an issue with this project
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
