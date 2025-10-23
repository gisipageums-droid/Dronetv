import React, { useState, useEffect } from 'react';
import token from "../assets/token.jpeg";
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/context';
import { toast } from 'react-toastify'; // Import toast for notifications

interface Transaction {
  transactionId: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  publishedId: string;
  companyName: string;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: string;
  referenceId: string;
}

interface UserDetails {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
}

const ProfilePage: React.FC = () => {
  // Load user data from localStorage or default values
  const { user, login } = useUserAuth(); // Add login function from context
  const stored = user?.userData;
  const [userDetails, setUserDetails] = useState<any>(stored);

  const [isEditing, setIsEditing] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [totalTokens, setTotalTokens] = useState();
  
  // Modal filters
  const [transactionSearch, setTransactionSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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
        setTotalTokens(data || 0);
      } else {
        console.error('Failed to fetch token data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  }

  const [recentToken, setRecentToken] = useState();
  async function getRecentToken() {
    try {
      // const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/recent?userId=ayushchouhan417@gmail.com&publishedId=all&limit=5`);
      const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/recent?userId=${stored?.email}&publishedId=all&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setRecentToken(data);
        console.log("recent: ", recentToken);
      } else {
        console.error('Failed to fetch recent token data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching recent token data:', error);
    }
  }

  const [AllTokenData, setAllTokenData] = useState<{
    success: boolean;
    transactions: Transaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    offset: number;
    limit: number;
    spendingByCompany: any;
  } | null>(null);

  async function getAllToken() {
    try {
      // const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/all?userId=ayushchouhan417@gmail.com&publishedId=all`);
      const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/all?userId=${stored?.email}&publishedId=all`);
      if (response.ok) {
        const data = await response.json();
        setAllTokenData(data);
      }
    } catch (error) {
      console.error('Error fetching all token data:', error);
    }
  }

  useEffect(() => {
    getTokenData();
    getRecentToken();
    getAllToken();
  }, []);

  // Save changes to localStorage whenever userDetails updates
  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    
    try {
      // Prepare the data for the API call
      const updateData = {
        userId: userDetails.email,
        fullName: userDetails.fullName,
        email: userDetails.email,
        city: userDetails.city,
        state: userDetails.state,
        phone: userDetails.phone
      };

      const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated successfully:', result);
        
        // Update localStorage with new user details
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        
        // Update context with new user data
        if (user) {
          const updatedUser = {
            ...user,
            userData: {
              ...user.userData,
              ...userDetails
            }
          };
          login(updatedUser); // Update context with new user data
        }
        
        toast.success('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', response.statusText);
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
            <h2 className="text-xl font-semibold text-amber-900 mb-6">Account Details</h2>

            <div className="space-y-5">
              {["fullName", "city", "state", "phone"].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-amber-700 mb-1 capitalize">
                    {key === "phone" ? "Phone Number" : key}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={(userDetails as any)[key] || ''}
                      onChange={handleChange}
                      className="w-full border border-amber-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-amber-900 font-medium">{(userDetails as any)[key] || 'Not provided'}</p>
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
              <div className="p-3 mb-4">
                <img 
                  className="h-16 w-16"
                  src={token} 
                  alt="token" 
                />
              </div>
              <h3 className="text-lg font-medium text-amber-800">Total Tokens</h3>
              <p className="text-3xl font-bold text-amber-700 mt-1">{totalTokens?.profile?.tokenBalance}</p>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <h3 className="font-medium text-amber-800">Recent Activity</h3>

              {recentToken && recentToken.transactions && recentToken.transactions.length > 0 ? 
                recentToken.transactions.map((transaction: Transaction) => (
                  <div key={transaction.transactionId} className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} tokens
                      </p>
                      <p className="text-sm text-amber-700">{transaction.description}</p>
                      <p className="text-xs text-amber-500">{transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-800">{formatDate(transaction.timestamp)}</p>
                      <p className="text-xs text-amber-600">{formatTime(transaction.timestamp)}</p>
                      <p className="text-xs text-amber-500">Balance: {transaction.balanceAfter}</p>
                    </div>
                  </div>
                )) : (
                <p className="text-sm text-amber-600">No recent transactions found.</p>
              )}

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
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-amber-200">
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

        {/* Transaction Summary */}
        {AllTokenData && (
          <div className="flex justify-between items-center text-sm text-amber-700 mb-2">
            <span>Total Transactions: {AllTokenData.totalCount}</span>
            {AllTokenData.spendingByCompany && Object.keys(AllTokenData.spendingByCompany).length > 0 && (
              <span>
                Spending by Company: {Object.values(AllTokenData.spendingByCompany)[0].tokensSpent} tokens
              </span>
            )}
          </div>
        )}
      </div>

      <div className="overflow-y-auto max-h-[50vh]">
        {AllTokenData && AllTokenData.transactions && AllTokenData.transactions.length > 0 ? (
          <table className="w-full">
            <thead className="bg-amber-50 text-left sticky top-0">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold text-amber-800">Type</th>
                <th className="py-3 px-4 text-sm font-semibold text-amber-800">Amount</th>
                <th className="py-3 px-4 text-sm font-semibold text-amber-800">Description</th>
                <th className="py-3 px-4 text-sm font-semibold text-amber-800">Category</th>
                <th className="py-3 px-4 text-sm font-semibold text-amber-800">Date & Time</th>
                <th className="py-3 px-4 text-sm font-semibold text-amber-800">Balance</th>
              </tr>
            </thead>
            <tbody>
              {AllTokenData.transactions
                .filter(transaction => {
                  const matchesSearch = 
                    transaction.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
                    transaction.category.toLowerCase().includes(transactionSearch.toLowerCase()) ||
                    transaction.amount.toString().includes(transactionSearch) ||
                    transaction.type.toLowerCase().includes(transactionSearch.toLowerCase());
                  
                  if (!dateFilter) return matchesSearch;
                  
                  const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
                  return matchesSearch && transactionDate === dateFilter;
                })
                .map((transaction) => (
                  <tr key={transaction.transactionId} className="border-b border-amber-100 hover:bg-amber-50">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`py-4 px-4 font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                    </td>
                    <td className="py-4 px-4 text-amber-800 text-sm">{transaction.description}</td>
                    <td className="py-4 px-4 text-amber-700 text-sm">{transaction.category}</td>
                    <td className="py-4 px-4">
                      <div className="text-amber-800 text-sm">{formatDate(transaction.timestamp)}</div>
                      <div className="text-amber-600 text-xs">{formatTime(transaction.timestamp)}</div>
                    </td>
                    <td className="py-4 px-4 text-amber-800 font-medium text-sm">{transaction.balanceAfter}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-amber-700">
            {AllTokenData ? 'No transactions found matching your filters' : 'Loading transactions...'}
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {AllTokenData && AllTokenData.totalPages > 1 && (
        <div className="p-4 border-t border-amber-200 bg-amber-50">
          <div className="flex justify-between items-center text-sm text-amber-700">
            <span>Page {AllTokenData.currentPage} of {AllTokenData.totalPages}</span>
            <span>Showing {AllTokenData.transactions.length} of {AllTokenData.totalCount} transactions</span>
            {AllTokenData.hasMore && (
              <button className="text-amber-600 hover:text-amber-800 font-medium">
                Load More
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-6 flex justify-end border-t border-amber-200">
        <button
          onClick={() => setShowAllTransactions(false)}
          className="cursor-pointer px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-300 shadow-md"
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