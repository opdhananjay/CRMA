/**
 * AddTeamMemberDrawer.jsx
 * 
 * Form Drawer for Inviting or Editing Team Members.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. THE KEY RESET PATTERN (REACT BEST PRACTICE):
 *    Instead of using `useEffect` with `setForm` to reset state when props change
 *    (which triggers ESLint cascading render errors), we use lazy initialization
 *    `useState(() => initialValues)`.
 *    When the parent mounts the drawer with a unique `key` (e.g. `key={member?.id || 'new'}`),
 *    React automatically creates a fresh component instance with the correct initial state.
 * 
 * 2. COMPOSES REUSABLE `<Drawer>`:
 *    Avoids repeating drawer frame markup and backdrop behavior.
 */

import { useState } from "react";
import { UserPlus, Pencil, Save } from "lucide-react";
import Drawer from "../common/Drawer";

export default function AddTeamMemberDrawer({
  isOpen,
  onClose,
  onSubmit,
  memberToEdit = null,
}) {
  const isEditMode = Boolean(memberToEdit);

  // Initialize form lazily from props
  const [form, setForm] = useState(() => ({
    name: memberToEdit?.name || "",
    email: memberToEdit?.email || "",
    phone: memberToEdit?.phone || "",
    role: memberToEdit?.role || "Agent",
    department: memberToEdit?.department || "Sales",
  }));

  const [errors, setErrors] = useState({});

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
    onClose();
  };

  const footerActions = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        form="team-member-form"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        <Save size={17} />
        <span>{isEditMode ? "Update Member" : "Send Invitation"}</span>
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Team Member" : "Invite Team Member"}
      description={
        isEditMode
          ? "Update roles and department information for this user."
          : "Add an employee or agent to your CRM organization."
      }
      icon={isEditMode ? Pencil : UserPlus}
      footer={footerActions}
      maxWidth="max-w-[560px]"
    >
      <form id="team-member-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="e.g., Rahul Sharma"
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 ${
              errors.name ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            placeholder="colleague@company.com"
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 ${
              errors.email ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role in Organization
            </label>
            <select
              name="role"
              value={form.role}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="Agent">Sales Agent</option>
              <option value="Manager">Sales Manager</option>
              <option value="OrganizationOwner">Organization Owner</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
              <option value="Support">Support</option>
            </select>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
