import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";
import { createRfq } from "../../../lib/rfqApi";

const CATEGORIES = ["Drone", "AI", "GIS", "Robotics", "Business Support"];

const inputCls = "w-full bg-ink border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-yellow transition";
const labelCls = "block text-xs font-bold text-white/50 uppercase tracking-wide mb-1.5";

const RfqNew: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const userId = (user as any)?.email || (user as any)?.userData?.email || "";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim()) { toast.error("Give your requirement a title"); return; }
    if (!description.trim()) { toast.error("Describe what you need"); return; }
    setSubmitting(true);
    try {
      const rfq = await createRfq(userId, {
        title: title.trim(),
        category,
        description: description.trim(),
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        location: location.trim() || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });
      toast.success("Requirement posted - matched vendors can now quote");
      navigate(`/user-rfq/${rfq.rfqId}`);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to post requirement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <button onClick={() => navigate("/user-rfq")} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white mb-4">
        <ArrowLeft size={14} /> Back to My Requirements
      </button>
      <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
        <ClipboardList size={22} className="text-brand-yellow" /> Post a Requirement
      </h1>
      <p className="text-sm text-white/40 mb-6">Tell us what you need - matched vendors in the right category and location will see this and can quote.</p>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>What do you need? *</label>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Drone survey for a 200-acre solar site" />
        </div>

        <div>
          <label className={labelCls}>Category *</label>
          <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Describe your requirement *</label>
          <textarea className={inputCls} rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Location and scope, equipment needed (e.g. RGB / thermal), deliverables you expect, and anything else a vendor needs to quote accurately." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Budget min (₹)</label>
            <input className={inputCls} type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className={labelCls}>Budget max (₹)</label>
            <input className={inputCls} type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Location</label>
            <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Telangana" />
          </div>
          <div>
            <label className={labelCls}>Needed by</label>
            <input className={inputCls} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full mt-2 px-4 py-3 bg-brand-yellow text-ink rounded-lg font-bold text-sm hover:bg-brand-gold transition disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Requirement"}
        </button>
      </div>
    </div>
  );
};

export default RfqNew;
