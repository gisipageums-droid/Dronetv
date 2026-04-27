// import React, { useState, useEffect } from 'react';
// import token from "../assets/token.jpeg";
// import { useNavigate } from 'react-router-dom';
// import { useUserAuth } from '../../context/context';
// import { toast } from 'react-toastify'; // Import toast for notifications

// interface Transaction {
//   transactionId: string;
//   type: string;
//   amount: number;
//   category: string;
//   description: string;
//   publishedId: string;
//   companyName: string;
//   balanceBefore: number;
//   balanceAfter: number;
//   timestamp: string;
//   referenceId: string;
// }

// interface UserDetails {
//   name: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   city: string;
//   state: string;
// }

// const ProfilePage: React.FC = () => {
//   // Load user data from localStorage or default values
//   const { user, login } = useUserAuth(); // Add login function from context
//   const stored = user?.userData;
//   const [userDetails, setUserDetails] = useState<any>(stored);

//   const [isEditing, setIsEditing] = useState(false);
//   const [showAllTransactions, setShowAllTransactions] = useState(false);
//   const [totalTokens, setTotalTokens] = useState();

//   // Modal filters
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

//   async function getTokenData() {
//     try {
//       const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/profile?userId=${stored?.email}`, {
//         headers: {
//           Authorization: `Bearer ${user?.token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Token data:', data);
//         setTotalTokens(data || 0);
//       } else {
//         console.error('Failed to fetch token data:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching token data:', error);
//     }
//   }

//   const [recentToken, setRecentToken] = useState();
//   async function getRecentToken() {
//     try {
//       // const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/recent?userId=ayushchouhan417@gmail.com&publishedId=all&limit=5`);
//       const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/recent?userId=${stored?.email}&publishedId=all&limit=5`);
//       if (response.ok) {
//         const data = await response.json();
//         setRecentToken(data);
//         console.log("recent: ", recentToken);
//       } else {
//         console.error('Failed to fetch recent token data:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching recent token data:', error);
//     }
//   }

//   const [AllTokenData, setAllTokenData] = useState<{
//     success: boolean;
//     transactions: Transaction[];
//     totalCount: number;
//     currentPage: number;
//     totalPages: number;
//     hasMore: boolean;
//     offset: number;
//     limit: number;
//     spendingByCompany: any;
//   } | null>(null);

//   async function getAllToken() {
//     try {
//       // const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/all?userId=ayushchouhan417@gmail.com&publishedId=all`);
//       const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/all?userId=${stored?.email}&publishedId=all`);
//       if (response.ok) {
//         const data = await response.json();
//         console.log("all: ", data);
//         setAllTokenData(data);
//       }
//     } catch (error) {
//       console.error('Error fetching all token data:', error);
//     }
//   }

//   useEffect(() => {
//     getTokenData();
//     getRecentToken();
//     getAllToken();
//   }, []);

//   // Save changes to localStorage whenever userDetails updates
//   useEffect(() => {
//     localStorage.setItem("userDetails", JSON.stringify(userDetails));
//   }, [userDetails]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     setIsEditing(false);

//     try {
//       // Prepare the data for the API call
//       const updateData = {
//         userId: userDetails.email,
//         fullName: userDetails.fullName,
//         email: userDetails.email,
//         city: userDetails.city,
//         state: userDetails.state,
//         phone: userDetails.phone
//       };

//       const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads/update-profile`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           // 'Authorization': `Bearer ${user?.token}`
//         },
//         body: JSON.stringify(updateData)
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Profile updated successfully:', result);

//         // Update localStorage with new user details
//         localStorage.setItem("userDetails", JSON.stringify(userDetails));

//         // Update context with new user data
//         if (user) {
//           const updatedUser = {
//             ...user,
//             userData: {
//               ...user.userData,
//               ...userDetails
//             }
//           };
//           login(updatedUser); // Update context with new user data
//         }

//         toast.success('Profile updated successfully!');
//       } else {
//         console.error('Failed to update profile:', response.statusText);
//         toast.error('Failed to update profile. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error('Error updating profile. Please try again.');
//     }
//   };

