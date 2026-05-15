import { useUserAuth } from "../../context/context";

export type AiRole = "admin" | "user";

const ADMIN_PANELS = new Set([
  "ai-caller", "caller-agents", "caller-campaigns", "phone-numbers", "call-logs", "dnc",
  "whatsapp", "wa-templates", "wa-contact-groups", "wa-campaigns", "wa-agents", "wa-live-chat",
  "instagram-agents", "contacts", "funnel", "calendar",
]);

const USER_PANELS = new Set([
  "ai-caller", "caller-agents", "caller-campaigns", "phone-numbers", "call-logs", "dnc",
  "whatsapp", "wa-templates", "wa-contact-groups", "wa-campaigns", "wa-agents", "wa-live-chat",
  "instagram-agents", "contacts", "funnel", "calendar",
]);

export function useAiRole() {
  const { isAdminLogin, admin, user } = useUserAuth();

  const role: AiRole = isAdminLogin ? "admin" : "user";
  const allowedPanels = isAdminLogin ? ADMIN_PANELS : USER_PANELS;

  const displayName = isAdminLogin
    ? (admin?.adminData?.userName || admin?.name || admin?.email || "Admin")
    : (user?.name || user?.email || "User");

  return { role, allowedPanels, displayName };
}
