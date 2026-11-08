/**
 * mockTeam.js
 * 
 * Seed data for Team Members (Tenant Users).
 * 
 * In production:
 * The ASP.NET Core Web API (`GET /api/team`) will return users belonging
 * to the authenticated user's OrganizationId.
 */

export const INITIAL_TEAM_MEMBERS = [
  {
    id: 1,
    name: "Dhananjay",
    email: "dhananjay@anjaya.com",
    phone: "+91 98765 43210",
    role: "Manager",
    department: "Management",
    status: "Active",
    joinedDate: "2026-01-10",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@abc.com",
    phone: "+91 98765 11111",
    role: "Manager",
    department: "Sales",
    status: "Active",
    joinedDate: "2026-02-15",
  },
  {
    id: 3,
    name: "Priya Shah",
    email: "priya@abc.com",
    phone: "+91 98765 22222",
    role: "Agent",
    department: "Sales",
    status: "Active",
    joinedDate: "2026-03-01",
  },
  {
    id: 4,
    name: "Amit Patel",
    email: "amit@abc.com",
    phone: "+91 98765 33333",
    role: "Agent",
    department: "Sales",
    status: "Inactive",
    joinedDate: "2026-03-15",
  },
];

