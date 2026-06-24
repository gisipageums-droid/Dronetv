import React, { useState, useEffect, useCallback } from "react";
import {
  Share2, FileText, Newspaper, Megaphone, Plus, Clock, CheckCircle2,
  XCircle, Star, Coins, AlertTriangle, X, ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";

const PROFILE_API = "https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/profile";
const NOTIFY_API  = "https://yv3392if0d.execute-api.ap-south-1.amazonaws.com/dev/drontv-token-buy-payment-gateway/spend-tokens";

// Package tier detection (same thresholds used across dashboard)
function getTier(t: number) {
  if (t >= 8000) return "brand";
  if (t >= 2000) return "scale";
  if (t >= 500)  return "reach";
  return "free";
}

type ContentType = "promo_post" | "article" | "news_post" | "press_release";

interface ContentLimit {
  type: ContentType;
  label: string;
  icon: React.ElementType;
  color: string;
  reach: number;
  scale: number;
  brand: number;
  tokenCost: number;
  placeholder: string;
  maxChars: number;
}

const CONTENT_TYPES: ContentLimit[] = [
  {
    type: "promo_post",
    label: "Promotional Post",
    icon: Share2,
    color: "bg-blue-100 text-blue-700",
    reach: 2, scale: 6, brand: 12,
    tokenCost: 0,
    placeholder: "Write your promotional post content. Will be published on LinkedIn, Instagram & Facebook...",
    maxChars: 500,
  },
  {
    type: "article",
    label: "Editorial Article",
    icon: FileText,
    color: "bg-green-100 text-green-700",
    reach: 0, scale: 1, brand: 3,
    tokenCost: 0,
    placeholder: "Provide the topic and key points for your article. DroneTv team will write and publish a 600–1000 word piece...",
    maxChars: 1000,
  },
  {
    type: "news_post",
    label: "DroneTv News Post",
    icon: Newspaper,
    color: "bg-teal-100 text-teal-700",
    reach: 0, scale: 0, brand: 6,
    tokenCost: 0,
    placeholder: "Describe the announcement, launch, certification or milestone you want to cover...",
    maxChars: 600,
  },
  {
    type: "press_release",
    label: "Press Release",
    icon: Megaphone,
    color: "bg-purple-100 text-purple-700",
    reach: 0, scale: 0, brand: 6,
    tokenCost: 0,
    placeholder: "Provide the press release details: headline, key facts, quotes, and contact info...",
    maxChars: 1500,
  },
];

interface Post {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  status: "submitted" | "in_review" | "published" | "rejected";
  featured: boolean;
  createdAt: string;
}

function getLimit(ct: ContentLimit, tier: string): number {
  if (tier === "brand") return ct.brand;
  if (tier === "scale") return ct.scale;
  if (tier === "reach") return ct.reach;
  return 0;
}

function getActiveAddons(email: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(`addons_active_${email}`) || "[]");
  } catch { return []; }
}

function getStoredPosts(email: string): Post[] {
  try {
    return JSON.parse(localStorage.getItem(`user_posts_${email}`) || "[]");
  } catch { return []; }
}

function savePosts(email: string, posts: Post[]) {
  localStorage.setItem(`user_posts_${email}`, JSON.stringify(posts));
}

const statusBadge: Record<Post["status"], { label: string; cls: string; icon: React.ElementType }> = {
  submitted:  { label: "Submitted",  cls: "bg-blue-100 text-blue-700",   icon: Clock },
  in_review:  { label: "In Review",  cls: "bg-yellow-100 text-yellow-700", icon: Clock },
  published:  { label: "Published",  cls: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected:   { label: "Rejected",   cls: "bg-red-100 text-red-700",     icon: XCircle },
};

const TIER_LABEL: Record<string, string> = { free: "Free", reach: "Reach", scale: "Scale", brand: "Brand" };
const TIER_COLOR: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  reach: "bg-blue-100 text-blue-700",
  scale: "bg-yellow-100 text-yellow-700",
  brand: "bg-purple-100 text-purple-700",
};

