import React, { useState, useEffect, useCallback } from "react";
import {
  Server,
  Plug,
  Plus,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { providersApi, type ProviderConnection, type ProviderPayload } from "./echoleadsApi";

// ---------- Not connected guard ----------
function NotConnected() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
      <p className="text-sm font-medium">Not connected</p>
      <p className="text-xs mt-1">Go to the Authentication tab first.</p>
    </div>
  );
}

// ---------- Status badge ----------
function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      {isActive ? "Active" : status}
    </span>
  );
}

// ---------- Capitalize ----------
function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------- Connect modal ----------
const KNOWN_PROVIDERS = ["twilio", "vonage", "plivo", "custom"];

const emptyForm: ProviderPayload & { _customProvider: string } = {
  provider: "twilio",
  _customProvider: "",
  account_sid: "",
  auth_token: "",
  phone_number: "",
  api_key: "",
  api_secret: "",
  metadata: {},
};

interface ConnectModalProps {
  onClose: () => void;
  onConnected: () => void;
}

function ConnectModal({ onClose, onConnected }: ConnectModalProps) {
  const [form, setForm] = useState({ ...emptyForm });
  const [metaJson, setMetaJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const isTwilio = form.provider === "twilio";
  const isCustom = form.provider === "custom";

  async function submit() {
    const providerName = isCustom ? form._customProvider.trim() : form.provider;
    if (!providerName) { setError("Provider name is required."); return; }

    let metadata: Record<string, string> | undefined;
    if (metaJson.trim()) {
      try {
        metadata = JSON.parse(metaJson.trim());
      } catch {
        setError("Metadata must be valid JSON.");
        return;
      }
    }

    const payload: ProviderPayload = {
      provider: providerName,
      account_sid: form.account_sid || undefined,
      auth_token: form.auth_token || undefined,
      phone_number: form.phone_number || undefined,
      api_key: !isTwilio ? (form.api_key || undefined) : undefined,
      api_secret: !isTwilio ? (form.api_secret || undefined) : undefined,
      metadata,
    };

    setLoading(true);
    setError("");
    try {
      await providersApi.connect(payload);
      onConnected();
      onClose();
    } catch {
      setError("Request failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Plug size={20} className="text-amber-600" />
            <h3 className="text-base font-bold text-gray-900">Connect Provider</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Provider select */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Provider *</label>
            <select
              value={form.provider}
              onChange={(e) => set("provider", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {KNOWN_PROVIDERS.map((p) => (
                <option key={p} value={p}>{capitalize(p)}</option>
              ))}
            </select>
          </div>

          {/* Custom provider text input */}
          {isCustom && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Custom Provider Name *</label>
              <input
                value={form._customProvider}
                onChange={(e) => set("_customProvider", e.target.value)}
                placeholder="e.g. bandwidth"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}

          {/* Account SID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Account SID</label>
            <input
              value={form.account_sid}
              onChange={(e) => set("account_sid", e.target.value)}
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Auth token */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Auth Token</label>
            <input
              type="password"
              value={form.auth_token}
              onChange={(e) => set("auth_token", e.target.value)}
              placeholder="Your auth token"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
            <input
              value={form.phone_number}
              onChange={(e) => set("phone_number", e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* API key + secret — hidden for twilio */}
          {!isTwilio && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">API Key</label>
                <input
                  value={form.api_key}
                  onChange={(e) => set("api_key", e.target.value)}
                  placeholder="Your API key"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">API Secret</label>
                <input
                  type="password"
                  value={form.api_secret}
                  onChange={(e) => set("api_secret", e.target.value)}
                  placeholder="Your API secret"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </>
          )}

          {/* Metadata JSON */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Metadata <span className="font-normal text-gray-400">(optional JSON)</span>
            </label>
            <textarea
              value={metaJson}
              onChange={(e) => setMetaJson(e.target.value)}
              rows={3}
              placeholder='{"region": "us-east-1"}'
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Disconnect confirm ----------
function DisconnectConfirm({
  connection,
  onCancel,
  onDisconnected,
}: {
  connection: ProviderConnection;
  onCancel: () => void;
  onDisconnected: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setLoading(true);
    setError("");
    try {
      await providersApi.disconnect(connection.id);
      onDisconnected();
    } catch {
      setError("Failed to disconnect. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Disconnect Provider</h3>
            <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Are you sure you want to disconnect <span className="font-semibold">{capitalize(connection.provider)}</span>?
        </p>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main panel ----------
const ProvidersPanel: React.FC = () => {
  if (!localStorage.getItem("echoleads_api_key")) return <NotConnected />;

  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<ProviderConnection | null>(null);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await providersApi.list();
      setConnections(res.data.connections || []);
    } catch {
      setFetchError("Failed to load providers. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  function onConnected() {
    fetchConnections();
  }

  function onDisconnected() {
    setDisconnectTarget(null);
    fetchConnections();
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <Server size={20} className="text-amber-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Providers</h1>
            <p className="text-xs text-gray-500">
              {connections.length > 0
                ? `${connections.length} provider${connections.length === 1 ? "" : "s"} connected`
                : "Manage your telephony providers"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchConnections}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            Connect Provider
          </button>
        </div>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={fetchConnections} className="ml-auto text-red-500 underline text-xs">Retry</button>
        </div>
      )}

      {/* Connections list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Server size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No providers connected</p>
            <p className="text-xs mt-1">Connect a telephony provider to start making calls.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Plug size={20} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{capitalize(conn.provider)}</span>
                    <StatusBadge status={conn.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Connected {new Date(conn.connected_at).toLocaleDateString()}
                    {conn.updated_at && conn.updated_at !== conn.connected_at && (
                      <> &middot; Updated {new Date(conn.updated_at).toLocaleDateString()}</>
                    )}
                  </p>
                  {conn.metadata && Object.keys(conn.metadata).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {Object.entries(conn.metadata).map(([k, v]) => (
                        <span key={k} className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5 text-gray-500">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => setDisconnectTarget(conn)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <ConnectModal
          onClose={() => setShowModal(false)}
          onConnected={onConnected}
        />
      )}
      {disconnectTarget && (
        <DisconnectConfirm
          connection={disconnectTarget}
          onCancel={() => setDisconnectTarget(null)}
          onDisconnected={onDisconnected}
        />
      )}
    </div>
  );
};

export default ProvidersPanel;
