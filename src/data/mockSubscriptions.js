/**
 * mockSubscriptions.js
 * 
 * Seed data for SaaS Subscription Plans and Organization Subscriptions.
 * 
 * In production:
 * The ASP.NET Core Web API (`GET /api/subscriptions`) will return subscription
 * tiers, active billing cycles, and organization-plan assignments.
 */

export const INITIAL_PLANS = [
  {
    id: 1,
    name: "Free Plan",
    price: 0,
    billingCycle: "Free",
    userLimit: 3,
    storageLimitGB: 1,
    features: ["Up to 3 Users", "Basic CRM Leads", "Meeting Scheduling", "Community Support"],
    status: "Active",
  },
  {
    id: 2,
    name: "Starter Plan",
    price: 1999,
    billingCycle: "Monthly",
    userLimit: 10,
    storageLimitGB: 10,
    features: ["Up to 10 Users", "Pipeline Management", "Follow-up Reminders", "Email Support"],
    status: "Active",
  },
  {
    id: 3,
    name: "Professional Plan",
    price: 4999,
    billingCycle: "Monthly",
    userLimit: 30,
    storageLimitGB: 50,
    features: ["Up to 30 Users", "All CRM Modules", "Roles & Permissions", "Priority Support"],
    status: "Active",
  },
];

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    organizationId: "ORG-0001",
    organizationName: "ABC Technologies",
    ownerName: "Rahul Sharma",
    ownerEmail: "owner@abc.com",
    planName: "Professional Plan",
    price: 4999,
    billingCycle: "Monthly",
    startDate: "2026-10-12",
    endDate: null,
    status: "Active",
  },
  {
    id: 2,
    organizationId: "ORG-0002",
    organizationName: "Bright Solutions",
    ownerName: "Priya Patel",
    ownerEmail: "priya@brightsolutions.com",
    planName: "Starter Plan",
    price: 1999,
    billingCycle: "Monthly",
    startDate: "2026-10-20",
    endDate: null,
    status: "Active",
  },
  {
    id: 3,
    organizationId: "ORG-0003",
    organizationName: "NextGen Services",
    ownerName: "Amit Verma",
    ownerEmail: "amit@nextgen.com",
    planName: "Professional Plan",
    price: 4999,
    billingCycle: "Monthly",
    startDate: "2026-10-25",
    endDate: null,
    status: "Suspended",
  },
  {
    id: 4,
    organizationId: "ORG-0004",
    organizationName: "Global Connect",
    ownerName: "Sneha Desai",
    ownerEmail: "sneha@globalconnect.com",
    planName: "Free Plan",
    price: 0,
    billingCycle: "Free",
    startDate: "2026-11-01",
    endDate: null,
    status: "Active",
  },
];

