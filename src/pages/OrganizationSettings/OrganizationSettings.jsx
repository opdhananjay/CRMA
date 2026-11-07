import { useState } from "react";
import {
  Building2,
  MapPin,
  SlidersHorizontal,
  GitBranch,
  Settings,
  Save,
  Plus,
  Trash2,
  Pencil,
  X,
  Globe,
} from "lucide-react";

const initialSettings = {
  organizationName: "ABC Technologies",
  businessEmail: "contact@abctech.com",
  phone: "+91 9876543210",
  website: "https://abctech.com",
  industry: "Information Technology",

  address: "Office No. 101, Business Park",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  pincode: "400001",

  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",

  leadSources: ["Website", "Referral", "LinkedIn", "JustDial", "IndiaMART"],
  industries: [
    "Information Technology",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Real Estate",
  ],
  leadTypes: ["Hot", "Warm", "Cold"],

  pipelineStages: [
    { id: 1, name: "New", color: "blue" },
    { id: 2, name: "Contacted", color: "cyan" },
    { id: 3, name: "Qualified", color: "purple" },
    { id: 4, name: "Proposal", color: "amber" },
    { id: 5, name: "Negotiation", color: "orange" },
    { id: 6, name: "Won", color: "green" },
    { id: 7, name: "Lost", color: "red" },
  ],
};

const tabs = [
  { id: "general", label: "General Information", icon: Building2 },
  { id: "address", label: "Address Details", icon: MapPin },
  { id: "crm", label: "CRM Configuration", icon: SlidersHorizontal },
  { id: "pipeline", label: "Pipeline Settings", icon: GitBranch },
  { id: "preferences", label: "Preferences", icon: Settings },
];

