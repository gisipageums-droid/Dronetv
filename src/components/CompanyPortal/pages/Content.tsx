import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { fetchMyContent, deleteContent, updateContent, MediaItem, ContentType } from "../../../lib/mediaApi";
import PostContentCTA from "../../common/PostContentCTA";
import { PageHeader, Card, EmptyState, Badge, Chip } from "../ui";

const TABS: { value: ContentType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "video", label: "Video Spotlight" },
  { value: "gallery", label: "Gallery" },
  { value: "impact-story", label: "Impact Story" },
  { value: "market-intelligence", label: "Market Intelligence" },
  { value: "tech-trends", label: "Tech Trends" },
  { value: "industry-report", label: "Industry Report" },
];

export default function Content() {
  const [activeTab, setActiveTab] = useState<ContentType | "all">("all");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetchMyContent(undefined, activeTab === "all" ? undefined : activeTab)
      .then(setItems)
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (item: MediaItem) => {
    try {
      await updateContent({ contentType: item.contentType, contentId: item.contentId, isPublished: !item.isPublished });
      toast.success(item.isPublished ? "Unpublished" : "Published");
      load();
    } catch { toast.error("Failed to update"); }
  };

  const remove = async (item: MediaItem) => {
    try {
      await deleteContent(item.contentType, item.contentId);
      toast.success("Deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const createType = activeTab === "all" ? "news" : activeTab;
  const createLabel = TABS.find(t => t.value === createType)?.label || "News";

  return (
    <div>
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <PageHeader title="My Content" sub="Manage what you've posted — create new, edit, publish, or remove" />
        <PostContentCTA contentType={createType as ContentType} typeLabel={createLabel} onSuccess={load} variant="button" />
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map(t => (
          <Chip key={t.value} on={activeTab === t.value} onClick={() => setActiveTab(t.value)}>{t.label}</Chip>
        ))}
      </div>

      {loading ? (
        <Card className="text-center py-16 text-white/40">Loading...</Card>
      ) : items.length === 0 ? (
        <Card><EmptyState text='No content yet. Click "Add Content" to create your first item.' /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.contentId} className="overflow-hidden min-w-0">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-3.5 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-sm line-clamp-2 min-w-0">{item.title}</h3>
                  <Badge tone={item.isPublished ? "success" : "neutral"}>{item.isPublished ? "Published" : "Draft"}</Badge>
                </div>
                <p className="text-xs text-white/40 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(item)} title={item.isPublished ? "Unpublish" : "Publish"}
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-success transition-colors">
                    {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(item)} title="Delete"
                    className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-error transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
