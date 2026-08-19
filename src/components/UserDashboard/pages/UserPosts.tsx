import React, { useState, useEffect, useCallback } from "react";
import {
  Share2, FileText, Newspaper, Megaphone, Plus, Clock, CheckCircle2,
  XCircle, Star, Coins, AlertTriangle, X, ChevronRight, Pencil, Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";
import { AUTH_API, PAYMENT_API, MEDIA_API, LAMBDA } from '../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const NOTIFY_API  = PAYMENT_API ? `${PAYMENT_API}/spend-tokens` : `${LAMBDA.tokenGateway}/spend-tokens`;
const CONTENT_API = MEDIA_API ? `${MEDIA_API}` : `${LAMBDA.media}/media-content`;

function getTierFromPackage(packageType: string | null | undefined): string {
  if (!packageType) return "free";
  const t = packageType.toLowerCase();
  if (t === "brand") return "brand";
  if (t === "scale") return "scale";
  if (t === "reach") return "reach";
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
    color: "bg-status-info/15 text-status-info",
    reach: 2, scale: 6, brand: 12,
    placeholder: "Write your promotional post content. Will be published on LinkedIn, Instagram & Facebook...",
    maxChars: 500,
  },
  {
    type: "article",
    label: "Editorial Article",
    icon: FileText,
    color: "bg-status-success/15 text-status-success",
    reach: 0, scale: 1, brand: 3,
    placeholder: "Provide the topic and key points for your article. DroneTv team will write and publish a 600–1000 word piece...",
    maxChars: 1000,
  },
  {
    type: "news_post",
    label: "DroneTv News Post",
    icon: Newspaper,
    color: "bg-status-info/15 text-status-info",
    reach: 0, scale: 0, brand: 6,
    placeholder: "Describe the announcement, launch, certification or milestone you want to cover...",
    maxChars: 600,
  },
  {
    type: "press_release",
    label: "Press Release",
    icon: Megaphone,
    color: "bg-brand-gold/15 text-brand-gold",
    reach: 0, scale: 0, brand: 6,
    placeholder: "Provide the press release details: headline, key facts, quotes, and contact info...",
    maxChars: 1500,
  },
];

