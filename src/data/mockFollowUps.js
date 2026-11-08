/**
 * mockFollowUps.js
 * 
 * Seed data for Scheduled Follow-ups.
 * 
 * In production:
 * The ASP.NET Core Web API (`GET /api/follow-ups`) will return scheduled reminders
 * filtered by role, assignee, or date range.
 */

// Helper to calculate ISO date strings relative to today
const getRelativeDate = (dayOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().slice(0, 10);
};

export const INITIAL_FOLLOW_UPS = [
  {
    id: 1,
    leadName: "ABC Technologies",
    contact: "Rahul Sharma",
    phone: "+91 98765 43210",
    type: "Call",
    date: getRelativeDate(-1),
    time: "10:30",
    assignedTo: "Rahul Sharma",
    notes: "Discuss inventory management requirements and software licenses.",
    status: "Pending",
  },
  {
    id: 2,
    leadName: "Bright Solutions",
    contact: "Amit Patel",
    phone: "+91 98765 12345",
    type: "Meeting",
    date: getRelativeDate(0),
    time: "14:00",
    assignedTo: "Priya Shah",
    notes: "Product demo of CRM automation features.",
    status: "Pending",
  },
  {
    id: 3,
    leadName: "NextGen Healthcare",
    contact: "Neha Joshi",
    phone: "+91 98220 99887",
    type: "Email",
    date: getRelativeDate(1),
    time: "11:00",
    assignedTo: "Dhananjay",
    notes: "Send the updated pricing proposal and implementation timeline.",
    status: "Pending",
  },
  {
    id: 4,
    leadName: "Global Manufacturing",
    contact: "Vikram Mehta",
    phone: "+91 98760 12345",
    type: "Call",
    date: getRelativeDate(0),
    time: "09:30",
    assignedTo: "Rahul Sharma",
    notes: "Follow up regarding contract terms discussion.",
    status: "Completed",
  },
  {
    id: 5,
    leadName: "Smart Realty Developers",
    contact: "Karan Shah",
    phone: "+91 97110 55443",
    type: "Site Visit",
    date: getRelativeDate(2),
    time: "15:30",
    assignedTo: "Priya Shah",
    notes: "On-site review of sales office kiosk requirements.",
    status: "Pending",
  },
];

