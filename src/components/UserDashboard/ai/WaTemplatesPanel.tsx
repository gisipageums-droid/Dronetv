import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutTemplate, Plus, Pencil, Trash2, Search, RefreshCw, X,
  Loader2, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  ArrowLeft, Info,
} from "lucide-react";
import { waTemplatesApi, type WaTemplate, type WaMetaConfig } from "./echoleadsApi";

type ToastType = "success" | "error";
interface ToastMsg { id: number; type: ToastType; text: string }

const LANGUAGES = [
  { code: "en_US", label: "English (US)" },
  { code: "en_GB", label: "English (UK)" },
  { code: "hi",    label: "Hindi" },
  { code: "te",    label: "Telugu" },
  { code: "ta",    label: "Tamil" },
  { code: "kn",    label: "Kannada" },
  { code: "ml",    label: "Malayalam" },
  { code: "es",    label: "Spanish" },
  { code: "fr",    label: "French" },
  { code: "pt_BR", label: "Portuguese (BR)" },
  { code: "ar",    label: "Arabic" },
  { code: "de",    label: "German" },
  { code: "it",    label: "Italian" },
];

const CATEGORIES  = ["MARKETING", "UTILITY", "AUTHENTICATION"];
const USE_FOR_OPTIONS = ["Lead Notification", "Appointment Reminder", "Order Confirmation", "Follow Up", "Promotional", "Support"];
const BUTTON_TYPES = [
  { value: "QUICK_REPLY",  label: "Quick Reply" },
  { value: "URL",          label: "URL Button" },
  { value: "DYNAMIC_URL",  label: "Dynamic URL Button" },
  { value: "PHONE_NUMBER", label: "Phone Number" },
  { value: "COPY_CODE",    label: "Copy Code" },
];

interface Btn { type: string; text: string; url?: string; phone?: string; code?: string }

interface TForm {
  phone_number_id: string;
  name: string;
  language: string;
  category: string;
  use_for: string;
  header: string;
  body: string;
  footer: string;
  buttons: Btn[];
  samples: Record<string, string>;
}

function extractVars(text: string): string[] {
  const matches = text.match(/\{\{(\d+)\}\}/g) ?? [];
  return [...new Set(matches.map(m => m.replace(/[{}]/g, "")))].sort((a, b) => +a - +b);
}

function nextVar(text: string): number {
  const nums = extractVars(text).map(Number);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/\*([^*\n]+)\*/g, "<b>$1</b>")
    .replace(/_([^_\n]+)_/g, "<i>$1</i>")
    .replace(/~([^~\n]+)~/g, "<s>$1</s>")
    .replace(/`([^`\n]+)`/g, "<code class='text-xs bg-ink-light px-1 rounded'>$1</code>")
    .replace(/\n/g, "<br>");
}

function applyVars(text: string, samples: Record<string, string>): string {
  return text.replace(/\{\{(\d+)\}\}/g, (_, n) => samples[n] ? `<span class="bg-brand-yellow-soft text-brand-gold rounded px-0.5">${samples[n]}</span>` : `{{${n}}}`);
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ toasts, dismiss }: { toasts: ToastMsg[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto ${
          t.type === "success" ? "bg-status-success/10 text-status-success border border-status-success/25" : "bg-status-error/10 text-status-error border border-status-error/25"
        }`}>
          {t.type === "success" ? <CheckCircle2 size={16} className="text-status-success shrink-0" /> : <AlertTriangle size={16} className="text-status-error shrink-0" />}
          <span>{t.text}</span>
          <button onClick={() => dismiss(t.id)} className="ml-2 opacity-50 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

// ── Category Badge ─────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  const cfg: Record<string, string> = {
    MARKETING: "bg-brand-yellow-soft text-brand-gold",
    UTILITY: "bg-status-info/15 text-status-info",
    AUTHENTICATION: "bg-status-success/15 text-status-success",
  };
  return <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg[category?.toUpperCase()] ?? "bg-ink-light text-ink-caption"}`}>{category || "—"}</span>;
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const cfg: Record<string, string> = {
    APPROVED: "bg-status-success/15 text-status-success",
    PENDING:  "bg-brand-yellow-soft text-brand-gold",
    REJECTED: "bg-status-error/15 text-status-error",
  };
  return <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg[status?.toUpperCase()] ?? "bg-ink-light text-ink-caption"}`}>{status}</span>;
}

