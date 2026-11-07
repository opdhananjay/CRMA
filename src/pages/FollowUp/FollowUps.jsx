import { useMemo, useState } from "react";
import {
    Plus,
    Search,
    CalendarDays,
    Clock,
    Phone,
    Users,
    Video,
    MoreHorizontal,
    CheckCircle2,
    AlertCircle,
    CalendarClock,
    X,
    MessageSquare,
    Filter
} from "lucide-react";

const getDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
};

const initialFollowUps = [
    {
        id: 1,
        leadName: "ABC Manufacturing",
        contact: "Rahul Sharma",
        phone: "9876543210",
        type: "Call",
        date: getDate(-1),
        time: "10:30",
        assignedTo: "Rahul Sharma",
        notes: "Discuss inventory management requirements.",
        status: "Pending"
    },
    {
        id: 2,
        leadName: "Global Properties",
        contact: "Priya Patel",
        phone: "9876543211",
        type: "Meeting",
        date: getDate(0),
        time: "14:00",
        assignedTo: "Priya Patel",
        notes: "Discuss CRM requirements.",
        status: "Pending"
    },
    {
        id: 3,
        leadName: "Bright Education",
        contact: "Amit Shah",
        phone: "9876543212",
        type: "Email",
        date: getDate(1),
        time: "11:00",
        assignedTo: "Amit Shah",
        notes: "Send the software proposal.",
        status: "Pending"
    },
    {
        id: 4,
        leadName: "Tech Solutions",
        contact: "Vikas Mehta",
        phone: "9876543213",
        type: "Call",
        date: getDate(0),
        time: "09:00",
        assignedTo: "Rahul Sharma",
        notes: "Discuss project pricing.",
        status: "Completed"
    }
];

const tabs = [
    "All",
    "Today",
    "Upcoming",
    "Overdue",
    "Completed"
];

const emptyForm = {
    leadName: "",
    type: "Call",
    date: getDate(0),
    time: "10:00",
    assignedTo: "",
    notes: ""
};

