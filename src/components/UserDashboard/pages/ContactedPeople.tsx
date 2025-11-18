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
  Star,
  Clock,
  Send,
  X,
  Check,
  CheckCheck,
  Calendar,
} from "lucide-react";

interface ContactedEntity {
  id: string;
  name: string;
  type: "company" | "service" | "product" | "professional" | "event";
  description: string;
  lastContacted: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "contact";
  timestamp: string;
  seen: boolean;
  delivered: boolean;
}

const ContactedPeople: React.FC = () => {
  //changes
  const { user } = useUserAuth();
  const userId = user?.email || user?.userData?.email;

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContact, setSelectedContact] = useState<ContactedEntity | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const contactedEntities: ContactedEntity[] = [
    // Companies
    {
      id: "1",
      name: "TechCorp Solutions",
      type: "company",
      description: "Leading software development company",
      lastContacted: "2024-01-15",
      contactPerson: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 234-567-8900",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Data Analytics Inc",
      type: "company",
      description: "Advanced data analytics and BI solutions",
      lastContacted: "2024-01-11",
      contactPerson: "Robert Brown",
      email: "robert@dataanalytics.com",
      phone: "+1 234-567-8904",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Global Finance Ltd",
      type: "company",
      description: "Financial services and consulting",
      lastContacted: "2024-01-08",
      contactPerson: "Maria Garcia",
      email: "maria@globalfinance.com",
      phone: "+1 234-567-8907",
      unreadCount: 1,
    },
    // Professionals
    {
      id: "4",
      name: "Dr. Emily Chen",
      type: "professional",
      description: "Business strategy consultant",
      lastContacted: "2024-01-12",
      email: "emily@chenconsulting.com",
      phone: "+1 234-567-8903",
      unreadCount: 0,
    },
    {
      id: "5",
      name: "Mark Johnson",
      type: "professional",
      description: "Senior software engineer",
      lastContacted: "2024-01-10",
      email: "mark@johnson.dev",
      phone: "+1 234-567-8908",
      unreadCount: 3,
    },
    {
      id: "6",
      name: "Sarah Williams",
      type: "professional",
      description: "Marketing expert and strategist",
      lastContacted: "2024-01-09",
      email: "sarah@williams.market",
      phone: "+1 234-567-8909",
      unreadCount: 0,
    },
    // Events
    {
      id: "7",
      name: "Tech Summit 2024",
      type: "event",
      description: "Annual technology conference and networking event",
      lastContacted: "2024-01-10",
      contactPerson: "Event Team",
      email: "info@techsummit.com",
      phone: "+1 234-567-8905",
      unreadCount: 3,
    },
    {
      id: "8",
      name: "Business Expo 2024",
      type: "event",
      description: "International business exhibition and trade show",
      lastContacted: "2024-01-07",
      contactPerson: "Expo Team",
      email: "contact@businessexpo.com",
      phone: "+1 234-567-8910",
      unreadCount: 0,
    },
    // Products
    {
      id: "9",
      name: "Cloud Storage Plus",
      type: "product",
      description: "Enterprise cloud storage solution",
      lastContacted: "2024-01-13",
      contactPerson: "Mike Wilson",
      email: "mike@cloudstorage.com",
      phone: "+1 234-567-8902",
      unreadCount: 1,
    },
    {
      id: "10",
      name: "Security Suite Pro",
      type: "product",
      description: "Advanced cybersecurity software package",
      lastContacted: "2024-01-06",
      contactPerson: "Support Team",
      email: "support@securitysuite.com",
      phone: "+1 234-567-8911",
      unreadCount: 0,
    },
    // Services
    {
      id: "11",
      name: "Marketing Pro",
      type: "service",
      description: "Digital marketing and SEO services",
      lastContacted: "2024-01-14",
      contactPerson: "Sarah Johnson",
      email: "sarah@marketingpro.com",
      phone: "+1 234-567-8901",
      unreadCount: 0,
    },
    {
      id: "12",
      name: "Design Services Co",
      type: "service",
      description: "Creative design and branding services",
      lastContacted: "2024-01-09",
      contactPerson: "Alex Designer",
      email: "alex@designservices.com",
      phone: "+1 234-567-8906",
      unreadCount: 2,
    },
  ];

  const categories = ["all", "companies", "professionals", "events", "products", "services"];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building className="w-5 h-5" />;
      case "service":
        return <Briefcase className="w-5 h-5" />;
      case "product":
        return <Package className="w-5 h-5" />;
      case "professional":
        return <Users className="w-5 h-5" />;
      case "event":
        return <Calendar className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "company":
        return "bg-blue-100 text-blue-800";
      case "service":
        return "bg-green-100 text-green-800";
      case "product":
        return "bg-purple-100 text-purple-800";
      case "professional":
        return "bg-orange-100 text-orange-800";
      case "event":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContacts = contactedEntities.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contact.type === selectedCategory.slice(0, -1); // Remove 's' from plural
    return matchesSearch && matchesCategory;
  });

  const handleChat = (contact: ContactedEntity) => {
    setSelectedContact(contact);
    setChatMessages([
      {
        id: "1",
        message: `Hello! I'm interested in learning more about ${contact.name}.`,
        sender: "user",
        timestamp: new Date().toISOString(),
        seen: true,
        delivered: true,
      },
      {
        id: "2",
        message: "Hi! Thank you for your interest. How can I help you today?",
        sender: "contact",
        timestamp: new Date().toISOString(),
        seen: false,
        delivered: true,
      },
    ]);
  };

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedContact) {
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
      
      // Simulate message delivery after 500ms
      setTimeout(() => {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, delivered: true }
              : msg
          )
        );
      }, 500);
      
      // Simulate seen status after 1000ms
      setTimeout(() => {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, seen: true }
              : msg
          )
        );
      }, 1000);
      
      // Simulate response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1000).toString(),
          message: "Thank you for your message. I'll get back to you soon!",
          sender: "contact",
          timestamp: new Date().toISOString(),
          seen: false,
          delivered: true,
        };
        setChatMessages(prev => [...prev, response]);
      }, 1500);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacted People</h1>
        <p className="text-gray-600">Manage your connections with companies, services, products, and professionals</p>
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
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(contact.type)}`}>
                      {getTypeIcon(contact.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{contact.type}</p>
                    </div>
                  </div>
                  {contact.unreadCount && contact.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{contact.description}</p>

                {contact.contactPerson && (
                  <p className="text-sm text-gray-500 mb-2">Contact: {contact.contactPerson}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{contact.lastContacted}</span>
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
          ))}
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
                    Contact Person
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
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getTypeColor(contact.type)} mr-3`}>
                          {getTypeIcon(contact.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(contact.type)}`}>
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.contactPerson || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.lastContacted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.unreadCount && contact.unreadCount > 0 ? (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {contact.unreadCount} new
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No new messages</span>
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
                ))}
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
                  {getTypeIcon(selectedContact.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedContact.name}</h3>
                  <p className="text-xs text-white/80">{selectedContact.contactPerson || "Support"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* WhatsApp-like Messages Area */}
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

export default ContactedPeople;
