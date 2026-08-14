import { COMPANY_API, LEADS_API, AUTH_API, PAYMENT_API, MEDIA_API, LAMBDA } from "../../lib/apiConfig";

export function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// The one company record this logged-in user manages in the portal - reads
// from localStorage the same way the rest of UserDashboard already resolves
// "my company" (publishedId cached after first load), avoiding a fresh
// dashboard-cards round trip on every portal page.
export async function getMyCompany(userId: string): Promise<any | null> {
  const url = COMPANY_API
    ? `${COMPANY_API}/dashboard-cards?userId=${encodeURIComponent(userId)}&viewType=user`
    : `${LAMBDA.company}/dashboard-cards?userId=${encodeURIComponent(userId)}&viewType=user`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  const cards = data.cards || [];
  return cards[0] || null;
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
