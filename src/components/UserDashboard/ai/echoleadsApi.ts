import axios from "axios";

const BASE = "https://dashboardapi.echoleads.ai/api/v1";

function authHeaders() {
  const key = localStorage.getItem("echoleads_api_key") || "";
  return { Authorization: key, "Content-Type": "application/json" };
}

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authHeaders() };
  return config;
});

// ─────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────
export interface Pagination {
  current_page: number;
  total_pages: number;
  total_records?: number;
  per_page: number;
}

// ─────────────────────────────────────────
// Auth
// ─────────────────────────────────────────
export interface EchoUser {
  id: number;
  name: string;
  email: string;
  status: string;
  is_verified: boolean;
  created_at: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; message: string; user: EchoUser; accessToken: string }>(
      "/auth/login",
      { email, password }
    ),
  register: (data: Record<string, string>) =>
    api.post<{ success: boolean; message: string }>("/auth/register", data),
};

// ─────────────────────────────────────────
// Agents
// ─────────────────────────────────────────
export interface Agent {
  id: number;
  name: string;
  agent_call_type: string;
  agent_status: string;
  a_id?: string;
  firstMessage?: string;
  prompt?: string;
  voice_id?: string;
  language?: string;
  speaks_first?: string;
  silence_timeout?: string;
  max_duration_seconds?: string;
  created_at: string;
  updated_at?: string;
}

export interface AgentPayload {
  name?: string;
  agent_call_type?: string;
  firstMessage?: string;
  prompt?: string;
  voice_id?: string;
  language?: string;
  agent_status?: string;
  speaks_first?: string;
  silence_timeout?: string;
  max_duration_seconds?: string;
}

export interface Voice {
  id: number;
  caller_name: string;
  voice_id: string;
  provider: string;
  gender: string;
  language: string;
  accent?: string;
  is_active?: boolean;
}

export const agentsApi = {
  list: (page = 1, limit = 10, search = "") =>
    api.get<{ success: boolean; data: Agent[]; pagination: Pagination }>(
      `/agent-tables?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    ),
  getById: (id: number) =>
    api.get<{ success: boolean; data: Agent }>(`/agent-tables/${id}`),
  create: (payload: AgentPayload) =>
    api.post<{ success: boolean; data: Agent }>("/agent-tables", payload),
  update: (id: number, payload: AgentPayload) =>
    api.put<{ success: boolean; data: Agent }>(`/agent-tables/${id}`, payload),
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/agent-tables/${id}`),
};

export const voicesApi = {
  list: () => api.get<{ success: boolean; data: Voice[] }>("/admin/voice"),
};

// ─────────────────────────────────────────
// Campaigns
// ─────────────────────────────────────────
export interface Campaign {
  id: number;
  campaign_name: string;
  status: string;
  send_option: string;
  contact_ids: (number | string)[];
  total_calls?: number;
  completed_calls?: number;
  success_rate?: number;
  from_number?: string;
  agent_id?: number;
  schedule_date?: string;
  schedule_time?: string;
  timezone?: string;
  created_at: string;
}

export interface CampaignPayload {
  campaign_name: string;
  agent_id: number;
  from_number: string;
  send_option: string;
  contact_ids: (number | string)[];
  concurrency_reserved?: number;
  concurrency_allocated?: number;
  schedule_date?: string;
  schedule_time?: string;
  timezone?: string;
  retries?: number;
  retry_after?: number;
}

