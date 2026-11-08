/**
 * mockActivities.js
 * 
 * Seed data for Activity Logs & Audit Timelines.
 * 
 * In production:
 * The ASP.NET Core Web API (`GET /api/activities`) will return chronological activity
 * logs (status changes, follow-ups logged, calls made, meetings scheduled).
 */

export const INITIAL_ACTIVITIES = [
  {
    id: 1,
    type: "Call",
    title: "Outbound Call Completed",
    description: "Spoke with Rahul Sharma regarding inventory requirements. Interested in enterprise tier.",
    relatedTo: "ABC Technologies",
    performedBy: "Rahul Sharma",
    timestamp: "Today at 10:30 AM",
    badgeColor: "blue",
  },
  {
    id: 2,
    type: "StatusChange",
    title: "Lead Status Updated to 'Qualified'",
    description: "Lead budget confirmed at ₹2,00,000. Decision maker identified.",
    relatedTo: "TechNova Systems",
    performedBy: "Dhananjay",
    timestamp: "Today at 09:15 AM",
    badgeColor: "green",
  },
  {
    id: 3,
    type: "Meeting",
    title: "Online Demo Scheduled",
    description: "Scheduled 45-minute Google Meet for tomorrow with Amit Patel.",
    relatedTo: "Bright Solutions",
    performedBy: "Priya Shah",
    timestamp: "Yesterday at 04:30 PM",
    badgeColor: "purple",
  },
  {
    id: 4,
    type: "Email",
    title: "Proposal Sent",
    description: "Sent customized software architecture proposal and fee structure PDF.",
    relatedTo: "NextGen Healthcare",
    performedBy: "Dhananjay",
    timestamp: "Yesterday at 02:15 PM",
    badgeColor: "orange",
  },
  {
    id: 5,
    type: "LeadCreated",
    title: "New Lead Created",
    description: "Inquiry received from Website Contact Form.",
    relatedTo: "Smart Realty Developers",
    performedBy: "System (Webhook)",
    timestamp: "06 Nov 2026, 11:00 AM",
    badgeColor: "cyan",
  },
];

