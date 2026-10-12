import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { contactsApi, type Contact, type ContactPayload } from "./echoleadsApi";

// ---------- Badges ----------
function CallStatusBadge({ status }: { status?: string }) {
  if (status === "ended") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success">
        <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
        Ended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ink-light text-ink-caption">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-caption" />
      {status || "None"}
    </span>
  );
}

function ContactStatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    New: "bg-status-info/15 text-status-info",
    Warm: "bg-brand-yellow-soft text-brand-gold",
    Hot: "bg-status-error/15 text-status-error",
    Cold: "bg-ink-light text-ink-paragraph",
  };
  const cls = (status && map[status]) || "bg-ink-light text-ink-caption";
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {status || "—"}
    </span>
  );
}

// ---------- Contact Modal ----------
const emptyForm: ContactPayload = {
  firstName: "",
  phone: "",
  lastName: "",
  email: "",
  company: "",
  position: "",
  status: "",
  source: "",
};

interface ContactModalProps {
  initial?: Contact | null;
  onClose: () => void;
  onSaved: () => void;
}

function ContactModal({ initial, onClose, onSaved }: ContactModalProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<ContactPayload>(
    initial
      ? {
          firstName: initial.firstName,
          phone: initial.phone,
          lastName: initial.lastName || "",
          email: initial.email || "",
          company: initial.company || "",
          position: initial.position || "",
          status: initial.status || "",
          source: initial.source || "",
        }
      : { ...emptyForm }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof ContactPayload, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    if (!form.firstName.trim()) { setError("First name is required."); return; }
    if (!form.phone.trim()) { setError("Phone number is required."); return; }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await contactsApi.update(initial!.id, form);
      } else {
        await contactsApi.create(form);
      }
      onSaved();
      onClose();
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-brand-gold" />
            <h3 className="text-base font-bold text-ink">
              {isEdit ? "Edit Contact" : "Add Contact"}
            </h3>
          </div>
          <button onClick={onClose} className="text-ink-caption hover:text-ink-paragraph transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">First Name *</label>
              <input
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Jane"
                className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-paragraph mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Inc."
                className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Position</label>
              <input
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="CEO"
                className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card"
              >
                <option value="">Select status</option>
                <option value="New">New</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-paragraph mb-1">Source</label>
              <input
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder="Website, Referral…"
                className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-light">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-ink-paragraph hover:text-ink-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-yellow hover:bg-brand-gold text-ink text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {isEdit ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Bulk Delete Confirm ----------
function BulkDeleteConfirm({
  count,
  onCancel,
  onConfirm,
  loading,
}: {
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-status-error/15 rounded-xl flex items-center justify-center">
            <Trash2 size={20} className="text-status-error" />
          </div>
          <div>
            <h3 className="font-bold text-ink text-sm">Delete Contacts</h3>
            <p className="text-xs text-ink-caption mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-ink-paragraph mb-5">
          Delete <span className="font-semibold">{count} selected contact{count !== 1 ? "s" : ""}</span>?
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-ink-paragraph hover:text-ink-charcoal transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-status-error hover:bg-status-error text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Panel ----------
const ContactsPanel: React.FC = () => {
  if (!localStorage.getItem("echoleads_api_key")) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-ink-caption">
        <p className="text-sm font-medium">Not connected</p>
        <p className="text-xs mt-1">Go to the Authentication tab first.</p>
      </div>
    );
  }

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<{ current_page: number; total_pages: number; total_contacts: number; per_page: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchContacts = useCallback(async (p = 1) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await contactsApi.list(p, 20);
      setContacts(res.data.contacts || []);
      setPagination(res.data.pagination || null);
      setSelected(new Set());
    } catch {
      setFetchError("Failed to load contacts. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(page);
  }, [page, fetchContacts]);

  const filtered = search.trim()
    ? contacts.filter(
        (c) =>
          `${c.firstName} ${c.lastName || ""}`.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      )
    : contacts;

  const allIds = filtered.map((c) => c.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    if (allSelected) {
      setSelected((s) => {
        const next = new Set(s);
        allIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((s) => {
        const next = new Set(s);
        allIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

  function toggleOne(id: number) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    setBulkDeleting(true);
    try {
      await contactsApi.bulkDelete(Array.from(selected));
      setShowBulkConfirm(false);
      setSelected(new Set());
      fetchContacts(page);
    } catch {
      // keep modal open; user can retry
    } finally {
      setBulkDeleting(false);
    }
  }

  function onSaved() {
    fetchContacts(page);
  }

  const selectedCount = selected.size;

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-yellow-soft rounded-xl flex items-center justify-center">
            <Users size={20} className="text-brand-gold" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-ink">Contacts</h1>
            <p className="text-xs text-ink-caption">
              {pagination ? `${pagination.total_contacts} contacts` : "Manage your contacts"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-status-error hover:bg-status-error text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Delete {selectedCount}
            </button>
          )}
          <button
            onClick={() => fetchContacts(page)}
            className="p-2 text-ink-caption hover:text-ink-paragraph hover:bg-ink-light rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { setEditContact(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-yellow hover:bg-brand-gold text-ink text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-caption" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full pl-9 pr-4 py-2.5 border border-ink-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-surface-card"
        />
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-status-error/10 border border-status-error/25 rounded-lg text-sm text-status-error">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={() => fetchContacts(page)} className="ml-auto text-status-error underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-ink-caption">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-caption">
            <Users size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No contacts found</p>
            <p className="text-xs mt-1">Add your first contact to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-light">
                <th className="pb-2 pr-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-ink-light accent-brand-yellow"
                  />
                </th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-ink-caption uppercase tracking-wide">Name</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-ink-caption uppercase tracking-wide">Phone</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-ink-caption uppercase tracking-wide hidden md:table-cell">Company</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-ink-caption uppercase tracking-wide">Status</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-ink-caption uppercase tracking-wide">Call</th>
                <th className="pb-2 text-right text-xs font-semibold text-ink-caption uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  className={`border-b border-ink-offwhite hover:bg-surface-main/40 transition-colors ${selected.has(contact.id) ? "bg-surface-main" : ""}`}
                >
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={selected.has(contact.id)}
                      onChange={() => toggleOne(contact.id)}
                      className="rounded border-ink-light accent-brand-yellow"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <span className="font-semibold text-ink">
                      {contact.firstName} {contact.lastName || ""}
                    </span>
                    {contact.email && (
                      <p className="text-xs text-ink-caption truncate max-w-[160px]">{contact.email}</p>
                    )}
                  </td>
                  <td className="py-3 pr-3 text-ink-paragraph font-mono text-xs">{contact.phone}</td>
                  <td className="py-3 pr-3 text-ink-paragraph text-xs hidden md:table-cell">
                    {contact.company || "—"}
                  </td>
                  <td className="py-3 pr-3">
                    <ContactStatusBadge status={contact.status} />
                  </td>
                  <td className="py-3 pr-3">
                    <CallStatusBadge status={contact.call_status} />
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditContact(contact); setShowModal(true); }}
                        className="p-1.5 text-ink-caption hover:text-brand-yellow hover:bg-surface-main rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-ink-light">
          <p className="text-xs text-ink-caption">
            Page {pagination.current_page} of {pagination.total_pages} &middot; {pagination.total_contacts} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={pagination.current_page === 1}
              className="p-1.5 border border-ink-light rounded-lg text-ink-caption hover:bg-ink-offwhite disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="p-1.5 border border-ink-light rounded-lg text-ink-caption hover:bg-ink-offwhite disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ContactModal
          initial={editContact}
          onClose={() => { setShowModal(false); setEditContact(null); }}
          onSaved={onSaved}
        />
      )}
      {showBulkConfirm && (
        <BulkDeleteConfirm
          count={selectedCount}
          onCancel={() => setShowBulkConfirm(false)}
          onConfirm={handleBulkDelete}
          loading={bulkDeleting}
        />
      )}
    </div>
  );
};

export default ContactsPanel;
