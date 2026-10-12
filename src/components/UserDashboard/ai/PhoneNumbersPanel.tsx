import React, { useState, useEffect, useCallback } from "react";
import {
  Phone,
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { phoneNumbersApi, type OwnedPhoneNumber, type PhoneNumberResult } from "./echoleadsApi";

const NOT_CONNECTED = (
  <div className="flex flex-col items-center justify-center h-full py-20 text-ink-caption">
    <p className="text-sm font-medium">Not connected</p>
    <p className="text-xs mt-1">Go to Authentication tab first.</p>
  </div>
);

const TABS = ["My Numbers", "Search Available"] as const;
type Tab = (typeof TABS)[number];

const INDIA_REGIONS = ["Gujarat", "Karnataka", "Mumbai"];

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        active ? "bg-status-success/15 text-status-success" : "bg-ink-light text-ink-caption"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-status-success" : "bg-ink-caption"}`} />
      {active ? "Active" : status}
    </span>
  );
}

function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-status-info/10 text-status-info">
      {type}
    </span>
  );
}

function AvailableBadge({ available }: { available?: boolean }) {
  if (available === undefined) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        available ? "bg-status-success/15 text-status-success" : "bg-status-error/15 text-status-error"
      }`}
    >
      {available ? <CheckCircle2 size={11} /> : null}
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

function MyNumbersTab() {
  const [numbers, setNumbers] = useState<OwnedPhoneNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await phoneNumbersApi.list();
      setNumbers((res.data as unknown as { phone_numbers: OwnedPhoneNumber[] }).phone_numbers || []);
    } catch {
      setError("Failed to load phone numbers. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-caption">{numbers.length} number{numbers.length !== 1 ? "s" : ""}</p>
        <button
          onClick={fetch}
          className="p-2 text-ink-caption hover:text-ink-paragraph hover:bg-ink-light rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
          <button onClick={fetch} className="ml-auto text-status-error underline text-xs">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-ink-caption">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : numbers.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-caption">
          <Phone size={36} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No phone numbers yet</p>
          <p className="text-xs mt-1">Contact support to purchase a number.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {numbers.map((n) => (
            <div key={n.id} className="flex items-center gap-4 p-4 bg-surface-card border border-ink-light rounded-xl hover:border-brand-yellow-soft hover:shadow-sm transition-all">
              <div className="w-9 h-9 bg-surface-main rounded-xl flex items-center justify-center shrink-0">
                <Phone size={18} className="text-brand-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-ink">{n.number}</span>
                  <StatusBadge status={n.status} />
                </div>
                <p className="text-xs text-ink-caption mt-0.5">
                  {n.country} &middot; Added {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-caption text-center pt-2">
        To purchase a number, contact{" "}
        <a href="mailto:support@deepvox.ai" className="text-brand-gold hover:underline">
          support@deepvox.ai
        </a>
      </p>
    </div>
  );
}

interface SearchForm {
  country: string;
  area_code: string;
  search_query: string;
  region: string;
}

function SearchAvailableTab() {
  const [form, setForm] = useState<SearchForm>({ country: "+1", area_code: "", search_query: "", region: "" });
  const [results, setResults] = useState<PhoneNumberResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function set(field: keyof SearchForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function doSearch() {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const payload: { country: string; area_code?: string; search_query?: string; region?: string } = {
        country: form.country,
      };
      if (form.country === "+1") {
        if (form.area_code.trim()) payload.area_code = form.area_code.trim();
        if (form.search_query.trim()) payload.search_query = form.search_query.trim();
      } else {
        if (form.region) payload.region = form.region;
      }
      const res = await phoneNumbersApi.search(payload);
      setResults((res.data as unknown as { results: PhoneNumberResult[] }).results || []);
    } catch {
      setError("Search failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="p-4 bg-ink-offwhite border border-ink-light rounded-xl space-y-3">
        <div>
          <label className="block text-xs font-semibold text-ink-paragraph mb-1">Country</label>
          <select
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card"
          >
            <option value="+1">+1 United States</option>
            <option value="+91">+91 India</option>
          </select>
        </div>

        {form.country === "+1" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Area Code</label>
              <input
                value={form.area_code}
                onChange={(e) => set("area_code", e.target.value)}
                placeholder="e.g. 415"
                className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Search Query</label>
              <input
                value={form.search_query}
                onChange={(e) => set("search_query", e.target.value)}
                placeholder="e.g. SALES"
                className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>
        )}

        {form.country === "+91" && (
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Region</label>
            <select
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card"
            >
              <option value="">Any region</option>
              {INDIA_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={doSearch}
          disabled={loading}
          className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-ink text-sm font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Search
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-caption">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : searched && results.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-10 text-ink-caption">
          <Phone size={30} className="mb-2 opacity-40" />
          <p className="text-sm font-medium">No results found</p>
          <p className="text-xs mt-1">Try a different search.</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="bg-surface-card border border-ink-light rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-base font-bold text-ink">{r.number}</p>
                    {r.region && <p className="text-xs text-ink-caption mt-0.5">{r.region}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypeBadge type={r.type} />
                    <AvailableBadge available={r.available} />
                  </div>
                </div>
                {(r.price !== undefined || r.ind_price !== undefined) && (
                  <p className="text-sm font-semibold text-brand-gold mt-2">
                    {r.price !== undefined ? `$${r.price.toFixed(2)}` : ""}
                    {r.ind_price !== undefined ? `₹${r.ind_price}` : ""}
                    {" "}/ month
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-caption text-center pt-1">
            Contact{" "}
            <a href="mailto:support@deepvox.ai" className="text-brand-gold hover:underline">
              support@deepvox.ai
            </a>{" "}
            to purchase any number.
          </p>
        </>
      ) : null}
    </div>
  );
}

const PhoneNumbersPanel: React.FC = () => {
  const [tab, setTab] = useState<Tab>("My Numbers");

  if (!localStorage.getItem("echoleads_api_key")) return NOT_CONNECTED;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 bg-brand-yellow-soft rounded-xl flex items-center justify-center">
          <Phone size={20} className="text-brand-gold" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink">Phone Numbers</h1>
          <p className="text-xs text-ink-caption">Manage and search phone numbers</p>
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
        {tab === "My Numbers" ? <MyNumbersTab /> : <SearchAvailableTab />}
      </div>
    </div>
  );
};

export default PhoneNumbersPanel;
