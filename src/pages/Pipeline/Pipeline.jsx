/**
 * Pipeline.jsx
 * 
 * Visual Sales Pipeline (Kanban Board) with Drag-and-Drop.
 * 
 * Accessible by: OrganizationOwner, Manager
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. NATIVE HTML5 DRAG AND DROP IN REACT:
 *    We didn't install bulky third-party libraries like `react-beautiful-dnd` or `dnd-kit`.
 *    Instead, we use native HTML5 drag-and-drop:
 *    - `draggable`: Enables dragging on lead cards.
 *    - `onDragStart`: Captures which lead ID is being dragged and stores it in `event.dataTransfer`.
 *    - `onDragOver`: Calls `event.preventDefault()` so the browser allows dropping on that stage.
 *    - `onDrop`: Reads the lead ID and updates its `stage` in state.
 * 
 * 2. COMPONENT REUSE:
 *    Previously, `Pipeline.jsx` defined its own private `SummaryCard` function.
 *    It now uses our shared `<StatCard>`, maintaining consistency across all pages.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    When connected to ASP.NET Core:
 *    - `GET /api/pipeline` loads active deals.
 *    - When a user drops a card onto a new stage, `PATCH /api/leads/{id}/stage`
 *      persists the new stage in SQL Server.
 */

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Building2,
  CalendarDays,
  IndianRupee,
  GripVertical,
  X,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import Drawer from "../../component/common/Drawer";