//   const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTime = (timestamp: string) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-amber-50 p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-amber-900 mb-8">Your Profile</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - User Details */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
//             <h2 className="text-xl font-semibold text-amber-900 mb-6">Account Details</h2>

//             <div className="space-y-5">
//               {["fullName", "city", "state", "phone"].map((key) => (
//                 <div key={key}>
//                   <label className="block text-sm font-medium text-amber-700 mb-1 capitalize">
//                     {key === "phone" ? "Phone Number" : key}
//                   </label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name={key}
//                       value={(userDetails as any)[key] || ''}
//                       onChange={handleChange}
//                       className="w-full border border-amber-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     />
//                   ) : (
//                     <p className="text-amber-900 font-medium">{(userDetails as any)[key] || 'Not provided'}</p>
//                   )}
//                 </div>
//               ))}

//               <div className="pt-4">
//                 <button
//                   onClick={() => navigate('/forgot-password')}
//                   className="text-amber-600 hover:text-amber-800 font-medium flex items-center"
//                 >
//                   <i className="fas fa-lock mr-2 text-amber-600"></i>
//                   Reset Password
//                 </button>
//               </div>
//             </div>

//             <div className="mt-8">
//               {isEditing ? (
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={handleSave}
//                     className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition duration-300 shadow-md"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     className="w-full bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium py-3 px-4 rounded-xl transition duration-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition duration-300 shadow-md"
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Transactions */}
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
//             <h2 className="text-xl font-semibold text-amber-900 mb-6">Recent Transactions</h2>

//             {/* Token Summary */}
//             <div className="flex flex-col items-center mb-8">
//               <div className="p-3 mb-4">
//                 <img
//                   className="h-16 w-16"
//                   src={token}
//                   alt="token"
//                 />
//               </div>
//               <h3 className="text-lg font-medium text-amber-800">Total Tokens gg</h3>
//               <p className="text-3xl font-bold text-amber-700 mt-1">{totalTokens?.profile?.tokenBalance}</p>
//             </div>

//             {/* Recent Transactions */}
//             <div className="space-y-4">
//               <h3 className="font-medium text-amber-800">Recent Activity</h3>

//               {recentToken && recentToken.transactions && recentToken.transactions.length > 0 ?
//                 recentToken.transactions.map((transaction: Transaction) => (
//                   <div key={transaction.transactionId} className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
//                     <div>
//                       <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
//                         {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} tokens
//                       </p>
//                       <p className="text-sm text-amber-700">{transaction.description}</p>
//                       <p className="text-xs text-amber-500">{transaction.category}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-amber-800">{formatDate(transaction.timestamp)}</p>
//                       <p className="text-xs text-amber-600">{formatTime(transaction.timestamp)}</p>
//                       <p className="text-xs text-amber-500">Balance: {transaction.balanceAfter}</p>
//                     </div>
//                   </div>
//                 )) : (
//                   <p className="text-sm text-amber-600">No recent transactions found.</p>
//                 )}

//               <button
//                 onClick={() => setShowAllTransactions(true)}
//                 className="w-full mt-4 py-2.5 text-amber-600 hover:text-amber-800 font-medium rounded-lg transition duration-300"
//               >
//                 See More Transactions
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Transactions Modal */}
//       {showAllTransactions && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-amber-200">
//             <div className="p-6 border-b border-amber-200">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-amber-900">All Transactions</h3>
//                 <button
//                   onClick={() => setShowAllTransactions(false)}
//                   className="text-amber-500 hover:text-amber-700"
//                 >
//                   <i className="fas fa-times text-xl"></i>
//                 </button>
//               </div>

