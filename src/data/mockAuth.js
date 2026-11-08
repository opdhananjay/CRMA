/**
 * mockAuth.js
 * 
 * Mock authentication users for UI testing before backend API is connected.
 * 
 * In production:
 * The ASP.NET Core backend will authenticate credentials via `POST /api/auth/login`,
 * validate the password hash (using ASP.NET Identity or BCrypt), and return a JWT token
 * along with the authenticated user's profile and organization claims.
 * 
 * For now:
 * This data allows frontend developers and testers to log in as different roles
 * (SuperAdmin, OrganizationOwner, Manager, Agent) and inspect role-based behavior.
 */

export const DEMO_USERS = {
  "superadmin@anjaya.com": {
    userId: 1,
    name: "Dhananjay",
    email: "superadmin@anjaya.com",
    role: "SuperAdmin",
    organizationId: null,
    organizationName: "Anjaya Systems",
    phone: "+91 98765 43210",
  },

  "owner@abc.com": {
    userId: 2,
    name: "Amit Sharma",
    email: "owner@abc.com",
    role: "OrganizationOwner",
    organizationId: 101,
    organizationName: "ABC Technologies",
    phone: "+91 98765 11111",
  },

  "manager@abc.com": {
    userId: 3,
    name: "Rahul Sharma",
    email: "manager@abc.com",
    role: "Manager",
    organizationId: 101,
    organizationName: "ABC Technologies",
    phone: "+91 98765 22222",
  },

  "agent@abc.com": {
    userId: 4,
    name: "Priya Shah",
    email: "agent@abc.com",
    role: "Agent",
    organizationId: 101,
    organizationName: "ABC Technologies",
    phone: "+91 98765 33333",
  },
};

