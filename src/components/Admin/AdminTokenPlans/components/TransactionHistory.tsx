import { useState, useEffect } from "react";
import { Search, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { PAYMENT_API, LAMBDA } from '../../../../lib/apiConfig';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  paymentStatus: string;
  currency: string;
  tokenCount: number;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planName: string;
  planId: string;
  period: string;
}

interface TransactionResponse {
  success: boolean;
  source: string;
  table: string;
  count: number;
  transactions: Transaction[];
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const controller = new AbortController();
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          PAYMENT_API ? `${PAYMENT_API}/drontv-token-buy-payment-gateway/Transaction-History/All-users-data` : `${LAMBDA.transactions}/Transaction-History/All-users-data`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: TransactionResponse = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
        }
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    return () => controller.abort();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CAPTURED":
        return "text-status-success bg-status-success/15";
      case "PENDING":
        return "text-brand-gold bg-brand-yellow-soft";
      case "FAILED":
        return "text-status-error bg-status-error/15";
      default:
        return "text-ink-paragraph bg-ink-light";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CAPTURED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const exportCSV = () => {
    if (loading) { toast.warning("Transactions are still loading — please wait a moment and try again."); return; }
    if (filteredTransactions.length === 0) { toast.warning("No transactions to export."); return; }
    const headers = ["ID", "User Name", "Email", "Phone", "Date", "Amount", "Currency", "Tokens", "Plan", "Period", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.userName,
      t.userEmail,
      t.userPhone,
      new Date(t.date).toLocaleString(),
      t.amount,
      t.currency,
      t.tokenCount,
      t.planName,
      t.period,
      t.paymentStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || transaction.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-1">Finance</p>
        <h1 className="text-xl font-extrabold text-ink mb-1">Transaction History</h1>
        <p className="text-sm text-ink-caption">View and manage all token purchase transactions</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-surface-card border border-ink-light p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
            <input
              type="text"
              placeholder="Search by email, ID, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-ink-light text-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink-light text-sm focus:outline-none focus:ring-1 focus:ring-brand-yellow text-ink-paragraph"
          >
            <option value="ALL">All Status</option>
            <option value="CAPTURED">Captured</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button onClick={exportCSV} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-soft text-ink font-bold rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-surface-card border border-ink-light rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-ink-offwhite border-b border-ink-light">
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-caption uppercase tracking-wide">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-caption uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-caption uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-caption uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-caption uppercase tracking-wide">Tokens</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-caption uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-light">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-caption">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-caption">No transactions found</td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-ink-offwhite transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-ink-paragraph">{transaction.id.substring(0, 8)}...</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-ink">{transaction.userName || "Unknown User"}</p>
                      <p className="text-xs text-ink-caption">{transaction.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-ink-paragraph">{new Date(transaction.date).toLocaleDateString()}</p>
                      <p className="text-xs text-ink-caption">{new Date(transaction.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-ink">{transaction.amount} {transaction.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-ink-paragraph">{transaction.tokenCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(transaction.paymentStatus)}`}>
                        {getStatusIcon(transaction.paymentStatus)}
                        {transaction.paymentStatus}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