export const campaignsApi = {
  list: (page = 1, limit = 10, status = "", search = "") =>
    api.get<{ success: boolean; campaigns: Campaign[]; pagination: { current_page: number; total_pages: number; total_campaigns: number; per_page: number } }>(
      "/campaigns",
      { params: { page, limit, ...(status && { status }), ...(search && { search }) } }
    ),
  getById: (id: number) =>
    api.get<{ success: boolean; campaign: Campaign }>(`/campaigns/${id}`),
  create: (payload: CampaignPayload) =>
    api.post<{ success: boolean; message: string; campaign: Campaign }>("/campaigns", payload),
  update: (id: number, payload: Partial<CampaignPayload> & { status?: string }) =>
    api.put<{ success: boolean; message: string; campaign: Campaign }>(`/campaigns/${id}`, payload),
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/campaigns/${id}`),
  start: (id: number) =>
    api.post<{ success: boolean; message: string }>(`/campaigns/${id}/start`),
};

// ─────────────────────────────────────────
// Contacts
// ─────────────────────────────────────────
export interface Contact {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  company?: string;
  position?: string;
  status?: string;
  source?: string;
  recording_link?: string;
  transcript?: string;
  call_status?: string;
  created_at?: string;
}

export interface ContactPayload {
  firstName: string;
  phone: string;
  lastName?: string;
  email?: string;
  company?: string;
  position?: string;
  status?: string;
  source?: string;
}

export const contactsApi = {
  list: (page = 1, limit = 10) =>
    api.get<{ success: boolean; contacts: Contact[]; pagination: { current_page: number; total_pages: number; total_contacts: number; per_page: number } }>(
      "/contacts",
      { params: { page, limit } }
    ),
  getById: (id: number) =>
    api.get<{ success: boolean; contact: Contact }>(`/contacts/${id}`),
  create: (payload: ContactPayload) =>
    api.post<{ success: boolean; message: string; contact: Contact }>("/contact", payload),
  bulkCreate: (contacts: ContactPayload[]) =>
    api.post<{ success: boolean; message: string; created_count: number; skipped_count: number; contacts: Contact[] }>(
      "/contacts/bulk",
      { contacts }
    ),
  update: (id: number, payload: ContactPayload) =>
    api.put<{ success: boolean; message: string; contact: Contact }>(`/contacts/${id}`, payload),
  bulkDelete: (ids: number[]) =>
    api.post<{ success: boolean; message: string; deleted_count: number }>("/delete-contacts", { ids }),
  validateDnc: (phones: string[]) =>
    api.post<{ success: boolean; dnc: { phone: string; status: string }[] }>("/validate-dnc", { phones }),
};

// ─────────────────────────────────────────
// Tools
// ─────────────────────────────────────────
export interface Tool {
  id: number;
  tool_name: string;
  description?: string;
  tool_type: string;
  destination_phone_number?: string;
  message_to_customer?: string;
  destination_description?: string;
  transfer_plan_mode?: string;
  vapi_tool_id?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface ToolPayload {
  tool_name: string;
  tool_type?: string;
  description?: string;
  destination_phone_number?: string;
  message_to_customer?: string;
  destination_description?: string;
  transfer_plan_mode?: string;
}

export const toolsApi = {
  list: () =>
    api.get<{ success: boolean; tools: Tool[] }>("/tools"),
  getById: (id: number) =>
    api.get<{ success: boolean; tool: Tool }>(`/tools/${id}`),
  create: (payload: ToolPayload) =>
    api.post<{ success: boolean; message: string; tool: Tool }>("/tools", payload),
  update: (id: number, payload: Partial<ToolPayload> & { status?: string }) =>
    api.put<{ success: boolean; message: string; tool: Tool }>(`/tools/${id}`, payload),
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/tools/${id}`),
};

// ─────────────────────────────────────────
// Providers
// ─────────────────────────────────────────
export interface ProviderConnection {
  id: number;
  provider: string;
  status: string;
  connected_at: string;
  updated_at?: string;
  metadata?: Record<string, string>;
}

export interface ProviderPayload {
  provider: string;
  api_key?: string;
  api_secret?: string;
  account_sid?: string;
  auth_token?: string;
  phone_number?: string;
  metadata?: Record<string, string>;
}

export const providersApi = {
  list: () =>
    api.get<{ success: boolean; message: string; connections: ProviderConnection[] }>("/providers/connections"),
  connect: (payload: ProviderPayload) =>
    api.post<{ success: boolean; message: string; connection: ProviderConnection }>("/providers/connect", payload),
  disconnect: (providerId: number | string) =>
    api.delete<{ success: boolean; message: string }>(`/providers/disconnect/${providerId}`),
};

