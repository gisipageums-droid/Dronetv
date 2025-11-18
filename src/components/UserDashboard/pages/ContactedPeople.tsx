import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MessageCircle,
  Building,
  Briefcase,
  Package,
  Users,
  Grid,
  Table,
  Clock,
  Send,
  X,
  Check,
  CheckCheck,
  Calendar,
} from "lucide-react";
import { useUserAuth } from "../../context/context";

interface ApiResponse {
  success: boolean;
  mode: string;
  leads: Lead[];
  totalCount: number;
}

interface Lead {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  companyName: string;
  category: string;
  publishedId: string;
  submittedAt: string;
  viewed: boolean;
  totalMessages: number;
  unreadCount: number;
  lastMessageAt: string;
  lastMessage: {
    senderType: string;
    senderName: string;
    message: string;
    timestamp: string;
  };
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

// Mock toast for demo
const toast = {
  error: (msg: string) => console.error(msg),
  success: (msg: string) => console.log(msg),
};

const ContactedPeople: React.FC = () => {
  //changes
  const { user } = useUserAuth();
  const userId = user?.email || user?.userData?.email;

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Lead | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<number | null>(null);
  const lastMessageIdRef = useRef<string>("");
  const [contactedEntities, setContactedEntities] = useState<Lead[]>([]);

  const categories = [
    "all",
    "companies",
    "professionals",
    "events",
    "products",
    "services",
  ];

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "company":
      case "companies":
        return <Building className="w-5 h-5" />;
      case "service":
      case "services":
        return <Briefcase className="w-5 h-5" />;
      case "product":
      case "products":
        return <Package className="w-5 h-5" />;
      case "professional":
      case "professionals":
        return <Users className="w-5 h-5" />;
      case "event":
      case "events":
        return <Calendar className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "company":
      case "companies":
        return "bg-blue-100 text-blue-800";
      case "service":
      case "services":
        return "bg-green-100 text-green-800";
      case "product":
      case "products":
        return "bg-purple-100 text-purple-800";
      case "professional":
      case "professionals":
        return "bg-orange-100 text-orange-800";
      case "event":
      case "events":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get display name
  const getDisplayName = (contact: Lead) => {
    if (contact.companyName) return contact.companyName;
    if (contact.company) return contact.company;
    return `${contact.firstName} ${contact.lastName}`.trim() || contact.email;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // ✅ Handle chat with contact
  const handleChat = (contact: Lead) => {
    setSelectedContact(contact);
    setChatMessages([]);
    lastMessageIdRef.current = "";

    // message pooling in 1s
    const id = setInterval(async () => {
      try {
        const response = await fetch(
          `https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/messages?leadId=${contact.leadId}&userId=${userId}&markAsRead=false`
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
              senderType:
                msg.senderType || msg.sender === "user" ? "user" : "lead",
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

  // ✅ Send message to contact
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const messageToSend = newMessage;
    setNewMessage("");

    // Add message immediately to UI
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      isRead: false,
      messageId: `temp-${Date.now()}`,
      senderType: "user",
      senderName: user?.userData?.fullName || user?.fullName || "You",
      message: messageToSend,
      timestamp: new Date(),
      delivered: false,
      seen: false,
      sender: "user",
    };

    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await fetch(
        "https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadId: selectedContact.leadId,
            userId: userId,
            senderType: "user",
            senderName: user?.userData?.fullName || user?.fullName || "You",
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

  const filteredContacts = contactedEntities.filter((contact) => {
    const displayName = getDisplayName(contact);
    const matchesSearch =
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.category &&
        contact.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      contact.category?.toLowerCase() ===
        selectedCategory.slice(0, -1).toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Close chat modal and clear interval
  const closeChatModal = () => {
    setSelectedContact(null);
    if (intervalId.current) clearInterval(intervalId.current);
  };

  useEffect(() => {
    async function fetchLeadMessages() {
      try {
        const res = await fetch(
          `https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/leads?userId=${userId}&mode=recent&sort=latest`
        );
        const val = (await res.json()) as ApiResponse;
        setContactedEntities(val.leads || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    }

    if (userId) {
      fetchLeadMessages();
    }
  }, [userId]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contacted People
        </h1>
        <p className="text-gray-600">
          Manage your connections with companies, services, products, and
          professionals
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "card"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Grid className="w-4 h-4" />
              Card View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "table"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Table className="w-4 h-4" />
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.leadId}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getTypeColor(
                          contact.category
                        )}`}
                      >
                        {getTypeIcon(contact.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getDisplayName(contact)}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {contact.category || "Contact"}
                        </p>
                      </div>
                    </div>
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {contact.lastMessage?.message || contact.email}
                  </p>

                  {contact.phone && (
                    <p className="text-sm text-gray-500 mb-2">
                      Phone: {contact.phone}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDate(
                          contact.lastMessageAt || contact.submittedAt
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleChat(contact)}
                    className="w-full bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contacted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.leadId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-lg ${getTypeColor(
                              contact.category
                            )} mr-3`}
                          >
                            {getTypeIcon(contact.category)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getDisplayName(contact)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            contact.category
                          )}`}
                        >
                          {contact.category || "Contact"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(
                          contact.lastMessageAt || contact.submittedAt
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.unreadCount && contact.unreadCount > 0 ? (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {contact.unreadCount} new
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No new messages
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleChat(contact)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition-colors flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[75vh] flex flex-col">
            {/* WhatsApp-like Header */}
            <div className="flex items-center justify-between p-3 bg-[#075e54] text-white rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/20`}>
                  {getTypeIcon(selectedContact.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {getDisplayName(selectedContact)}
                  </h3>
                  <p className="text-xs text-white/80">
                    {selectedContact.email}
                  </p>
                </div>
              </div>
              <button
                onClick={closeChatModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Contact Info Bar */}
            <div className="bg-gray-50 px-4 py-3 border-b flex-shrink-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Name:</span>
                    <p className="font-medium text-gray-900">
                      {getDisplayName(selectedContact)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Type:</span>
                    <p className="font-medium text-gray-900 capitalize">
                      {selectedContact.category || "Contact"}
                    </p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <span className="text-gray-500 text-xs">Phone:</span>
                      <p className="font-medium text-gray-900">
                        {selectedContact.phone}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 text-xs">
                      Last Contacted:
                    </span>
                    <p className="font-medium text-gray-900">
                      {formatDate(
                        selectedContact.lastMessageAt ||
                          selectedContact.submittedAt
                      )}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Email:</span>{" "}
                    {selectedContact.email}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp-like Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] min-h-0">
              <div className="space-y-2">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
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
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* WhatsApp-like Input Area */}
            <div className="p-3 bg-white border-t rounded-b-lg flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#075e54] text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="bg-[#075e54] text-white p-2 rounded-full hover:bg-[#064e44] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ContactedPeople;