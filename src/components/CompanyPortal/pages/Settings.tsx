import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";
import { AUTH_API, LAMBDA } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";
import { PageHeader, Card, CardHeader, Field, inputCls, FormGrid, ActionBar } from "../ui";

interface Account {
  fullName: string;
  email: string;
  city: string;
  state: string;
  phone: string;
}

export default function Settings() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const base = AUTH_API || LAMBDA.auth;
    axios.get(`${base}/me`, { headers: authHeader() })
      .then((r) => setAccount({
        fullName: r.data?.fullName || "",
        email: r.data?.email || userId,
        city: r.data?.city || "",
        state: r.data?.state || "",
        phone: r.data?.phone || "",
      }))
      .catch(() => toast.error("Failed to load account details"))
      .finally(() => setLoading(false));
  }, [userId]);

  const save = async () => {
    if (!account) return;
    setSaving(true);
    try {
      const base = AUTH_API || LAMBDA.auth;
      await axios.put(`${base}/me`, {
        fullName: account.fullName, city: account.city, state: account.state, phone: account.phone,
      }, { headers: authHeader() });
      toast.success("Account updated");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Enter your current and new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    try {
      const base = AUTH_API || LAMBDA.auth;
      await axios.post(`${base}/change-password`, { currentPassword, newPassword }, { headers: authHeader() });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" sub="Manage your account details" />

      {loading ? (
        <Card className="text-center py-16 text-ink-caption">Loading...</Card>
      ) : !account ? (
        <Card className="text-center py-16 text-ink-caption">Unable to load account.</Card>
      ) : (
        <Card>
          <CardHeader title="Account Information" />
          <div className="p-4">
            <FormGrid>
              <Field label="Full Name" required>
                <input className={inputCls} value={account.fullName} onChange={(e) => setAccount({ ...account, fullName: e.target.value })} />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={account.email} disabled />
              </Field>
              <Field label="Phone">
                <input className={inputCls} type="tel" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} />
              </Field>
              <Field label="City">
                <input className={inputCls} value={account.city} onChange={(e) => setAccount({ ...account, city: e.target.value })} />
              </Field>
              <Field label="State">
                <input className={inputCls} value={account.state} onChange={(e) => setAccount({ ...account, state: e.target.value })} />
              </Field>
            </FormGrid>
            <div className="mt-5">
              <ActionBar onSave={save} saveLabel={saving ? "Saving..." : "Save Changes"} />
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-5">
        <CardHeader title="Change Password" />
        <div className="p-4">
          <FormGrid>
            <Field label="Current Password" required wide>
              <input className={inputCls} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
            </Field>
            <Field label="New Password" required>
              <input className={inputCls} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
            </Field>
            <Field label="Confirm New Password" required>
              <input className={inputCls} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            </Field>
          </FormGrid>
          <div className="mt-5">
            <ActionBar onSave={changePassword} saveLabel={changingPassword ? "Changing..." : "Change Password"} />
          </div>
        </div>
      </Card>
    </div>
  );
}