//               {/* Modal Filters */}
//               <div className="flex flex-col sm:flex-row gap-3 mb-4">
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     placeholder="Search transactions..."
//                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
//                     value={transactionSearch}
//                     onChange={(e) => setTransactionSearch(e.target.value)}
//                   />
//                   <i className="fas fa-search absolute left-3 top-2.5 text-amber-500"></i>
//                 </div>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     className="w-full py-2 px-4 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* Transaction Summary */}
//               {AllTokenData && (
//                 <div className="flex justify-between items-center text-sm text-amber-700 mb-2">
//                   <span>Total Transactions: {AllTokenData.totalCount}</span>
//                   {AllTokenData.spendingByCompany && Object.keys(AllTokenData.spendingByCompany).length > 0 && (
//                     <span>
//                       Spending by Company: {Object.values(AllTokenData.spendingByCompany)[0].tokensSpent} tokens
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="overflow-y-auto max-h-[50vh]">
//               {AllTokenData && AllTokenData.transactions && AllTokenData.transactions.length > 0 ? (
//                 <table className="w-full">
//                   <thead className="bg-amber-50 text-left sticky top-0">
//                     <tr>
//                       <th className="py-3 px-4 text-sm font-semibold text-amber-800">Type</th>
//                       <th className="py-3 px-4 text-sm font-semibold text-amber-800">Amount</th>
//                       <th className="py-3 px-4 text-sm font-semibold text-amber-800">Description</th>
//                       <th className="py-3 px-4 text-sm font-semibold text-amber-800">Category</th>
//                       <th className="py-3 px-4 text-sm font-semibold text-amber-800">Date & Time</th>
//                       <th className="py-3 px-4 text-sm font-semibold text-amber-800">Balance</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {AllTokenData.transactions
//                       .filter(transaction => {
//                         const matchesSearch =
//                           transaction.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//                           transaction.category.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//                           transaction.amount.toString().includes(transactionSearch) ||
//                           transaction.type.toLowerCase().includes(transactionSearch.toLowerCase());

//                         if (!dateFilter) return matchesSearch;

//                         const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
//                         return matchesSearch && transactionDate === dateFilter;
//                       })
//                       .map((transaction) => (
//                         <tr key={transaction.transactionId} className="border-b border-amber-100 hover:bg-amber-50">
//                           <td className="py-4 px-4">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'credit'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                               }`}>
//                               {transaction.type}
//                             </span>
//                           </td>
//                           <td className={`py-4 px-4 font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
//                             }`}>
//                             {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
//                           </td>
//                           <td className="py-4 px-4 text-amber-800 text-sm">{transaction.description}</td>
//                           <td className="py-4 px-4 text-amber-700 text-sm">{transaction.category}</td>
//                           <td className="py-4 px-4">
//                             <div className="text-amber-800 text-sm">{formatDate(transaction.timestamp)}</div>
//                             <div className="text-amber-600 text-xs">{formatTime(transaction.timestamp)}</div>
//                           </td>
//                           <td className="py-4 px-4 text-amber-800 font-medium text-sm">{transaction.balanceAfter}</td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="text-center py-8 text-amber-700">
//                   {AllTokenData ? 'No transactions found matching your filters' : 'Loading transactions...'}
//                 </div>
//               )}
//             </div>

//             {/* Pagination Info */}
//             {AllTokenData && AllTokenData.totalPages > 1 && (
//               <div className="p-4 border-t border-amber-200 bg-amber-50">
//                 <div className="flex justify-between items-center text-sm text-amber-700">
//                   <span>Page {AllTokenData.currentPage} of {AllTokenData.totalPages}</span>
//                   <span>Showing {AllTokenData.transactions.length} of {AllTokenData.totalCount} transactions</span>
//                   {AllTokenData.hasMore && (
//                     <button className="text-amber-600 hover:text-amber-800 font-medium">
//                       Load More
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="p-6 flex justify-end border-t border-amber-200">
//               <button
//                 onClick={() => setShowAllTransactions(false)}
//                 className="cursor-pointer px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-300 shadow-md"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import token from "../assets/token.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/context';
import { toast } from 'react-toastify';

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

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

