import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search, ThumbsUp } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getForumThreads, createForumThread, getForumThread, replyToForumThread, upvoteForumReply, ForumThreadSummary } from "../api";
import { PageHeader, Card, Btn, inputCls, EmptyState } from "../ui";

const CATEGORIES = ["DGCA Regulations", "Agriculture", "GIS / Survey", "Equipment", "Jobs", "Career"];

export default function Community() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [professionalId, setProfessionalId] = useState("");
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<ForumThreadSummary[]>([]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [openThread, setOpenThread] = useState<{ thread: ForumThreadSummary; replies: any[] } | null>(null);
  const [replyText, setReplyText] = useState("");

  const load = () => getForumThreads({ search }).then(setThreads).catch(() => toast.error("Failed to load discussions"));

  useEffect(() => {
    if (userId) getMyProfessional(userId).then(c => c && setProfessionalId(c.professionalId)).catch(() => {});
    load().finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => { load(); }, [search]);

  const createThread = async () => {
    if (!professionalId) { toast.error("Complete your professional profile first"); return; }
    if (!title || !body) { toast.error("Title and content are required"); return; }
    try {
      await createForumThread(professionalId, title, body, category);
      toast.success("Discussion posted");
      setTitle(""); setBody(""); setCreating(false);
      load();
    } catch {
      toast.error("Failed to post discussion");
    }
  };

  const openThreadDetail = async (id: string) => {
    try {
      const detail = await getForumThread(id);
      setOpenThread(detail);
    } catch {
      toast.error("Failed to load discussion");
    }
  };

  const postReply = async () => {
    if (!openThread || !replyText.trim() || !professionalId) return;
    try {
      await replyToForumThread(openThread.thread.threadId, professionalId, replyText.trim());
      setReplyText("");
      await openThreadDetail(openThread.thread.threadId);
      load();
    } catch {
      toast.error("Failed to post reply");
    }
  };

  const upvote = async (replyId: string) => {
    await upvoteForumReply(replyId);
    if (openThread) openThreadDetail(openThread.thread.threadId);
  };

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;

  if (openThread) {
    return (
      <div>
        <button className="text-[12.5px] text-brand-yellow mb-4" onClick={() => setOpenThread(null)}>← Back to Community Forum</button>
        <Card className="mb-4">
          <div className="p-4">
            <div className="text-[15px] font-bold text-white mb-1">{openThread.thread.title}</div>
            <div className="text-[11.5px] text-white/40 mb-3">{openThread.thread.authorName} · {openThread.thread.category} · {new Date(openThread.thread.createdAt).toLocaleDateString()}</div>
            <div className="text-[13px] text-white/70 leading-relaxed whitespace-pre-wrap">{openThread.thread.body}</div>
          </div>
        </Card>
        <div className="text-sm font-bold text-white mb-3">{openThread.replies.length} Replies</div>
        {openThread.replies.map((r: any) => (
          <Card key={r.replyId} className="mb-2.5 p-3.5 flex gap-3">
            <div className="flex-1">
              <div className="text-[12.5px] font-bold text-white mb-1">{r.authorName}</div>
              <div className="text-[12.5px] text-white/60 whitespace-pre-wrap">{r.body}</div>
            </div>
            <button onClick={() => upvote(r.replyId)} className="flex flex-col items-center text-white/40 hover:text-brand-yellow flex-shrink-0">
              <ThumbsUp size={14} />
              <span className="text-[10px] mt-0.5">{r.upvotes || 0}</span>
            </button>
          </Card>
        ))}
        <Card className="mt-4">
          <div className="p-3.5 flex gap-2">
            <input className={inputCls} placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && postReply()} />
            <Btn onClick={postReply}>Reply</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Community Forum" sub="Discussions, tips, and peer support from India's drone professional community" />

      <div className="flex flex-wrap gap-2.5 mb-5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-md px-3 py-2 flex-1 min-w-[200px] max-w-[320px]">
          <Search size={15} className="text-white/40" />
          <input className="bg-transparent outline-none text-[13px] text-white placeholder-white/30 w-full" placeholder="Search discussions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Btn onClick={() => setCreating(!creating)}>+ New Discussion</Btn>
      </div>

      {creating && (
        <Card className="mb-5">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input className={inputCls} placeholder="Discussion title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea className={`${inputCls} min-h-[90px] resize-y mb-3`} placeholder="What's on your mind?" value={body} onChange={(e) => setBody(e.target.value)} />
            <Btn onClick={createThread}>Post Discussion</Btn>
          </div>
        </Card>
      )}

      {threads.length === 0 ? (
        <EmptyState text="No discussions yet — start the first one." />
      ) : (
        threads.map(t => (
          <Card key={t.threadId} className="mb-2.5 p-4 flex gap-4 cursor-pointer hover:border-brand-yellow/40" onClick={() => openThreadDetail(t.threadId)}>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-bold text-white mb-1 truncate">{t.title}</div>
              <div className="text-[11px] text-white/40">{t.authorName} · {t.category} · {new Date(t.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[16px] font-extrabold text-status-error">{t.replyCount}</div>
              <div className="text-[10px] text-white/40">replies</div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
