import React, { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { fetchMyContent, deleteContent, updateContent, MediaItem } from "../../../lib/mediaApi";
import PostContentCTA from "../../common/PostContentCTA";
import { PageHeader, Card, EmptyState, Badge } from "../ui";

export default function Magazine() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetchMyContent(undefined, "magazine")
      .then(setItems)
      .catch(() => toast.error("Failed to load magazine features"))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div>
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <PageHeader title="Magazine Features" sub="Feature articles about your company in the DroneTv magazine" />
        <PostContentCTA contentType="magazine" typeLabel="Magazine Feature" onSuccess={load} variant="button" />
      </div>
      {loading ? (
        <Card className="text-center py-16 text-ink-caption">Loading...</Card>
      ) : items.length === 0 ? (
        <Card><EmptyState text='No magazine features yet. Click "Add Content" to submit one.' /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.contentId} className="overflow-hidden min-w-0">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-3.5 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-ink text-sm line-clamp-2 min-w-0">{item.title}</h3>
                  <Badge tone={item.isPublished ? "success" : "neutral"}>{item.isPublished ? "Published" : "Draft"}</Badge>
                </div>
                <p className="text-xs text-ink-caption line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(item)} title={item.isPublished ? "Unpublish" : "Publish"}
                    className="p-1.5 rounded hover:bg-ink-light text-ink-caption hover:text-status-success transition-colors">
                    {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(item)} title="Delete"
                    className="p-1.5 rounded hover:bg-ink-light text-ink-caption hover:text-status-error transition-colors">
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
