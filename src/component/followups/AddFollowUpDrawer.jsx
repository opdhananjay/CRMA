/**
 * AddFollowUpDrawer.jsx
 * 
 * Drawer form for scheduling a follow-up action (Call, Meeting, Email, Visit).
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. EXTRACTED FROM MONOLITH:
 *    Previously, this entire drawer (200+ lines of JSX and form logic) was declared
 *    directly inside `FollowUps.jsx`, making the page 774 lines long!
 *    Extracting it here makes both components clean, readable, and testable.
 * 
 * 2. CONTROLLED FORM HANDLING:
 *    - `form` holds input values.
 *    - `errors` holds field validation messages.
 *    - `onClose` clears form errors when canceled.
 */

import { useState } from "react";
import { CalendarClock, Save } from "lucide-react";
import Drawer from "../common/Drawer";

const todayString = new Date().toISOString().slice(0, 10);

const emptyForm = {
  leadName: "",
  type: "Call",
  date: todayString,
  time: "10:00",
  assignedTo: "",
  notes: "",
};

export default function AddFollowUpDrawer({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.leadName.trim()) errs.leadName = "Please select or enter a lead name.";
    if (!form.date) errs.date = "Please select a scheduled date.";
    if (!form.time) errs.time = "Please select a time.";
    if (!form.assignedTo.trim()) errs.assignedTo = "Please select an assigned team member.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  const footerActions = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <button
        type="button"
        onClick={handleClose}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        form="add-follow-up-form"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        <Save size={17} />
        <span>Save Follow-up</span>
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Follow-up"
      description="Set a reminder for a phone call, email, or client discussion."
      icon={CalendarClock}
      footer={footerActions}
      maxWidth="max-w-[580px]"
    >
      <form id="add-follow-up-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Lead Selection */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Select Lead <span className="text-red-500">*</span>
          </label>
          <select
            name="leadName"
            value={form.leadName}
            onChange={updateField}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 ${
              errors.leadName ? "border-red-400" : "border-gray-200"
            }`}
          >
            <option value="">Select a lead</option>
            <option value="ABC Technologies">ABC Technologies</option>
            <option value="Bright Solutions">Bright Solutions</option>
            <option value="TechNova Systems">TechNova Systems</option>
            <option value="Global Manufacturing">Global Manufacturing</option>
            <option value="NextGen Healthcare">NextGen Healthcare</option>
          </select>
          {errors.leadName && (
            <p className="mt-1 text-xs text-red-500">{errors.leadName}</p>
          )}
        </div>

        {/* Follow-up Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Follow-up Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={updateField}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="Call">Call</option>
            <option value="Meeting">Meeting</option>
            <option value="Email">Email</option>
            <option value="Site Visit">Site Visit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={updateField}
              min={todayString}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                errors.date ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Due Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={updateField}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
                errors.time ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.time && (
              <p className="mt-1 text-xs text-red-500">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Assigned Team Member */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Assigned To <span className="text-red-500">*</span>
          </label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={updateField}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
              errors.assignedTo ? "border-red-400" : "border-gray-200"
            }`}
          >
            <option value="">Select team member</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Priya Shah">Priya Shah</option>
            <option value="Dhananjay">Dhananjay</option>
          </select>
          {errors.assignedTo && (
            <p className="mt-1 text-xs text-red-500">{errors.assignedTo}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Agenda / Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={updateField}
            placeholder="Key discussion points or requirements..."
            className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </form>
    </Drawer>
  );
}