// ── Preview Panel ──────────────────────────────────────────────
function TemplatePreview({ form }: { form: TForm }) {
  const headerHtml = parseMarkdown(applyVars(form.header, form.samples));
  const bodyHtml   = parseMarkdown(applyVars(form.body,   form.samples));

  return (
    <div className="sticky top-5">
      <p className="text-xs font-semibold text-ink-caption uppercase tracking-wider mb-3">Template Preview</p>
      <div className="bg-[#e5ddd5] rounded-2xl p-4">
        <p className="text-[10px] text-center text-ink-caption mb-3 font-medium">Chat Background</p>
        <div className="bg-surface-card rounded-xl rounded-tl-none shadow-sm overflow-hidden max-w-full">
          {form.header && (
            <div className="px-3 pt-3 pb-1">
              <p className="text-sm font-semibold text-ink" dangerouslySetInnerHTML={{ __html: headerHtml }} />
            </div>
          )}
          {form.body && (
            <div className="px-3 py-2">
              <p className="text-sm text-ink-charcoal leading-relaxed" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            </div>
          )}
          {form.footer && (
            <div className="px-3 pb-3">
              <p className="text-xs text-ink-caption">{form.footer}</p>
            </div>
          )}
          {!form.header && !form.body && !form.footer && (
            <div className="px-3 py-4 text-xs text-ink-caption italic">Your message will appear here…</div>
          )}
          {form.buttons.length > 0 && (
            <div className="border-t border-ink-light">
              {form.buttons.map((btn, i) => (
                <div key={i} className="py-2 text-center text-sm font-medium text-status-info border-t border-ink-light first:border-t-0">
                  {btn.type === "URL" || btn.type === "DYNAMIC_URL" ? "🔗 " : btn.type === "PHONE_NUMBER" ? "📞 " : btn.type === "COPY_CODE" ? "📋 " : "↩ "}
                  {btn.text || <span className="italic text-ink-caption text-xs">{BUTTON_TYPES.find(t => t.value === btn.type)?.label}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create / Edit Form ─────────────────────────────────────────
interface CreateFormProps {
  initial?: WaTemplate | null;
  metaConfigs: WaMetaConfig[];
  onBack: () => void;
  onSaved: () => void;
  addToast: (type: ToastType, text: string) => void;
}

function CreateForm({ initial, metaConfigs, onBack, onSaved, addToast }: CreateFormProps) {
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [form, setForm] = useState<TForm>({
    phone_number_id: metaConfigs[0]?.phone_number_id ?? "",
    name:     initial?.name     ?? "",
    language: initial?.language ?? "en_US",
    category: initial?.category ?? "MARKETING",
    use_for:  "",
    header:   initial?.header   ?? "",
    body:     initial?.body     ?? "",
    footer:   initial?.footer   ?? "",
    buttons:  (() => { try { return initial?.button ? JSON.parse(initial.button) : []; } catch { return []; } })(),
    samples:  {},
  });

  function set<K extends keyof TForm>(k: K, v: TForm[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  const allVars = [...new Set([...extractVars(form.header), ...extractVars(form.body)])].sort((a, b) => +a - +b);

  async function submit() {
    if (!form.name.trim()) { addToast("error", "Template name is required."); return; }
    if (!form.body.trim()) { addToast("error", "Body is required."); return; }
    setSaving(true);
    try {
      const payload: Partial<WaTemplate> = {
        name:     form.name.trim(),
        language: form.language,
        category: form.category,
        header:   form.header || undefined,
        body:     form.body,
        footer:   form.footer || undefined,
        button:   form.buttons.length ? JSON.stringify(form.buttons) : undefined,
      };
      if (isEdit && initial) {
        await waTemplatesApi.update(initial.id, payload);
        addToast("success", "Template updated.");
      } else {
        await waTemplatesApi.create(payload);
        addToast("success", "Template created.");
      }
      onSaved();
      onBack();
    } catch {
      addToast("error", isEdit ? "Failed to update." : "Failed to create template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-ink-light shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-ink-caption hover:text-ink-charcoal font-medium transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-ink-light">/</span>
        <h2 className="text-base font-bold text-ink">{isEdit ? "Edit Template" : "Template Configuration"}</h2>
      </div>

      {/* Two-column body */}
      <div className="flex-1 overflow-hidden flex">

        {/* LEFT: Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 border-r border-ink-light">

          {/* WhatsApp Number */}
          {metaConfigs.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Select WhatsApp Number</label>
              <select value={form.phone_number_id} onChange={e => set("phone_number_id", e.target.value)}
                className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card">
                {metaConfigs.map(mc => (
                  <option key={mc.id} value={mc.phone_number_id}>{mc.phone_number_id}</option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Template Name *</label>
            <input value={form.name}
              onChange={e => set("name", e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              placeholder="e.g. order_confirmation"
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          </div>

          {/* Language + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Template Language *</label>
              <select value={form.language} onChange={e => set("language", e.target.value)}
                className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card">
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Use For */}
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Use For (Optional)</label>
            <select value={form.use_for} onChange={e => set("use_for", e.target.value)}
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card">
              <option value="">Select…</option>
              {USE_FOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Formatting Help */}
          <div className="rounded-lg border border-ink-light overflow-hidden">
            <button type="button" onClick={() => setShowHelp(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-ink-paragraph hover:bg-ink-offwhite transition-colors">
              <span className="flex items-center gap-2"><Info size={14} className="text-brand-gold" />Template Formatting Help</span>
              {showHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showHelp && (
              <div className="px-4 pb-3 pt-2 text-xs text-ink-caption border-t border-ink-light space-y-1">
                <p>Use <code className="bg-ink-light px-1 rounded">*bold*</code>, <code className="bg-ink-light px-1 rounded">_italic_</code>, <code className="bg-ink-light px-1 rounded">~strikethrough~</code>, <code className="bg-ink-light px-1 rounded">`code`</code>, and <code className="bg-ink-light px-1 rounded">{"{{1}}"}</code> for variables</p>
                <a href="https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates" target="_blank" rel="noreferrer" className="text-brand-gold hover:underline">Learn more</a>
              </div>
            )}
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-ink-paragraph">Header (Optional)</label>
              <span className="text-xs text-ink-caption bg-ink-light px-2 py-0.5 rounded font-medium">Text</span>
            </div>
            <input value={form.header} onChange={e => set("header", e.target.value)}
              placeholder="*hello welcome*"
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
            <button type="button" onClick={() => set("header", form.header + `{{${nextVar(form.header + form.body)}}}`)}
              className="mt-1.5 text-xs text-brand-gold hover:text-brand-yellow font-semibold flex items-center gap-1">
              <Plus size={11} /> Add Variable
            </button>
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Body *</label>
            <textarea value={form.body} onChange={e => set("body", e.target.value)} rows={5}
              placeholder="Enter the text for your message in the language you've selected."
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none" />
            <button type="button" onClick={() => set("body", form.body + `{{${nextVar(form.header + form.body)}}}`)}
              className="mt-1.5 text-xs text-brand-gold hover:text-brand-yellow font-semibold flex items-center gap-1">
              <Plus size={11} /> Add Variable
            </button>
          </div>

          {/* Sample Variables */}
          {allVars.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-2">Sample Text for Variables *</label>
              <div className="space-y-2">
                {allVars.map(n => (
                  <div key={n}>
                    <label className="block text-xs text-ink-caption mb-1">Variable {`{{${n}}}`} *</label>
                    <input value={form.samples[n] ?? ""}
                      onChange={e => set("samples", { ...form.samples, [n]: e.target.value })}
                      placeholder={`Sample value for {{${n}}} (Required)`}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1.5">Footer (Optional)</label>
            <input value={form.footer} onChange={e => set("footer", e.target.value)}
              placeholder="Add a short line of text to the bottom of your message template."
              className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          </div>

          {/* Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink-paragraph">Buttons (Optional)</label>
              <button type="button"
                onClick={() => set("buttons", [...form.buttons, { type: "QUICK_REPLY", text: "" }])}
                className="text-xs text-brand-gold hover:text-brand-yellow font-semibold flex items-center gap-1">
                <Plus size={11} /> Add Button
              </button>
            </div>
            <p className="text-xs text-ink-caption mb-3">Create buttons that let customers respond to your message or take action.</p>
            {form.buttons.length > 0 && (
              <div className="space-y-3">
                {form.buttons.map((btn, i) => (
                  <div key={i} className="p-3 border border-ink-light rounded-xl bg-ink-offwhite space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-caption">{i + 1}</span>
                      <button type="button" onClick={() => set("buttons", form.buttons.filter((_, idx) => idx !== i))}
                        className="text-ink-caption hover:text-status-error transition-colors"><X size={14} /></button>
                    </div>
                    <select value={btn.type}
                      onChange={e => { const next = [...form.buttons]; next[i] = { ...next[i], type: e.target.value }; set("buttons", next); }}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card">
                      {BUTTON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input value={btn.text}
                      onChange={e => { const next = [...form.buttons]; next[i] = { ...next[i], text: e.target.value }; set("buttons", next); }}
                      placeholder="Button Text"
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    {(btn.type === "URL" || btn.type === "DYNAMIC_URL") && (
                      <input value={btn.url ?? ""}
                        onChange={e => { const next = [...form.buttons]; next[i] = { ...next[i], url: e.target.value }; set("buttons", next); }}
                        placeholder="https://example.com"
                        className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    )}
                    {btn.type === "PHONE_NUMBER" && (
                      <input value={btn.phone ?? ""}
                        onChange={e => { const next = [...form.buttons]; next[i] = { ...next[i], phone: e.target.value }; set("buttons", next); }}
                        placeholder="+1234567890"
                        className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    )}
                    {btn.type === "COPY_CODE" && (
                      <input value={btn.code ?? ""}
                        onChange={e => { const next = [...form.buttons]; next[i] = { ...next[i], code: e.target.value }; set("buttons", next); }}
                        placeholder="Coupon code"
                        className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-8">
            <button type="button" onClick={onBack}
              className="px-5 py-2.5 text-sm font-medium text-ink-paragraph hover:text-ink-charcoal border border-ink-light rounded-lg transition-colors">
              Cancel
            </button>
            <button type="button" onClick={submit} disabled={saving}
              className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg px-6 py-2.5 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              {isEdit ? "Save Changes" : "Create Template"}
            </button>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="w-72 shrink-0 px-5 py-5 hidden lg:block overflow-y-auto bg-ink-offwhite/50">
          <TemplatePreview form={form} />
        </div>
      </div>
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────
export default function WaTemplatesPanel() {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-ink-caption">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to Authentication tab first.</p>
      </div>
    );
  }

  const [templates, setTemplates]   = useState<WaTemplate[]>([]);
  const [metaConfigs, setMetaConfigs] = useState<WaMetaConfig[]>([]);
  const [loading, setLoading]       = useState(false);
  const [syncing, setSyncing]       = useState(false);
  const [search, setSearch]         = useState("");
  const [view, setView]             = useState<"list" | "create">("list");
  const [editing, setEditing]       = useState<WaTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [toasts, setToasts]         = useState<ToastMsg[]>([]);
  const counter = React.useRef(0);

  function addToast(type: ToastType, text: string) {
    const id = ++counter.current + Date.now();
    setToasts(p => [...p, { id, type, text }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await waTemplatesApi.sync();
      setTemplates(res.data.templates ?? []);
      setMetaConfigs(res.data.metaConfigs ?? []);
    } catch {
      addToast("error", "Failed to load templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await waTemplatesApi.sync();
      setTemplates(res.data.templates ?? []);
      setMetaConfigs(res.data.metaConfigs ?? []);
      addToast("success", res.data.message || "Templates synced from Meta.");
    } catch {
      addToast("error", "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(id: number | string) {
    if (!confirm("Delete this template?")) return;
    setDeletingId(id);
    try {
      await waTemplatesApi.delete(id);
      addToast("success", "Template deleted.");
      setTemplates(p => p.filter(t => t.id !== id));
    } catch {
      addToast("error", "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  }

  function openCreate() { setEditing(null); setView("create"); }
  function openEdit(t: WaTemplate) { setEditing(t); setView("create"); }
  function backToList() { setView("list"); setEditing(null); }

  if (view === "create") {
    return (
      <>
        <Toast toasts={toasts} dismiss={id => setToasts(p => p.filter(t => t.id !== id))} />
        <CreateForm
          initial={editing}
          metaConfigs={metaConfigs}
          onBack={backToList}
          onSaved={load}
          addToast={addToast}
        />
      </>
    );
  }

  const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <Toast toasts={toasts} dismiss={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-caption pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
              className="w-full pl-9 pr-3 py-2 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          </div>
          <button onClick={load} title="Refresh"
            className="p-2 rounded-lg border border-ink-light text-ink-caption hover:text-brand-yellow hover:border-brand-yellow-soft transition-colors">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleSync} disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 border border-brand-yellow-soft text-brand-gold text-sm font-semibold rounded-lg hover:bg-surface-main disabled:opacity-50 transition-colors">
            {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Sync from Meta
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-gold text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors">
            <Plus size={16} /> New Template
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-ink-caption">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-caption">
            <LayoutTemplate size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">{search ? "No templates match your search" : "No templates yet"}</p>
            <p className="text-xs mt-1">{search ? "Try a different name." : "Sync from Meta or create a new template."}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(t => (
              <div key={t.id} className="bg-surface-card border border-ink-light rounded-xl p-4 hover:border-brand-yellow-soft hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{t.name}</p>
                    <p className="text-xs text-ink-caption mt-0.5">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                  </div>
                  {t.status && <StatusBadge status={t.status} />}
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <CategoryBadge category={t.category} />
                  <span className="text-xs text-ink-caption font-medium">{t.language}</span>
                </div>
                {t.body && (
                  <p className="text-xs text-ink-caption line-clamp-2 mb-3 leading-relaxed">
                    {t.body.length > 80 ? t.body.slice(0, 80) + "…" : t.body}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-3 border-t border-ink-light">
                  <button onClick={() => openEdit(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-offwhite hover:bg-surface-main text-ink-paragraph hover:text-brand-yellow text-xs font-semibold rounded-lg transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <div className="flex-1" />
                  <button onClick={() => handleDelete(t.id)} disabled={deletingId === t.id}
                    className="p-1.5 text-ink-caption hover:text-status-error rounded-lg hover:bg-status-error/10 transition-colors disabled:opacity-50">
                    {deletingId === t.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