// ─────────────────────────────────────────
// Funnel
// ─────────────────────────────────────────
export interface FunnelLead {
  id: number;
  contact_id: number;
  funnel_stage: string;
  notes?: string;
  value?: number;
  call_id?: number;
  campaign_id?: number;
  moved_by?: string;
  created_at?: string;
}

export const funnelApi = {
  getLeads: () =>
    api.get<{ success: boolean; leadsByStage: Record<string, FunnelLead[]>; totalLeads: number }>("/funnel/leads"),
  move: (payload: { contact_id: number; funnel_stage: string; notes?: string; value?: number; call_id?: number; campaign_id?: number }) =>
    api.post<{ success: boolean; message: string; lead: FunnelLead }>("/funnel/move", payload),
  update: (id: number, payload: { funnel_stage?: string; notes?: string; value?: number }) =>
    api.put<{ success: boolean; message: string; lead: FunnelLead }>(`/funnel/leads/${id}`, payload),
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/funnel/leads/${id}`),
};

// ─────────────────────────────────────────
// Call Logs
// ─────────────────────────────────────────
export interface CallLog {
  id: number;
  user_id?: number;
  campaign_id?: number;
  contact_id?: number;
  phone?: string;
  a_id?: string;
  agent_id?: number;
  status?: string;
  recording_url?: string;
  transcript?: string;
  call_total_time?: string;
  created_at: string;
  contact?: { id: number; firstName: string; phone: string };
  campaign?: { id: number; campaign_name: string };
  agent?: { id: number; name: string };
}

export interface CallLogsParams {
  status?: string;
  campaign_id?: number;
  agent_id?: number;
  contact_id?: number;
  from_date?: string;
  to_date?: string;
  is_test_call?: boolean;
  limit?: number;
  offset?: number;
}

export const callLogsApi = {
  list: (params: CallLogsParams = {}) =>
    api.get<{ success: boolean; calls: CallLog[]; total_count?: number }>("/call-logs", { params }),
  create: (payload: { phone: string; a_id?: string; campaign_id?: number; firstMessage?: string; from_number?: string }) =>
    api.post<{ success: boolean; message: string; data: { id: string; status: string } }>("/call/create", payload),
};

// ─────────────────────────────────────────
// DNC
// ─────────────────────────────────────────
export interface DncNumber {
  id: number;
  phone: string;
  dnd_status: string;
  user_id: number;
  user_name?: string;
  removal_request_status?: string;
  created_at: string;
}

export interface DncRemovalRequest {
  id: number;
  dnc_number_id: number;
  phone: string;
  reason?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
}

export const dncApi = {
  list: (page = 1, limit = 10, search = "") =>
    api.get<{ success: boolean; dnc_numbers: DncNumber[]; pagination: Pagination }>(
      "/dnc",
      { params: { page, limit, ...(search && { search }) } }
    ),
  add: (phones: string[]) =>
    api.post<{ success: boolean; message: string; added_count: number; skipped_count: number; added: DncNumber[] }>(
      "/dnc/add",
      { phones }
    ),
  requestRemoval: (ids: number[], reason?: string) =>
    api.post<{ success: boolean; message: string; requests_count: number }>("/dnc/request-removal", { ids, reason }),
  getRemovalRequests: (page = 1, limit = 10) =>
    api.get<{ success: boolean; requests: DncRemovalRequest[]; pagination: Pagination }>(
      "/dnc/removal-requests",
      { params: { page, limit } }
    ),
};

// ─────────────────────────────────────────
// Phone Numbers
// ─────────────────────────────────────────
export interface PhoneNumberResult {
  number: string;
  region?: string;
  type?: string;
  area_code?: string;
  country?: string;
  price?: number;
  ind_price?: number;
  available?: boolean;
}

export interface OwnedPhoneNumber {
  id: number;
  number: string;
  status: string;
  country: string;
  created_at: string;
}

export const phoneNumbersApi = {
  list: () =>
    api.get<{ success: boolean; message: string; phone_numbers: OwnedPhoneNumber[] }>("/phone-numbers-api"),
  search: (payload: { country: string; area_code?: string; search_query?: string; region?: string }) =>
    api.post<{ success: boolean; message: string; results: PhoneNumberResult[] }>("/phone-numbers/search", payload),
};

// ─────────────────────────────────────────
// Calendar Booking
// ─────────────────────────────────────────
export interface CalendarBooking {
  id: number;
  title: string;
  a_id: string;
  start_date: string;
  end_date: string;
  customer_number?: string;
}

export const calendarApi = {
  checkAvailability: (payload: { assistant_id: string; availability_date: string; availability_time: string }) =>
    api.post<{ results: string }>("/calendar-booking/check-availability", payload),
  list: (params?: { startDate?: string; endDate?: string; a_id?: string }) =>
    api.get<{ success: boolean; message: string; bookings: CalendarBooking[] }>("/calendar-booking", { params }),
};

// ─────────────────────────────────────────
// Pay As You Go
// ─────────────────────────────────────────
export const paygApi = {
  configuredCall: (payload: {
    phone_number: string;
    stt_provider?: string;
    stt_api_key?: string;
    stt_model?: string;
    llm_provider?: string;
    llm_api_key?: string;
    llm_model?: string;
    tts_provider?: string;
    tts_api_key?: string;
    tts_model?: string;
    tts_voice_id?: string;
    greeting_message?: string;
    agent_speaks_first?: boolean;
  }) =>
    api.post<{ success: boolean; message: string; data: { call_id: string } }>("/call/configured", payload),
  simpleCall: (payload: {
    phone_number: string;
    greeting?: string;
    instructions?: string;
    openai_api_key?: string;
    voice: string;
    model: string;
  }) =>
    api.post<{ success: boolean; message: string; data: { call_id: string } }>("/call/simple", payload),
};

// ─────────────────────────────────────────
// WhatsApp Templates
// ─────────────────────────────────────────
export interface WaTemplate {
  id: number | string;
  _uid?: string;
  name: string;
  language: string;
  category: string;
  header?: string;
  body?: string;
  footer?: string;
  button?: string;
  status?: string;
  whatsapp_template_id?: string;
  error?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WaMetaConfig {
  id: string;
  user_id: string;
  business_account_id: string;
  phone_number_id: string;
  created_at: string;
}

export const waTemplatesApi = {
  sync: () =>
    api.post<{ success: boolean; templates: WaTemplate[]; metaConfigs: WaMetaConfig[]; message: string }>(
      "/whatsapp/templates/sync"
    ),
  getById: (id: number | string) =>
    api.get<{ success: boolean; data: WaTemplate }>(`/whatsapp/templates/${id}`),
  create: (payload: Partial<WaTemplate>) =>
    api.post<{ success: boolean; data: WaTemplate; message: string }>("/whatsapp/templates", payload),
  update: (id: number | string, payload: Partial<WaTemplate>) =>
    api.put<{ success: boolean; data: WaTemplate; message: string }>(`/whatsapp/templates/${id}`, payload),
  delete: (id: number | string) =>
    api.delete<{ success: boolean; message: string }>(`/whatsapp/templates/${id}`),
};

// ─────────────────────────────────────────
// Contact Groups
// ─────────────────────────────────────────
export interface ContactGroup {
  id: number;
  title: string;
  description?: string;
  contact_ids?: number[];
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const contactGroupsApi = {
  list: () =>
    api.get<{ success: boolean; contactGroup: ContactGroup[] }>("/contact-groups"),
  create: (payload: { title: string; description?: string; contact_ids?: number[] }) =>
    api.post<{ success: boolean; message: string; group: ContactGroup }>("/contact-groups", payload),
  update: (id: number, payload: { title?: string; description?: string; contact_ids?: number[] }) =>
    api.put<{ success: boolean; message: string }>(`/contact-groups/${id}`, payload),
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/contact-groups/${id}`),
  bulkDelete: (ids: number[]) =>
    api.post<{ success: boolean; message: string }>("/contact-groups/bulk-delete", { ids }),
  bulkArchive: (ids: number[], is_deleted: boolean) =>
    api.post<{ success: boolean; message: string }>("/contact-groups/bulk-archive", { ids, is_deleted }),
};

