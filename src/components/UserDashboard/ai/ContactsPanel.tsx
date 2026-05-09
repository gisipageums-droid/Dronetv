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
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Ended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      {status || "None"}
    </span>
  );
}

function ContactStatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    Warm: "bg-amber-100 text-amber-700",
    Hot: "bg-red-100 text-red-600",
    Cold: "bg-slate-100 text-slate-600",
  };
  const cls = (status && map[status]) || "bg-gray-100 text-gray-500";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-amber-600" />
            <h3 className="text-base font-bold text-gray-900">
              {isEdit ? "Edit Contact" : "Add Contact"}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
              <input
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Jane"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Inc."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Position</label>
              <input
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="CEO"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              >
                <option value="">Select status</option>
                <option value="New">New</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Source</label>
              <input
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder="Website, Referral…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Delete Contacts</h3>
            <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          Delete <span className="font-semibold">{count} selected contact{count !== 1 ? "s" : ""}</span>?
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
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
      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
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
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-amber-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Contacts</h1>
            <p className="text-xs text-gray-500">
              {pagination ? `${pagination.total_contacts} contacts` : "Manage your contacts"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Delete {selectedCount}
            </button>
          )}
          <button
            onClick={() => fetchContacts(page)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => { setEditContact(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        />
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertTriangle size={15} className="shrink-0" />
          {fetchError}
          <button onClick={() => fetchContacts(page)} className="ml-auto text-red-500 underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No contacts found</p>
            <p className="text-xs mt-1">Add your first contact to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 pr-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300 accent-amber-400"
                  />
                </th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Company</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="pb-2 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Call</th>
                <th className="pb-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  className={`border-b border-gray-50 hover:bg-amber-50/40 transition-colors ${selected.has(contact.id) ? "bg-amber-50" : ""}`}
                >
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={selected.has(contact.id)}
                      onChange={() => toggleOne(contact.id)}
                      className="rounded border-gray-300 accent-amber-400"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <span className="font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName || ""}
                    </span>
                    {contact.email && (
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">{contact.email}</p>
                    )}
                  </td>
                  <td className="py-3 pr-3 text-gray-700 font-mono text-xs">{contact.phone}</td>
                  <td className="py-3 pr-3 text-gray-600 text-xs hidden md:table-cell">
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
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
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
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Page {pagination.current_page} of {pagination.total_pages} &middot; {pagination.total_contacts} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={pagination.current_page === 1}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
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
