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