const FollowUps = () => {

    const [followUps, setFollowUps] = useState(initialFollowUps);
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const today = getDate(0);

    // Determine follow-up status using its due date.
    const getFollowUpStatus = (item) => {
        if (item.status === "Completed" || item.status === "Cancelled") {
            return item.status;
        }

        if (item.date < today) return "Overdue";
        if (item.date === today) return "Today";

        return "Upcoming";
    };

    // Summary cards
    const summary = useMemo(() => {
        const pending = followUps.filter(
            item => item.status === "Pending"
        );

        return {
            total: pending.length,
            today: pending.filter(item => item.date === today).length,
            upcoming: pending.filter(item => item.date > today).length,
            overdue: pending.filter(item => item.date < today).length
        };
    }, [followUps, today]);

    // Search and tab filtering
    const filteredFollowUps = useMemo(() => {

        return followUps.filter(item => {

            const status = getFollowUpStatus(item);

            const matchesTab =
                activeTab === "All" ||
                (activeTab === "Today" && status === "Today") ||
                (activeTab === "Upcoming" && status === "Upcoming") ||
                (activeTab === "Overdue" && status === "Overdue") ||
                (activeTab === "Completed" && status === "Completed");

            const matchesSearch =
                item.leadName.toLowerCase().includes(search.toLowerCase()) ||
                item.contact.toLowerCase().includes(search.toLowerCase()) ||
                item.assignedTo.toLowerCase().includes(search.toLowerCase());

            return matchesTab && matchesSearch;
        }).sort((a, b) => {
            return `${a.date} ${a.time}`.localeCompare(
                `${b.date} ${b.time}`
            );
        });

    }, [followUps, activeTab, search]);

    const updateForm = (e) => {
        const { name, value } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

        setErrors(previous => ({
            ...previous,
            [name]: ""
        }));
    };

    const handleAddFollowUp = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!form.leadName) {
            newErrors.leadName = "Please select a lead.";
        }

        if (!form.date) {
            newErrors.date = "Please select a date.";
        }

        if (!form.time) {
            newErrors.time = "Please select a time.";
        }

        if (!form.assignedTo.trim()) {
            newErrors.assignedTo = "Please enter an assigned user.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newFollowUp = {
            ...form,
            id: Date.now(),
            contact: "Contact details pending",
            phone: "",
            status: "Pending"
        };

        setFollowUps(previous => [
            newFollowUp,
            ...previous
        ]);

        setForm(emptyForm);
        setErrors({});
        setIsDrawerOpen(false);
        setActiveTab("All");
    };

    const markCompleted = (id) => {
        setFollowUps(previous =>
            previous.map(item =>
                item.id === id
                    ? { ...item, status: "Completed" }
                    : item
            )
        );
    };

    const cancelFollowUp = (id) => {
        setFollowUps(previous =>
            previous.map(item =>
                item.id === id
                    ? { ...item, status: "Cancelled" }
                    : item
            )
        );
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "Call":
                return Phone;
            case "Meeting":
                return Users;
            case "Email":
                return MessageSquare;
            case "Site Visit":
                return Video;
            default:
                return CalendarClock;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Overdue":
                return "bg-red-50 text-red-700";
            case "Today":
                return "bg-blue-50 text-blue-700";
            case "Upcoming":
                return "bg-purple-50 text-purple-700";
            case "Completed":
                return "bg-green-50 text-green-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const stats = [
        {
            title: "Total Pending",
            value: summary.total,
            icon: CalendarClock,
            color: "blue"
        },
        {
            title: "Due Today",
            value: summary.today,
            icon: Clock,
            color: "purple"
        },
        {
            title: "Upcoming",
            value: summary.upcoming,
            icon: CalendarDays,
            color: "orange"
        },
        {
            title: "Overdue",
            value: summary.overdue,
            icon: AlertCircle,
            color: "red"
        }
    ];

    const cardColors = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
        red: "bg-red-50 text-red-600"
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center
                            sm:justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Follow-ups
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your scheduled calls, meetings and reminders.
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
                    Add Follow-up
                </button>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {stats.map(item => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-xl border border-gray-200
                                       bg-white p-5"
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {item.title}
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold
                                                   text-gray-800">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className={`rounded-lg p-3 ${cardColors[item.color]}`}>
                                    <Icon size={22} />
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>

            {/* Follow-up List */}
            <div className="overflow-hidden rounded-xl border
                            border-gray-200 bg-white">

                {/* Tabs */}
                <div className="flex gap-5 overflow-x-auto border-b
                                border-gray-200 px-5">

                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap border-b-2 py-4
                                text-sm font-medium transition-colors
                                ${
                                    activeTab === tab
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}

                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3
                                justify-between p-4">

                    <div className="relative w-full sm:max-w-sm">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2
                                       -translate-y-1/2 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search lead, contact or employee..."
                            className="w-full rounded-lg border border-gray-200
                                       py-2.5 pl-10 pr-3 text-sm outline-none
                                       focus:border-blue-500"
                        />

                    </div>

                    <button className="flex items-center justify-center gap-2
                                       rounded-lg border border-gray-200
                                       px-4 py-2.5 text-sm text-gray-600
                                       hover:bg-gray-50">
                        <Filter size={17} />
                        Filters
                    </button>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px] text-left text-sm">

                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">Lead</th>
                                <th className="px-5 py-3 font-medium">Type</th>
                                <th className="px-5 py-3 font-medium">Due Date</th>
                                <th className="px-5 py-3 font-medium">Assigned To</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredFollowUps.map(item => {

                                const Icon = getTypeIcon(item.type);
                                const status = getFollowUpStatus(item);

                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800">
                                                {item.leadName}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.contact}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Icon size={16} />
                                                {item.type}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-gray-700">
                                                {new Date(
                                                    `${item.date}T00:00:00`
                                                ).toLocaleDateString("en-IN")}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.time}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {item.assignedTo}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-3 py-1
                                                              text-xs font-medium
                                                              ${getStatusStyle(status)}`}>
                                                {status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">

                                                {item.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => markCompleted(item.id)}
                                                            title="Mark completed"
                                                            className="rounded-lg p-2 text-green-600
                                                                       hover:bg-green-50"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() => cancelFollowUp(item.id)}
                                                            title="Cancel follow-up"
                                                            className="rounded-lg p-2 text-red-500
                                                                       hover:bg-red-50"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    title="More options"
                                                    className="rounded-lg p-2 text-gray-500
                                                               hover:bg-gray-100"
                                                >
                                                    <MoreHorizontal size={19} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                    {filteredFollowUps.length === 0 && (
                        <div className="py-14 text-center">
                            <CalendarClock
                                size={30}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 font-medium text-gray-700">
                                No follow-ups found
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Try another tab or add a new follow-up.
                            </p>
                        </div>
                    )}

                </div>

            </div>

            {/* Add Follow-up Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">

                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsDrawerOpen(false)}
                    />

                    <div className="relative flex h-full w-full max-w-[550px]
                                    flex-col bg-white shadow-2xl">

                        <div className="flex items-center justify-between
                                        border-b border-gray-200 px-5 py-4">

                            <div>
                                <h2 className="font-semibold text-gray-800">
                                    Add Follow-up
                                </h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Schedule your next action.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="rounded-lg p-2 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleAddFollowUp}
                            className="flex min-h-0 flex-1 flex-col"
                        >

                            <div className="flex-1 space-y-5 overflow-y-auto p-5">

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Select Lead *
                                    </label>

                                    <select
                                        name="leadName"
                                        value={form.leadName}
                                        onChange={updateForm}
                                        className="w-full rounded-lg border border-gray-200
                                                   bg-white px-3 py-2.5 text-sm outline-none
                                                   focus:border-blue-500"
                                    >
                                        <option value="">Select a lead</option>
                                        <option value="ABC Manufacturing">ABC Manufacturing</option>
                                        <option value="Global Properties">Global Properties</option>
                                        <option value="Bright Education">Bright Education</option>
                                    </select>

                                    {errors.leadName && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.leadName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Follow-up Type *
                                    </label>

                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={updateForm}
                                        className="w-full rounded-lg border border-gray-200
                                                   bg-white px-3 py-2.5 text-sm outline-none
                                                   focus:border-blue-500"
                                    >
                                        <option value="Call">Call</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Email">Email</option>
                                        <option value="Site Visit">Site Visit</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Due Date *
                                        </label>

                                        <input
                                            type="date"
                                            name="date"
                                            min={today}
                                            value={form.date}
                                            onChange={updateForm}
                                            className="w-full rounded-lg border border-gray-200
                                                       px-3 py-2.5 text-sm outline-none
                                                       focus:border-blue-500"
                                        />

                                        {errors.date && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Due Time *
                                        </label>

                                        <input
                                            type="time"
                                            name="time"
                                            value={form.time}
                                            onChange={updateForm}
                                            className="w-full rounded-lg border border-gray-200
                                                       px-3 py-2.5 text-sm outline-none
                                                       focus:border-blue-500"
                                        />

                                        {errors.time && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.time}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Assigned To *
                                    </label>

                                    <select
                                        name="assignedTo"
                                        value={form.assignedTo}
                                        onChange={updateForm}
                                        className="w-full rounded-lg border border-gray-200
                                                   bg-white px-3 py-2.5 text-sm outline-none
                                                   focus:border-blue-500"
                                    >
                                        <option value="">Select employee</option>
                                        <option value="Rahul Sharma">Rahul Sharma</option>
                                        <option value="Priya Patel">Priya Patel</option>
                                        <option value="Amit Shah">Amit Shah</option>
                                    </select>

                                    {errors.assignedTo && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.assignedTo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>

                                    <textarea
                                        name="notes"
                                        rows={4}
                                        value={form.notes}
                                        onChange={updateForm}
                                        placeholder="What should be discussed during the follow-up?"
                                        className="w-full resize-y rounded-lg border border-gray-200
                                                   px-3 py-2.5 text-sm outline-none
                                                   focus:border-blue-500"
                                    />
                                </div>

                            </div>

                            <div className="flex flex-col-reverse gap-3
                                            border-t border-gray-200 p-5
                                            sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="rounded-lg border border-gray-300
                                               px-5 py-2.5 text-sm text-gray-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5
                                               text-sm font-medium text-white
                                               hover:bg-blue-700"
                                >
                                    Save Follow-up
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default FollowUps;