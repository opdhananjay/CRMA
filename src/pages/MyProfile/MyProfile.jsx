/**
 * MyProfile.jsx
 * 
 * User Profile & Account Settings Page.
 * 
 * Accessible by: SuperAdmin, OrganizationOwner, Manager, Agent
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. NEVER DECLARE COMPONENTS INSIDE RENDER (REACT 19 COMPILER RULE):
 *    Previously, `InfoItem` was declared INSIDE the `MyProfile` function body.
 *    In React, declaring a component inside another component re-creates that
 *    function on every single render. React treats it as an entirely new component type,
 *    destroying DOM state and hurting performance.
 *    SOLUTION: Move helper components OUTSIDE, passing data via props.
 * 
 * 2. CONTROLLED INPUT STATE:
 *    - `isEditing`: Boolean toggling between view mode and edit mode.
 *    - `formData`: Holds draft edits. If the user clicks "Cancel", `formData` reverts
 *      without corrupting the active `profile` state.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    - `GET /api/users/me` loads current authenticated profile.
 *    - `PUT /api/users/me` updates name and phone.
 *    - `POST /api/auth/change-password` updates credentials securely via ASP.NET Core Identity.
 */

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  CalendarDays,
  Pencil,
  LockKeyhole,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../component/auth/useAuth";

/**
 * Pure helper component declared OUTSIDE of MyProfile.
 * Renders an icon, label, and text value cleanly.
 */
function InfoItem({ icon, label, value }) {
  const IconComp = icon;
  return (
    <div className="flex items-start gap-3">
      {IconComp && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <IconComp size={18} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const { user, role } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [profile, setProfile] = useState({
    fullName: user?.name || user?.fullName || "User Name",
    email: user?.email || "",
    phone: user?.phone || "+91 98765 43210",
    organization: user?.organizationName || "Anjaya Systems",
    role: role || "Agent",
    status: user?.isActive === false ? "Inactive" : "Active",
    joinedDate: user?.joinedAt
      ? new Date(user.joinedAt).toLocaleDateString()
      : "10 Oct 2026",
  });

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    phone: profile.phone,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    setProfile((prev) => ({
      ...prev,
      fullName: formData.fullName,
      phone: formData.phone,
    }));

    setIsEditing(false);
    setSuccessMessage("Profile updated successfully.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPasswordError("");
  };

  const handleSavePassword = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      return;
    }

    // Backend call placeholder:
    // await authService.changePassword(passwordData);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
    setSuccessMessage("Password changed successfully.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information, security settings, and role credentials.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Header Banner */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-blue-700 to-indigo-600" />

        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
              {initials}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {profile.fullName}
              </h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    fullName: profile.fullName,
                    phone: profile.phone,
                  });
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Pencil size={15} />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
            >
              <LockKeyhole size={15} />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details or Edit Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-6">
          Personal Information
        </h3>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <InfoItem icon={UserRound} label="Full Name" value={profile.fullName} />
            <InfoItem icon={Mail} label="Email Address" value={profile.email} />
            <InfoItem icon={Phone} label="Phone Number" value={profile.phone} />
            <InfoItem icon={Building2} label="Organization" value={profile.organization} />
            <InfoItem icon={ShieldCheck} label="System Role" value={profile.role} />
            <InfoItem icon={CalendarDays} label="Member Since" value={profile.joinedDate} />
          </div>
        )}
      </div>

      {/* Password Change Form Modal / Card */}
      {showPasswordForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Update Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your account uses a secure password (minimum 8 characters).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          </div>

          {passwordError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Current Password *
              </label>
              <input
                required
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                New Password *
              </label>
              <input
                required
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Confirm New Password *
              </label>
              <input
                required
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
