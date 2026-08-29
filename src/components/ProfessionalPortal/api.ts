import { PROFESSIONAL_API, EVENTS_API, MEDIA_API, JOB_APPLICATIONS_API, LAMBDA } from "../../lib/apiConfig";
import { compressImage } from "../../lib/compressImage";

export function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// The one professional record this logged-in user manages in the portal -
// same resolution pattern as CompanyPortal's getMyCompany().
export async function getMyProfessional(userId: string): Promise<any | null> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/professional-dashboard-cards?userId=${encodeURIComponent(userId)}&viewType=user`, { headers: authHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  const cards = data.cards || [];
  return cards[0] || null;
}

export async function updateProfessionalBase(userId: string, professionalId: string, data: Record<string, any>): Promise<void> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/${encodeURIComponent(userId)}/${professionalId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function getPortalProfile(professionalId: string): Promise<Record<string, any>> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/portal-profile/${professionalId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.portalProfile || {};
}

export async function savePortalProfileSection(professionalId: string, section: string, data: any): Promise<void> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/portal-profile/${professionalId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ section, data }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function getPortfolioUploadUrl(professionalId: string, fileName: string, contentType: string): Promise<{ uploadUrl: string; key: string; fileUrl: string }> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/${professionalId}/portfolio/upload-url`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ fileName, contentType }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function uploadPortfolioFile(professionalId: string, rawFile: File, onProgress?: (pct: number) => void): Promise<string> {
  const file = await compressImage(rawFile);
  const { uploadUrl, fileUrl: url } = await getPortfolioUploadUrl(professionalId, file.name, file.type || "application/octet-stream");
  // XMLHttpRequest, not fetch() — fetch has no upload-progress event, so a
  // multi-MB file on a slow connection just sits with no feedback at all.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error("Failed to upload file"));
    xhr.onerror = () => reject(new Error("Failed to upload file"));
    xhr.send(file);
  });
  return url;
}

export async function trackPortfolioView(professionalId: string, itemId: string): Promise<number> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/${professionalId}/portfolio/${itemId}/view`, { method: "POST" });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.views || 0;
}

// ── Networking ──
export async function getSuggestedConnections(professionalId: string, limit = 6): Promise<any[]> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/connections/suggested?professionalId=${encodeURIComponent(professionalId)}&limit=${limit}`, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function getMyConnections(professionalId: string): Promise<{ accepted: any[]; pendingIncoming: any[]; pendingOutgoing: any[] }> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/connections?professionalId=${encodeURIComponent(professionalId)}`, { headers: authHeaders() });
  if (!res.ok) return { accepted: [], pendingIncoming: [], pendingOutgoing: [] };
  return res.json();
}

export async function sendConnectionRequest(professionalId: string, targetProfessionalId: string): Promise<void> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/connections/${targetProfessionalId}?professionalId=${encodeURIComponent(professionalId)}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function acceptConnectionRequest(connectionId: string): Promise<void> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/connections/${connectionId}/accept`, { method: "POST", headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// ── Community Forum ──
export interface ForumThreadSummary {
  threadId: string;
  professionalId: string;
  authorName: string;
  title: string;
  body: string;
  category?: string;
  createdAt: string;
  replyCount: number;
}

export async function getForumThreads(params: { category?: string; search?: string } = {}): Promise<ForumThreadSummary[]> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  const res = await fetch(`${base}/forum/threads?${qs.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function createForumThread(professionalId: string, title: string, body: string, category: string): Promise<ForumThreadSummary> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/forum/threads?professionalId=${encodeURIComponent(professionalId)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, body, category }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getForumThread(threadId: string): Promise<{ thread: ForumThreadSummary; replies: any[] }> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/forum/threads/${threadId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function replyToForumThread(threadId: string, professionalId: string, body: string): Promise<void> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  const res = await fetch(`${base}/forum/threads/${threadId}/replies?professionalId=${encodeURIComponent(professionalId)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function upvoteForumReply(replyId: string): Promise<void> {
  const base = PROFESSIONAL_API || LAMBDA.professional;
  await fetch(`${base}/forum/replies/${replyId}/upvote`, { method: "POST" });
}

// ── Events ──
export async function getUpcomingEvents(): Promise<any[]> {
  const base = EVENTS_API || LAMBDA.events;
  const res = await fetch(`${base}/events-dashboard?viewType=main`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.cards || [];
}

export { PROFESSIONAL_API, EVENTS_API, MEDIA_API, JOB_APPLICATIONS_API, LAMBDA };
