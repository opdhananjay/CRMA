import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../component/auth/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Temporary demo users for UI testing
  const demoUsers = {
    "superadmin@anjaya.com": {
      userId: 1,
      name: "Dhananjay",
      email: "superadmin@anjaya.com",
      role: "SuperAdmin",
      organizationId: null,
      organizationName: "Anjaya Systems",
    },

    "owner@abc.com": {
      userId: 2,
      name: "Amit Sharma",
      email: "owner@abc.com",
      role: "OrganizationOwner",
      organizationId: 101,
      organizationName: "ABC Technologies",
    },

    "manager@abc.com": {
      userId: 3,
      name: "Rahul Sharma",
      email: "manager@abc.com",
      role: "Manager",
      organizationId: 101,
      organizationName: "ABC Technologies",
    },

    "agent@abc.com": {
      userId: 4,
      name: "Priya Shah",
      email: "agent@abc.com",
      role: "Agent",
      organizationId: 101,
      organizationName: "ABC Technologies",
    },
  };

  const rolePaths = {
    SuperAdmin: "/super-admin/dashboard",
    OrganizationOwner: "/manager/dashboard",
    Manager: "/manager/dashboard",
    Agent: "/agent/dashboard",
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Login submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Temporary demo authentication
    // Later replace this section with your ASP.NET Core Login API.

    const email = form.email.trim().toLowerCase();
    const demoUser = demoUsers[email];

    if (!demoUser) {
      setErrors({
        general: "Invalid email or password.",
      });
      setLoading(false);
      return;
    }

    // Demo only: accepts any non-empty password.
    login(demoUser);

    // Remember me is not yet connected to persistent
    // authentication/session handling.
    navigate(rolePaths[demoUser.role] || "/login", {
      replace: true,
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#101D35] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-32 -left-32 blur-3xl" />
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full -bottom-32 -right-20 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>

            <div>
              <h1 className="text-white text-xl font-bold tracking-wide">
                ANJAYA
              </h1>
              <p className="text-slate-400 text-xs tracking-[3px]">SYSTEMS</p>
            </div>
          </div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-2 text-sm">
            <CheckCircle2 size={15} />
            Your business, organized
          </span>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mt-7">
            Manage your business.
            <span className="text-blue-400"> Grow with confidence.</span>
          </h2>

          <p className="text-slate-400 mt-6 text-base leading-7">
            Manage leads, track opportunities, organize your team and build
            stronger customer relationships — all in one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Manage your leads and sales pipeline",
              "Stay on top of meetings and follow-ups",
              "Track your team's performance",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-slate-300 text-sm"
              >
                <CheckCircle2 size={18} className="text-blue-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-xs">
          © {new Date().getFullYear()} Anjaya Systems. All rights reserved.
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>

            <div>
              <h1 className="text-slate-900 text-lg font-bold">ANJAYA</h1>
              <p className="text-slate-500 text-xs tracking-[3px]">SYSTEMS</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>

            <p className="text-slate-500 mt-2 text-sm">
              Please enter your details to sign in to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm outline-none transition ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg text-sm outline-none transition ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />

              <label
                htmlFor="rememberMe"
                className="text-sm text-slate-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* General Error */}
            {errors.general && (
              <p className="text-sm text-red-500">{errors.general}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition shadow-sm"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <span className="text-slate-700 font-medium">
              Contact your administrator
            </span>
          </div>

          <p className="text-center text-xs text-slate-400 mt-12">
            © {new Date().getFullYear()} Anjaya Systems
          </p>

          {/* Demo Login Credentials */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Demo Login Emails
            </p>
            <p className="text-xs text-slate-500">
              Super Admin: superadmin@anjaya.com
            </p>
            <p className="text-xs text-slate-500">Owner: owner@abc.com</p>
            <p className="text-xs text-slate-500">Manager: manager@abc.com</p>
            <p className="text-xs text-slate-500">Agent: agent@abc.com</p>
            <p className="text-xs text-slate-400 mt-2">
              Demo only: any non-empty password works.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