// ─────────────────────────────────────────
// WhatsApp Campaigns
// ─────────────────────────────────────────
export interface WaCampaign {
  id: number;
  _uid?: string;
  title: string;
  status: number;
  number_of_contacts?: number;
  template_name?: string;
  template_language?: string;
  scheduled_at?: string;
  timezone?: string;
  is_archived?: boolean;
  created_at: string;
}

export const waCampaignsApi = {
  list: (page = 1, limit = 10) =>
    api.get<{ success: boolean; campaigns: WaCampaign[]; pagination: { current_page: number; total_pages: number; total_campaigns: number; per_page: number } }>(
      "/whatsapp-campaign",
      { params: { page, limit } }
    ),
  getById: (id: number) =>
    api.get<{ success: boolean; campaign: WaCampaign }>(`/whatsapp-campaign/${id}`),
  create: (formData: FormData) =>
    api.post<{ success: boolean; message: string; campaign: WaCampaign }>("/whatsapp-campaign/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  archiveToggle: (id: number) =>
    api.put<{ success: boolean; message: string }>(`/whatsapp-campaign/${id}`),
  rescheduleFailed: (id: number) =>
    api.post<{ success: boolean; message: string; rescheduled_count: number }>(`/whatsapp-campaign/${id}/reschedule-failed`),
};

// ─────────────────────────────────────────
// WhatsApp Agents
// ─────────────────────────────────────────
export interface WaAgent {
  id: number;
  user_id?: string;
  meta_id?: string;
  name: string;
  agent_status: string;
  enable_ai_bot?: boolean;
  credits?: string;
  total_credits?: string;
  firstMessage?: string;
  prompt?: string;
  summary_capturing?: boolean;
  sentiment_detection?: boolean;
  total_chats?: number;
  created_at?: string;
  updated_at?: string;
  meta_config?: { id: number; user_id: number; whatsapp_number: string; uid: string };
}

export const waAgentsApi = {
  getById: (id: number) =>
    api.get<{ success: boolean; whatsappAgent: WaAgent[] }>(`/whatsapp-agent/${id}`),
  create: (formData: FormData) =>
    api.post<{ success: boolean; message: string; whatsappAgent: WaAgent }>("/whatsapp-agent", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, payload: Partial<WaAgent>) =>
    api.put<{ success: boolean; message: string; whatsappAgent: WaAgent }>(`/whatsapp-agent/${id}`, payload),
  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/whatsapp-agent/${id}`),
  toggleAiBot: (agent_id: number, enable: boolean) =>
    api.post<{ success: boolean; message: string }>("/whatsapp-agent/enable-disable-ai-bot", { agent_id, enable }),
};

// ─────────────────────────────────────────
// WhatsApp Live Chat
// ─────────────────────────────────────────
export interface WaConversation {
  id: number;
  uid: string;
  phone_number: string;
  user_name?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WaMessage {
  id: number;
  message: string;
  is_incoming_message: boolean;
  status: string;
  created_at: string;
}

export const waLiveChatApi = {
  getConversations: () =>
    api.get<{ success: boolean; data: WaConversation[]; total: number }>("/whatsapp-conversations"),
  getConversation: (id: string | number) =>
    api.get<{ success: boolean; data: WaConversation; messages: WaMessage[] }>(`/whatsapp-conversations/${id}`),
  sendMessage: (contact_id: number, message: string) =>
    api.post<{ success: boolean; message: string; data: { wamid: string; message_id: number } }>(
      "/whatsapp/send-message",
      { contact_id, message }
    ),
  sendTemplate: (payload: { contact_id: number; template_name: string; language: string; parameters?: string[] }) =>
    api.post<{ success: boolean; message: string }>("/whatsapp/send-message-template", payload),
};
