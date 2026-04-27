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
  userId?: string; // <-- added for role detection
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

interface UserRole {
  type: "company" | "lead" | "unknown";
  displayName: string;
}

// Mock toast
const toast = {
  error: (msg: string) => console.error(msg),
  success: (msg: string) => console.log(msg),
};

const ContactedPeople: React.FC = () => {
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
  const [loading, setLoading] = useState(false);

  const categories = [
    "all",
    "companies",
    "professionals",
    "events",
    "products",
    "services",
  ];

  // -------------------------------
  // ROLE LOGIC
  // -------------------------------
  const getUserRoleInConversation = (contact: Lead): UserRole => {
    if (!userId) {
      return { type: "unknown", displayName: "Participant" };
    }

    if (userId === contact.userId) {
      return {
        type: "company",
        displayName: "Business Owner",
      };
    }

    if (userId === contact.email) {
      return {
        type: "lead",
        displayName: "Lead Submitter",
      };
    }

    return {
      type: "unknown",
      displayName: "Participant",
    };
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role.type) {
      case "company":
        return "bg-blue-100 text-blue-800";
      case "lead":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // -------------------------------
  // TYPE ICONS + COLORS
  // -------------------------------
  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
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
    switch (type?.toLowerCase()) {
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

  const getDisplayName = (contact: Lead) => {
    if (contact.companyName) return contact.companyName;
    if (contact.company) return contact.company;
    return `${contact.firstName} ${contact.lastName}`.trim() || contact.email;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // -------------------------------
  // CHAT FUNCTIONS
  // -------------------------------
  const handleChat = (contact: Lead) => {
    setSelectedContact(contact);
    setChatMessages([]);
    lastMessageIdRef.current = "";

    const id = setInterval(async () => {
      try {
        const response = await fetch(
          `https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/messages?leadId=${contact.leadId}&markAsRead=false`,
          {
            headers: {
              "X-User-Email": userId,
            },
          }
        );

        const data = await response.json();

        if (data?.messages && Array.isArray(data.messages)) {
          const transformedMessages: ChatMessage[] = data.messages.map(
            (msg: any) => ({
              id: msg.messageId || `${msg.timestamp}-${Math.random()}`,
              messageId: msg.messageId,
              senderType: msg.senderType === "user" ? "user" : "lead",
              senderName: msg.senderName,
              message: msg.message,
              timestamp: new Date(msg.timestamp),
              delivered: msg.delivered !== false,
              seen: msg.seen || false,
              sender: msg.senderType === "user" ? "user" : "lead",
              isRead: msg.isRead || false,
            })
          );

          setChatMessages(transformedMessages);
        }
      } catch (e) {
        console.error("Error fetching chat messages:", e);
      }
    }, 1000);

    intervalId.current = id;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const txt = newMessage;
    setNewMessage("");

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      messageId: `temp-${Date.now()}`,
      senderType: "user",
      senderName: user?.userData?.fullName || user?.fullName || "You",
      message: txt,
      timestamp: new Date(),
      delivered: false,
      seen: false,
      sender: "user",
      isRead: false,
    };

    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch(
        "https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Email": userId,
          },
          body: JSON.stringify({
            leadId: selectedContact.leadId,
            message: txt,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === tempMessage.id
              ? {
                  ...m,
                  delivered: true,
                  id: data.messageId,
                  messageId: data.messageId,
                }
              : m
          )
        );
      } else {
        setChatMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        toast.error("Failed to send message.");
      }
    } catch (e) {
      console.error(e);
      setChatMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [chatMessages]);

  useEffect(
    () => () => {
      if (intervalId.current) clearInterval(intervalId.current);
    },
    []
  );

  // -------------------------------
  // FETCH LEADS
  // -------------------------------
  useEffect(() => {
    async function load() {
      if (!userId) return;

      setLoading(true);
      try {
        const res = await fetch(
          `https://29c04nhq08.execute-api.ap-south-1.amazonaws.com/prod/chat/leads?mode=recent&sort=latest&userId=${userId}`,
          {
            headers: { "X-User-Email": userId },
          }
        );

        const data = await res.json();

        if (data.success) {
          setContactedEntities(data.leads || []);
        } else {
          toast.error("Failed to load conversations");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const filteredContacts = contactedEntities.filter((c) => {
    const name = getDisplayName(c);
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "all" ||
      c.category?.toLowerCase() === selectedCategory.slice(0, -1);

    return matchesSearch && matchesCategory;
  });

  const closeChatModal = () => {
    setSelectedContact(null);
    if (intervalId.current) clearInterval(intervalId.current);
  };

  return (
    <div className="p-6">
      {/* ----------------------- HEADER ----------------------- */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contacted People
        </h1>
        <p className="text-gray-600">
          Manage your connections with companies, services, products, and
          professionals.
        </p>
      </div>

      {/* ----------------------- FILTERS ----------------------- */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === "card"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Grid className="w-4 h-4" /> Card
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === "table"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Table className="w-4 h-4" /> Table
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------- LOADING ----------------------- */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading conversations…</p>
        </div>
      )}

      {/* ----------------------- CARD VIEW ----------------------- */}
      {!loading && viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No contacts found.
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const role = getUserRoleInConversation(contact);

              return (
                <div
                  key={contact.leadId}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex items-start justify-between mb-3">
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

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500 capitalize">
                            {contact.category || "Contact"}
                          </span>

                          {/* ROLE BADGE */}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(
                              role
                            )}`}
                          >
                            {role.displayName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {contact.unreadCount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Message Preview */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {contact.lastMessage?.message || "No messages yet"}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(
                        contact.lastMessageAt || contact.submittedAt
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {contact.totalMessages || 0}
                    </div>
                  </div>

                  <button
                    onClick={() => handleChat(contact)}
                    className="w-full bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ----------------------- TABLE VIEW ----------------------- */}
      {!loading && viewMode === "table" && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Last Contact</th>
                <th className="px-6 py-3 text-left">Messages</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const role = getUserRoleInConversation(contact);

                  return (
                    <tr
                      key={contact.leadId}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getTypeColor(
                              contact.category
                            )}`}
                          >
                            {getTypeIcon(contact.category)}
                          </div>

                          <div>
                            <div className="font-medium">
                              {getDisplayName(contact)}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 capitalize text-sm">
                        {contact.category || "Contact"}
                      </td>

                      {/* ROLE BADGE */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(
                            role
                          )}`}
                        >
                          {role.displayName}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4 text-sm">
                        {contact.phone || "-"}
                      </td>

                      {/* Last Contact */}
                      <td className="px-6 py-4 text-sm">
                        {formatDate(
                          contact.lastMessageAt || contact.submittedAt
                        )}
                      </td>

                      {/* Messages */}
                      <td className="px-6 py-4 text-sm">
                        {contact.totalMessages} msgs
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleChat(contact)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded text-sm hover:bg-yellow-500"
                        >
                          Chat
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ----------------------- CHAT MODAL ----------------------- */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between bg-[#075e54] text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {getTypeIcon(selectedContact.category)}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {getDisplayName(selectedContact)}
                  </h3>

                  {/* ROLE BADGE */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(
                      getUserRoleInConversation(selectedContact)
                    )}`}
                  >
                    {getUserRoleInConversation(selectedContact).displayName}
                  </span>
                </div>
              </div>

              <button
                onClick={closeChatModal}
                className="p-2 hover:bg-white/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]">
              {chatMessages.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                  No messages yet
                </p>
              )}

              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-[#dcf8c6] text-gray-800"
                        : "bg-white text-gray-700 shadow"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>

                    <div className="text-xs text-gray-600 flex justify-end gap-1 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                      {msg.sender === "user" && (
                        <>
                          {!msg.delivered ? (
                            <Clock className="w-3 h-3" />
                          ) : msg.seen ? (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t rounded-b-lg flex items-center gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:ring-2 focus:ring-[#075e54]"
              />

              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-[#075e54] text-white p-3 rounded-full hover:bg-[#064e44] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactedPeople;