function Field({ label, children, description }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
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

function SectionHeading({ title, description }) {
  return (
    <div className="mb-5">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function ListEditor({ title, description, items, onAdd, onRemove }) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    const value = newItem.trim();

    if (!value) return;

    const alreadyExists = items.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      alert("This value already exists.");
      return;
    }

    onAdd(value);
    setNewItem("");
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              title={`Remove ${item}`}
              className="text-slate-400 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {items.length === 0 && (
          <p className="text-xs text-slate-400">No values added.</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={`Add ${title.toLowerCase()}...`}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}

export default function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [editingStage, setEditingStage] = useState(null);
  const [newStage, setNewStage] = useState("");

  const updateField = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaved(false);
  };

  const updateList = (field, action, value) => {
    setSettings((prev) => {
      const current = prev[field];

      const updated =
        action === "add"
          ? [...current, value]
          : current.filter((item) => item !== value);

      return { ...prev, [field]: updated };
    });

    setSaved(false);
  };

  const addPipelineStage = () => {
    const name = newStage.trim();

    if (!name) return;

    const exists = settings.pipelineStages.some(
      (stage) => stage.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      alert("This pipeline stage already exists.");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      pipelineStages: [
        ...prev.pipelineStages,
        {
          id: crypto.randomUUID(),
          name,
          color: "blue",
        },
      ],
    }));

    setNewStage("");
    setSaved(false);
  };

  const updateStage = (id, name) => {
    const value = name.trim();
    if (!value) return;

    setSettings((prev) => ({
      ...prev,
      pipelineStages: prev.pipelineStages.map((stage) =>
        stage.id === id ? { ...stage, name: value } : stage,
      ),
    }));

    setEditingStage(null);
    setSaved(false);
  };

  const removeStage = (id) => {
    const stage = settings.pipelineStages.find((x) => x.id === id);

    if (["Won", "Lost"].includes(stage?.name)) {
      alert("Won and Lost are required system stages and cannot be removed.");
      return;
    }

    if (!window.confirm("Remove this pipeline stage?")) return;

    setSettings((prev) => ({
      ...prev,
      pipelineStages: prev.pipelineStages.filter((x) => x.id !== id),
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // TODO: PUT /api/organization/settings
      // OrganizationId must come from the authenticated backend context.

      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const renderGeneral = () => (
    <>
      <SectionHeading
        title="Company Information"
        description="Manage the basic information of your organization."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Organization Name">
          <Input
            value={settings.organizationName}
            onChange={(e) => updateField("organizationName", e.target.value)}
            placeholder="Company name"
          />
        </Field>

        <Field label="Industry">
          <select
            value={settings.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Select industry</option>
            {settings.industries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Business Email">
          <Input
            type="email"
            value={settings.businessEmail}
            onChange={(e) => updateField("businessEmail", e.target.value)}
            placeholder="company@example.com"
          />
        </Field>

        <Field label="Phone Number">
          <Input
            value={settings.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+91 9876543210"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Website">
            <Input
              value={settings.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <Field label="Organization Logo">
          <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Upload organization logo
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG or SVG. Logo upload will be connected to storage later.
              </p>
            </div>
          </div>
        </Field>
      </div>
    </>
  );

  const renderAddress = () => (
    <>
      <SectionHeading
        title="Business Address"
        description="Maintain the official address of your organization."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Street Address">
            <Input
              value={settings.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Building, street, area"
            />
          </Field>
        </div>

        <Field label="City">
          <Input
            value={settings.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="City"
          />
        </Field>

        <Field label="State">
          <Input
            value={settings.state}
            onChange={(e) => updateField("state", e.target.value)}
            placeholder="State"
          />
        </Field>

        <Field label="Country">
          <Input
            value={settings.country}
            onChange={(e) => updateField("country", e.target.value)}
            placeholder="Country"
          />
        </Field>

        <Field label="Pincode">
          <Input
            value={settings.pincode}
            onChange={(e) => updateField("pincode", e.target.value)}
            placeholder="Postal code"
          />
        </Field>
      </div>
    </>
  );

  const renderCRM = () => (
    <div className="space-y-5">
      <SectionHeading
        title="CRM Configuration"
        description="Customize dropdown values used when creating and managing leads."
      />

      <ListEditor
        title="Lead Sources"
        description="Where your organization receives leads from."
        items={settings.leadSources}
        onAdd={(value) => updateList("leadSources", "add", value)}
        onRemove={(value) => updateList("leadSources", "remove", value)}
      />

      <ListEditor
        title="Industries"
        description="Industries available when classifying leads."
        items={settings.industries}
        onAdd={(value) => updateList("industries", "add", value)}
        onRemove={(value) => updateList("industries", "remove", value)}
      />

      <ListEditor
        title="Lead Types"
        description="Categories used to identify lead priority or potential."
        items={settings.leadTypes}
        onAdd={(value) => updateList("leadTypes", "add", value)}
        onRemove={(value) => updateList("leadTypes", "remove", value)}
      />
    </div>
  );

  const renderPipeline = () => (
    <>
      <SectionHeading
        title="Lead Pipeline Stages"
        description="Configure the stages your sales team uses to track opportunities."
      />

      <div className="space-y-3">
        {settings.pipelineStages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
              {index + 1}
            </div>

            {editingStage === stage.id ? (
              <input
                autoFocus
                defaultValue={stage.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateStage(stage.id, e.currentTarget.value);
                  }
                }}
                className="min-w-0 flex-1 rounded-lg border border-blue-300 px-3 py-2 text-sm outline-none"
              />
            ) : (
              <span className="flex-1 text-sm font-medium text-slate-700">
                {stage.name}
              </span>
            )}

            {["Won", "Lost"].includes(stage.name) ? (
              <span className="text-xs text-slate-400">System stage</span>
            ) : (
              <>
                {editingStage === stage.id ? (
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget
                        .closest("div")
                        .parentElement.querySelector("input");
                      updateStage(stage.id, input.value);
                    }}
                    className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                    title="Save stage"
                  >
                    <Save size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingStage(stage.id)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    title="Edit stage"
                  >
                    <Pencil size={16} />
                  </button>
                )}

                <button
                  onClick={() => removeStage(stage.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  title="Remove stage"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          value={newStage}
          onChange={(e) => setNewStage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPipelineStage();
            }
          }}
          placeholder="Enter new pipeline stage"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={addPipelineStage}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Add Stage
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Note: Removing or renaming an existing stage can affect opportunities
        already using it. The backend should validate these changes.
      </p>
    </>
  );

  const renderPreferences = () => (
    <>
      <SectionHeading
        title="Organization Preferences"
        description="Set default regional preferences for your organization."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Timezone">
          <select
            value={settings.timezone}
            onChange={(e) => updateField("timezone", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Dubai</option>
            <option value="Europe/London">London</option>
          </select>
        </Field>

        <Field label="Date Format">
          <select
            value={settings.dateFormat}
            onChange={(e) => updateField("dateFormat", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </Field>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneral();
      case "address":
        return renderAddress();
      case "crm":
        return renderCRM();
      case "pipeline":
        return renderPipeline();
      case "preferences":
        return renderPreferences();
      default:
        return null;
    }
  };

  const ActiveIcon = tabs.find((tab) => tab.id === activeTab)?.icon || Settings;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Organization Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your company's information and CRM workspace configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
        {/* Navigation */}
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
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium ${
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

        {/* Content */}
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
                Configure your organization preferences.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">{renderContent()}</div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-slate-500">
              {saved
                ? "Settings saved in this demo."
                : "Save your changes when you're finished."}
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
