import axios from "axios";
import { RFQ_API } from "./apiConfig";
import { authHeader } from "./authService";

export interface Rfq {
  rfqId: string;
  buyerUserId: string;
  title: string;
  category: string;
  description?: string;
  requirements?: Record<string, any>;
  budgetMin?: number | null;
  budgetMax?: number | null;
  location?: string | null;
  deadline?: string | null;
  status: "OPEN" | "AWARDED" | "CANCELLED" | "CLOSED";
  quoteCount: number;
  awardedQuoteId?: string | null;
  awardedAt?: string | null;
  deliveryStatus?: "IN_PROGRESS" | "DELIVERED" | "COMPLETED" | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  quoteId: string;
  rfqId: string;
  vendorUserId: string;
  vendorPublishedId?: string | null;
  vendorCompanyName?: string | null;
  priceAmount: number;
  deliveryDays?: number | null;
  notes?: string | null;
  equipmentDetails?: string | null;
  status: "SUBMITTED" | "AWARDED" | "REJECTED" | "WITHDRAWN";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  rfqId: string;
  reviewerUserId: string;
  revieweeUserId: string;
  revieweeCompanyName?: string | null;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface Dispute {
  disputeId: string;
  rfqId: string;
  raisedByUserId: string;
  reason: string;
  status: "OPEN" | "RESOLVED";
  adminNotes?: string | null;
  resolvedBy?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

const base = RFQ_API || "";

export async function createRfq(userId: string, data: Partial<Rfq>): Promise<Rfq> {
  const res = await axios.post(`${base}/`, { userId, ...data }, { headers: authHeader() });
  return res.data.rfq;
}

export async function myRfqs(userId: string): Promise<Rfq[]> {
  const res = await axios.get(`${base}/mine`, { params: { userId }, headers: authHeader() });
  return res.data.rfqs || [];
}

export async function getRfq(rfqId: string): Promise<Rfq> {
  const res = await axios.get(`${base}/${rfqId}`, { headers: authHeader() });
  return res.data.rfq;
}

export async function cancelRfq(rfqId: string): Promise<Rfq> {
  const res = await axios.post(`${base}/${rfqId}/cancel`, {}, { headers: authHeader() });
  return res.data.rfq;
}

export async function availableRfqs(category?: string, location?: string): Promise<Rfq[]> {
  const res = await axios.get(`${base}/available`, { params: { category, location }, headers: authHeader() });
  return res.data.rfqs || [];
}

export async function rfqQuotes(rfqId: string): Promise<Quote[]> {
  const res = await axios.get(`${base}/${rfqId}/quotes`, { headers: authHeader() });
  return res.data.quotes || [];
}

export async function submitQuote(rfqId: string, userId: string, data: Partial<Quote>): Promise<Quote> {
  const res = await axios.post(`${base}/${rfqId}/quotes`, { userId, ...data }, { headers: authHeader() });
  return res.data.quote;
}

export async function myQuotes(userId: string): Promise<Quote[]> {
  const res = await axios.get(`${base}/quotes/mine`, { params: { userId }, headers: authHeader() });
  return res.data.quotes || [];
}

export async function awardQuote(rfqId: string, quoteId: string): Promise<Rfq> {
  const res = await axios.post(`${base}/${rfqId}/award/${quoteId}`, {}, { headers: authHeader() });
  return res.data.rfq;
}

// Post-award project lifecycle - status only, no payment involved
export async function vendorAwardedProjects(userId: string): Promise<Rfq[]> {
  const res = await axios.get(`${base}/vendor/awarded`, { params: { userId }, headers: authHeader() });
  return res.data.rfqs || [];
}

export async function markDelivered(rfqId: string): Promise<Rfq> {
  const res = await axios.post(`${base}/${rfqId}/mark-delivered`, {}, { headers: authHeader() });
  return res.data.rfq;
}

export async function confirmCompleted(rfqId: string): Promise<Rfq> {
  const res = await axios.post(`${base}/${rfqId}/confirm-completed`, {}, { headers: authHeader() });
  return res.data.rfq;
}

// Reviews
export async function submitReview(rfqId: string, userId: string, rating: number, comment?: string): Promise<Review> {
  const res = await axios.post(`${base}/${rfqId}/review`, { userId, rating, comment }, { headers: authHeader() });
  return res.data.review;
}

export async function getReview(rfqId: string): Promise<Review | null> {
  const res = await axios.get(`${base}/${rfqId}/review`, { headers: authHeader() });
  return res.data.review;
}

export async function vendorRating(userId: string): Promise<{ count: number; average: number | null }> {
  const res = await axios.get(`${base}/vendor-rating`, { params: { userId } });
  return res.data;
}

// Disputes
export async function raiseDispute(rfqId: string, userId: string, reason: string): Promise<Dispute> {
  const res = await axios.post(`${base}/${rfqId}/disputes`, { userId, reason }, { headers: authHeader() });
  return res.data.dispute;
}

export async function listDisputes(rfqId: string): Promise<Dispute[]> {
  const res = await axios.get(`${base}/${rfqId}/disputes`, { headers: authHeader() });
  return res.data.disputes || [];
}

export async function adminListDisputes(status?: string): Promise<Dispute[]> {
  const res = await axios.get(`${base}/admin/disputes`, { params: { status }, headers: authHeader() });
  return res.data.disputes || [];
}

export async function adminResolveDispute(disputeId: string, notes: string): Promise<Dispute> {
  const res = await axios.post(`${base}/admin/disputes/${disputeId}/resolve`, { notes }, { headers: authHeader() });
  return res.data.dispute;
}
