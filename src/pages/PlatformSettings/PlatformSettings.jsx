import { useState } from "react";
import {
  Settings,
  Building2,
  Mail,
  ShieldCheck,
  Server,
  Save,
  Upload,
  Clock,
  Globe,
  LockKeyhole,
  Bell,
  AlertTriangle,
} from "lucide-react";

const initialSettings = {
  // General
  appName: "Anjaya CRM",
  companyName: "Anjaya Systems",
  supportEmail: "support@anjaya.com",
  supportPhone: "",
  website: "https://anjaya.com",

  // Email
  senderName: "Anjaya CRM",
  senderEmail: "noreply@anjaya.com",

  // Security
  minPasswordLength: 8,
  sessionTimeout: 30,
  maxLoginAttempts: 5,

  // System
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  maintenanceMode: false,
};

const tabs = [
  { id: "general", label: "General Settings", icon: Building2 },
  { id: "email", label: "Email Settings", icon: Mail },
  { id: "security", label: "Security Settings", icon: ShieldCheck },
  { id: "system", label: "System Settings", icon: Server },
];

function Field({ label, children, description }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {description && (
        <p className="mt-1.5 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSetting = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // TODO: Connect PUT /api/platform/settings
      // Send only the settings allowed for the current section.

      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800">
          Application Information
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Configure the basic identity of your CRM platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Application Name">
          <TextInput
            value={settings.appName}
            onChange={(e) => updateSetting("appName", e.target.value)}
            placeholder="Enter application name"
          />
        </Field>

        <Field label="Company Name">
          <TextInput
            value={settings.companyName}
            onChange={(e) => updateSetting("companyName", e.target.value)}
            placeholder="Enter company name"
          />
        </Field>

        <Field label="Support Email">
          <TextInput
            type="email"
            value={settings.supportEmail}
            onChange={(e) => updateSetting("supportEmail", e.target.value)}
            placeholder="support@example.com"
          />
        </Field>

        <Field label="Support Phone">
          <TextInput
            value={settings.supportPhone}
            onChange={(e) => updateSetting("supportPhone", e.target.value)}
            placeholder="+91 9876543210"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Website URL">
            <TextInput
              value={settings.website}
              onChange={(e) => updateSetting("website", e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
        </div>
      </div>

      <div>
        <Field
          label="Company Logo"
          description="Logo upload will be connected to backend file storage later."
        >
          <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={30} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                Upload company logo
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG or SVG. Recommended square or horizontal logo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert("Logo upload will be implemented later.")}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Upload size={16} />
              Upload Logo
            </button>
          </div>
        </Field>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800">Email Configuration</h3>
        <p className="mt-1 text-sm text-slate-500">
          Configure the sender identity for platform emails.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Sender Name">
          <TextInput
            value={settings.senderName}
            onChange={(e) => updateSetting("senderName", e.target.value)}
            placeholder="Anjaya CRM"
          />
        </Field>

        <Field label="Sender Email">
          <TextInput
            type="email"
            value={settings.senderEmail}
            onChange={(e) => updateSetting("senderEmail", e.target.value)}
            placeholder="noreply@example.com"
          />
        </Field>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Mail size={20} className="shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Email service integration
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-700">
              SMTP or email provider credentials will be configured securely on
              the backend. Do not store email passwords or API keys in frontend
              settings.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-slate-800">
          Platform Email Notifications
        </h3>

        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
          {[
            ["ownerInvitation", "Owner invitation emails"],
            ["accountActivation", "Account activation emails"],
            ["securityNotification", "Security notification emails"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-4">
              <span className="text-sm text-slate-700">{label}</span>
              <span className="text-xs font-medium text-slate-500">
                Configured through email templates later
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800">Security Configuration</h3>
        <p className="mt-1 text-sm text-slate-500">
          Set default security policies for platform authentication.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Minimum Password Length">
          <TextInput
            type="number"
            value={settings.minPasswordLength}
            onChange={(e) =>
              updateSetting("minPasswordLength", Number(e.target.value))
            }
          />
        </Field>

        <Field
          label="Session Timeout (Minutes)"
          description="Suggested idle session duration."
        >
          <TextInput
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) =>
              updateSetting("sessionTimeout", Number(e.target.value))
            }
          />
        </Field>

        <Field
          label="Maximum Login Attempts"
          description="Number of failed attempts before temporary lockout."
        >
          <TextInput
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) =>
              updateSetting("maxLoginAttempts", Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
        <div className="flex gap-3">
          <LockKeyhole size={19} className="shrink-0 text-amber-700" />
          <p className="text-xs leading-5 text-amber-800">
            These are proposed platform-wide defaults. The backend must enforce
            password rules, session expiry and login attempt limits. Changing a
            frontend value alone does not provide security.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-slate-800">System Configuration</h3>
        <p className="mt-1 text-sm text-slate-500">
          Configure regional preferences and platform availability.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Default Timezone">
          <SelectInput
            value={settings.timezone}
            onChange={(e) => updateSetting("timezone", e.target.value)}
          >
            <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Dubai</option>
            <option value="Europe/London">London</option>
            <option value="America/New_York">New York</option>
          </SelectInput>
        </Field>

        <Field label="Date Format">
          <SelectInput
            value={settings.dateFormat}
            onChange={(e) => updateSetting("dateFormat", e.target.value)}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </SelectInput>
        </Field>
      </div>

      <div className="rounded-xl border border-red-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-50 p-2.5 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Maintenance Mode</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Temporarily restrict customer access while maintenance is
                performed.
              </p>
            </div>
          </div>

          <Toggle
            checked={settings.maintenanceMode}
            onChange={(value) => updateSetting("maintenanceMode", value)}
          />
        </div>

        {settings.maintenanceMode && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            Maintenance mode is selected. This demo does not actually restrict
            access. The backend must enforce this setting before it is enabled
            in production.
          </p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "email":
        return renderEmailSettings();
      case "security":
        return renderSecuritySettings();
      case "system":
        return renderSystemSettings();
      default:
        return null;
    }
  };

  const ActiveIcon = tabs.find((tab) => tab.id === activeTab)?.icon || Settings;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage global configuration and preferences for Anjaya CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
        {/* Settings navigation */}
        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Settings
          </p>

          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSaved(false);
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Settings content */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-3">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <ActiveIcon size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Configure your platform preferences.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">{renderContent()}</div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-slate-500">
              {saved
                ? "Settings saved in this demo."
                : "Remember to save your changes."}
            </p>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
