import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit, X, Package as PackageIcon } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { COMPANY_API, LAMBDA } from "../../../lib/apiConfig";
import { authHeaders, getMyCompany } from "../api";
import { PageHeader, Card, Btn, Field, inputCls, FormGrid, EmptyState } from "../ui";

interface Product { title: string; description: string; }

export default function Listings() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [company, setCompany] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<{ index: number; item: Product } | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getMyCompany(userId).then((c) => {
      setCompany(c);
      if (!c) { setLoading(false); return; }
      const base = COMPANY_API || LAMBDA.company;
      axios.get(`${base}/templates?publishId=${c.publishedId}`)
        .then((r) => {
          const data = r.data?.data;
          setContent(data?.content || {});
          setProducts(data?.content?.products?.products || []);
        })
        .catch(() => toast.error("Failed to load listings"))
        .finally(() => setLoading(false));
    });
  }, [userId]);

  const save = async (next: Product[]) => {
    if (!company) return;
    setSaving(true);
    try {
      const base = COMPANY_API || LAMBDA.company;
      const nextContent = { ...content, products: { ...(content?.products || {}), products: next } };
      await axios.put(`${base}/save-template`, {
        userId, publishedId: company.publishedId, websiteContent: nextContent,
      }, { headers: authHeaders() });
      setContent(nextContent);
      setProducts(next);
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const openNew = () => setEditing({ index: -1, item: { title: "", description: "" } });
  const openEdit = (i: number) => setEditing({ index: i, item: { ...products[i] } });

  const submitEdit = async () => {
    if (!editing || !editing.item.title.trim()) { toast.error("Title is required"); return; }
    const next = [...products];
    if (editing.index === -1) next.push(editing.item);
    else next[editing.index] = editing.item;
    await save(next);
    setEditing(null);
  };

  const remove = async (i: number) => {
    const next = products.filter((_, idx) => idx !== i);
    await save(next);
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <PageHeader title="Product Listings" sub="Products & services shown on your public company profile" />
        {company && <Btn onClick={openNew}><Plus className="w-4 h-4" /> Add Product</Btn>}
      </div>

      {loading ? (
        <Card className="text-center py-16 text-white/40">Loading...</Card>
      ) : !company ? (
        <Card><EmptyState text="No published company found. Publish your profile first." /></Card>
      ) : products.length === 0 ? (
        <Card><EmptyState text='No products yet. Click "Add Product" to list your first one.' /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p, i) => (
            <Card key={i} className="p-4 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <PackageIcon className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                <h3 className="font-bold text-white text-sm min-w-0 line-clamp-2">{p.title}</h3>
              </div>
              <p className="text-xs text-white/40 line-clamp-3 mb-3">{p.description}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(i)} title="Edit" className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-info transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => remove(i)} title="Delete" className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-status-error transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="text-base font-bold text-white">{editing.index === -1 ? "Add Product" : "Edit Product"}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <FormGrid>
                <Field label="Title" required wide>
                  <input className={inputCls} value={editing.item.title}
                    onChange={(e) => setEditing({ ...editing, item: { ...editing.item, title: e.target.value } })} />
                </Field>
                <Field label="Description" wide>
                  <textarea className={inputCls} rows={4} value={editing.item.description}
                    onChange={(e) => setEditing({ ...editing, item: { ...editing.item, description: e.target.value } })} />
                </Field>
              </FormGrid>
            </div>
            <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={submitEdit} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
