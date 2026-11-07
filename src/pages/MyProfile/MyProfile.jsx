import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  CalendarDays,
  Camera,
  Pencil,
  LockKeyhole,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../component/auth/AuthContext";

export default function MyProfile() {
  const { user, role } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.name || user?.fullName || "User Name",
    email: user?.email || "",
    phone: user?.phone || "",
    organization: user?.organizationName || "Anjaya Systems",
    role: role || "Agent",
    status: user?.isActive === false ? "Inactive" : "Active",
    joinedDate: user?.joinedAt
      ? new Date(user.joinedAt).toLocaleDateString()
      : "Not available",
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

    // TODO: Call PUT /api/users/me when backend is ready.
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSavePassword = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    // TODO: Call POST /api/auth/change-password.
    alert("Connect the change-password API to update your password.");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* Profile header */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="h-28 bg-gradient-to-r from-blue-700 to-indigo-600" />

        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
              {initials || <UserRound size={32} />}
              <button
                type="button"
                title="Change profile photo"
                className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-white p-1.5 text-slate-600 shadow"
              >
                <Camera size={15} />
              </button>
            </div>

            <div className="pb-1">
              <h2 className="text-xl font-bold text-slate-800">
                {profile.fullName}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {profile.role}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={13} />
                  {profile.status}
                </span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setFormData({
                  fullName: profile.fullName,
                  phone: profile.phone,
                });
                setIsEditing(true);
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Personal information */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">
                  Personal Information
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your basic personal and contact details.
                </p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Contact your organization owner to change your email.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InfoItem
                  icon={UserRound}
                  label="Full Name"
                  value={profile.fullName}
                />
                <InfoItem
                  icon={Mail}
                  label="Email Address"
                  value={profile.email}
                />
                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={profile.phone}
                />
                <InfoItem
                  icon={Building2}
                  label="Organization"
                  value={
                    profile.role === "SuperAdmin"
                      ? "Anjaya Platform"
                      : profile.organization
                  }
                />
              </div>
            )}
          </section>

          {/* Password section */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <LockKeyhole size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    Password & Security
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordForm((prev) => !prev)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handleSavePassword} className="mt-6 space-y-4">
                {[
                  ["currentPassword", "Current Password"],
                  ["newPassword", "New Password"],
                  ["confirmPassword", "Confirm New Password"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {label}
                    </label>
                    <input
                      type="password"
                      name={name}
                      value={passwordData[name]}
                      onChange={handlePasswordChange}
                      required
                      minLength={name === "currentPassword" ? undefined : 8}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Account information */}
        <div>
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-6 font-bold text-slate-800">
              Account Information
            </h3>

            <div className="space-y-6">
              <InfoItem
                icon={ShieldCheck}
                label="Account Role"
                value={profile.role}
              />
              <InfoItem
                icon={CheckCircle2}
                label="Account Status"
                value={profile.status}
              />
              <InfoItem
                icon={CalendarDays}
                label="Joined Date"
                value={profile.joinedDate}
              />
              <InfoItem
                icon={Building2}
                label="Organization"
                value={
                  profile.role === "SuperAdmin"
                    ? "Platform Administration"
                    : profile.organization
                }
              />
            </div>
          </section>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-center gap-2 text-blue-800">
              <ShieldCheck size={19} />
              <h3 className="text-sm font-bold">Account Security</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-blue-700">
              Never share your password with anyone. Contact your organization
              owner if you need help with your account access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
