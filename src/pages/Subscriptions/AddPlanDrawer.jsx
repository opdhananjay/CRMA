import { useEffect, useState } from "react";
import { X, Package, Save, Info } from "lucide-react";

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

  useEffect(() => {
    if (open) setForm({ ...initialForm });
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);

      await onSave({
        ...form,
        planName: form.planName.trim(),
        price: Number(form.price),
        maxUsers: form.maxUsers === "" ? null : Number(form.maxUsers),
        maxLeads: form.maxLeads === "" ? null : Number(form.maxLeads),
        storageLimit:
          form.storageLimit === "" ? null : Number(form.storageLimit),
      });

      onClose();
    } catch (error) {
      alert(error?.message || "Unable to create plan.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                Add Subscription Plan
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Create a new plan for your organizations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          id="add-plan-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              name="planName"
              value={form.planName}
              onChange={handleChange}
              placeholder="e.g. Professional"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what's included in this plan..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={form.billingCycle}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="Free">Free</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-slate-800">Usage Limits</h3>
            <p className="mb-4 text-xs text-slate-500">
              Leave a limit empty if it should be unlimited.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["maxUsers", "Maximum Users", "e.g. 5"],
                ["maxLeads", "Maximum Leads", "e.g. 500"],
                ["storageLimit", "Storage (GB)", "e.g. 10"],
              ].map(([name, label, placeholder]) => (
                <div key={name}>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {label}
                  </label>
                  <input
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    min="0"
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <Info size={18} className="shrink-0 text-blue-600" />
            <p className="text-xs leading-5 text-blue-700">
              Creating a plan does not automatically assign it to existing
              organizations. You can assign it separately through subscription
              management.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-plan-form"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
