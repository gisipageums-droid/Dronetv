import { COMPANY_API, LEADS_API, AUTH_API, PAYMENT_API, MEDIA_API, LAMBDA } from "../../lib/apiConfig";

export function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// One account can own several companies (token-gated: 1 free, up to 5, or
// unlimited - see UserDashboard getCompanyLimit). The portal lets the user
// pick which one is "active"; that choice is stored here and every page
// resolves against it.
const ACTIVE_KEY = "companyPortal:activePublishedId";

export function getActivePublishedId(): string | null {
  try { return localStorage.getItem(ACTIVE_KEY); } catch { return null; }
}

export function setActivePublishedId(publishedId: string): void {
  try { localStorage.setItem(ACTIVE_KEY, publishedId); } catch { /* ignore */ }
}

// Every company this logged-in user owns, newest first (matches the backend's
// createdAt DESC ordering).
export async function getMyCompanies(userId: string): Promise<any[]> {
  const url = COMPANY_API
    ? `${COMPANY_API}/dashboard-cards?userId=${encodeURIComponent(userId)}&viewType=user`
    : `${LAMBDA.company}/dashboard-cards?userId=${encodeURIComponent(userId)}&viewType=user`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.cards || [];
}

// The company the portal is currently acting on: the user's stored selection
// if it still exists, otherwise the newest company. Returns null only when the
// account owns no companies at all.
export async function getMyCompany(userId: string): Promise<any | null> {
  const cards = await getMyCompanies(userId);
  if (cards.length === 0) return null;
  const active = getActivePublishedId();
  return (active && cards.find((c: any) => c.publishedId === active)) || cards[0];
}

export async function getPortalProfile(publishedId: string): Promise<Record<string, any>> {
  const url = COMPANY_API ? `${COMPANY_API}/portal-profile/${publishedId}` : `${LAMBDA.company}/portal-profile/${publishedId}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.portalProfile || {};
}

export async function savePortalProfileSection(publishedId: string, section: string, data: any): Promise<void> {
  const url = COMPANY_API ? `${COMPANY_API}/portal-profile/${publishedId}` : `${LAMBDA.company}/portal-profile/${publishedId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ section, data }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// Full website content (the `websiteContent` blob) for the company the portal
// user manages. This is the store the public company page and the /products &
// /services listing pages actually read from - the Services & Products tab
// edits `content.services` / `content.products` in here, not the separate
// portalProfile blob (which nothing public renders).
// Self-hosted company service only (company-api.dronetv.in) - no AWS Lambda
// fallback here, deliberately: this data must go through our own control API.
export async function getCompanyContent(publishedId: string): Promise<Record<string, any>> {
  if (!COMPANY_API) throw new Error("Company API not configured");
  const res = await fetch(`${COMPANY_API}/templates?publishId=${encodeURIComponent(publishedId)}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.data || {};
}

export async function saveCompanyContent(userId: string, publishedId: string, websiteContent: any): Promise<void> {
  if (!COMPANY_API) throw new Error("Company API not configured");
  const res = await fetch(`${COMPANY_API}/update`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ userId, publishedId, websiteContent }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function uploadCompanyFile(userId: string, fieldName: string, file: File): Promise<string> {
  const base = COMPANY_API || LAMBDA.company;
  const presignRes = await fetch(`${base}/upload-file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, fieldName, filename: file.name, contentType: file.type || "application/octet-stream" }),
  });
  const presignData = await presignRes.json();
  if (!presignRes.ok || !presignData.success) throw new Error(presignData.error || "Failed to get upload URL");
  const { uploadUrl, imageUrl } = presignData;
  await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
  return imageUrl;
}

export { COMPANY_API, LEADS_API, AUTH_API, PAYMENT_API, MEDIA_API, LAMBDA };