const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const INITIAL_PIPELINE_DEALS = [
  {
    id: 1,
    companyName: "ABC Technologies",
    contactPerson: "Rahul Sharma",
    email: "rahul@abctech.com",
    phone: "+91 98765 43210",
    value: 75000,
    stage: "New",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-11-20",
  },
  {
    id: 2,
    companyName: "Bright Solutions",
    contactPerson: "Amit Patel",
    email: "amit@brightsolutions.com",
    phone: "+91 98765 12345",
    value: 125000,
    stage: "Contacted",
    assignedTo: "Rahul Sharma",
    expectedCloseDate: "2026-11-25",
  },
  {
    id: 3,
    companyName: "TechNova Systems",
    contactPerson: "Priya Shah",
    email: "priya@technova.com",
    phone: "+91 99887 66554",
    value: 200000,
    stage: "Qualified",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-11-28",
  },
  {
    id: 4,
    companyName: "Global Manufacturing",
    contactPerson: "Vikram Mehta",
    email: "vikram@globalmfg.com",
    phone: "+91 98760 12345",
    value: 150000,
    stage: "Proposal",
    assignedTo: "Rahul Sharma",
    expectedCloseDate: "2026-12-05",
  },
  {
    id: 5,
    companyName: "NextGen Healthcare",
    contactPerson: "Neha Joshi",
    email: "neha@nextgenhealth.com",
    phone: "+91 98220 99887",
    value: 300000,
    stage: "Negotiation",
    assignedTo: "Dhananjay",
    expectedCloseDate: "2026-12-10",
  },
  {
    id: 6,
    companyName: "Smart Realty Developers",
    contactPerson: "Karan Shah",
    email: "karan@smartrealty.com",
    phone: "+91 97110 55443",
    value: 90000,
    stage: "Won",
    assignedTo: "Priya Shah",
    expectedCloseDate: "2026-11-10",
  },
  {
    id: 7,
    companyName: "Legacy Logistics",
    contactPerson: "Suresh Patil",
    email: "suresh@legacylogistics.com",
    phone: "+91 96550 44332",
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

// Helper: Format Indian Rupee currency
const formatCurrency = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);

// Stage accent border colors
const STAGE_HEADER_COLORS = {
  New: "border-blue-500",
  Contacted: "border-cyan-500",
  Qualified: "border-purple-500",
  Proposal: "border-violet-500",
  Negotiation: "border-amber-500",
  Won: "border-green-500",
  Lost: "border-red-500",
};

export default function Pipeline() {
  const [leads, setLeads] = useState(INITIAL_PIPELINE_DEALS);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(emptyLead);
  const [draggedLeadId, setDraggedLeadId] = useState(null);

  // Filter deals based on search term
  const filteredLeads = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return leads;

    return leads.filter(
      (lead) =>
        lead.companyName.toLowerCase().includes(term) ||
        lead.contactPerson.toLowerCase().includes(term) ||
        lead.assignedTo.toLowerCase().includes(term)
    );
  }, [leads, search]);

  // Aggregate pipeline metrics
  const stats = useMemo(() => {
    const active = leads.filter((l) => !["Won", "Lost"].includes(l.stage));
    const won = leads.filter((l) => l.stage === "Won");

    const totalPipelineValue = active.reduce((sum, l) => sum + Number(l.value || 0), 0);
    const wonValue = won.reduce((sum, l) => sum + Number(l.value || 0), 0);

    return {
      activeCount: active.length,
      pipelineValue: formatCurrency(totalPipelineValue),
      wonValue: formatCurrency(wonValue),
    };
  }, [leads]);

  // Drag-and-drop: When drag starts on a deal card
  const handleDragStart = (event, leadId) => {
    setDraggedLeadId(leadId);
    event.dataTransfer.setData("text/plain", String(leadId));
    event.dataTransfer.effectAllowed = "move";
  };

  // Drag-and-drop: When card is dropped over a stage column
  const handleDrop = (event, targetStage) => {
    event.preventDefault();
    const leadId = Number(event.dataTransfer.getData("text/plain") || draggedLeadId);

    if (!leadId) return;

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, stage: targetStage } : lead
      )
    );

    setDraggedLeadId(null);
  };

  // Handle adding an opportunity
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

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Sales Pipeline"
        description="Visual deal board. Drag and drop cards between stages to track deal progression."
        action={
          <button
            type="button"
            onClick={() => {
              setForm(emptyLead);
              setDrawerOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Opportunity</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Summary KPI Cards                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Opportunities"
          value={stats.activeCount}
          subtitle="Deals in negotiation"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Active Pipeline Value"
          value={stats.pipelineValue}
          subtitle="Estimated weighted revenue"
          icon={IndianRupee}
          color="purple"
        />
        <StatCard
          title="Won Deal Value"
          value={stats.wonValue}
          subtitle="Successfully closed"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search Bar                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter pipeline by company or owner..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Kanban Board Container                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);
          const stageTotal = stageLeads.reduce((acc, l) => acc + Number(l.value || 0), 0);
          const headerAccent = STAGE_HEADER_COLORS[stage] || "border-gray-300";

          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage)}
              className="w-72 shrink-0 bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col max-h-[calc(100vh-280px)]"
            >
              {/* Column Header */}
              <div className={`border-t-2 ${headerAccent} bg-white rounded-lg p-3 shadow-sm mb-3`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {stage}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {stageLeads.length}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {formatCurrency(stageTotal)}
                </p>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 min-h-[120px]">
                {stageLeads.length === 0 ? (
                  <div className="h-24 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400">
                    Drop deals here
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm leading-tight">
                          {lead.companyName}
                        </h4>
                        <GripVertical size={14} className="text-slate-300 shrink-0" />
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {lead.contactPerson}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {formatCurrency(lead.value)}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {lead.assignedTo}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add Opportunity Drawer                                             */}
      {/* ------------------------------------------------------------------ */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add Opportunity"
        description="Create a deal and place it into your sales pipeline."
        maxWidth="max-w-[560px]"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              required
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={updateForm}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contact Person *
            </label>
            <input
              required
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={updateForm}
              placeholder="Primary contact"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Deal Value (₹) *
              </label>
              <input
                required
                type="number"
                name="value"
                value={form.value}
                onChange={updateForm}
                placeholder="Estimated revenue"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Initial Stage
              </label>
              <select
                name="stage"
                value={form.stage}
                onChange={updateForm}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Assigned Host / Owner
            </label>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={updateForm}
              placeholder="e.g., Rahul Sharma"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Save Deal
            </button>
          </div>
        </form>
      </Drawer>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Deal Details Modal                                           */}
      {/* ------------------------------------------------------------------ */}
      {selectedLead && (
        <Drawer
          isOpen={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
          title={selectedLead.companyName}
          description="Opportunity Details"
          maxWidth="max-w-[480px]"
        >
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Contact:</span>
                <span className="font-semibold text-gray-800">{selectedLead.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Value:</span>
                <span className="font-bold text-blue-600">{formatCurrency(selectedLead.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Stage:</span>
                <span className="font-medium text-gray-800">{selectedLead.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned To:</span>
                <span className="text-gray-800">{selectedLead.assignedTo}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Move to Stage:
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={selectedLead.stage === s}
                    onClick={() => {
                      setLeads((prev) =>
                        prev.map((l) => (l.id === selectedLead.id ? { ...l, stage: s } : l))
                      );
                      setSelectedLead((prev) => ({ ...prev, stage: s }));
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition ${
                      selectedLead.stage === s
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "hover:bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
