import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { claimCompany } from "./api";
import { Card, Btn } from "./ui";

// Deployment Map 2.5, "the most important placement on this list": before
// a bulk-imported Pre-Listing can be published, the real owner must
// actively confirm the Vendor Agreement and their authority to publish -
// not a silent auto-claim on page load. Blocks the rest of the portal
// until accepted (or the owner leaves without claiming).
export default function ClaimAgreementModal({
  companyName,
  publishedId,
  onClaimed,
}: {
  companyName: string;
  publishedId: string;
  onClaimed: () => void;
}) {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const confirm = async () => {
    if (!accepted) { toast.error("Please confirm the statement below to continue"); return; }
    setSubmitting(true);
    const res = await claimCompany(publishedId, true);
    setSubmitting(false);
    if (res.ok) {
      toast.success("Listing claimed - welcome to your Company Portal");
      onClaimed();
    } else {
      toast.error(res.detail || "Failed to claim this listing");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <ShieldCheck className="w-5 h-5 text-brand-gold" />
          <div className="text-base font-bold text-white">Claim {companyName}</div>
        </div>
        <p className="text-sm text-white/60 mb-4">
          This profile was compiled from public company records before your company joined DroneTV. It has not been published, and DroneTV has not confirmed anything on it. Before you can publish and manage it, please confirm the Vendor and Service Provider Agreement.
        </p>
        <div className="bg-ink border border-white/10 rounded-lg p-4 mb-4 text-xs text-white/50 max-h-40 overflow-y-auto">
          By publishing, you confirm this information is accurate and that you are authorised to publish it on behalf of this company. From the point of publication, you are solely responsible for the accuracy of all information on this profile, whether originally compiled by DroneTV or added by you. Verification credentials (equipment, insurance, DGCA UIN/RPC/UAOP/RPTO where applicable) remain self-declared unless independently checked by DroneTV.
        </div>
        <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5" />
          <span className="text-sm text-white/80">I confirm this information is accurate and that I am authorised to publish it on behalf of this company.</span>
        </label>
        <Btn onClick={confirm} disabled={submitting || !accepted}>{submitting ? "Claiming..." : "Claim & Publish"}</Btn>
      </Card>
    </div>
  );
}
