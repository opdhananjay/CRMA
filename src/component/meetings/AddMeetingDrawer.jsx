/**
 * AddMeetingDrawer.jsx
 * 
 * Drawer form for scheduling Meetings.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. EXTRACTED FROM MONOLITH:
 *    Previously, this drawer and its validation logic occupied ~200 lines inside
 *    `Meetings.jsx`. Extracting it here keeps each component clean and focused.
 * 
 * 2. COMPOSITION PATTERN:
 *    Uses the shared `<Drawer>` component to handle backdrop, escape key, and animations.
 */

import { useState } from "react";
import { CalendarDays, Save } from "lucide-react";
import Drawer from "../common/Drawer";

const todayString = new Date().toISOString().slice(0, 10);

const emptyMeeting = {
  title: "",
  leadName: "",
  contactPerson: "",
  date: todayString,
  time: "10:00",
  duration: "30",
  type: "Online",
  location: "Google Meet",
  assignedTo: "",
  notes: "",
};

export default function AddMeetingDrawer({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyMeeting);
  const [errors, setErrors] = useState({});

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Meeting title is required.";
    if (!form.leadName.trim()) errs.leadName = "Please select or specify a lead.";
    if (!form.date) errs.date = "Meeting date is required.";
    if (!form.time) errs.time = "Meeting time is required.";
    if (!form.assignedTo.trim()) errs.assignedTo = "Please select an assigned host.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
    setForm(emptyMeeting);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setForm(emptyMeeting);
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
        form="add-meeting-form"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        <Save size={17} />
        <span>Schedule Meeting</span>
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Meeting"
      description="Book an online or in-person discussion with a client or prospect."
      icon={CalendarDays}
      footer={footerActions}
      maxWidth="max-w-[620px]"
    >
      <form id="add-meeting-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Meeting Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Meeting Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="e.g., Product Architecture Review"
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 ${
              errors.title ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Lead & Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Lead / Company <span className="text-red-500">*</span>
            </label>
            <select
              name="leadName"
              value={form.leadName}
              onChange={updateField}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={updateField}
              placeholder="e.g., Rahul Sharma"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Date, Time & Duration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
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
              Time <span className="text-red-500">*</span>
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              name="duration"
              value={form.duration}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="45">45 mins</option>
              <option value="60">60 mins</option>
              <option value="90">90 mins</option>
            </select>
          </div>
        </div>

        {/* Meeting Type & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Meeting Mode
            </label>
            <select
              name="type"
              value={form.type}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="Online">Online Video Call</option>
              <option value="In Person">In Person / On-site</option>
              <option value="Phone">Phone Call</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Location / Link
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={updateField}
              placeholder="e.g., Google Meet link or Office address"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Assigned Host */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Host / Assigned To <span className="text-red-500">*</span>
          </label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={updateField}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 ${
              errors.assignedTo ? "border-red-400" : "border-gray-200"
            }`}
          >
            <option value="">Select team host</option>
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
            Agenda / Meeting Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={updateField}
            placeholder="Key discussion topics, demo goals, or attendee list..."
            className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </form>
    </Drawer>
  );
}

