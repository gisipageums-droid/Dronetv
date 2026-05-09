import React, { useState } from "react";
import {
  CreditCard,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { paygApi } from "./echoleadsApi";

const NOT_CONNECTED = (
  <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
    <p className="text-sm font-medium">Not connected</p>
    <p className="text-xs mt-1">Go to Authentication tab first.</p>
  </div>
);

const TABS = ["Configured Call", "Simple Call"] as const;
type Tab = (typeof TABS)[number];

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

interface ConfiguredForm {
  phone_number: string;
  greeting_message: string;
  agent_speaks_first: boolean;
  stt_provider: string;
  stt_api_key: string;
  stt_model: string;
  llm_provider: string;
  llm_api_key: string;
  llm_model: string;
  tts_provider: string;
  tts_api_key: string;
  tts_model: string;
  tts_voice_id: string;
}

const emptyConfigured: ConfiguredForm = {
  phone_number: "",
  greeting_message: "",
  agent_speaks_first: false,
  stt_provider: "",
  stt_api_key: "",
  stt_model: "",
  llm_provider: "",
  llm_api_key: "",
  llm_model: "",
  tts_provider: "",
  tts_api_key: "",
  tts_model: "",
  tts_voice_id: "",
};

function ConfiguredCallTab() {
  const [form, setForm] = useState<ConfiguredForm>({ ...emptyConfigured });
  const [showProviders, setShowProviders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [callId, setCallId] = useState<string | null>(null);

  function set(field: keyof ConfiguredForm, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function makeCall() {
    if (!form.phone_number.trim()) {
      setError("Phone number is required.");
      return;
    }
    setLoading(true);
    setError("");
    setCallId(null);
    try {
      const payload: Parameters<typeof paygApi.configuredCall>[0] = {
        phone_number: form.phone_number.trim(),
      };
      if (form.greeting_message.trim()) payload.greeting_message = form.greeting_message.trim();
      payload.agent_speaks_first = form.agent_speaks_first;
      if (form.stt_provider.trim()) payload.stt_provider = form.stt_provider.trim();
      if (form.stt_api_key.trim()) payload.stt_api_key = form.stt_api_key.trim();
      if (form.stt_model.trim()) payload.stt_model = form.stt_model.trim();
      if (form.llm_provider.trim()) payload.llm_provider = form.llm_provider.trim();
      if (form.llm_api_key.trim()) payload.llm_api_key = form.llm_api_key.trim();
      if (form.llm_model.trim()) payload.llm_model = form.llm_model.trim();
      if (form.tts_provider.trim()) payload.tts_provider = form.tts_provider.trim();
      if (form.tts_api_key.trim()) payload.tts_api_key = form.tts_api_key.trim();
      if (form.tts_model.trim()) payload.tts_model = form.tts_model.trim();
      if (form.tts_voice_id.trim()) payload.tts_voice_id = form.tts_voice_id.trim();

      const res = await paygApi.configuredCall(payload);
      const id =
        (res.data as unknown as { data: { data: { call_id: string } } }).data?.data?.call_id ||
        res.data.data?.call_id ||
        "";
      setCallId(id);
    } catch {
      setError("Call failed. Verify your API key and phone number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelCls}>Phone Number * <span className="font-normal text-gray-400">(E.164 e.g. +14155551234)</span></label>
        <input
          value={form.phone_number}
          onChange={(e) => set("phone_number", e.target.value)}
          placeholder="+14155551234"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Greeting Message</label>
        <input
          value={form.greeting_message}
          onChange={(e) => set("greeting_message", e.target.value)}
          placeholder="Hello! How can I help you today?"
          className={inputCls}
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.agent_speaks_first}
            onChange={(e) => set("agent_speaks_first", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-amber-400 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
        <span className="text-sm text-gray-700 font-medium">Agent speaks first</span>
      </div>

      {/* Provider Settings collapsible */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowProviders((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          Provider Settings
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProviders ? "rotate-180" : ""}`} />
        </button>

        {showProviders && (
          <div className="p-4 space-y-4">
            {/* STT */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Speech-to-Text (STT)</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={labelCls}>Provider</label>
                  <input value={form.stt_provider} onChange={(e) => set("stt_provider", e.target.value)} placeholder="deepgram" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>API Key</label>
                  <input type="password" value={form.stt_api_key} onChange={(e) => set("stt_api_key", e.target.value)} placeholder="••••••••" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Model</label>
                  <input value={form.stt_model} onChange={(e) => set("stt_model", e.target.value)} placeholder="nova-2" className={inputCls} />
                </div>
              </div>
            </div>

            {/* LLM */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Language Model (LLM)</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={labelCls}>Provider</label>
                  <input value={form.llm_provider} onChange={(e) => set("llm_provider", e.target.value)} placeholder="openai" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>API Key</label>
                  <input type="password" value={form.llm_api_key} onChange={(e) => set("llm_api_key", e.target.value)} placeholder="••••••••" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Model</label>
                  <input value={form.llm_model} onChange={(e) => set("llm_model", e.target.value)} placeholder="gpt-3.5-turbo" className={inputCls} />
                </div>
              </div>
            </div>

            {/* TTS */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Text-to-Speech (TTS)</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Provider</label>
                  <input value={form.tts_provider} onChange={(e) => set("tts_provider", e.target.value)} placeholder="cartesia" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>API Key</label>
                  <input type="password" value={form.tts_api_key} onChange={(e) => set("tts_api_key", e.target.value)} placeholder="••••••••" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Model</label>
                  <input value={form.tts_model} onChange={(e) => set("tts_model", e.target.value)} placeholder="sonic-english" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Voice ID</label>
                  <input value={form.tts_voice_id} onChange={(e) => set("tts_voice_id", e.target.value)} placeholder="voice-id" className={inputCls} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={makeCall}
        disabled={loading}
        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60 self-start"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
        Make Call
      </button>

      {callId && (
        <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Call initiated!</p>
            <p className="text-xs mt-0.5 font-mono text-green-700">Call ID: {callId}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SimpleForm {
  phone_number: string;
  voice: string;
  model: string;
  greeting: string;
  instructions: string;
  openai_api_key: string;
}

const emptySimple: SimpleForm = {
  phone_number: "",
  voice: "",
  model: "",
  greeting: "",
  instructions: "",
  openai_api_key: "",
};

function SimpleCallTab() {
  const [form, setForm] = useState<SimpleForm>({ ...emptySimple });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [callId, setCallId] = useState<string | null>(null);

  function set(field: keyof SimpleForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function makeCall() {
    if (!form.phone_number.trim()) { setError("Phone number is required."); return; }
    if (!form.voice.trim()) { setError("Voice is required."); return; }
    if (!form.model.trim()) { setError("Model is required."); return; }
    setLoading(true);
    setError("");
    setCallId(null);
    try {
      const payload: Parameters<typeof paygApi.simpleCall>[0] = {
        phone_number: form.phone_number.trim(),
        voice: form.voice.trim(),
        model: form.model.trim(),
      };
      if (form.greeting.trim()) payload.greeting = form.greeting.trim();
      if (form.instructions.trim()) payload.instructions = form.instructions.trim();
      if (form.openai_api_key.trim()) payload.openai_api_key = form.openai_api_key.trim();

      const res = await paygApi.simpleCall(payload);
      const id =
        (res.data as unknown as { data: { data: { call_id: string } } }).data?.data?.call_id ||
        res.data.data?.call_id ||
        "";
      setCallId(id);
    } catch {
      setError("Call failed. Verify your API key and inputs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelCls}>Phone Number * <span className="font-normal text-gray-400">(E.164)</span></label>
        <input
          value={form.phone_number}
          onChange={(e) => set("phone_number", e.target.value)}
          placeholder="+14155551234"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Voice *</label>
          <input
            value={form.voice}
            onChange={(e) => set("voice", e.target.value)}
            placeholder="cedar"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Model *</label>
          <input
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="gpt-4o-realtime-preview"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Greeting <span className="font-normal text-gray-400">(optional)</span></label>
        <input
          value={form.greeting}
          onChange={(e) => set("greeting", e.target.value)}
          placeholder="Hi there, how can I help?"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Instructions <span className="font-normal text-gray-400">(optional)</span></label>
        <textarea
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
          rows={3}
          placeholder="You are a helpful assistant..."
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className={labelCls}>OpenAI API Key <span className="font-normal text-gray-400">(optional)</span></label>
        <input
          type="password"
          value={form.openai_api_key}
          onChange={(e) => set("openai_api_key", e.target.value)}
          placeholder="sk-••••••••"
          className={inputCls}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={makeCall}
        disabled={loading}
        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-60 self-start"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
        Make Call
      </button>

      {callId && (
        <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Call initiated!</p>
            <p className="text-xs mt-0.5 font-mono text-green-700">Call ID: {callId}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const PaygPanel: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Configured Call");

  if (!localStorage.getItem("echoleads_api_key")) return NOT_CONNECTED;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
          <CreditCard size={20} className="text-amber-700" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Pay As You Go</h1>
          <p className="text-xs text-gray-500">Initiate calls with custom providers</p>
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
        {tab === "Configured Call" ? <ConfiguredCallTab /> : <SimpleCallTab />}
      </div>
    </div>
  );
};

export default PaygPanel;
