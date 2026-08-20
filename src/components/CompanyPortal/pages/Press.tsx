import React, { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { fetchMyContent, deleteContent, MediaItem } from "../../../lib/mediaApi";
import PostContentCTA from "../../common/PostContentCTA";
import { PageHeader, Card, EmptyState, Badge } from "../ui";

export default function Press() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetchMyContent(undefined, "press-release")
      .then(setItems)
      .catch(() => toast.error("Failed to load press releases"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

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
        <PageHeader title="Press Releases" sub="Official press releases submitted to DroneTv" />
        <PostContentCTA contentType="press-release" typeLabel="Press Release" onSuccess={load} variant="button" />
      </div>
      {loading ? (
        <Card className="text-center py-16 text-white/40">Loading...</Card>
      ) : items.length === 0 ? (
        <Card><EmptyState text='No press releases yet. Click "Add Content" to submit one.' /></Card>
      ) : (
        <Card className="divide-y divide-ink-light">
          {items.map((item) => (
            <div key={item.contentId} className="p-4 flex items-start justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
                  <Badge tone={item.isPublished ? "success" : "neutral"}>{item.isPublished ? "Published" : "Draft"}</Badge>
                </div>
                <p className="text-xs text-white/40 line-clamp-2">{item.description}</p>
                <p className="text-[11px] text-white/40 mt-1">{item.date || new Date(item.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <button onClick={() => remove(item)} title="Delete"
                className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-error transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
