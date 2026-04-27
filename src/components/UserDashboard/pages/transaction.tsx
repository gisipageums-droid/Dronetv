import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useUserAuth } from "../../context/context";

// Define transaction type - updated to match API response
interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'credit' | 'debit';
    paymentStatus?: string;
    currency?: string;
    tokenCount?: number;
    userId?: string;
}

interface ApiResponse {
    success: boolean;
    source: string;
    table: string;
    count: number;
    transactions: Transaction[];
}

const TransactionHistory: React.FC = () => {
    const { user } = useUserAuth();

    // State management
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [transactionHistoryData, setTransactionHistoryData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = user?.userData?.email;

    // Fetch transaction history from API
    const transactionHistory = async () => {
        if (!userId) {
            setError("User not found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `https://vgrrxo3wu9.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/Transaction-History/${userId}`
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                setTransactionHistoryData(response.data);
                setTransactions(response.data.transactions || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch transactions');
            }
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            setError('Failed to load transactions. Showing demo data.');

            // Fallback to mock data
            const mockTransactions: Transaction[] = [
                {
                    id: "67eb97910589f0b6e99bccc962728db3",
                    date: "2025-11-24T05:21:39.267Z",
                    description: "Token Purchase - 500 tokens (475 INR)",
                    amount: 500,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 500,
                    userId: "example2@gmail.com"
                },
                {
                    id: "774231324d576de675670648ec1ead3a",
                    date: "2025-11-22T17:38:12.028Z",
                    description: "Token Purchase - 2500 tokens (2400 INR)",
                    amount: 2500,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "CAPTURED",
                    currency: "INR",
                    tokenCount: 2500,
                    userId: "example2@gmail.com"
                },
                {
                    id: "b41c2435438d17bdf40c6e209c27f86b",
                    date: "2025-11-22T17:37:51.367Z",
                    description: "Token Purchase - 2500 tokens (2400 INR)",
                    amount: 2500,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 2500,
                    userId: "example2@gmail.com"
                },
                {
                    id: "574d88d38d702471750f51d99b7a3c76",
                    date: "2025-11-22T17:34:21.231Z",
                    description: "Token Purchase - 100 tokens (5000 INR)",
                    amount: 100,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 100,
                    userId: "example2@gmail.com"
                },
                {
                    id: "9ed02273f280f09f1b635a17e9ff5ca1",
                    date: "2025-11-22T15:16:59.748Z",
                    description: "Token Purchase - 2092 tokens (20923 INR)",
                    amount: 2092,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 2092,
                    userId: "example999@gmail.com"
                },
                {
                    id: "1c2d805234659e263a65c15525acd815",
                    date: "2025-11-22T15:16:12.050Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example999@gmail.com"
                },
                {
                    id: "90ff7d54f94ed8e837b4eb39f8d7263e",
                    date: "2025-11-22T14:47:03.452Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example999@gmail.com"
                },
                {
                    id: "c2dc1e76a2d222cd2ad9ebbbb53ab8ac",
                    date: "2025-11-21T06:10:59.677Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example2@gmail.com"
                },
                {
                    id: "dca900cdf0b82c4d599134bd93f2c99e",
                    date: "2025-11-21T06:09:28.014Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "CAPTURED",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example2@gmail.com"
                },
                {
                    id: "f50eb5b91a4b232f03b91e6d62ae05e3",
                    date: "2025-11-21T05:31:58.118Z",
                    description: "Token Purchase - 1 tokens (10 INR)",
                    amount: 1,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 1,
                    userId: "example999@gmail.com"
                },
                {
                    id: "2a36895346571dfbfe0fd2fec71ca3f5",
                    date: "2025-11-21T05:31:29.903Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example999@gmail.com"
                },
                {
                    id: "eae7f2ce07081419fec78cc51ad4b517",
                    date: "2025-11-20T17:44:16.806Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example999@gmail.com"
                },
                {
                    id: "c094898ae27a692014086d95ed9d94de",
                    date: "2025-11-20T15:45:27.920Z",
                    description: "Token Purchase - 851 tokens (8510 INR)",
                    amount: 851,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 851,
                    userId: "example999@gmail.com"
                },
                {
                    id: "1315032a4c893843fdb6076eba0f81b2",
                    date: "2025-11-20T15:43:56.072Z",
                    description: "Token Purchase - 177 tokens (1772 INR)",
                    amount: 177,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "CAPTURED",
                    currency: "INR",
                    tokenCount: 177,
                    userId: "example999@gmail.com"
                },
                {
                    id: "4477185bb305bd6504d70189c51e9156",
                    date: "2025-11-20T15:42:24.576Z",
                    description: "Token Purchase - 88 tokens (886 INR)",
                    amount: 88,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "PENDING",
                    currency: "INR",
                    tokenCount: 88,
                    userId: "example999@gmail.com"
                },
                {
                    id: "89f5a8eaad84e3f707f01d172651faba",
                    date: "2025-11-20T15:29:24.706Z",
                    description: "Token Purchase - 177 tokens (1772 INR)",
                    amount: 177,
                    category: "Token Purchase",
                    type: "credit",
                    paymentStatus: "CAPTURED",
                    currency: "INR",
                    tokenCount: 177,
                    userId: "example999@gmail.com"
                }
            ];
            setTransactions(mockTransactions);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        transactionHistory();
    }, [userId]); // Add userId as dependency

    // Filter transactions based on search and date
    useEffect(() => {
        let result = transactions;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(tx =>
                tx.description.toLowerCase().includes(term) ||
                tx.category.toLowerCase().includes(term) ||
                tx.amount.toString().includes(term) ||
                (tx.paymentStatus && tx.paymentStatus.toLowerCase().includes(term))
            );
        }

        // Apply date filter
        if (dateFilter) {
            result = result.filter(tx =>
                tx.date && new Date(tx.date).toDateString() === new Date(dateFilter).toDateString()
            );
        }

        setFilteredTransactions(result);
    }, [searchTerm, dateFilter, transactions]);

    // Format tokens amount
    const formatTokens = (amount: number) => {
        return new Intl.NumberFormat('en-US').format(amount);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'CAPTURED':
            case 'COMPLETED':
            case 'SUCCESS':
                return 'bg-emerald-100 text-emerald-800';
            case 'PENDING':
                return 'bg-amber-100 text-amber-800';
            case 'FAILED':
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status text for display
    const getStatusText = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'CAPTURED':
                return 'Completed';
            case 'PENDING':
                return 'Pending';
            case 'FAILED':
                return 'Failed';
            case 'CANCELLED':
                return 'Cancelled';
            default:
                return status || 'Unknown';
        }
    };

    // Debug logging - this will show the data
    useEffect(() => {
        console.log("transactionHistoryData:", transactionHistoryData);
        console.log("transactions array:", transactions);
        console.log("Filtered transactions:", filteredTransactions);
    }, [transactionHistoryData, transactions, filteredTransactions]);

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="text-amber-700 mt-4">Loading your transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Transaction History</h1>
                    <p className="text-amber-700 mt-2">Review your token purchase history</p>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-md mx-auto">
                            <strong>Note:</strong> {error}
                        </div>
                    )}

                    {/* Debug info - shows API data count */}
                    {transactionHistoryData && (
                        <div className="mt-2 text-sm text-amber-600">
                            Loaded {transactionHistoryData.count} transactions from API
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                {transactionHistoryData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-amber-200">
                            <div className="text-2xl font-bold text-amber-700">{transactionHistoryData.count}</div>
                            <div className="text-amber-600 text-sm">Total Transactions</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-amber-200">
                            <div className="text-2xl font-bold text-emerald-700">
                                {formatTokens(transactions.reduce((sum, tx) => sum + tx.amount, 0))}
                            </div>
                            <div className="text-amber-600 text-sm">Total Tokens</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-amber-200">
                            <div className="text-2xl font-bold text-amber-700">
                                {transactions.filter(tx => tx.paymentStatus === 'CAPTURED').length}
                            </div>
                            <div className="text-amber-600 text-sm">Completed</div>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 border border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-amber-800 mb-1">
                                Search Transactions
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by description, amount, or status..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-amber-900 placeholder-amber-400"
                                />
                                <svg
                                    className="w-5 h-5 text-amber-500 absolute left-3 top-2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label htmlFor="dateFilter" className="block text-sm font-medium text-amber-800 mb-1">
                                Filter by Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dateFilter"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-amber-900"
                                />
                                <svg
                                    className="w-5 h-5 text-amber-500 absolute left-3 top-2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-amber-700">
                            <svg
                                className="w-16 h-16 mx-auto text-amber-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-medium">No transactions found</h3>
                            <p className="mt-2">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-amber-100">
                            {filteredTransactions.map((transaction) => (
                                <li
                                    key={transaction.id}
                                    className="p-4 md:p-6 hover:bg-amber-50 transition-colors duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start space-x-4">
                                                <div
                                                    className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${transaction.type === 'credit'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                >
                                                    {transaction.type === 'credit' ? (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg font-semibold text-amber-900 truncate">
                                                        {transaction.description}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded">
                                                            {transaction.category}
                                                        </span>
                                                        {transaction.paymentStatus && (
                                                            <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(transaction.paymentStatus)}`}>
                                                                {getStatusText(transaction.paymentStatus)}
                                                            </span>
                                                        )}
                                                        {transaction.currency && (
                                                            <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded">
                                                                {transaction.currency}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-amber-500 mt-2">
                                                        {formatDate(transaction.date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className={`text-xl font-bold ${transaction.type === 'credit'
                                                ? 'text-emerald-700'
                                                : 'text-amber-800'
                                                }`}>
                                                {transaction.type === 'credit' ? '+' : '-'}
                                                {formatTokens(Math.abs(transaction.amount))} tokens
                                            </div>
                                            {transaction.tokenCount && (
                                                <p className="text-sm text-amber-600 mt-1">
                                                    {transaction.tokenCount} tokens
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Debug Section - Remove in production */}


            </div>
        </div>
    );
};

export default TransactionHistory;