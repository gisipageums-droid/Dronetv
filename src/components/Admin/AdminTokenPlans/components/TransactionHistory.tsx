import { useState, useEffect } from "react";
import { Search, Download, CheckCircle, XCircle, Clock } from "lucide-react";

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
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://vgrrxo3wu9.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/Transaction-History/All-users-data"
        );
        const data: TransactionResponse = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
    <div className="space-y-6 mt-20">
      <div>
        <h1 className="text-yellow-900 mb-2">Transaction History</h1>
        <p className="text-yellow-700/70">
          View and manage all token purchase transactions
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 backdrop-blur-xl border border-yellow-200/50 p-4 rounded-2xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700/50" />
            <input
              type="text"
              placeholder="Search by email, ID, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-yellow-200/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-yellow-900 placeholder-yellow-700/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-yellow-200/50 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-yellow-900"
          >
            <option value="ALL">All Status</option>
            <option value="CAPTURED">Captured</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl transition-colors font-medium">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-yellow-100/50 border-b border-yellow-200/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-200/50">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-yellow-700/70"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-yellow-700/70"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-yellow-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-yellow-900 font-mono">
                        {transaction.id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-yellow-900">
                          {transaction.userName || "Unknown User"}
                        </span>
                        <span className="text-xs text-yellow-700/70">
                          {transaction.userEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-yellow-800">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      <br />
                      <span className="text-xs text-yellow-700/50">
                        {new Date(transaction.date).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-yellow-900">
                        {transaction.amount} {transaction.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-yellow-800">
                        {transaction.tokenCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          transaction.paymentStatus
                        )}`}
                      >
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
