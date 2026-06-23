import React, { useState, useEffect, useCallback } from "react";
import {
  Video, FileText, Share2, Newspaper, BookOpen, Megaphone,
  CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Mail,
} from "lucide-react";
import axios from "axios";
import { useUserAuth } from "../../context/context";

const PROFILE_API = "https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/profile";
const TOKEN_THRESHOLD = { reach: 500, scale: 2000, brand: 8000 };

function getTier(tokens: number) {
  if (tokens >= TOKEN_THRESHOLD.brand) return "brand";
  if (tokens >= TOKEN_THRESHOLD.scale) return "scale";
  if (tokens >= TOKEN_THRESHOLD.reach) return "reach";
  return "free";
}

type Status = "included" | "add-on" | "not-included";
type DelivStatus = "pending" | "in_progress" | "delivered";

interface DeliverableItem {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  reach: string;
  scale: string;
  brand: string;
  category: string;
}

const deliverables: DeliverableItem[] = [
  {
    id: "video_interview",
    icon: Video,
    title: "Video Interview (5 min)",
    desc: "CEO / technical lead interview published on YouTube & embedded on your profile.",
    reach: "—",
    scale: "1 interview",
    brand: "2 interviews",
    category: "Video",
  },
  {
    id: "short_reel",
    icon: Video,
    title: "Short Reel (1 min)",
    desc: "Product reel published on Instagram, Facebook & LinkedIn.",
    reach: "—",
    scale: "2 reels",
    brand: "4 reels",
    category: "Video",
  },
  {
    id: "promo_posts",
    icon: Share2,
    title: "Promotional Posts",
    desc: "Company posts across LinkedIn, Instagram and Facebook.",
    reach: "2 posts (one-time)",
    scale: "6 / year",
    brand: "12 / year",
    category: "Social",
  },
  {
    id: "article",
    icon: FileText,
    title: "Editorial Article",
    desc: "600–1000 word article published on DroneTv.in and promoted on social.",
    reach: "—",
    scale: "1 article",
    brand: "3 articles",
    category: "Article",
  },
  {
    id: "news_post",
    icon: Newspaper,
    title: "DroneTv News Post",
    desc: "Short platform news for announcements, launches and milestones.",
    reach: "—",
    scale: "—",
    brand: "6 / year",
    category: "News",
  },
  {
    id: "press_release",
    icon: Megaphone,
    title: "Press Release",
    desc: "Press releases written and published on DroneTv.in.",
    reach: "—",
    scale: "—",
    brand: "6 / year",
    category: "PR",
  },
  {
    id: "magazine",
    icon: BookOpen,
    title: "Magazine Placement",
    desc: "Ad placement in DroneTv quarterly magazine.",
    reach: "—",
    scale: "Half-page × 2",
    brand: "Full-page × 4 + editorial",
    category: "Magazine",
  },
];

const categoryColor: Record<string, string> = {
  Video: "bg-red-900/30 text-red-400",
  Social: "bg-blue-900/30 text-blue-400",
  Article: "bg-green-900/30 text-green-400",
  News: "bg-teal-900/30 text-teal-400",
  PR: "bg-purple-900/30 text-purple-400",
  Magazine: "bg-yellow-900/30 text-yellow-400",
};

const mockStatuses: Record<string, DelivStatus> = {
  promo_posts: "delivered",
  article: "in_progress",
};

function statusBadge(s: DelivStatus) {
  if (s === "delivered") return <span className="flex items-center gap-1 text-xs font-semibold text-green-400"><CheckCircle2 size={13} />Delivered</span>;
  if (s === "in_progress") return <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400"><Clock size={13} />In Progress</span>;
  return <span className="flex items-center gap-1 text-xs font-semibold text-gray-400"><AlertCircle size={13} />Pending</span>;
}

const MediaHub: React.FC = () => {
  const { user } = useUserAuth();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.userData?.email || user?.email || "";

  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await axios.get(`${PROFILE_API}?userId=${userId}`);
      setTokenBalance(res.data?.profile?.tokenBalance || 0);
    } catch { /* silent */ }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const tier = getTier(tokenBalance);

  function getAllocation(d: DeliverableItem): string {
    if (tier === "brand") return d.brand;
    if (tier === "scale") return d.scale;
    if (tier === "reach") return d.reach;
    return "—";
  }

  function getStatus(d: DeliverableItem): Status {
    const alloc = getAllocation(d);
    if (alloc === "—") return "not-included";
    return "included";
  }

  const tierLabel: Record<string, string> = { free: "Free", reach: "Reach", scale: "Scale", brand: "Brand" };
  const tierColor: Record<string, string> = {
    free: "bg-gray-700 text-gray-300",
    reach: "bg-blue-900/40 text-blue-300",
    scale: "bg-yellow-900/40 text-yellow-300",
    brand: "bg-purple-900/40 text-purple-300",
  };

  const included = deliverables.filter(d => getStatus(d) === "included");
  const notIncluded = deliverables.filter(d => getStatus(d) === "not-included");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-1">MEDIA HUB</p>
        <h1 className="text-2xl font-black text-gray-900">Your Media Deliverables</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage all media content produced for your company by DroneTv.</p>
      </div>

      {/* Plan badge + token balance */}
      {!loading && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${tierColor[tier]}`}>
            {tierLabel[tier]} Plan
          </div>
          <div className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
            {tokenBalance.toLocaleString()} tokens available
          </div>
          {tier === "free" && (
            <a href="/user-recharge" className="px-3 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-500 transition-colors">
              Upgrade Plan →
            </a>
          )}
        </div>
      )}

      {/* Included deliverables */}
      {included.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Included in Your Plan</h2>
          <div className="space-y-2">
            {included.map(d => {
              const Icon = d.icon;
              const delivStatus = mockStatuses[d.id] ?? "pending";
              const isOpen = expanded === d.id;
              return (
                <div key={d.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : d.id)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-yellow-400/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-gray-900">{d.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${categoryColor[d.category]}`}>{d.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{getAllocation(d)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {statusBadge(delivStatus)}
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mt-3 mb-3">{d.desc}</p>
                      <div className="flex items-center gap-3">
                        <a
                          href={`mailto:media@dronetv.in?subject=${encodeURIComponent("Media Request: " + d.title)}&body=${encodeURIComponent("Hi DroneTv team,\n\nI'd like to initiate my " + d.title + " deliverable.\n\nMy email: " + userId)}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-500 transition-colors"
                        >
                          <Mail size={13} />
                          Request Now
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Not included */}
      {notIncluded.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Upgrade to Unlock</h2>
          <div className="space-y-2">
            {notIncluded.map(d => {
              const Icon = d.icon;
              return (
                <div key={d.id} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4 opacity-60">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-500">{d.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${categoryColor[d.category]}`}>{d.category}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Scale: {d.scale} &nbsp;|&nbsp; Brand: {d.brand}</p>
                  </div>
                  <a href="/user-recharge" className="flex-shrink-0 text-xs font-bold text-yellow-600 hover:underline">Upgrade</a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {tier === "free" && included.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Video size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-bold text-gray-700 mb-1">No Media Deliverables Yet</h3>
          <p className="text-sm text-gray-400 mb-4">Upgrade your plan to unlock video interviews, articles, social posts and more.</p>
          <a href="/user-recharge" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors">
            View Plans
          </a>
        </div>
      )}
    </div>
  );
};

export default MediaHub;
