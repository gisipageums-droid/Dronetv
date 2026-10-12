import React, { useState, useCallback } from "react";
import {
  CalendarCheck,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { calendarApi, type CalendarBooking } from "./echoleadsApi";

const NOT_CONNECTED = (
  <div className="flex flex-col items-center justify-center h-full py-20 text-ink-caption">
    <p className="text-sm font-medium">Not connected</p>
    <p className="text-xs mt-1">Go to Authentication tab first.</p>
  </div>
);

const TABS = ["Bookings", "Check Availability"] as const;
type Tab = (typeof TABS)[number];

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function BookingsTab() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aId, setAId] = useState("");
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: { startDate?: string; endDate?: string; a_id?: string } = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (aId.trim()) params.a_id = aId.trim();
      const res = await calendarApi.list(params);
      setBookings(res.data.bookings || []);
      setLoaded(true);
    } catch {
      setError("Failed to load bookings. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, aId]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="p-4 bg-ink-offwhite border border-ink-light rounded-xl space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-paragraph mb-1">Assistant ID (optional)</label>
          <input
            value={aId}
            onChange={(e) => setAId(e.target.value)}
            placeholder="Filter by assistant ID"
            className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CalendarCheck size={15} />}
            Load Bookings
          </button>
          {loaded && (
            <button
              onClick={load}
              className="p-2 text-ink-caption hover:text-ink-paragraph hover:bg-ink-light rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
          <button onClick={load} className="ml-auto text-status-error underline text-xs">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-caption">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : loaded && bookings.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-10 text-ink-caption">
          <CalendarCheck size={30} className="mb-2 opacity-40" />
          <p className="text-sm font-medium">No bookings found</p>
          <p className="text-xs mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-surface-card border border-ink-light rounded-xl p-4 hover:border-brand-yellow-soft hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-ink">{b.title}</p>
                {b.customer_number && (
                  <span className="text-xs text-ink-caption bg-ink-offwhite border border-ink-light rounded-lg px-2 py-0.5">
                    {b.customer_number}
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-ink-caption">
                  <span className="font-medium text-ink-paragraph">Start:</span> {formatDate(b.start_date)}
                </p>
                <p className="text-xs text-ink-caption">
                  <span className="font-medium text-ink-paragraph">End:</span> {formatDate(b.end_date)}
                </p>
                <p className="text-xs text-ink-caption">
                  Assistant: {b.a_id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckAvailabilityTab() {
  const [assistantId, setAssistantId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check() {
    if (!assistantId.trim() || !date || !time) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await calendarApi.checkAvailability({
        assistant_id: assistantId.trim(),
        availability_date: date,
        availability_time: time,
      });
      setResult(res.data.results ?? "No result returned.");
    } catch {
      setError("Check failed. Verify your API key and inputs.");
    } finally {
      setLoading(false);
    }
  }

  const isAvailabilityPositive = result !== null && result.toLowerCase().includes("availability");

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-ink-offwhite border border-ink-light rounded-xl space-y-3">
        <div>
          <label className="block text-xs font-semibold text-ink-paragraph mb-1">Assistant ID *</label>
          <input
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
            placeholder="e.g. asst_abc123"
            className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Time *</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>

        <button
          onClick={check}
          disabled={loading}
          className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
          Check
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {result !== null && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
            isAvailabilityPositive
              ? "bg-status-success/10 border-status-success/25 text-status-success"
              : "bg-surface-main border-brand-yellow-soft text-brand-gold"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}

const CalendarPanel: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Bookings");

  if (!localStorage.getItem("echoleads_api_key")) return NOT_CONNECTED;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 bg-brand-yellow-soft rounded-xl flex items-center justify-center">
          <CalendarCheck size={20} className="text-brand-gold" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink">Calendar</h1>
          <p className="text-xs text-ink-caption">Bookings and availability</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-ink-light mb-5 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
              tab === t
                ? "border-b-2 border-brand-gold text-brand-gold bg-surface-main"
                : "text-ink-caption hover:text-ink-paragraph"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "Bookings" ? <BookingsTab /> : <CheckAvailabilityTab />}
      </div>
    </div>
  );
};

export default CalendarPanel;
