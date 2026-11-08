/**
 * AddOrganizationDrawer.jsx
 * 
 * Drawer form for SuperAdmin to register a new Tenant Organization.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. FIXED REACT 19 EFFECT ERROR:
 *    Previously, this component contained:
 *    `useEffect(() => { if (open) setFormData(initialForm); }, [open])`
 *    Synchronously updating state inside `useEffect` causes cascading re-renders.
 *    Instead, we reset the form state cleanly upon successful submit or cancel.
 * 
 * 2. COMPOSES REUSABLE `<Drawer>`:
 *    Leverages the shared `Drawer.jsx` for consistent backdrops and escape handling.
 * 
 * 3. BUSINESS FLOW (FROM work/flow-1.txt):
 *    When SuperAdmin creates an organization, the backend will:
 *    1. Insert Organization record.
 *    2. Create first Owner user account.
 *    3. Find active Free Plan and insert subscription record.
 *    4. Dispatch Owner invitation email.
 */

import { useState } from "react";
import {
  Building2,
  MapPin,
  UserRound,
  Save,
} from "lucide-react";
import Drawer from "../../component/common/Drawer";

const initialForm = {
  organizationName: "",
  businessEmail: "",
  businessPhone: "",
  website: "",
  industry: "Information Technology",
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

function SectionHeader({ icon, title, description }) {
  const IconComp = icon;
  return (
    <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-3">
      {IconComp && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <IconComp size={18} />
        </div>
      )}
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function AddOrganizationDrawer({ open, onClose, onSave }) {
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await onSave(formData);

    setFormData(initialForm);
    setSaving(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData(initialForm);
    onClose();
  };

  const footerActions = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <button
        type="button"
        onClick={handleCancel}
        className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        form="add-org-form"
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
      >
        <Save size={17} />
        <span>{saving ? "Creating..." : "Create Organization"}</span>
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={open}
      onClose={handleCancel}
      title="Add Organization"
      description="Register a new customer organization and provision an owner account."
      icon={Building2}
      footer={footerActions}
      maxWidth="max-w-[640px]"
    >
      <form id="add-org-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Organization Details */}
        <div>
          <SectionHeader
            icon={Building2}
            title="Company Information"
            description="Official business details and industry vertical."
          />

          <div className="space-y-3.5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="e.g. Acme Technologies Pvt Ltd"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Business Phone <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Industry Vertical
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Owner Details */}
        <div>
          <SectionHeader
            icon={UserRound}
            title="First Owner Account"
            description="The administrative user who will manage this tenant."
          />

          <div className="space-y-3.5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Owner Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Owner Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  placeholder="owner@company.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Owner Phone
                </label>
                <input
                  type="text"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 11111"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Office Address */}
        <div>
          <SectionHeader
            icon={MapPin}
            title="Billing & Location Details"
            description="Headquarters address and regional location."
          />

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Office Suite, Tech Park"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
