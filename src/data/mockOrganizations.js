/**
 * mockOrganizations.js
 * 
 * Seed data for Tenant Organizations managed by Platform SuperAdmin.
 * 
 * In production:
 * The ASP.NET Core Web API (`GET /api/organizations`) will return all registered
 * tenant companies on the platform.
 */

export const INITIAL_ORGANIZATIONS = [
  {
    id: 1,
    name: "ABC Technologies",
    code: "ORG-0001",
    owner: "Rahul Sharma",
    email: "owner@abc.com",
    phone: "+91 98765 43210",
    plan: "Professional",
    users: 12,
    status: "Active",
    createdAt: "12 Oct 2026",
  },
  {
    id: 2,
    name: "Bright Solutions",
    code: "ORG-0002",
    owner: "Priya Patel",
    email: "priya@brightsolutions.com",
    phone: "+91 98765 12345",
    plan: "Starter",
    users: 5,
    status: "Trial",
    createdAt: "20 Oct 2026",
  },
  {
    id: 3,
    name: "NextGen Services",
    code: "ORG-0003",
    owner: "Amit Verma",
    email: "amit@nextgen.com",
    phone: "+91 99887 66554",
    plan: "Enterprise",
    users: 28,
    status: "Suspended",
    createdAt: "25 Oct 2026",
  },
  {
    id: 4,
    name: "Global Connect",
    code: "ORG-0004",
    owner: "Sneha Desai",
    email: "sneha@globalconnect.com",
    phone: "+91 98760 12345",
    plan: "Professional",
    users: 9,
    status: "Active",
    createdAt: "01 Nov 2026",
  },
];

