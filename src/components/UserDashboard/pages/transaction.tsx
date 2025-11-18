import React, { useState, useEffect } from 'react';

// Define transaction type
interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'credit' | 'debit';
}

const TransactionHistory: React.FC = () => {
    // State management
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    // Mock data initialization
    useEffect(() => {
        // In a real app, fetch from API
        const mockTransactions: Transaction[] =[
  {
    id: '1',
    date: '2025-11-17T09:15:00',
    description: 'Pro Plan Annual ($299) → 3,000 Tokens',
    amount: 3000.00, // tokens received
    category: 'Subscription',
    type: 'credit'   // tokens credited to user
  },
  {
    id: '2',
    date: '2025-11-15T14:22:10',
    description: 'Starter Pack ($19.99) → 200 Tokens',
    amount: 200.00,
    category: 'Purchase',
    type: 'credit'
  },
  {
    id: '3',
    date: '2025-11-12T11:05:33',
    description: 'Referral Bonus: Friend upgraded → 500 Tokens',
    amount: 500.00,
    category: 'Referral',
    type: 'credit'
  },
  {
    id: '4',
    date: '2025-11-10T16:45:00',
    description: 'Enterprise Bundle ($999) → 12,000 Tokens + API Access',
    amount: 12000.00,
    category: 'Purchase',
    type: 'credit'
  },
  {
    id: '5',
    date: '2025-11-07T08:30:15',
    description: 'Monthly Subscription ($24.99) → 250 Tokens',
    amount: 250.00,
    category: 'Subscription',
    type: 'credit'
  },
  {
    id: '6',
    date: '2025-11-03T13:17:42',
    description: 'NFT Whitelist Mint ($49.99 + gas) → 300 Tokens',
    amount: 300.00,
    category: 'Digital Assets',
    type: 'credit'
  },
  {
    id: '7',
    date: '2025-10-28T10:05:19',
    description: 'Early Adopter Bonus (Free) → 1,000 Tokens',
    amount: 1000.00,
    category: 'Promotion',
    type: 'credit'
  },
  {
    id: '8',
    date: '2025-10-20T09:45:00',
    description: 'Custom Integration Fee ($499) → 5,500 Tokens',
    amount: 5500.00,
    category: 'Services',
    type: 'credit'
  }
];
        setTransactions(mockTransactions);
    }, []);

    // Filter transactions based on search and date
    useEffect(() => {
        let result = transactions;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(tx =>
                tx.description.toLowerCase().includes(term) ||
                tx.category.toLowerCase().includes(term) ||
                tx.amount.toString().includes(term)
            );
        }

        // Apply date filter
        if (dateFilter) {
            result = result.filter(tx =>
                new Date(tx.date).toDateString() === new Date(dateFilter).toDateString()
            );
        }

        setFilteredTransactions(result);
    }, [searchTerm, dateFilter, transactions]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-amber-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Transaction History</h1>
                    <p className="text-amber-700 mt-2">Review your financial activity</p>
                </div>

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
                                    placeholder="Search by description, amount, or category..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-amber-900"
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
                                    className="p-4 md:p-6 hover:bg-amber-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <div
                                                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${transaction.type === 'credit'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                >
                                                    {transaction.type === 'credit' ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-medium text-amber-900 truncate">
                                                        {transaction.description}
                                                    </h3>
                                                    <p className="text-sm text-amber-600 mt-1">{transaction.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-lg font-bold ${transaction.type === 'credit'
                                                    ? 'text-emerald-700'
                                                    : 'text-amber-800'
                                                }`}>
                                                {transaction.type === 'credit' ? '+' : '-'}
                                                {formatCurrency(Math.abs(transaction.amount))}
                                            </div>
                                            <p className="text-sm text-amber-500 mt-1">
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