const ProfilePage: React.FC = () => {
  // Load user data from localStorage or default values
  const { user, login } = useUserAuth();
  const stored = user?.userData;
  const [userDetails, setUserDetails] = useState<any>(stored);

  const [isEditing, setIsEditing] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [totalTokens, setTotalTokens] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal filters
  const [transactionSearch, setTransactionSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Token purchase states
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);

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

  const [recentToken, setRecentToken] = useState<any>(null);
  async function getRecentToken() {
    try {
      const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/recent?userId=${stored?.email}&publishedId=all&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setRecentToken(data);
        console.log("recent: ", data);
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
      const response = await fetch(`https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/transactions/all?userId=${stored?.email}&publishedId=all`);
      if (response.ok) {
        const data = await response.json();
        console.log("all: ", data);
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
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated successfully:', result);

        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        if (user) {
          const updatedUser = {
            ...user,
            userData: {
              ...user.userData,
              ...userDetails
            }
          };
          login(updatedUser);
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

  // Token Purchase Functions
  const createRazorpayOrder = async (amount: number, tokenCount: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://yv3392if0d.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/place-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userDetails.email,
            amount: amount,
            tokenCount: tokenCount,
            currency: 'INR'
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any, transactionId: string) => {
    try {
      console.log('Payment success response:', response);

      const confirmResponse = await fetch(
        'https://yv3392if0d.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/confirm-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            transactionId: transactionId
          }),
        }
      );

      const result = await confirmResponse.json();

      if (result.success) {
        toast.success(`Success! ${result.data.tokensAdded} tokens added to your account.`);
        setShowTokenPurchase(false);

        // Refresh user data
        await getTokenData();
        await getRecentToken();
        await getAllToken();

      } else {
        console.error('Payment verification failed:', result);
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error in payment success:', error);
      toast.error('Error processing payment. Please contact support.');
    }
  };

  const openRazorpayCheckout = async (amount: number, tokenCount: number) => {
    try {
      const orderData = await createRazorpayOrder(amount, tokenCount);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'DroneTV',
        description: `Purchase ${tokenCount} tokens`,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          await handlePaymentSuccess(response, orderData.transactionId);
        },
        prefill: {
          name: userDetails.fullName || '',
          email: userDetails.email || '',
          contact: userDetails.phone || ''
        },
        theme: {
          color: '#F59E0B'
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Razorpay checkout error:', error);
    }
  };

  const tokenPackages = [
    { tokens: 100, price: 100, bonus: 0 },
    { tokens: 550, price: 500, bonus: 50 },
    { tokens: 1200, price: 1000, bonus: 200 },
    { tokens: 2500, price: 2000, bonus: 500 }
  ];

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
            <h2 className="text-xl font-semibold text-amber-900 mb-6">Token Balance</h2>

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
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {totalTokens?.profile?.tokenBalance || 0}
              </p>

              {/* Buy Tokens Button */}
              <Link to="/user-recharge">

                <button
                  className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300 shadow-md"
                >
                  Buy More Tokens
                </button>
              </Link>
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

      {/* Token Purchase Modal */}
      {showTokenPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-amber-200">
            <div className="p-6 border-b border-amber-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-amber-900">Buy Tokens</h3>
                <button
                  onClick={() => setShowTokenPurchase(false)}
                  className="text-amber-500 hover:text-amber-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-amber-700">Choose a token package</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {tokenPackages.map((pkg, index) => (
                  <div key={index} className="border border-amber-200 rounded-lg p-4 hover:border-amber-400 transition duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-amber-900">{pkg.tokens} Tokens</h4>
                        {pkg.bonus > 0 && (
                          <p className="text-green-600 text-sm">+ {pkg.bonus} bonus tokens</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-amber-700">₹{pkg.price}</span>
                    </div>
                    <button
                      onClick={() => openRazorpayCheckout(pkg.price, pkg.tokens + pkg.bonus)}
                      disabled={loading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-amber-200 bg-amber-50">
              <div className="text-sm text-amber-700">
                <p>💳 Secure payment powered by Razorpay</p>
                <p className="mt-1">⚡ Tokens will be added instantly after payment</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'credit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className={`py-4 px-4 font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
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