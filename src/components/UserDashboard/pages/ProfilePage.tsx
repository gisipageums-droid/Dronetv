import React, { useState, useEffect } from 'react';
import token from "../assets/token.jpeg";
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/context';

interface Transaction {
  id: string;
  tokens: number;
  reason: string;
  timestamp: string;
}

interface UserDetails {
  name: string;
  fullName: string;
  email: string;
  phone: string;
}

const ProfilePage: React.FC = () => {
  // Load user data from localStorage or default values
  const { user } = useUserAuth();
  const stored = user?.userData;
  const [userDetails, setUserDetails] = useState<any>(stored);



  const [isEditing, setIsEditing] = useState(false);

  const [transactions] = useState<Transaction[]>([
    { id: "1", tokens: 50, reason: "Referral bonus", timestamp: "2023-10-15T14:30:00Z" },
    { id: "2", tokens: -25, reason: "Daily login", timestamp: "2023-10-14T09:15:00Z" },
    { id: "3", tokens: 100, reason: "Content creation", timestamp: "2023-10-12T16:45:00Z" },
    { id: "4", tokens: 10, reason: "Profile completion", timestamp: "2023-10-10T11:20:00Z" },
    { id: "5", tokens: -75, reason: "Community contribution", timestamp: "2023-10-08T13:50:00Z" },
  ]);

  const [showAllTransactions, setShowAllTransactions] = useState(false);
  // const totalTokens = transactions.reduce((sum, t) => sum + t.tokens, 0);
let totalTokens = 0;
  useEffect(() => {
async function getTokenData() {
  try {
    const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/profile?userId=${stored?.email}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token data:', data);
      totalTokens = data.profile.tokenBalance || 0;
    } else {
      console.error('Failed to fetch token data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching token data:', error);
  }
}
getTokenData();
  }, []);

  // Modal filters
  const [transactionSearch, setTransactionSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Save changes to localStorage whenever userDetails updates
  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter transactions based on search and date
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.reason.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      transaction.tokens.toString().includes(transactionSearch);
    
    if (!dateFilter) return matchesSearch;
    
    const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
    return matchesSearch && transactionDate === dateFilter;
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50  p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-900 mb-6">Account Details</h2>

            <div className="space-y-5">
              {["fullName", "city", "state", "email", "phone"].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-amber-700 mb-1 capitalize">
                    {key === "phone" ? "Phone Number" : key}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={(userDetails as any)[key]}
                      onChange={handleChange}
                      className="w-full border border-amber-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-amber-900 font-medium">{(userDetails as any)[key]}</p>
                  )}
                </div>
              ))}

              <div className="pt-4">
                <button
                onClick={() => navigate('/forgot-password')}
                  className="text-amber-600 hover:text-amber-800 font-medium flex items-center"
                >
                  <i className="fas fa-lock mr-2 text-amber-600"></i>
                  Reset Password
                </button>
              </div>
            </div>

            <div className="mt-8">
              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition duration-300 shadow-md"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium py-3 px-4 rounded-xl transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition duration-300 shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-900 mb-6">Recent Transactions</h2>

            {/* Token Summary */}
            <div className="flex flex-col items-center mb-8">
              <div className=" p-3 mb-4">
                <img 
                  className="h-16 w-16"
                  src={token} 
                  alt="token" 
                />
              </div>
              <h3 className="text-lg font-medium text-amber-800">Total Tokens</h3>
              <p className="text-3xl font-bold text-amber-700 mt-1">{totalTokens}</p>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <h3 className="font-medium text-amber-800">Recent Activity</h3>

              {transactions.slice(0,3).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-amber-100">
                  <div>
                    <p className={`font-medium ${transaction.tokens >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.tokens >= 0 ? '+' : ''}{transaction.tokens} tokens
                    </p>
                    <p className="text-sm text-amber-700">{transaction.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-amber-800">{formatDate(transaction.timestamp)}</p>
                    <p className="text-xs text-amber-600">{formatTime(transaction.timestamp)}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowAllTransactions(true)}
                className="w-full mt-4 py-2.5 text-amber-600 hover:text-amber-800 font-medium rounded-lg transition duration-300"
              >
                See More Transactions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Modal */}
      {showAllTransactions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-amber-200">
            <div className="p-6 border-b border-amber-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-amber-900">All Transactions</h3>
                <button
                  onClick={() => setShowAllTransactions(false)}
                  className="text-amber-500 hover:text-amber-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              {/* Modal Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-3 top-2.5 text-amber-500"></i>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full py-2 px-4 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh]">
              {filteredTransactions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-amber-50 text-left sticky top-0">
                    <tr>
                      <th className="py-3 px-6 text-sm font-semibold text-amber-800">Tokens</th>
                      <th className="py-3 px-6 text-sm font-semibold text-amber-800">Reason</th>
                      <th className="py-3 px-6 text-sm font-semibold text-amber-800">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-amber-100 hover:bg-amber-50">
                        <td className={`py-4 px-6 font-medium ${transaction.tokens >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.tokens >= 0 ? '+' : ''}{transaction.tokens}
                        </td>
                        <td className="py-4 px-6 text-amber-800">{transaction.reason}</td>
                        <td className="py-4 px-6">
                          <div className="text-amber-800">{formatDate(transaction.timestamp)}</div>
                          <div className="text-amber-600 text-sm">{formatTime(transaction.timestamp)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-amber-700">
                  No transactions found matching your filters
                </div>
              )}
            </div>

            <div className="p-6 flex justify-end border-t border-amber-200">
              <button
                onClick={() => setShowAllTransactions(false)}
                className=" cursor-pointer px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-300 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;