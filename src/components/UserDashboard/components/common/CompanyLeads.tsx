import React, { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../../../context/context";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MessageCircle, Send, X, Check, CheckCheck, Clock } from "lucide-react";

interface Lead {
  leadId: string;
  company: string;
  category: string;
  subject: string;
  email: string;
  phone: string;
  viewed: boolean;
  firstName: string;
  lastName: string;
  message: string;
  companyName: string;
  submittedAt: string;
  viewedAt?: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "lead";
  timestamp: string;
  seen: boolean;
  delivered: boolean;
}

const LeadsPage: React.FC = () => {
  console.log("=== LeadsPage Component Mounted ===");
  
  const { user } = useUserAuth();
  const userId = user?.email;
  const companyName = useParams().companyName || "";
  
  // Debug: Log navigation state
  const location = useLocation();
  const publishedId = location.state?.publishedId;
  
  console.log("LeadsPage Debug Info:");
  console.log("- userId:", userId);
  console.log("- companyName:", companyName);
  console.log("- location.state:", location.state);
  console.log("- publishedId:", publishedId);
  console.log("- full location:", location);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  
  // Chat states
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch user tokens
  const fetchUserTokens = async () => {
    if (!userId) return;
    try {
      console.log("Fetching tokens for userId:", userId);
      const res = await fetch(
        `https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/profile?userId=${userId}`
      );
      console.log("Tokens API response status:", res.status);
      const data = await res.json();
      console.log("Tokens API response data:", data);
      setTotalTokens(data.profile?.tokenBalance || 0);
    } catch (error) {
      console.error("Error fetching user tokens:", error);
    }
  };

  // ✅ Fetch leads
  const fetchLeads = async () => {
    if (!userId) return;
    try {
      console.log("Calling leads API with:", { userId, publishedId });
      
      // Try with publishedId first, if not available, try without it
      let apiUrl = `https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads?userId=${userId}&mode=all&limit=20&offset=0&filter=all`;
      if (publishedId) {
        apiUrl += `&publishedId=${publishedId}`;
      }
      
      console.log("Final API URL:", apiUrl);
      const res = await fetch(apiUrl);
      console.log("Leads API response status:", res.status);
      const data = await res.json();
      console.log("Leads API response data:", data);
      
      if (data.success && Array.isArray(data.leads)) {
        const formattedLeads = data.leads.map((lead: any) => ({
          leadId: lead.leadId,
          company: lead.company,
          category: lead.category,
          subject: lead.subject,
          email: lead.email,
          phone: lead.phone,
          viewed: lead.viewed,
          firstName: lead.firstName,
          lastName: lead.lastName,
          message: lead.message,
          companyName: lead.companyName,
          submittedAt: lead.submittedAt,
          viewedAt: lead.viewedAt,
        }));
        console.log("Formatted leads:", formattedLeads);
        setLeads(formattedLeads);
      } else {
        console.log("No leads found or invalid response format");
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
    }
  };

  // Force API call on component mount
  React.useEffect(() => {
    console.log("=== Force API Call on Mount ===");
    if (userId) {
      console.log("User found, forcing API calls...");
      fetchUserTokens();
      fetchLeads();
    } else {
      console.log("No user found, cannot call APIs");
    }
  }, []); // Empty dependency array to run only once on mount

  // ✅ Fetch both in parallel
  useEffect(() => {
    console.log("=== LeadsPage useEffect triggered ===");
    console.log("Current state:", { userId, publishedId, loading });
    
    const fetchAll = async () => {
      console.log("=== Starting fetchAll ===");
      if (!userId) {
        console.log("No userId found, skipping API calls");
        setLoading(false);
        return;
      }
      
      if (!publishedId) {
        console.warn("Warning: No publishedId found. Will try to fetch all leads for user.");
      }
      
      setLoading(true);
      console.log("Fetching leads for userId:", userId, "publishedId:", publishedId);
      
      try {
        await Promise.all([fetchUserTokens(), fetchLeads()]);
      } catch (error) {
        console.error("Error in fetchAll:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, [userId, publishedId]);

  // ✅ Handle view button
  const handleViewClick = async (leadId: string) => {
    if (totalTokens < 10) {
      setShowTokenModal(true);
      return;
    }

    try {
      const res = await fetch(
        "https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads/view",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, leadId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.leadId === leadId ? { ...lead, viewed: true } : lead
          )
        );
        // Optional: update tokens count after viewing
        fetchUserTokens();
        toast.success("Lead viewed successfully!");
        fetchLeads(); // Refresh leads to get full details
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error viewing lead:", error);
    }
  };

  // ✅ Handle view message button click
  const handleViewMessage = (lead: Lead) => {
    setSelectedLead(lead);
    setShowMessageModal(true);
  };

  const closeTokenModal = () => setShowTokenModal(false);
  const closeMessageModal = () => setShowMessageModal(false);

  // ✅ Handle chat with lead
  const handleChatWithLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowChatModal(true);
    // Initialize chat with welcome message
    setChatMessages([
      {
        id: "1",
        message: `Hello ${lead.firstName}! Thank you for your interest in ${companyName}. How can I help you today?`,
        sender: "user",
        timestamp: new Date().toISOString(),
        seen: false,
        delivered: true,
      }
    ]);
  };

  // ✅ Send message to lead
  const sendChatMessage = () => {
    if (newMessage.trim() && selectedLead) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        message: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
        seen: false,
        delivered: false,
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
      
      // Simulate message delivery
      setTimeout(() => {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, delivered: true }
              : msg
          )
        );
      }, 500);
      
      // Simulate lead response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1000).toString(),
          message: "Thank you for your response. I'll get back to you soon with more information!",
          sender: "lead",
          timestamp: new Date().toISOString(),
          seen: false,
          delivered: true,
        };
        setChatMessages(prev => [...prev, response]);
      }, 1500);
    }
  };

  // ✅ Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // ✅ Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || lead.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(leads.map((lead) => lead.subject))];

  // ✅ Show full-page loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
        <p className="mt-4 text-amber-800 font-semibold text-lg">
          Loading your data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
              {companyName}
            </h1>
            <h2 className="text-xl font-semibold text-amber-800 mt-1">
              Leads Management
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 bg-amber-500 rounded-xl px-6 py-3 shadow-md">
            <div className="flex items-center">
              <i className="fas fa-coins text-white text-xl mr-2"></i>
              <span className="text-white font-bold text-lg">
                Tokens: {totalTokens}
              </span>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>User ID: {userId || "Not found"}</p>
            <p>Published ID: {publishedId || "Not found"}</p>
            <p>Company Name: {companyName || "Not found"}</p>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>Leads Count: {leads.length}</p>
          </div>
          <button
            onClick={() => {
              console.log("Manual API trigger clicked");
              fetchUserTokens();
              fetchLeads();
            }}
            className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
          >
            Manual Trigger APIs
          </button>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64 mb-3 sm:mb-0">
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-amber-500"></i>
          </div>

          <select
            className="px-4 py-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-500">
                <tr>
                  {["Company", "Name", "Subject", "Status", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.leadId}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td
                        className={`px-6 py-4 text-sm font-medium text-amber-900 ${
                          lead.viewed ? "" : "blur-sm select-none"
                        }`}
                      >
                        {lead.company}
                      </td>

                      <td
                        className={`px-6 py-4 text-sm text-amber-800 ${
                          lead.viewed ? "" : "blur-sm select-none"
                        }`}
                      >
                        {lead.firstName} {lead.lastName}
                      </td>

                      <td className="px-6 py-4 text-sm text-amber-800">
                        {lead.subject}
                      </td>

                      <td className="px-6 py-4 text-sm text-amber-800">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          lead.viewed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {lead.viewed ? "Viewed" : "New"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.viewed ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewMessage(lead)}
                              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => handleChatWithLead(lead)}
                              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Chat
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleViewClick(lead.leadId)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm flex items-center"
                          >
                            <i className="fas fa-eye mr-2"></i> View (10 tokens)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-amber-100 rounded-full p-4 mb-4">
                          <MessageCircle className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                          No leads found
                        </h3>
                        <p className="text-amber-700 text-sm max-w-md">
                          {searchTerm || selectedCategory !== "All" 
                            ? "Try adjusting your search or filter criteria to find more leads."
                            : "You haven't received any leads yet. When people contact you through your company page, they'll appear here."}
                        </p>
                        {!searchTerm && selectedCategory === "All" && (
                          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 max-w-sm">
                            <p className="text-xs text-amber-600">
                              <strong>Tip:</strong> Share your company page to start receiving leads from potential customers.
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 rounded-full p-3">
                <i className="fas fa-exclamation-triangle text-amber-600 text-2xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-amber-900 mb-2">
              Insufficient Tokens
            </h3>
            <p className="text-amber-700 text-center mb-6">
              You need at least 10 tokens to view lead details. Current balance:{" "}
              <span className="font-bold">{totalTokens}</span>
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeTokenModal}
                className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-amber-500 text-white rounded-lg">
                Buy Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-amber-500 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  Lead Details
                </h3>
                <button
                  onClick={closeMessageModal}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Lead Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Lead Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-600">Name:</span>
                      <span className="font-medium text-amber-800">
                        {selectedLead.firstName} {selectedLead.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Company:</span>
                      <span className="font-medium text-amber-800">{selectedLead.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Subject:</span>
                      <span className="font-medium text-amber-800">{selectedLead.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Category:</span>
                      <span className="font-medium text-amber-800">{selectedLead.category}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-600">Submitted:</span>
                      <span className="font-medium text-amber-800">{formatDate(selectedLead.submittedAt)}</span>
                    </div>
                    {selectedLead.viewedAt && (
                      <div className="flex justify-between">
                        <span className="text-amber-600">Viewed:</span>
                        <span className="font-medium text-amber-800">{formatDate(selectedLead.viewedAt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-amber-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedLead.viewed 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {selectedLead.viewed ? "Viewed" : "New"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-3">Message from Lead</h4>
                <div className="bg-white rounded-lg p-4 border border-amber-100 min-h-[120px]">
                  <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">
                    {selectedLead.message || "No message provided."}
                  </p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Privacy Notice:</strong> Contact information (email, phone) is hidden for privacy protection. Use the chat feature to communicate with this lead.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-amber-200">
                <button
                  onClick={closeMessageModal}
                  className="px-6 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeMessageModal();
                    handleChatWithLead(selectedLead);
                  }}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[75vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 bg-[#075e54] text-white rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {selectedLead.firstName.charAt(0)}{selectedLead.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h3>
                  <p className="text-xs text-white/80">{selectedLead.company}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Lead Contact Info Bar */}
            <div className="bg-gray-50 px-4 py-3 border-b flex-shrink-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Name:</span>
                    <p className="font-medium text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Company:</span>
                    <p className="font-medium text-gray-900">{selectedLead.company}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Subject:</span>
                    <p className="font-medium text-gray-900">{selectedLead.subject}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Category:</span>
                    <p className="font-medium text-gray-900">{selectedLead.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500 text-xs">
                      Received: {formatDate(selectedLead.submittedAt)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Lead ID: {selectedLead.leadId}
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Original Message:</span> {selectedLead.message || "No message provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] min-h-0">
              <div className="space-y-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-xs lg:max-w-md">
                      <div
                        className={`relative px-4 py-2 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-[#dcf8c6] text-gray-800 rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          msg.sender === "user" ? "text-gray-500" : "text-gray-400"
                        }`}>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {msg.sender === "user" && (
                            <span className="ml-1">
                              {!msg.delivered ? (
                                <Clock className="w-3 h-3" />
                              ) : !msg.seen ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t rounded-b-lg flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#075e54] text-sm"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-[#075e54] text-white p-2 rounded-full hover:bg-[#064e44] transition-colors flex items-center justify-center"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;