const UserPosts: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeType, setActiveType] = useState<ContentType>("promo_post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const userId = user?.userData?.email || user?.email || "";
  const tier = getTier(tokenBalance);
  const activeAddons = getActiveAddons(userId);
  const isFeatured = activeAddons.includes("featured_placement");

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const r = await axios.get(`${PROFILE_API}?userId=${userId}`);
      setTokenBalance(r.data?.profile?.tokenBalance ?? 0);
    } catch { /* silent */ }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
    setPosts(getStoredPosts(userId));
  }, [fetchProfile, userId]);

  const ct = CONTENT_TYPES.find(c => c.type === activeType)!;
  const limit = getLimit(ct, tier);
  const usedCount = posts.filter(p => p.type === activeType).length;
  const canSubmit = limit > 0 && usedCount < limit;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Fill in title and content"); return; }
    if (!canSubmit) { toast.error("You've reached your limit for this content type. Upgrade to submit more."); return; }

    setSubmitting(true);
    const newPost: Post = {
      id: `post_${Date.now()}`,
      type: activeType,
      title: title.trim(),
      content: content.trim(),
      status: "submitted",
      featured: isFeatured,
      createdAt: new Date().toISOString(),
    };

    try {
      // Notify platform team
      await axios.post(NOTIFY_API, {
        userId,
        tokenCount: 0,
        service: activeType,
        serviceName: ct.label,
        postTitle: title,
        postContent: content,
        featured: isFeatured,
      }).catch(() => {});

      const updated = [newPost, ...posts];
      savePosts(userId, updated);
      setPosts(updated);
      setTitle("");
      setContent("");
      setShowForm(false);
      toast.success(`${ct.label} submitted! DroneTv team will review and publish it.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-1">CONTENT</p>
        <h1 className="text-2xl font-black text-gray-900">My Posts & Content</h1>
        <p className="text-sm text-gray-500 mt-1">Submit content for DroneTv to publish on your behalf.</p>
      </div>

      {/* Plan + featured banner */}
      {!loading && (
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${TIER_COLOR[tier]}`}>
            {TIER_LABEL[tier]} Plan
          </span>
          {isFeatured && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-400 text-black">
              <Star size={12} />
              Featured Placement Active — Your listings appear at the top
            </span>
          )}
          {!isFeatured && (
            <a href="/user-addons" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Star size={12} />
              Get Featured Placement
              <ChevronRight size={12} />
            </a>
          )}
        </div>
      )}

      {/* Content type tabs + limits */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {CONTENT_TYPES.map(ct2 => {
          const Icon = ct2.icon;
          const lim = getLimit(ct2, tier);
          const used = posts.filter(p => p.type === ct2.type).length;
          const isActive = activeType === ct2.type;
          return (
            <button
              key={ct2.type}
              onClick={() => { setActiveType(ct2.type); setShowForm(false); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className={isActive ? "text-yellow-600" : "text-gray-400"} />
                <span className={`text-xs font-bold truncate ${isActive ? "text-yellow-700" : "text-gray-600"}`}>{ct2.label}</span>
              </div>
              {lim === 0 ? (
                <p className="text-[10px] text-gray-400">Not in your plan</p>
              ) : (
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-gray-500">{used}/{lim} used</span>
                    {used >= lim && <span className="text-red-500 font-semibold">Limit reached</span>}
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className={`h-1 rounded-full ${used >= lim ? "bg-red-400" : "bg-yellow-400"}`} style={{ width: `${Math.min((used/lim)*100, 100)}%` }} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit form toggle */}
      <div className="mb-6">
        {!showForm ? (
          <button
            onClick={() => {
              if (tier === "free") { toast.error("Upgrade to Reach or higher to submit content"); return; }
              if (!canSubmit) { toast.error(`You've used all ${getLimit(ct, tier)} ${ct.label}(s) for your plan.`); return; }
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-500 transition-colors"
          >
            <Plus size={16} />
            Submit New {ct.label}
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">New {ct.label}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {isFeatured && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs font-semibold text-yellow-700">Featured Placement active — this post will be promoted at the top</span>
              </div>
            )}

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
            <textarea
              placeholder={ct.placeholder}
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={ct.maxChars}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
            <div className="flex items-center justify-between mt-1 mb-4">
              <span className="text-xs text-gray-400">{content.length}/{ct.maxChars} characters</span>
              {isFeatured && <span className="text-xs font-bold text-yellow-600 flex items-center gap-1"><Star size={11} /> Featured</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 rounded-xl bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit for Publishing"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-2xl border border-dashed border-gray-200">
          <Share2 size={36} className="mx-auto text-gray-200 mb-3" />
          <h3 className="font-bold text-gray-600 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-400">Submit your first content piece above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">Submitted Content</h2>
          {posts.filter(p => activeType === p.type || true).map(p => {
            const typeDef = CONTENT_TYPES.find(c => c.type === p.type)!;
            const Icon = typeDef?.icon || FileText;
            const badge = statusBadge[p.status];
            const BadgeIcon = badge.icon;
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm text-gray-900 truncate">{p.title}</span>
                    {p.featured && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                        <Star size={9} />Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{p.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                      <BadgeIcon size={10} />
                      {badge.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeDef?.color}`}>{typeDef?.label}</span>
                    <span className="text-[10px] text-gray-400">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upgrade prompt */}
      {tier === "free" && (
        <div className="mt-6 p-4 rounded-xl bg-gray-900 text-center">
          <AlertTriangle size={20} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-white text-sm font-semibold mb-1">No content included in Free plan</p>
          <p className="text-white/50 text-xs mb-3">Upgrade to Reach (500+ tokens) to start submitting promotional posts.</p>
          <a href="/user-recharge" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors">
            <Coins size={14} />
            Top Up & Upgrade
          </a>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
