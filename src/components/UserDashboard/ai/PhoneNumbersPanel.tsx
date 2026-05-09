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
  <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
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
        active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
      {active ? "Active" : status}
    </span>
  );
}

function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
      {type}
    </span>
  );
}

function AvailableBadge({ available }: { available?: boolean }) {
  if (available === undefined) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
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
        <p className="text-xs text-gray-500">{numbers.length} number{numbers.length !== 1 ? "s" : ""}</p>
        <button
          onClick={fetch}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
          <button onClick={fetch} className="ml-auto text-red-500 underline text-xs">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : numbers.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Phone size={36} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No phone numbers yet</p>
          <p className="text-xs mt-1">Contact support to purchase a number.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {numbers.map((n) => (
            <div key={n.id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={18} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900">{n.number}</span>
                  <StatusBadge status={n.status} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {n.country} &middot; Added {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center pt-2">
        To purchase a number, contact{" "}
        <a href="mailto:support@deepvox.ai" className="text-amber-600 hover:underline">
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
  const [form, setForm] = useState<SearchForm>({ country: "US", area_code: "", search_query: "", region: "" });
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
      if (form.country === "US") {
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
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
          <select
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="US">+1 United States</option>
            <option value="IN">+91 India</option>
          </select>
        </div>

        {form.country === "US" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Area Code</label>
              <input
                value={form.area_code}
                onChange={(e) => set("area_code", e.target.value)}
                placeholder="e.g. 415"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Search Query</label>
              <input
                value={form.search_query}
                onChange={(e) => set("search_query", e.target.value)}
                placeholder="e.g. SALES"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        )}

        {form.country === "IN" && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Region</label>
            <select
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
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
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Search
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : searched && results.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <Phone size={30} className="mb-2 opacity-40" />
          <p className="text-sm font-medium">No results found</p>
          <p className="text-xs mt-1">Try a different search.</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-base font-bold text-gray-900">{r.number}</p>
                    {r.region && <p className="text-xs text-gray-500 mt-0.5">{r.region}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypeBadge type={r.type} />
                    <AvailableBadge available={r.available} />
                  </div>
                </div>
                {(r.price !== undefined || r.ind_price !== undefined) && (
                  <p className="text-sm font-semibold text-amber-700 mt-2">
                    {r.price !== undefined ? `$${r.price.toFixed(2)}` : ""}
                    {r.ind_price !== undefined ? `₹${r.ind_price}` : ""}
                    {" "}/ month
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center pt-1">
            Contact{" "}
            <a href="mailto:support@deepvox.ai" className="text-amber-600 hover:underline">
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
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
          <Phone size={20} className="text-amber-700" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Phone Numbers</h1>
          <p className="text-xs text-gray-500">Manage and search phone numbers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-5 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
              tab === t
                ? "border-b-2 border-amber-500 text-amber-700 bg-amber-50"
                : "text-gray-500 hover:text-gray-700"
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
