/**
 * navigation.js
 * 
 * Centralized role navigation and dashboard path resolution.
 * 
 * Why this exists:
 * Previously, `ProtectedRoute.jsx`, `PublicRoute.jsx`, and `Login.jsx` each defined
 * their own private dictionary mapping roles to dashboard URLs.
 * If a URL changed, a developer had to update 3 different files.
 * Centralizing this ensures consistency across all routing and redirects.
 */

export const ROLE_NAMES = {
  SUPER_ADMIN: "SuperAdmin",
  ORGANIZATION_OWNER: "OrganizationOwner",
  MANAGER: "Manager",
  AGENT: "Agent",
};

export const DASHBOARD_PATHS = {
  [ROLE_NAMES.SUPER_ADMIN]: "/super-admin/dashboard",
  [ROLE_NAMES.ORGANIZATION_OWNER]: "/manager/dashboard",
  [ROLE_NAMES.MANAGER]: "/manager/dashboard",
  [ROLE_NAMES.AGENT]: "/agent/dashboard",
};

/**
 * Get the home dashboard path for a given user role.
 * Fallback to "/login" if role is missing or invalid.
 * 
 * @param {string|null} role - The user's role (e.g., "SuperAdmin", "Agent")
 * @returns {string} The dashboard URL
 */
export function getDashboardPath(role) {
  if (!role) return "/login";
  return DASHBOARD_PATHS[role] || "/login";
}

