import React, { useState, useEffect, useCallback } from "react";
import {
  Share2, FileText, Newspaper, Megaphone, Plus, Clock, CheckCircle2,
  XCircle, Star, Coins, AlertTriangle, X, ChevronRight, Pencil, Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";
import { AUTH_API, PAYMENT_API, LAMBDA } from '../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const NOTIFY_API  = PAYMENT_API ? `${PAYMENT_API}/spend-tokens` : `${LAMBDA.tokenGateway}/spend-tokens`;

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
    placeholder: "Write your promotional post content. Will be published on LinkedIn, Instagram & Facebook...",
    maxChars: 500,
  },
  {
    type: "article",
    label: "Editorial Article",
    icon: FileText,
    color: "bg-green-100 text-green-700",
    reach: 0, scale: 1, brand: 3,
    placeholder: "Provide the topic and key points for your article. DroneTv team will write and publish a 600–1000 word piece...",
    maxChars: 1000,
  },
  {
    type: "news_post",
    label: "DroneTv News Post",
    icon: Newspaper,
    color: "bg-teal-100 text-teal-700",
    reach: 0, scale: 0, brand: 6,
    placeholder: "Describe the announcement, launch, certification or milestone you want to cover...",
    maxChars: 600,
  },
  {
    type: "press_release",
    label: "Press Release",
    icon: Megaphone,
    color: "bg-purple-100 text-purple-700",
    reach: 0, scale: 0, brand: 6,
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
  updatedAt?: string;
}

function getLimit(ct: ContentLimit, tier: string): number {
  if (tier === "brand") return ct.brand;
  if (tier === "scale") return ct.scale;
  if (tier === "reach") return ct.reach;
  return 0;
}

function getActiveAddons(email: string): string[] {
  try { return JSON.parse(localStorage.getItem(`addons_active_${email}`) || "[]"); }
  catch { return []; }
}

function getStoredPosts(email: string): Post[] {
  try { return JSON.parse(localStorage.getItem(`user_posts_${email}`) || "[]"); }
  catch { return []; }
}

function savePosts(email: string, posts: Post[]) {
  localStorage.setItem(`user_posts_${email}`, JSON.stringify(posts));
}

