/**
 * mockMeetings.js
 * 
 * Seed data for Scheduled Meetings.
 * 
 * In production:
 * The ASP.NET Core Web API (`GET /api/meetings`) will return scheduled meetings
 * filtered by tenant organization, assignee, and date range.
 */

const getTodayString = () => new Date().toISOString().slice(0, 10);

const getOffsetDateString = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const INITIAL_MEETINGS = [
  {
    id: 1,
    title: "CRM Product Architecture Discussion",
    leadName: "ABC Technologies",
    contactPerson: "Rahul Sharma",
    date: getTodayString(),
    time: "11:00",
    duration: "45",
    type: "Online",
    location: "Google Meet",
    assignedTo: "Rahul Sharma",
    notes: "Review custom workflow requirements and SQL Server data integration.",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Project Scope & Licensing Meeting",
    leadName: "Bright Solutions",
    contactPerson: "Amit Patel",
    date: getOffsetDateString(1),
    time: "14:30",
    duration: "60",
    type: "In Person",
    location: "Mumbai Head Office",
    assignedTo: "Priya Shah",
    notes: "Present proposal and finalize team seat licenses.",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Initial Discovery Session",
    leadName: "TechNova Systems",
    contactPerson: "Priya Shah",
    date: getOffsetDateString(-3),
    time: "10:00",
    duration: "30",
    type: "Online",
    location: "Microsoft Teams",
    assignedTo: "Dhananjay",
    notes: "Initial requirement gathering and company overview.",
    status: "Completed",
  },
  {
    id: 4,
    title: "Quarterly Sales Strategy Sync",
    leadName: "NextGen Healthcare",
    contactPerson: "Neha Joshi",
    date: getOffsetDateString(3),
    time: "16:00",
    duration: "45",
    type: "Online",
    location: "Zoom",
    assignedTo: "Rahul Sharma",
    notes: "Demonstrate healthcare compliance reporting module.",
    status: "Scheduled",
  },
];

