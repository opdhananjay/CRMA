import { useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import AddLeadDrawer from "../../component/leads/AddLeadDrawer";

const Leads = () => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [leads, setLeads] = useState([]);

    const handleAddLead = async (data) => {
        console.log("New Lead:", data);

        // Temporary frontend implementation.
        // Later we will replace this with an API call.

        const newLead = {
            ...data,
            id: Date.now()
        };

        setLeads((previous) => [newLead, ...previous]);
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row
                            sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Leads
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage and track your business leads.
                    </p>
                </div>

                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center justify-center gap-2
                               rounded-lg bg-blue-600 px-4 py-2.5
                               text-sm font-medium text-white
                               hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Lead
                </button>

            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2
                               -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search leads..."
                    className="w-full rounded-lg border border-gray-200
                               bg-white py-2.5 pl-10 pr-4 text-sm
                               outline-none focus:border-blue-500"
                />
            </div>

            {/* Lead List */}
            <div className="overflow-hidden rounded-xl border
                            border-gray-200 bg-white">

                {leads.length === 0 ? (

                    <div className="flex flex-col items-center
                                    justify-center px-4 py-16 text-center">

                        <div className="mb-4 rounded-full bg-blue-50 p-4">
                            <Users size={28} className="text-blue-600" />
                        </div>

                        <h3 className="font-semibold text-gray-800">
                            No leads yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Start by adding your first lead.
                        </p>

                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="mt-4 text-sm font-semibold
                                       text-blue-600 hover:text-blue-700"
                        >
                            + Add your first lead
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left text-sm">

                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Company
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Contact
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Lead Type
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Phone
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {leads.map((lead) => (
                                    <tr key={lead.id}
                                        className="hover:bg-gray-50">

                                        <td className="px-5 py-4 font-medium text-gray-800">
                                            {lead.companyName}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {lead.contactPerson}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {lead.leadType}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full
                                                             bg-blue-50 px-3 py-1
                                                             text-xs font-medium
                                                             text-blue-700">
                                                {lead.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {lead.phone}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                )}

            </div>

            {/* Add Lead Drawer */}
            <AddLeadDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSubmit={handleAddLead}
            />

        </div>
    );
};

export default Leads;