import React, { useEffect, useState, useRef, useCallback } from "react";
import { useUserAuth } from "../../../context/context";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MessageCircle, Send, X, Check, CheckCheck, Clock } from "lucide-react";
//changes2
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
  isRead: boolean;
  messageId: string;
  senderType: "user" | "lead";
  senderName: string;
  message: string;
  timestamp: Date;
  delivered?: boolean;
  seen?: boolean;
  sender?: "user" | "lead";
}

const LeadsPage: React.FC = () => {
  const { user } = useUserAuth();
  const userId = user?.email || user?.userData?.email;
  const companyName = useParams().companyName || "";
  const location = useLocation();
  const publishedId = location.state?.publishedId;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<number | null>(null);
  const lastMessageIdRef = useRef<string>("");

  const fetchUserTokens = useCallback(async () => {
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
  }, [userId]);

  const fetchLeads = useCallback(async () => {
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
  }, [publishedId, userId]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!userId) {
        console.log("No userId found, skipping API calls");
        setLoading(false);
        return;
      }

      if (!publishedId) {
        console.warn(
          "Warning: No publishedId found. Will try to fetch all leads for user."
        );
      }

      try {
        setLoading(true);
        await Promise.all([fetchUserTokens(), fetchLeads()]);
      } catch (error) {
        console.error("Error in fetchAll:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId, publishedId, fetchLeads, fetchUserTokens]);

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

  const handleViewMessage = (lead: Lead) => {
    setSelectedLead(lead);
    setShowMessageModal(true);
  };

  const closeTokenModal = () => setShowTokenModal(false);

  const closeMessageModal = () => {
    setShowMessageModal(false);
    if (intervalId.current) clearInterval(intervalId.current);
  };

  // gel all conversetions
  const handleChatWithLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowChatModal(true);
    setChatMessages([]);
    lastMessageIdRef.current = "";

    // message pooling in 1s
    const id = setInterval(async () => {
      try {
        const response = await fetch(
          `https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/messages?leadId=${lead.leadId}&userId=${userId}&markAsRead=false`,{
            headers: {
            "Content-Type": "application/json",
            "X-User-Email": userId,
          },
          }
        );
        const data = await response.json();

        if (data?.messages && Array.isArray(data.messages)) {
          // Transform messages to ensure consistent structure
          const transformedMessages: ChatMessage[] = data.messages.map(
            (msg: any) => ({
              id:
                msg.messageId || msg.id || `${msg.timestamp}-${Math.random()}`,
              isRead: msg.isRead || false,
              messageId:
                msg.messageId || msg.id || `${msg.timestamp}-${Math.random()}`,
              senderType: msg.senderType === "user" ? "user" : "lead",
              senderName: msg.senderName || msg.sender,
              message: msg.message,
              timestamp: new Date(msg.timestamp),
              delivered: msg.delivered !== false,
              seen: msg.seen || false,
              sender: msg.senderType === "user" ? "user" : "lead",
            })
          );

          setChatMessages(transformedMessages);
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    }, 1000);

    intervalId.current = id;
  };

  // Send message to User
  const sendChatMessage = async () => {
    if (!newMessage.trim() || !selectedLead) return;

    const messageToSend = newMessage;
    setNewMessage("");

    // Add message immediately to UI
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      isRead: false,
      messageId: `temp-${Date.now()}`,
      senderType: "lead",
      senderName: user?.userData?.fullName || user?.fullName || "You",
      message: messageToSend,
      timestamp: new Date(),
      delivered: false,
      seen: false,
      sender: "lead",
    };

    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await fetch(
        "https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Email": userId,
          },
          body: JSON.stringify({
            leadId: selectedLead.leadId,
            message: messageToSend,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update message with delivered status
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? {
                  ...msg,
                  id: data.messageId,
                  messageId: data.messageId,
                  delivered: true,
                }
              : msg
          )
        );
      } else {
        // Remove message if failed
        setChatMessages((prev) =>
          prev.filter((msg) => msg.id !== tempMessage.id)
        );
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove message if failed
      setChatMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMessage.id)
      );
      toast.error("Error sending message");
    }
  };

  // ✅ Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Cleanup interval on modal close
  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lead.viewed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
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
                    <td colSpan={5} className="px-6 py-16 text-center">
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
                              <strong>Tip:</strong> Share your company page to
                              start receiving leads from potential customers.
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
          <div className="bg-white rounded-2xl shadow-xl w-full h-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-amber-500 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Lead Details</h3>
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
                  <h4 className="font-semibold text-amber-800 mb-2">
                    Lead Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-600">Name:</span>
                      <span className="font-medium text-amber-800">
                        {selectedLead.firstName} {selectedLead.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Company:</span>
                      <span className="font-medium text-amber-800">
                        {selectedLead.company}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Subject:</span>
                      <span className="font-medium text-amber-800">
                        {selectedLead.subject}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-600">Category:</span>
                      <span className="font-medium text-amber-800">
                        {selectedLead.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    Timeline
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-600">Submitted:</span>
                      <span className="font-medium text-amber-800">
                        {formatDate(selectedLead.submittedAt)}
                      </span>
                    </div>
                    {selectedLead.viewedAt && (
                      <div className="flex justify-between">
                        <span className="text-amber-600">Viewed:</span>
                        <span className="font-medium text-amber-800">
                          {formatDate(selectedLead.viewedAt)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-amber-600">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedLead.viewed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedLead.viewed ? "Viewed" : "New"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-3">
                  Message from Lead
                </h4>
                <div className="bg-white rounded-lg p-4 border border-amber-100 min-h-[120px]">
                  <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">
                    {selectedLead.message || "No message provided."}
                  </p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Privacy Notice:</strong> Contact information (email,
                  phone) is hidden for privacy protection. Use the chat feature
                  to communicate with this lead.
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
                    {selectedLead.firstName.charAt(0)}
                    {selectedLead.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h3>
                  <p className="text-xs text-white/80">
                    {selectedLead.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChatModal(false);
                  if (intervalId.current) clearInterval(intervalId.current);
                }}
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
                    <p className="font-medium text-gray-900">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Company:</span>
                    <p className="font-medium text-gray-900">
                      {selectedLead.company}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Subject:</span>
                    <p className="font-medium text-gray-900">
                      {selectedLead.subject}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Category:</span>
                    <p className="font-medium text-gray-900">
                      {selectedLead.category}
                    </p>
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
                    <span className="font-medium text-gray-900">
                      Original Message:
                    </span>{" "}
                    {selectedLead.message || "No message provided."}
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
                    className={`flex ${
                      msg.sender === "user" ? "justify-start" : "justify-end"
                    }`}
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
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            msg.sender === "user"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
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
