import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyCompany } from "../api";
import { getRfq, submitQuote, Rfq } from "../../../lib/rfqApi";
import { PageHeader, Card, Badge, Btn } from "../ui";

const inputCls = "w-full bg-ink border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-wide mb-1.5";

const RfqRespond: React.FC = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";

  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!rfqId || !userId) { setLoading(false); return; }
    Promise.all([getRfq(rfqId), getMyCompany(userId)])
      .then(([r, c]) => { setRfq(r); setCompany(c); })
      .catch(() => toast.error("Could not load this requirement"))
      .finally(() => setLoading(false));
  }, [rfqId, userId]);

  const submit = async () => {
    if (!rfqId) return;
    const amount = Number(price);
    if (!amount || amount <= 0) { toast.error("Enter a valid price"); return; }
    setSubmitting(true);
    try {
      await submitQuote(rfqId, userId, {
        vendorPublishedId: company?.publishedId,
        vendorCompanyName: company?.companyName,
        priceAmount: amount,
        deliveryDays: deliveryDays ? Number(deliveryDays) : undefined,
        notes: notes.trim() || undefined,
      });
      toast.success("Quote submitted");
      setSubmitted(true);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to submit quote");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!rfq) return <Card className="text-center py-16 text-white/40">Requirement not found.</Card>;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate("/company-portal/rfq")} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white mb-4">
        <ArrowLeft size={14} /> Back to RFQ Inbox
      </button>
      <PageHeader title={rfq.title} sub={`${rfq.category}${rfq.location ? " · " + rfq.location : ""}`} />

      <Card className="mb-5">
        <div className="p-4">
          <p className="text-sm text-white/70 whitespace-pre-wrap">{rfq.description}</p>
          {(rfq.budgetMin || rfq.budgetMax) && (
            <div className="text-xs text-white/40 mt-3">
              Buyer's budget: {rfq.budgetMin ? `₹${rfq.budgetMin.toLocaleString("en-IN")}` : ""}{rfq.budgetMin && rfq.budgetMax ? " – " : ""}{rfq.budgetMax ? `₹${rfq.budgetMax.toLocaleString("en-IN")}` : ""}
            </div>
          )}
          <div className="mt-3"><Badge tone={rfq.status === "OPEN" ? "info" : "neutral"}>{rfq.status}</Badge></div>
        </div>
      </Card>

      {rfq.status !== "OPEN" ? (
        <Card><div className="p-6 text-center text-sm text-white/40">This requirement is no longer accepting quotes.</div></Card>
      ) : submitted ? (
        <Card><div className="p-6 text-center text-sm text-status-success">Your quote has been submitted. The buyer will review it and may award it.</div></Card>
      ) : (
        <Card>
          <div className="p-4 space-y-4">
            <div className="text-sm font-bold text-white">Submit your quote</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Your price (₹) *</label>
                <input className={inputCls} type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Delivery (days)</label>
                <input className={inputCls} type="number" min={1} value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Notes for the buyer</label>
              <textarea className={inputCls} rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Equipment you'll use, your approach, why you're a good fit..." />
            </div>
            <Btn onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Quote"}</Btn>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RfqRespond;
