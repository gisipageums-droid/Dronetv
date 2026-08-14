import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/context";
import { PAYMENT_API, AUTH_API, LAMBDA } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";
import { PageHeader, Card, Badge, KpiRow, KpiCard, EmptyState } from "../ui";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "credit" | "debit";
  paymentStatus: string;
  currency: string;
  tokenCount: number;
}

export default function Invoices() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    axios.get(
      PAYMENT_API ? `${PAYMENT_API}/transactions/${userId}` : `${LAMBDA.transactions}/Transaction-History/${userId}`,
      PAYMENT_API ? { headers: authHeader() } : undefined
    ).then((response) => {
      if (response.data.success) {
        const raw = response.data.transactions || [];
        const mapped: Transaction[] = PAYMENT_API
          ? raw.map((t: any) => ({
              id: t.id, date: t.date, description: t.description, amount: t.amount,
              category: t.service || (t.tokenCount >= 0 ? "Token Purchase" : "Token Usage"),
              type: t.tokenCount >= 0 ? "credit" : "debit",
              paymentStatus: (t.status || "").toUpperCase(),
              currency: t.currency || "INR",
              tokenCount: Math.abs(t.tokenCount || 0),
            }))
          : raw;
        setTransactions(mapped);
      }
    }).catch(() => setTransactions([])).finally(() => setLoading(false));

    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then((r) => setTokenBalance(r.data?.profile?.tokenBalance ?? 0))
      .catch(() => {});
  }, [userId]);

  const totalSpent = transactions.filter((t) => t.type === "debit" || t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalPaid = transactions.filter((t) => t.type === "credit" && t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <PageHeader title="Invoices & Payments" sub="Your billing history and token transactions" />

      <KpiRow>
        <KpiCard label="Token Balance" value={(tokenBalance ?? 0).toLocaleString("en-IN")} accent="yellow" />
        <KpiCard label="Total Paid" value={`₹${totalPaid.toLocaleString("en-IN")}`} accent="green" />
        <KpiCard label="Total Transactions" value={transactions.length} accent="blue" />
      </KpiRow>

      {loading ? (
        <Card className="text-center py-16 text-ink-caption">Loading...</Card>
      ) : transactions.length === 0 ? (
        <Card><EmptyState text="No transactions yet." /></Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-ink-offwhite border-b border-ink-light">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Description</th>
                <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-light">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-ink-offwhite transition-colors">
                  <td className="px-4 py-3 text-ink-caption text-xs whitespace-nowrap">{t.date ? new Date(t.date).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-4 py-3 text-ink min-w-0">{t.description}</td>
                  <td className="px-4 py-3 text-ink-caption text-xs">{t.category}</td>
                  <td className={`px-4 py-3 font-bold text-xs whitespace-nowrap ${t.type === "credit" ? "text-status-success" : "text-status-error"}`}>
                    {t.type === "credit" ? "+" : "-"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={t.paymentStatus === "SUCCESS" || t.paymentStatus === "COMPLETED" ? "success" : t.paymentStatus === "PENDING" ? "warning" : "neutral"}>
                      {t.paymentStatus || "—"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
