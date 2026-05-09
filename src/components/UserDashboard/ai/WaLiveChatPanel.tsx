import { useState, useEffect, useCallback, useRef } from "react";
import {
  MessageCircle,
  Send,
  Search,
  RefreshCw,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { waLiveChatApi, WaConversation, WaMessage } from "./echoleadsApi";

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function getInitials(name?: string, phone?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (phone) return phone.slice(-2);
  return "??";
}

interface TemplateModalProps {
  contactId: number;
  onClose: () => void;
}

function TemplateModal({ contactId, onClose }: TemplateModalProps) {
  const [templateName, setTemplateName] = useState("");
  const [language, setLanguage] = useState("en_US");
  const [parametersRaw, setParametersRaw] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSend() {
    if (!templateName.trim()) return;
    setSending(true);
    setResult(null);
    const parameters = parametersRaw
      ? parametersRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    try {
      await waLiveChatApi.sendTemplate({
        contact_id: contactId,
        template_name: templateName.trim(),
        language: language.trim() || "en_US",
        ...(parameters && parameters.length > 0 ? { parameters } : {}),
      });
      setResult({ ok: true, msg: "Template sent successfully." });
    } catch {
      setResult({ ok: false, msg: "Failed to send template." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Send WhatsApp Template</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Template Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. welcome_message"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="en_US"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Parameters{" "}
              <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <textarea
              value={parametersRaw}
              onChange={(e) => setParametersRaw(e.target.value)}
              placeholder="John, Order #123, $50"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
          {result && (
            <div
              className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${
                result.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}
            >
              {result.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {result.msg}
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !templateName.trim()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {sending && <Loader2 size={14} className="animate-spin" />}
            Send Template
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WaLiveChatPanel() {
  const [conversations, setConversations] = useState<WaConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<WaConversation | null>(null);
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKey = localStorage.getItem("echoleads_api_key");

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const res = await waLiveChatApi.getConversations();
      setConversations(res.data.data ?? []);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conv: WaConversation) => {
    setLoadingMessages(true);
    setMessages([]);
    try {
      const res = await waLiveChatApi.getConversation(conv.uid);
      setMessages(res.data.messages ?? []);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleSelectConversation(conv: WaConversation) {
    setSelectedConversation(conv);
    fetchMessages(conv);
    setMessageInput("");
  }

  async function handleSend() {
    if (!messageInput.trim() || !selectedConversation || sending) return;
    const text = messageInput.trim();
    setMessageInput("");
    setSending(true);

    const optimistic: WaMessage = {
      id: Date.now(),
      message: text,
      is_incoming_message: false,
      status: "sending",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await waLiveChatApi.sendMessage(selectedConversation.id, text);
      await fetchMessages(selectedConversation);
    } finally {
      setSending(false);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const filtered = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.user_name ?? "").toLowerCase().includes(q) ||
      c.phone_number.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {showTemplateModal && selectedConversation && (
        <TemplateModal
          contactId={selectedConversation.id}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      <div className="flex h-full overflow-hidden">
        {/* Left column */}
        <div className="w-72 shrink-0 flex flex-col bg-gray-50 border-r border-gray-100 overflow-hidden">
          {/* Search + Refresh */}
          <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              onClick={fetchConversations}
              disabled={loadingConversations}
              className="p-2 rounded-full hover:bg-amber-50 text-gray-400 hover:text-amber-500 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              {loadingConversations ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
            </button>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <MessageCircle size={28} strokeWidth={1.5} />
                <p className="text-xs mt-2">No conversations</p>
              </div>
            )}
            {filtered.map((conv) => {
              const isActive = selectedConversation?.id === conv.id;
              const initials = getInitials(conv.user_name, conv.phone_number);
              const displayName = conv.user_name || conv.phone_number;
              const preview = conv.last_message
                ? conv.last_message.length > 40
                  ? conv.last_message.slice(0, 40) + "…"
                  : conv.last_message
                : "";
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-3 cursor-pointer hover:bg-amber-50 transition-colors border-b border-gray-50 flex items-center gap-3 ${
                    isActive ? "bg-amber-50 border-l-4 border-l-amber-500" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        {displayName}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {formatRelativeTime(conv.last_message_time ?? conv.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[11px] text-gray-400 truncate">{preview}</p>
                      {conv.unread_count && conv.unread_count > 0 ? (
                        <span className="ml-1 shrink-0 min-w-[18px] h-[18px] bg-amber-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {conv.unread_count > 99 ? "99+" : conv.unread_count}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {!selectedConversation ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle size={40} strokeWidth={1.2} />
              <p className="text-sm mt-3 font-medium">Select a conversation</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shrink-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedConversation.user_name || selectedConversation.phone_number}
                  </p>
                  {selectedConversation.user_name && (
                    <p className="text-xs text-gray-400">{selectedConversation.phone_number}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-3 py-1.5 text-xs font-medium border border-amber-400 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  Send Template
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageCircle size={28} strokeWidth={1.5} />
                    <p className="text-xs mt-2">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const incoming = msg.is_incoming_message;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${incoming ? "items-start" : "items-end"}`}
                      >
                        <div
                          className={
                            incoming
                              ? "max-w-[75%] px-4 py-2.5 bg-white border border-gray-100 rounded-2xl rounded-tl-none text-sm text-gray-800"
                              : "max-w-[75%] px-4 py-2.5 bg-amber-400 text-white rounded-2xl rounded-tr-none text-sm ml-auto"
                          }
                        >
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white shrink-0">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !messageInput.trim()}
                  className="p-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-full transition-colors disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