interface Post {
  id: string;
  remoteId?: string;
  type: ContentType;
  title: string;
  content: string;
  status: "submitted" | "in_review" | "published" | "rejected";
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

function backendStatusToLocal(status: string): Post["status"] {
  if (status === "approved") return "published";
  if (status === "rejected") return "rejected";
  return "submitted";
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
  submitted: { label: "Submitted",  cls: "bg-status-info/15 text-status-info",    icon: Clock },
  in_review: { label: "In Review",  cls: "bg-brand-yellow-soft text-brand-gold", icon: Clock },
  published: { label: "Published",  cls: "bg-status-success/15 text-status-success",  icon: CheckCircle2 },
  rejected:  { label: "Rejected",   cls: "bg-status-error/15 text-status-error",      icon: XCircle },
};

const TIER_LABEL: Record<string, string> = { free: "Free", reach: "Reach", scale: "Expand", brand: "Brand" };
const TIER_COLOR: Record<string, string> = {
  free:  "bg-ink-light text-ink-paragraph",
  reach: "bg-status-info/15 text-status-info",
  scale: "bg-brand-yellow-soft text-brand-gold",
  brand: "bg-brand-gold/15 text-brand-gold",
};

const EDITABLE_STATUSES: Post["status"][] = ["submitted", "rejected"];

const UserPosts: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [packageType, setPackageType] = useState<string | null>(null);
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
  const tier = getTierFromPackage(packageType);
  const activeAddons = getActiveAddons(userId);
  const isFeatured = activeAddons.includes("featured_placement");

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const r = await axios.get(`${PROFILE_API}?userId=${userId}`);
      setTokenBalance(r.data?.profile?.tokenBalance ?? 0);
      setPackageType(r.data?.profile?.packageType ?? null);
    } catch { /* silent */ }
    setLoading(false);
  }, [userId]);

  const syncPostStatuses = useCallback(async () => {
    if (!userId) return;
    const local = getStoredPosts(userId);
    const withRemote = local.filter(p => p.remoteId);
    if (!withRemote.length) return;
    try {
      const res = await axios.get(`${CONTENT_API}/admin?type=user-content`);
      const remoteItems: any[] = res.data?.items || [];
      const byId = new Map(remoteItems.map(i => [i.contentId, i]));
      const merged = local.map(p => {
        const remote = p.remoteId ? byId.get(p.remoteId) : null;
        if (!remote) return p;
        return { ...p, status: backendStatusToLocal(remote.status) };
      });
      savePosts(userId, merged);
      setPosts(merged);
    } catch { /* silent — fall back to local status */ }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
    setPosts(getStoredPosts(userId));
    syncPostStatuses();
  }, [fetchProfile, syncPostStatuses, userId]);

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
        if (editingPost.remoteId) {
          await axios.put(CONTENT_API, {
            contentType: "user-content",
            contentId: editingPost.remoteId,
            title: title.trim(),
            description: content.trim(),
            status: "submitted",
          }).catch(() => {});
        }
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
        try {
          const res = await axios.post(CONTENT_API, {
            contentType: "user-content",
            title: title.trim(),
            description: content.trim(),
            userId,
            postType: activeType,
            featured: isFeatured,
            status: "submitted",
          });
          newPost.remoteId = res.data?.item?.contentId;
        } catch {
          toast.warning("Saved locally — couldn't reach the review queue. It'll sync later.");
        }
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
        <p className="text-xs font-bold tracking-widest text-brand-yellow uppercase mb-1">CONTENT</p>
        <h1 className="text-2xl font-black text-ink">My Posts & Content</h1>
        <p className="text-sm text-ink-caption mt-1">Submit content for DroneTv to publish on your behalf.</p>
      </div>

      {/* Plan + featured banner */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${TIER_COLOR[tier]}`}>
            {TIER_LABEL[tier]} Plan
          </span>
          {isFeatured ? (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-yellow text-ink">
              <Star size={12} />Featured Placement Active
            </span>
          ) : (
            <a href="/user-addons" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-ink-light text-ink-paragraph hover:bg-ink-light transition-colors">
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
                isActive ? "border-brand-yellow bg-surface-main" : "border-ink-light bg-surface-card hover:border-ink-light"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={13} className={isActive ? "text-brand-gold" : "text-ink-caption"} />
                <span className={`text-[11px] font-bold leading-tight ${isActive ? "text-brand-gold" : "text-ink-paragraph"}`}>{ct2.label}</span>
              </div>
              {lim === 0 ? (
                <p className="text-[10px] text-ink-caption">Not in your plan</p>
              ) : (
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-ink-caption">{used}/{lim} used</span>
                    {used >= lim && <span className="text-status-error font-semibold">Limit reached</span>}
                  </div>
                  <div className="h-1 bg-ink-light rounded-full">
                    <div className={`h-1 rounded-full ${used >= lim ? "bg-status-error" : "bg-brand-yellow"}`} style={{ width: `${Math.min((used / lim) * 100, 100)}%` }} />
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow text-ink font-bold text-sm hover:bg-brand-gold transition-colors"
          >
            <Plus size={16} />
            Submit New {ct.label}
          </button>
        ) : (
          <div className="bg-surface-card border border-ink-light rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink text-sm">
                {editingPost ? `Edit ${currentCt.label}` : `New ${currentCt.label}`}
              </h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-ink-light transition-colors">
                <X size={16} className="text-ink-caption" />
              </button>
            </div>

            {isFeatured && !editingPost && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-surface-main border border-brand-yellow-soft">
                <Star size={13} className="text-brand-gold flex-shrink-0" />
                <span className="text-xs font-semibold text-brand-gold">Featured Placement active — this post will be promoted at the top</span>
              </div>
            )}

            {editingPost && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-status-info/10 border border-status-info/25">
                <Pencil size={13} className="text-status-info flex-shrink-0" />
                <span className="text-xs font-semibold text-status-info">Editing — post will be resubmitted for review after saving</span>
              </div>
            )}

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-ink-light rounded-xl px-4 py-2.5 text-sm mb-3 text-ink placeholder-ink-caption focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
            />
            <textarea
              placeholder={currentCt.placeholder}
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={currentCt.maxChars}
              rows={5}
              className="w-full border border-ink-light rounded-xl px-4 py-2.5 text-sm resize-none text-ink placeholder-ink-caption focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
            />
            <div className="flex items-center justify-between mt-1 mb-4">
              <span className="text-xs text-ink-caption">{content.length}/{currentCt.maxChars} characters</span>
            </div>
            <div className="flex gap-3">
              <button onClick={closeForm} className="flex-1 px-4 py-2 rounded-xl border border-ink-light text-sm font-semibold text-ink-paragraph hover:bg-ink-offwhite transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 rounded-xl bg-brand-yellow text-ink text-sm font-bold hover:bg-brand-gold transition-colors disabled:opacity-60"
              >
                {submitting ? "Saving…" : editingPost ? "Save & Resubmit" : "Submit for Publishing"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-surface-card rounded-2xl border border-dashed border-ink-light">
          <Share2 size={32} className="mx-auto text-ink-light mb-3" />
          <h3 className="font-bold text-ink-paragraph mb-1">No posts yet</h3>
          <p className="text-sm text-ink-caption">Submit your first content piece above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-ink-caption uppercase tracking-widest mb-2">Submitted Content</h2>
          {posts.map(p => {
            const typeDef = CONTENT_TYPES.find(c => c.type === p.type)!;
            const Icon = typeDef?.icon || FileText;
            const badge = statusBadge[p.status];
            const BadgeIcon = badge.icon;
            const canEdit = EDITABLE_STATUSES.includes(p.status);

            return (
              <div key={p.id} className="bg-surface-card border border-ink-light rounded-xl px-4 py-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-ink-offwhite border border-ink-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={15} className="text-ink-caption" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-semibold text-sm text-ink truncate">{p.title}</span>
                        {p.featured && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-brand-yellow-soft text-brand-gold px-1.5 py-0.5 rounded-full flex-shrink-0">
                            <Star size={8} />Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-caption line-clamp-1 mb-2">{p.content}</p>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                          <BadgeIcon size={10} />{badge.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeDef?.color}`}>{typeDef?.label}</span>
                        <span className="text-[10px] text-ink-caption">
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
                          className="p-1.5 rounded-lg text-ink-caption hover:text-brand-yellow hover:bg-surface-main transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(p)}
                        title="Delete post"
                        className="p-1.5 rounded-lg text-ink-caption hover:text-status-error hover:bg-status-error/10 transition-colors"
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
        <div className="mt-6 p-4 rounded-xl bg-ink text-center">
          <AlertTriangle size={20} className="text-brand-yellow mx-auto mb-2" />
          <p className="text-white text-sm font-semibold mb-1">No content included in Free plan</p>
          <p className="text-white/50 text-xs mb-3">Upgrade to Reach (500+ tokens) to start submitting promotional posts.</p>
          <a href="/user-recharge" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-yellow text-ink text-sm font-bold hover:bg-brand-gold transition-colors">
            <Coins size={14} />Top Up & Upgrade
          </a>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-status-error/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-status-error" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm">Delete Post?</h3>
                <p className="text-xs text-ink-caption mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <div className="bg-ink-offwhite rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-ink truncate">{deleteConfirm.title}</p>
              <p className="text-xs text-ink-caption mt-0.5 line-clamp-1">{deleteConfirm.content}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-ink-light text-sm font-semibold text-ink-paragraph hover:bg-ink-offwhite transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-xl bg-status-error text-white text-sm font-bold hover:bg-status-error transition-colors"
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
