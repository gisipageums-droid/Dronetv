import { useState } from "react";
import { Save, Bell, Globe, Lock, Mail, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: "DroneTv.in",
    supportEmail: "bd@dronetv.in",
    notifyNewCompany: true,
    notifyNewEvent: true,
    notifyNewProfessional: false,
    maintenanceMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform configuration and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            saved ? "bg-green-500 text-white" : "bg-yellow-400 text-black hover:bg-yellow-500"
          }`}
        >
          <Save size={15} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-yellow-500" />
            <h2 className="text-sm font-bold text-gray-900">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Site Name</label>
              <input
                type="text"
                value={form.siteName}
                onChange={e => setForm(p => ({ ...p, siteName: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={e => setForm(p => ({ ...p, supportEmail: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-yellow-500" />
            <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: "notifyNewCompany", label: "New company registration" },
              { key: "notifyNewEvent", label: "New event submission" },
              { key: "notifyNewProfessional", label: "New professional profile" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{label}</span>
                <div
                  onClick={() => setForm(p => ({ ...p, [key]: !p[key as keyof typeof form] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    form[key as keyof typeof form] ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form[key as keyof typeof form] ? "translate-x-5" : ""
                  }`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-yellow-500" />
            <h2 className="text-sm font-bold text-gray-900">Security</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">Maintenance mode</span>
              <div
                onClick={() => setForm(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                  form.maintenanceMode ? "bg-red-500" : "bg-gray-200"
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.maintenanceMode ? "translate-x-5" : ""
                }`} />
              </div>
            </label>
            {form.maintenanceMode && (
              <p className="text-xs text-red-500 font-medium">⚠ Site will be inaccessible to public users</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={18} className="text-yellow-500" />
            <h2 className="text-sm font-bold text-gray-900">Contact Info</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-gray-400" />
              <span>Admin panel: dronetv.in/admin</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <span>bd@dronetv.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-400" />
              <span>dronetv.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
