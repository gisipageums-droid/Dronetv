import { useState, useEffect } from "react";
import { Search, Download, CheckCircle, XCircle, Clock } from "lucide-react";
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
          PAYMENT_API ? `${PAYMENT_API}/drontv-token-buy-payment-gateway/Transaction-History/All-users-data` : `${LAMBDA.transactions}/drontv-token-buy-payment-gateway/Transaction-History/All-users-data`,
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
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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
        <p className="text-xs font-bold tracking-widest text-yellow-500 uppercase mb-1">Finance</p>
        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Transaction History</h1>
        <p className="text-sm text-gray-500">View and manage all token purchase transactions</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, ID, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 text-gray-700"
          >
            <option value="ALL">All Status</option>
            <option value="CAPTURED">Captured</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg transition-colors text-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Tokens</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No transactions found</td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-600">{transaction.id.substring(0, 8)}...</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900">{transaction.userName || "Unknown User"}</p>
                      <p className="text-xs text-gray-500">{transaction.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700">{new Date(transaction.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-gray-900">{transaction.amount} {transaction.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{transaction.tokenCount}</span>
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
