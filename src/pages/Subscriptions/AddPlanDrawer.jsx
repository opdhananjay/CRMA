/**
 * AddPlanDrawer.jsx
 * 
 * Drawer form for SuperAdmin to configure new SaaS Subscription Tiers.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. FIXED REACT 19 EFFECT ERROR:
 *    Removed `useEffect(() => if (open) setForm(initialForm), [open])` which caused
 *    cascading renders. The form is now reset on clean cancel and submit handlers.
 * 
 * 2. COMPOSES REUSABLE `<Drawer>`:
 *    Avoids repeating drawer frame markup, backdrop blur, and Escape listeners.
 */

import { useState } from "react";
import { Package, Save } from "lucide-react";
import Drawer from "../../component/common/Drawer";

const initialForm = {
  planName: "",
  description: "",
  price: "0",
  billingCycle: "Free",
  maxUsers: "",
  maxLeads: "",
  storageLimit: "",
};

export default function AddPlanDrawer({ open, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    await onSave({
      ...form,
      planName: form.planName.trim(),
      price: Number(form.price),
      maxUsers: form.maxUsers === "" ? null : Number(form.maxUsers),
      maxLeads: form.maxLeads === "" ? null : Number(form.maxLeads),
      storageLimit: form.storageLimit === "" ? null : Number(form.storageLimit),
    });

    setForm(initialForm);
    setSaving(false);
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
        form="add-plan-form"
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
      >
        <Save size={17} />
        <span>{saving ? "Saving..." : "Create Plan"}</span>
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={open}
      onClose={handleCancel}
      title="Create Subscription Plan"
      description="Define pricing tiers, user allowances, and storage limits."
      icon={Package}
      footer={footerActions}
      maxWidth="max-w-[560px]"
    >
      <form id="add-plan-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="planName"
            value={form.planName}
            onChange={handleChange}
            placeholder="e.g. Enterprise Tier"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={2}
            value={form.description}
            onChange={handleChange}
            placeholder="Brief overview of features included..."
            className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Billing Cycle
            </label>
            <select
              name="billingCycle"
              value={form.billingCycle}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="Free">Free</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Max Users
            </label>
            <input
              type="number"
              name="maxUsers"
              value={form.maxUsers}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Max Leads
            </label>
            <input
              type="number"
              name="maxLeads"
              value={form.maxLeads}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Storage (GB)
            </label>
            <input
              type="number"
              name="storageLimit"
              value={form.storageLimit}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </form>
    </Drawer>
  );
}
