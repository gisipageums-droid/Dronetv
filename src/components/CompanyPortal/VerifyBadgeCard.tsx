import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { COMPANY_API, PAYMENT_API } from "../../lib/apiConfig";
import { authHeaders } from "./api";
import { Card, Btn } from "./ui";

const FEE = 499;

interface VerifyStatus {
  badgeStatus: string;
  verificationFeePaid: boolean;
  readyToPay: boolean;
  missingLabels: string[];
}

export default function VerifyBadgeCard({
  publishedId,
  onVerified,
}: {
  publishedId: string;
  onVerified?: () => void;
}) {
  const { Razorpay } = useRazorpay();
  const [status, setStatus] = useState<VerifyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    if (!COMPANY_API || !publishedId) { setLoading(false); return; }
    axios.get(`${COMPANY_API}/${publishedId}/self-verify/status`, { headers: authHeaders() })
      .then((r) => setStatus(r.data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, [publishedId]);

  if (loading || !status) return null;
  // Once the badge is live — via this flow or the admin-reviewed path —
  // this card's job is done. Never show it again.
  if (status.badgeStatus === "SILVER") return null;

  const handlePay = async () => {
    if (!PAYMENT_API) return;
    setPaying(true);
    setError("");
    try {
      const placeRes = await axios.post(
        `${PAYMENT_API}/company-verification/place-order`,
        { publishedId },
        { headers: authHeaders() }
      );
      const { transactionId, razorpayOrderId, key, order } = placeRes.data.data;

      const options: RazorpayOrderOptions = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: "DroneTv.in",
        description: "Verified Badge",
        image: "https://www.dronetv.in/images/Drone%20tv%20.in.png",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axios.post(
              `${PAYMENT_API}/company-verification/confirm-order`,
              {
                transactionId,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              },
              { headers: authHeaders() }
            );
            load();
            onVerified?.();
          } catch (e: any) {
            setError(e.response?.data?.detail?.message || e.response?.data?.detail || "Payment confirmed but activation failed. Contact support.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {},
        theme: { color: "#F8C400" },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rp = new Razorpay(options);
      rp.on("payment.failed", (r: any) => {
        setError(r?.error?.description || "Payment failed");
        setPaying(false);
      });
      rp.open();
    } catch (e: any) {
      setError(e.response?.data?.detail?.message || e.response?.data?.detail || "Could not start payment");
      setPaying(false);
    }
  };

  return (
    <Card className="mb-5 border-brand-yellow/30">
      <div className="p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-brand-yellow" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white">Get your Verified Badge</div>
          {status.readyToPay ? (
            <>
              <p className="text-xs text-white/50 mt-1">
                Your company details are complete. Pay ₹{FEE} to activate the Verified Badge on your listing and dashboard.
              </p>
              <Btn size="sm" className="mt-3" disabled={paying} onClick={handlePay}>
                {paying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {paying ? "Processing..." : `Pay ₹${FEE} & Verify`}
              </Btn>
            </>
          ) : (
            <>
              <p className="text-xs text-white/50 mt-1 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-status-warning flex-shrink-0 mt-0.5" />
                Complete these fields on your Company Profile before you can pay to verify: {status.missingLabels.join(", ")}.
              </p>
            </>
          )}
          {error && <p className="text-xs text-status-error mt-2">{error}</p>}
        </div>
      </div>
    </Card>
  );
}
