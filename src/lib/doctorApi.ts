import { LEADS_API } from './apiConfig';
import { authHeader } from './authService';
import { BookingApiError } from './bookingApi';
import type { Availability, BookingSettings, SavedSettings } from './bookingApi';

export interface DoctorTopic { id: string; label: string; description: string }

export interface DoctorConfig { topics: DoctorTopic[]; feePaise: number; feeLabel: string; doctorName: string; holdMinutes: number }

export interface DoctorBookingInfo {
  id: string;
  ref: string;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'expired' | 'payment_review';
  name: string;
  company: string;
  city: string;
  topic: string;
  topicLabel: string;
  topicDescription: string;
  message: string;
  consultant: string;
  start: string;
  end: string;
  durationMinutes: number;
  dateLabel: string;
  timeRangeLabel: string;
  timezone: string;
  meetLink: string;
  feeLabel: string;
  amountPaise: number;
  paid: boolean;
  refunded: boolean;
  googleCalendarUrl: string;
  holdUntil: string | null;
  token?: string;
  manageUrl?: string;
  payment?: { orderId: string; key: string; amountPaise: number; currency: string };
}

export interface AdminDoctorBooking extends DoctorBookingInfo {
  email: string;
  phone: string;
  createdAt: string | null;
  cancelledBy: string | null;
  paymentId: string | null;
  paymentMethod: string | null;
  orderId: string | null;
  emails: { kind: string; to: string; status: 'sent' | 'skipped' | 'failed'; error: string | null }[];
}

function base(): string {
  if (!LEADS_API) throw new BookingApiError('Booking is not available right now.', 503);
  return `${LEADS_API}/doctor`;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, init);
  } catch {
    throw new BookingApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    const message = typeof detail === 'string' ? detail : Array.isArray(detail) ? (detail[0]?.msg || 'Please check the details you entered.') : `Request failed (${res.status})`;
    throw new BookingApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const post = (body: unknown, extra: Record<string, string> = {}): RequestInit => ({
  method: 'POST', headers: { 'Content-Type': 'application/json', ...extra }, body: JSON.stringify(body),
});

export const fetchDoctorConfig = () => call<DoctorConfig>('/topics');
export const fetchDoctorAvailability = (from: string, to: string) => call<Availability>(`/availability?from=${from}&to=${to}`);

export const createDoctorBooking = (payload: {
  name: string; company: string; email: string; phone: string; city: string; topic: string; message: string;
  confirmed: boolean; start: string; tz: string; website: string;
}) => call<DoctorBookingInfo | undefined>('/bookings', post(payload));

export const confirmDoctorBooking = (id: string, token: string) =>
  call<DoctorBookingInfo>(`/bookings/${encodeURIComponent(id)}/confirm`, post({ token }));

export const fetchDoctorBooking = (id: string, token: string) =>
  call<DoctorBookingInfo>(`/bookings/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`);

export const doctorIcsUrl = (id: string, token: string) =>
  `${base()}/bookings/${encodeURIComponent(id)}/ics?token=${encodeURIComponent(token)}`;

export const doctorAdminGetSettings = () => call<BookingSettings>('/admin/settings', { headers: authHeader() });
export const doctorAdminSaveSettings = (s: BookingSettings) =>
  call<SavedSettings>('/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(s) });
export const doctorAdminList = (params: { status: string; when: string; q: string; purpose?: string }) =>
  call<{ bookings: AdminDoctorBooking[]; count: number }>(
    `/admin/bookings?status=${params.status}&when=${params.when}&q=${encodeURIComponent(params.q)}&purpose=${encodeURIComponent(params.purpose || '')}`,
    { headers: authHeader() },
  );
export const doctorAdminCancel = (id: string, notifyVisitor: boolean, refund: boolean) =>
  call<DoctorBookingInfo>(`/admin/bookings/${id}/cancel`, post({ notifyVisitor, refund }, authHeader()));
export const doctorAdminDelete = (id: string) => call<{ message: string }>(`/admin/bookings/${id}`, { method: 'DELETE', headers: authHeader() });