const statusBadge: Record<Post["status"], { label: string; cls: string; icon: React.ElementType }> = {
  submitted: { label: "Submitted",  cls: "bg-blue-100 text-blue-700",    icon: Clock },
  in_review: { label: "In Review",  cls: "bg-yellow-100 text-yellow-700", icon: Clock },
  published: { label: "Published",  cls: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  rejected:  { label: "Rejected",   cls: "bg-red-100 text-red-700",      icon: XCircle },
};

const TIER_LABEL: Record<string, string> = { free: "Free", reach: "Reach", scale: "Scale", brand: "Brand" };
const TIER_COLOR: Record<string, string> = {
  free:  "bg-gray-100 text-gray-600",
  reach: "bg-blue-100 text-blue-700",
  scale: "bg-yellow-100 text-yellow-700",
  brand: "bg-purple-100 text-purple-700",
};

const EDITABLE_STATUSES: Post["status"][] = ["submitted", "rejected"];

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
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Post | null>(null);

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
  const usedCount = posts.filter(p => p.type === activeType && p.id !== editingPost?.id).length;
  const canSubmit = limit > 0 && usedCount < limit;

  const openNewForm = () => {
    if (tier === "free") { toast.error("Upgrade to Reach or higher to submit content"); return; }
    if (!canSubmit) { toast.error(`You've used all ${getLimit(ct, tier)} ${ct.label}(s) for your plan.`); return; }
    setEditingPost(null);
    setTitle("");
    setContent("");
    setShowForm(true);
  };

  const openEditForm = (post: Post) => {
    setEditingPost(post);
    setActiveType(post.type);
    setTitle(post.title);
    setContent(post.content);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setTitle("");
    setContent("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Fill in title and content"); return; }

    setSubmitting(true);
    try {
      if (editingPost) {
        // UPDATE existing post
        const updated = posts.map(p =>
          p.id === editingPost.id
            ? { ...p, title: title.trim(), content: content.trim(), status: "submitted" as Post["status"], updatedAt: new Date().toISOString() }
            : p
        );
        savePosts(userId, updated);
        setPosts(updated);
        closeForm();
        toast.success("Post updated and resubmitted for review.");
      } else {
        // NEW post
        if (!canSubmit) { toast.error("You've reached your limit for this content type."); return; }
        const newPost: Post = {
          id: `post_${Date.now()}`,
          type: activeType,
          title: title.trim(),
          content: content.trim(),
          status: "submitted",
          featured: isFeatured,
          createdAt: new Date().toISOString(),
        };
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
        closeForm();
        toast.success(`${ct.label} submitted! DroneTv team will review and publish it.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (post: Post) => {
    const updated = posts.filter(p => p.id !== post.id);
    savePosts(userId, updated);
    setPosts(updated);
    setDeleteConfirm(null);
    toast.success("Post deleted.");
  };

  const currentCt = CONTENT_TYPES.find(c => c.type === (editingPost?.type ?? activeType))!;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-1">CONTENT</p>
        <h1 className="text-2xl font-black text-gray-900">My Posts & Content</h1>
        <p className="text-sm text-gray-500 mt-1">Submit content for DroneTv to publish on your behalf.</p>
      </div>

      {/* Plan + featured banner */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${TIER_COLOR[tier]}`}>
            {TIER_LABEL[tier]} Plan
          </span>
          {isFeatured ? (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-400 text-black">
              <Star size={12} />Featured Placement Active
            </span>
          ) : (
            <a href="/user-addons" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Star size={12} />Get Featured Placement<ChevronRight size={12} />
            </a>
          )}
        </div>
      )}

      {/* Content type tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
        {CONTENT_TYPES.map(ct2 => {
          const Icon = ct2.icon;
          const lim = getLimit(ct2, tier);
          const used = posts.filter(p => p.type === ct2.type).length;
          const isActive = activeType === ct2.type;
          return (
            <button
              key={ct2.type}
              onClick={() => { setActiveType(ct2.type); if (!editingPost) setShowForm(false); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={13} className={isActive ? "text-yellow-600" : "text-gray-400"} />
                <span className={`text-[11px] font-bold leading-tight ${isActive ? "text-yellow-700" : "text-gray-600"}`}>{ct2.label}</span>
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
                    <div className={`h-1 rounded-full ${used >= lim ? "bg-red-400" : "bg-yellow-400"}`} style={{ width: `${Math.min((used / lim) * 100, 100)}%` }} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit / Edit form */}
      <div className="mb-5">
        {!showForm ? (
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-500 transition-colors"
          >
            <Plus size={16} />
            Submit New {ct.label}
          </button>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingPost ? `Edit ${currentCt.label}` : `New ${currentCt.label}`}
              </h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {isFeatured && !editingPost && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
                <Star size={13} className="text-yellow-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-yellow-700">Featured Placement active — this post will be promoted at the top</span>
              </div>
            )}

            {editingPost && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                <Pencil size={13} className="text-blue-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-700">Editing — post will be resubmitted for review after saving</span>
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
              placeholder={currentCt.placeholder}
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={currentCt.maxChars}
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
            />
            <div className="flex items-center justify-between mt-1 mb-4">
              <span className="text-xs text-gray-400">{content.length}/{currentCt.maxChars} characters</span>
            </div>
            <div className="flex gap-3">
              <button onClick={closeForm} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 rounded-xl bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors disabled:opacity-60"
              >
                {submitting ? "Saving…" : editingPost ? "Save & Resubmit" : "Submit for Publishing"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <Share2 size={32} className="mx-auto text-gray-200 mb-3" />
          <h3 className="font-bold text-gray-600 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-400">Submit your first content piece above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Submitted Content</h2>
          {posts.map(p => {
            const typeDef = CONTENT_TYPES.find(c => c.type === p.type)!;
            const Icon = typeDef?.icon || FileText;
            const badge = statusBadge[p.status];
            const BadgeIcon = badge.icon;
            const canEdit = EDITABLE_STATUSES.includes(p.status);

            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={15} className="text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-semibold text-sm text-gray-900 truncate">{p.title}</span>
                        {p.featured && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            <Star size={8} />Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">{p.content}</p>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                          <BadgeIcon size={10} />{badge.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeDef?.color}`}>{typeDef?.label}</span>
                        <span className="text-[10px] text-gray-400">
                          {p.updatedAt ? `Edited ${new Date(p.updatedAt).toLocaleDateString("en-IN")}` : new Date(p.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {canEdit && (
                        <button
                          onClick={() => openEditForm(p)}
                          title="Edit post"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(p)}
                        title="Delete post"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Free plan upgrade */}
      {tier === "free" && (
        <div className="mt-6 p-4 rounded-xl bg-gray-900 text-center">
          <AlertTriangle size={20} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-white text-sm font-semibold mb-1">No content included in Free plan</p>
          <p className="text-white/50 text-xs mb-3">Upgrade to Reach (500+ tokens) to start submitting promotional posts.</p>
          <a href="/user-recharge" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors">
            <Coins size={14} />Top Up & Upgrade
          </a>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Delete Post?</h3>
                <p className="text-xs text-gray-500 mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-gray-900 truncate">{deleteConfirm.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{deleteConfirm.content}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
