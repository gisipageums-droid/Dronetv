import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Clock, Star, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { MEDIA_API, LAMBDA } from "../../lib/apiConfig";

const CONTENT_API = MEDIA_API ? `${MEDIA_API}` : `${LAMBDA.media}/media-content`;

interface UserContentItem {
  contentType: string;
  contentId: string;
  title: string;
  description: string;
  userId: string;
  postType: string;
  status: "submitted" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const POST_TYPE_LABEL: Record<string, string> = {
  promo_post: "Promotional Post",
  article: "Editorial Article",
  news_post: "DroneTv News Post",
  press_release: "Press Release",
};

const STATUS_TABS: { value: "submitted" | "approved" | "rejected" | "all"; label: string }[] = [
  { value: "submitted", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export default function AdminUserContentPage() {
  const [items, setItems] = useState<UserContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"submitted" | "approved" | "rejected" | "all">("submitted");
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONTENT_API}/admin?type=user-content`);
      const data = await res.json();
      const list: UserContentItem[] = data.items || [];
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setItems(list);
    } catch {
      toast.error("Couldn't load submitted content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const review = async (item: UserContentItem, action: "approved" | "rejected") => {
    setActingId(item.contentId);
    try {
      const res = await fetch(CONTENT_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "user-content",
          contentId: item.contentId,
          status: action,
          isPublished: action === "approved",
        }),
      });
      if (!res.ok) throw new Error();
      setItems(prev => prev.map(i => i.contentId === item.contentId ? { ...i, status: action } : i));
      toast.success(action === "approved" ? "Approved" : "Rejected");
    } catch {
      toast.error("Failed to update status. Try again.");
    } finally {
      setActingId(null);
    }
  };

  const filtered = tab === "all" ? items : items.filter(i => i.status === tab);
  const pendingCount = items.filter(i => i.status === "submitted").length;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Content Review</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review and approve promotional posts, articles, news posts and press releases submitted from user dashboards (/user-posts).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === t.value ? "bg-yellow-400 text-black" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
            {t.value === "submitted" && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px]">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading submissions…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-3" size={36} />
          <p className="text-sm text-gray-500">No content in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => (
            <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {POST_TYPE_LABEL[item.postType] || item.postType}
                    </span>
                    {item.featured && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                        <Star size={11} />Featured
                      </span>
                    )}
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                      item.status === "approved" ? "bg-green-100 text-green-700"
                        : item.status === "rejected" ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {item.status === "approved" ? <CheckCircle2 size={11} /> : item.status === "rejected" ? <XCircle size={11} /> : <Clock size={11} />}
                      {item.status === "approved" ? "Approved" : item.status === "rejected" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.userId} · {new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{item.description}</p>
              {item.status === "submitted" && (
                <div className="flex gap-2">
                  <button
                    disabled={actingId === item.contentId}
                    onClick={() => review(item, "approved")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-bold disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />Approve
                  </button>
                  <button
                    disabled={actingId === item.contentId}
                    onClick={() => review(item, "rejected")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50"
                  >
                    <XCircle size={14} />Reject
                  </button>
                </div>
              )}
              {item.status !== "submitted" && (
                <button
                  onClick={() => review(item, item.status === "approved" ? "rejected" : "approved")}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                >
                  {item.status === "approved" ? "Revert to rejected" : "Revert to approved"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
