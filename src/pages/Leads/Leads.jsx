/**
 * Leads.jsx
 * 
 * Shared CRM Leads Management Page with Create & Edit capability.
 * 
 * Accessible by: OrganizationOwner, Manager, Agent
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. EDITING LEADS IN A DRAWER:
 *    - `selectedLead` stores the lead clicked for editing.
 *    - When clicking "+ Add Lead", `selectedLead` is set to `null` (Create mode).
 *    - When clicking "Edit" on a lead row, `selectedLead` is set to that lead object (Edit mode).
 *    - The drawer receives `leadToEdit={selectedLead}` and pre-populates all inputs.
 * 
 * 2. IMMUTABLE STATE UPDATES (IMPORTANT REACT PRACTICE):
 *    In `handleSaveLead`:
 *    - To edit an item, we use `leads.map(...)` returning a new updated object.
 *    - To add an item, we use `[newLead, ...prevLeads]` creating a new array.
 *    - We NEVER mutate `leads[index].companyName = ...` directly, as React relies
 *      on object reference changes to detect updates and trigger re-renders.
 */

import { useState, useMemo } from "react";
import { Plus, Search, Users, Filter, Phone, Building2, Pencil } from "lucide-react";

import PageHeader from "../../component/common/PageHeader";
import StatCard from "../../component/common/StatCard";
import StatusBadge from "../../component/common/StatusBadge";
import AddLeadDrawer from "../../component/leads/AddLeadDrawer";
import { useAuth } from "../../component/auth/useAuth";
import { INITIAL_LEADS } from "../../data/mockLeads";

const leadStatuses = ["All", "New", "Contacted", "Interested", "Qualified", "Proposal Sent", "Won", "Lost"];

const Leads = () => {
  const { role } = useAuth();

  // State: List of leads (initialized from mock data)
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // State: Search query and status filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State: Controls visibility of the Add/Edit Lead Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // This state stores the selected lead.
  // When a user clicks View or Edit, we use this
  // lead to display the details inside the drawer.
  const [selectedLead, setSelectedLead] = useState(null);

  // Compute summary stats dynamically from the current leads state
  const stats = useMemo(() => {
    return {
      total: leads.length,
      newLeads: leads.filter((l) => l.status === "New").length,
      inProgress: leads.filter((l) => ["Contacted", "Interested", "Qualified", "Proposal Sent"].includes(l.status)).length,
      won: leads.filter((l) => l.status === "Won").length,
    };
  }, [leads]);

  // Filter leads based on active search text and selected status
  const filteredLeads = useMemo(() => {
    const term = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !term ||
        lead.companyName.toLowerCase().includes(term) ||
        lead.contactPerson.toLowerCase().includes(term) ||
        lead.phone.includes(term) ||
        (lead.city && lead.city.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  // Open drawer in Create mode
  const handleOpenCreate = () => {
    setSelectedLead(null);
    setIsDrawerOpen(true);
  };

  // Open drawer in Edit mode
  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  // Close drawer and reset selection
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedLead(null);
  };

  // Handle saving a lead (both Create and Edit)
  const handleSaveLead = async (formData) => {
    if (selectedLead) {
      // Edit mode: Update existing lead
      // When connected to ASP.NET Core:
      // await leadService.updateLead(selectedLead.id, formData);
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id
            ? { ...item, ...formData, id: selectedLead.id }
            : item
        )
      );
    } else {
      // Create mode: Append new lead
      // When connected to ASP.NET Core:
      // const created = await leadService.createLead(formData);
      const newLead = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setLeads((prev) => [newLead, ...prev]);
    }
  };

  const isAgent = role === "Agent";
  const pageTitle = isAgent ? "My Leads" : "Leads Management";
  const pageDescription = isAgent
    ? "View and manage your assigned customer leads."
    : "Track, assign and convert leads across your organization.";

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Page Header                                                        */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        action={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Lead</span>
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Metric & Summary Cards                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          subtitle="All registered leads"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="New Inquiries"
          value={stats.newLeads}
          subtitle="Requires first contact"
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="In Pipeline"
          value={stats.inProgress}
          subtitle="Active discussions"
          icon={Filter}
          color="orange"
        />
        <StatCard
          title="Won Deals"
          value={stats.won}
          subtitle="Converted customers"
          icon={Phone}
          color="green"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search & Filter Toolbar                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, contact, or phone..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-medium text-gray-500">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Leads Table & Empty State                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
              <Users size={32} />
            </div>
            <h3 className="font-semibold text-gray-800 text-base">
              No leads found
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              {search || statusFilter !== "All"
                ? "Try adjusting your search criteria or clear your filters."
                : "Get started by adding your first lead to the system."}
            </p>
            {search || statusFilter !== "All" ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                + Add your first lead
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Company</th>
                  <th className="px-5 py-3.5 font-medium">Contact Person</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Lead Type</th>
                  <th className="px-5 py-3.5 font-medium">Phone</th>
                  <th className="px-5 py-3.5 font-medium">Assigned To</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      <div>{lead.companyName}</div>
                      {lead.city && (
                        <span className="text-xs text-gray-400 font-normal">
                          {lead.city}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      <div>{lead.contactPerson}</div>
                      {lead.email && (
                        <div className="text-xs text-gray-400">{lead.email}</div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={lead.status} dot />
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {lead.leadType || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                      {lead.phone || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                        {lead.assignedTo || "Unassigned"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(lead)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition"
                      >
                        <Pencil size={13} />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Reusable Add / Edit Lead Drawer                                    */}
      {/* ------------------------------------------------------------------ */}
      <AddLeadDrawer
        isOpen={isDrawerOpen}
        leadToEdit={selectedLead}
        onClose={handleCloseDrawer}
        onSubmit={handleSaveLead}
      />
    </div>
  );
};

export default Leads;
