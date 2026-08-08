import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useUserAuth } from "../../context/context";
import { PAYMENT_API, LAMBDA, AUTH_API } from '../../../lib/apiConfig';
import { authHeader } from '../../../lib/authService';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

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
    const [profileBalance, setProfileBalance] = useState<number | null>(null);

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
                PAYMENT_API
                    ? `${PAYMENT_API}/transactions/${userId}`
                    : `${LAMBDA.transactions}/Transaction-History/${userId}`,
                PAYMENT_API ? { headers: authHeader() } : undefined
            );

            if (response.data.success) {
                const rawTransactions = response.data.transactions || [];
                const mapped: Transaction[] = PAYMENT_API
                    ? rawTransactions.map((t: any) => ({
                        id: t.id,
                        date: t.date,
                        description: t.description,
                        amount: t.amount,
                        category: t.service || (t.tokenCount >= 0 ? 'Token Purchase' : 'Token Usage'),
                        type: t.tokenCount >= 0 ? 'credit' : 'debit',
                        paymentStatus: (t.status || '').toUpperCase(),
                        currency: t.currency || 'INR',
                        tokenCount: Math.abs(t.tokenCount || 0),
                        userId,
                    }))
                    : rawTransactions;
                setTransactionHistoryData(response.data);
                setTransactions(mapped);
            } else {
                throw new Error(response.data.message || 'Failed to fetch transactions');
            }
        } catch {
            setError('Failed to load transactions.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        transactionHistory();
        if (userId) {
            axios.get(`${PROFILE_API}?userId=${userId}`)
                .then(r => setProfileBalance(r.data?.profile?.tokenBalance ?? 0))
                .catch(() => {});
        }
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

    const getDisplayTokens = (tx: Transaction): number => {
        const match = tx.description?.match(/(\d[\d,]*)\s*tokens?\s*\(/i);
        if (match) return parseInt(match[1].replace(/,/g, ''), 10);
        if (tx.tokenCount && tx.tokenCount > 0) return tx.tokenCount;
        return Math.floor(tx.amount / 10);
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'CAPTURED':
            case 'COMPLETED':
            case 'SUCCESS':
                return 'bg-status-success/15 text-status-success';
            case 'PENDING':
                return 'bg-brand-yellow-soft text-brand-gold';
            case 'FAILED':
            case 'CANCELLED':
                return 'bg-status-error/15 text-status-error';
            default:
                return 'bg-ink-light text-ink-charcoal';
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


    if (loading) {
        return (
            <div className="min-h-screen bg-surface-main p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                    <p className="text-brand-gold mt-4">Loading your transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-main p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-brand-gold">Transaction History</h1>
                    <p className="text-brand-gold mt-1 text-sm md:text-base">Review your token purchase history</p>
                    {error && (
                        <div className="mt-3 p-3 bg-status-error/15 border border-status-error/40 text-status-error rounded-lg max-w-md mx-auto text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                {transactions.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                        <div className="bg-surface-card rounded-xl shadow-sm p-3 md:p-4 text-center border border-brand-yellow-soft">
                            <div className="text-xl md:text-2xl font-bold text-brand-gold">{transactions.length}</div>
                            <div className="text-brand-gold text-xs md:text-sm">Total</div>
                        </div>
                        <div className="bg-surface-card rounded-xl shadow-sm p-3 md:p-4 text-center border border-brand-yellow-soft">
                            <div className="text-xl md:text-2xl font-bold text-status-success">
                                {formatTokens(transactions.filter(tx => tx.paymentStatus === 'CAPTURED' || tx.paymentStatus === 'COMPLETED' || tx.paymentStatus === 'SUCCESS').reduce((sum, tx) => sum + (tx.tokenCount || 0), 0))}
                            </div>
                            <div className="text-brand-gold text-xs md:text-sm">Purchased</div>
                        </div>
                        <div className="bg-surface-card rounded-xl shadow-sm p-3 md:p-4 text-center border border-brand-yellow-soft">
                            <div className="text-xl md:text-2xl font-bold text-brand-gold">
                                {transactions.filter(tx => tx.paymentStatus === 'CAPTURED' || tx.paymentStatus === 'COMPLETED' || tx.paymentStatus === 'SUCCESS').length}
                            </div>
                            <div className="text-brand-gold text-xs md:text-sm">Completed</div>
                        </div>
                        <div className="bg-ink rounded-xl shadow-sm p-3 md:p-4 text-center border border-brand-yellow">
                            <div className="text-xl md:text-2xl font-bold text-brand-yellow">
                                {profileBalance === null ? '…' : formatTokens(profileBalance)}
                            </div>
                            <div className="text-brand-gold text-xs md:text-sm">Balance</div>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="bg-surface-card rounded-xl shadow-lg p-4 md:p-6 mb-6 border border-brand-yellow-soft">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-brand-gold mb-1">
                                Search Transactions
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by description, amount, or status..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-yellow-soft focus:ring-2 focus:ring-brand-gold focus:border-transparent bg-surface-card text-brand-gold placeholder-brand-yellow"
                                />
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label htmlFor="dateFilter" className="block text-sm font-medium text-brand-gold mb-1">
                                Filter by Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dateFilter"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-brand-yellow-soft focus:ring-2 focus:ring-brand-gold focus:border-transparent bg-surface-card text-brand-gold"
                                />
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-surface-card rounded-xl shadow-lg overflow-hidden border border-brand-yellow-soft">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-brand-gold">
                            <svg
                                className="w-16 h-16 mx-auto text-brand-yellow mb-4"
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
                        <ul className="divide-y divide-brand-yellow-soft">
                            {filteredTransactions.map((transaction) => (
                                <li
                                    key={transaction.id}
                                    className="p-3 md:p-5 hover:bg-surface-main transition-colors duration-200"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Status icon */}
                                        <div
                                            className={`flex-shrink-0 h-9 w-9 md:h-11 md:w-11 rounded-full flex items-center justify-center mt-0.5 ${
                                                transaction.paymentStatus === 'CAPTURED' || transaction.paymentStatus === 'COMPLETED' || transaction.paymentStatus === 'SUCCESS'
                                                    ? 'bg-status-success/15 text-status-success'
                                                    : transaction.paymentStatus === 'FAILED' || transaction.paymentStatus === 'CANCELLED'
                                                    ? 'bg-status-error/15 text-status-error'
                                                    : 'bg-brand-yellow-soft text-brand-gold'
                                            }`}
                                        >
                                            {transaction.paymentStatus === 'CAPTURED' || transaction.paymentStatus === 'COMPLETED' || transaction.paymentStatus === 'SUCCESS' ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : transaction.paymentStatus === 'FAILED' || transaction.paymentStatus === 'CANCELLED' ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Main content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Description + Amount on same row */}
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm md:text-base font-semibold text-brand-gold break-words leading-snug flex-1 min-w-0">
                                                    {transaction.description}
                                                </p>
                                                <span className={`flex-shrink-0 text-sm md:text-base font-bold whitespace-nowrap ${
                                                    transaction.type === 'credit' ? 'text-status-success' : 'text-brand-gold'
                                                }`}>
                                                    {transaction.type === 'credit' ? '+' : '-'}{formatTokens(getDisplayTokens(transaction))} tokens
                                                </span>
                                            </div>

                                            {/* Badges — wrap on mobile */}
                                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                                <span className="text-xs text-brand-gold bg-brand-yellow-soft px-2 py-0.5 rounded">
                                                    {transaction.category}
                                                </span>
                                                {transaction.paymentStatus && (
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(transaction.paymentStatus)}`}>
                                                        {getStatusText(transaction.paymentStatus)}
                                                    </span>
                                                )}
                                                {transaction.currency && (
                                                    <span className="text-xs text-brand-gold bg-surface-main px-2 py-0.5 rounded">
                                                        {transaction.currency}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Date */}
                                            <p className="text-xs text-brand-yellow mt-1.5">
                                                {formatDate(transaction.date)}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


            </div>
        </div>
    );
};

export default TransactionHistory;