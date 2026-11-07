
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Building2,
  User,
  CalendarDays,
  IndianRupee,
  GripVertical,
  X,
  ArrowRight,
} from "lucide-react";

const stages = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const initialLeads = [
  {
    id: 1,
    companyName: "ABC Technologies",
    contactPerson: "Rahul Sharma",
    email: "rahul@abc.com",
    phone: "9876543210",
    value: 75000,
    stage: "New",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-11-20",
  },
  {
    id: 2,
    companyName: "Bright Solutions",
    contactPerson: "Amit Patel",
    email: "amit@bright.com",
    phone: "9876543211",
    value: 125000,
    stage: "Contacted",
    assignedTo: "Rahul",
    expectedCloseDate: "2026-11-25",
  },
  {
    id: 3,
    companyName: "TechNova",
    contactPerson: "Priya Shah",
    email: "priya@technova.com",
    phone: "9876543212",
    value: 200000,
    stage: "Qualified",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-11-28",
  },
  {
    id: 4,
    companyName: "Global Systems",
    contactPerson: "Vikram Mehta",
    email: "vikram@global.com",
    phone: "9876543213",
    value: 150000,
    stage: "Proposal",
    assignedTo: "Rahul",
    expectedCloseDate: "2026-12-05",
  },
  {
    id: 5,
    companyName: "NextGen Services",
    contactPerson: "Neha Joshi",
    email: "neha@nextgen.com",
    phone: "9876543214",
    value: 300000,
    stage: "Negotiation",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-12-10",
  },
  {
    id: 6,
    companyName: "Smart Business",
    contactPerson: "Karan Shah",
    email: "karan@smart.com",
    phone: "9876543215",
    value: 90000,
    stage: "Won",
    assignedTo: "Rahul",
    expectedCloseDate: "2026-11-10",
  },
  {
    id: 7,
    companyName: "OldTech",
    contactPerson: "Suresh Patil",
    email: "suresh@oldtech.com",
    phone: "9876543216",
    value: 50000,
    stage: "Lost",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-11-08",
  },
];

const emptyLead = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  value: "",
  stage: "New",
  assignedTo: "",
  expectedCloseDate: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function Pipeline() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(emptyLead);
  const [draggedLeadId, setDraggedLeadId] = useState(null);

  const filteredLeads = useMemo(() => {
    const term = search.toLowerCase();

    return leads.filter(
      (lead) =>
        lead.companyName.toLowerCase().includes(term) ||
        lead.contactPerson.toLowerCase().includes(term) ||
        lead.assignedTo.toLowerCase().includes(term)
    );
  }, [leads, search]);

  const totalPipelineValue = leads
    .filter((lead) => !["Won", "Lost"].includes(lead.stage))
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);

  const wonValue = leads
    .filter((lead) => lead.stage === "Won")
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);

  const activeLeadCount = leads.filter(
    (lead) => !["Won", "Lost"].includes(lead.stage)
  ).length;

  const handleDragStart = (event, leadId) => {
    setDraggedLeadId(leadId);
    event.dataTransfer.setData("text/plain", String(leadId));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event, targetStage) => {
    event.preventDefault();

    const leadId = Number(
      event.dataTransfer.getData("text/plain") || draggedLeadId
    );

    if (!leadId) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, stage: targetStage } : lead
      )
    );

    setDraggedLeadId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newLead = {
      ...form,
      id: Date.now(),
      value: Number(form.value || 0),
    };

    setLeads((prev) => [newLead, ...prev]);
    setForm(emptyLead);
    setDrawerOpen(false);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const stageColors = {
    New: "bg-blue-500",
    Contacted: "bg-cyan-500",
    Qualified: "bg-violet-500",
    Proposal: "bg-orange-500",
    Negotiation: "bg-amber-500",
    Won: "bg-green-500",
    Lost: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Sales Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your leads and manage your sales opportunities.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyLead);
            setDrawerOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Opportunity
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Active Opportunities"
          value={activeLeadCount}
          icon={<Building2 size={20} />}
        />
        <SummaryCard
          title="Pipeline Value"
          value={formatCurrency(totalPipelineValue)}
          icon={<IndianRupee size={20} />}
        />
        <SummaryCard
          title="Won Value"
          value={formatCurrency(wonValue)}
          icon={<IndianRupee size={20} />}
        />
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact or employee..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max items-start">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter(
              (lead) => lead.stage === stage
            );

            const stageValue = stageLeads.reduce(
              (sum, lead) => sum + Number(lead.value || 0),
              0
            );

            return (
              <div
                key={stage}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, stage)}
                className="w-[290px] bg-slate-100 rounded-xl p-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${stageColors[stage]}`}
                    />
                    <h3 className="font-semibold text-slate-700 text-sm">
                      {stage}
                    </h3>
                    <span className="text-xs bg-white text-slate-500 px-2 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-3">
                  {formatCurrency(stageValue)}
                </p>

                {/* Lead Cards */}
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, lead.id)}
                      onDragEnd={() => setDraggedLeadId(null)}
                      onClick={() => setSelectedLead(lead)}
                      className={`bg-white border border-slate-200 rounded-lg p-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 ${
                        draggedLeadId === lead.id ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-sm text-slate-800">
                          {lead.companyName}
                        </h4>
                        <GripVertical
                          size={16}
                          className="text-slate-300 shrink-0"
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                        <User size={14} />
                        {lead.contactPerson}
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <IndianRupee size={14} />
                        {formatCurrency(lead.value)}
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        {lead.expectedCloseDate || "No close date"}
                      </div>

                      <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {lead.assignedTo || "Unassigned"}
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          View <ArrowRight size={12} className="inline" />
                        </span>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-xs text-slate-400">
                      Drop an opportunity here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Opportunity Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-white w-full sm:max-w-xl h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Add Opportunity
                </h2>
                <p className="text-sm text-slate-500">
                  Create a sales opportunity.
                </p>
              </div>
              <button onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Field label="Company Name" name="companyName" value={form.companyName} onChange={updateForm} required />
              <Field label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={updateForm} required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={updateForm} />
              <Field label="Phone" name="phone" value={form.phone} onChange={updateForm} />

              <Field label="Expected Deal Value (₹)" name="value" type="number" value={form.value} onChange={updateForm} min="0" />

              <SelectField
                label="Pipeline Stage"
                name="stage"
                value={form.stage}
                onChange={updateForm}
                options={stages}
              />

              <Field label="Assigned To" name="assignedTo" value={form.assignedTo} onChange={updateForm} required />
              <Field label="Expected Closing Date" name="expectedCloseDate" type="date" value={form.expectedCloseDate} onChange={updateForm} />

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Add Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative bg-white w-full sm:max-w-md h-full p-6 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Opportunity Details</h2>
              <button onClick={() => setSelectedLead(null)}>
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              {selectedLead.companyName}
            </h3>

            <div className="mt-6 space-y-4 text-sm">
              <Detail label="Contact Person" value={selectedLead.contactPerson} />
              <Detail label="Email" value={selectedLead.email || "-"} />
              <Detail label="Phone" value={selectedLead.phone || "-"} />
              <Detail label="Deal Value" value={formatCurrency(selectedLead.value)} />
              <Detail label="Stage" value={selectedLead.stage} />
              <Detail label="Assigned To" value={selectedLead.assignedTo || "-"} />
              <Detail label="Expected Closing" value={selectedLead.expectedCloseDate || "-"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-slate-800 mt-3">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
