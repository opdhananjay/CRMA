import { useEffect, useState } from "react";
import {
  X,
  Building2,
  MapPin,
  UserRound,
  Save,
  Mail,
  Info,
} from "lucide-react";

const initialForm = {
  organizationName: "",
  businessEmail: "",
  businessPhone: "",
  website: "",
  industry: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
};

const industries = [
  "Information Technology",
  "Healthcare",
  "Education",
  "Real Estate",
  "Finance",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Consulting",
  "Other",
];

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  children,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children || (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      )}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default function AddOrganizationDrawer({ open, onClose, onSave }) {
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ ...initialForm });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const payload = {
      ...formData,
      organizationName: formData.organizationName.trim(),
      businessEmail: formData.businessEmail.trim(),
      ownerName: formData.ownerName.trim(),
      ownerEmail: formData.ownerEmail.trim(),
    };

    try {
      setSaving(true);
      await onSave(payload);
      onClose();
    } catch (error) {
      alert(error?.message || "Unable to create organization.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-org-title"
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={21} />
            </div>
            <div>
              <h2
                id="add-org-title"
                className="text-lg font-bold text-slate-800"
              >
                Add Organization
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Register a new customer organization
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          id="add-organization-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-6"
        >
          {/* Organization details */}
          <section>
            <SectionHeading
              icon={Building2}
              title="Organization Details"
              description="Basic information about the customer company."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  label="Organization Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <FormField
                label="Business Email"
                name="businessEmail"
                type="email"
                value={formData.businessEmail}
                onChange={handleChange}
                placeholder="company@example.com"
                required
              />

              <FormField
                label="Business Phone"
                name="businessPhone"
                type="tel"
                value={formData.businessPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />

              <FormField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              <FormField label="Industry">
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Address details */}
          <section>
            <SectionHeading
              icon={MapPin}
              title="Address Details"
              description="Business location and registered address."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, building, area"
                />
              </div>

              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />

              <FormField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />

              <FormField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
              />

              <FormField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter postal code"
              />
            </div>
          </section>

          {/* Owner details */}
          <section>
            <SectionHeading
              icon={UserRound}
              title="Organization Owner"
              description="The first administrator of this organization's CRM account."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  label="Owner Full Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner's full name"
                  required
                />
              </div>

              <FormField
                label="Owner Email"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="owner@example.com"
                required
              />

              <FormField
                label="Owner Phone"
                name="ownerPhone"
                type="tel"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="mt-5 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <Mail size={19} className="shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Owner Invitation
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Once backend onboarding is connected, the owner will receive
                  an invitation email to activate their account and create a
                  password.
                </p>
              </div>
            </div>
          </section>

          {/* Additional information */}
          <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-4">
            <Info size={17} className="mt-0.5 shrink-0 text-slate-500" />
            <p className="text-xs leading-5 text-slate-600">
              The organization code will be generated automatically by the
              backend. Subscription and plan configuration will be handled
              separately in the Subscriptions module.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-organization-form"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Creating..." : "Create Organization"}
          </button>
        </div>
      </div>
    </div>
  );
}
