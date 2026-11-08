/**
 * Login.jsx
 * 
 * Authentication / Login Page.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. FORM STATE MANAGEMENT:
 *    - `form`: Stores controlled input values (`email`, `password`).
 *    - `errors`: Stores validation error messages mapped by field name.
 *    - `loading`: Disables the submit button while authentication is processing.
 * 
 * 2. VALIDATION FLOW:
 *    - Client-side validation runs first (`validateForm`).
 *    - If any field is empty or malformed, error state is set and execution stops.
 *    - This gives instant feedback to the user without sending invalid network requests.
 * 
 * 3. BACKEND API INTEGRATION POINT:
 *    Currently, this page matches the email against `DEMO_USERS` (see `src/data/mockAuth.js`).
 *    When the ASP.NET Core backend is connected:
 *    ```javascript
 *    // Future API integration:
 *    const response = await authService.login({
 *      email: form.email,
 *      password: form.password,
 *    });
 *    login(response.user, response.token);
 *    ```
 * 
 * 4. ONE-CLICK DEMO LOGIN:
 *    To help you and your team test the four roles quickly, clicking any role button
 *    in the demo credentials box automatically populates the form!
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../component/auth/useAuth";
import { DEMO_USERS } from "../../data/mockAuth";
import { getDashboardPath } from "../../utils/navigation";

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

  // Handle controlled input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message once user starts re-typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  // Validate form fields before submission
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // ========================================================================
    // BACKEND INTEGRATION PLACEHOLDER:
    // Replace this demo lookup with your ASP.NET Core Login API:
    // POST /api/auth/login -> { email, password }
    // ========================================================================

    const email = form.email.trim().toLowerCase();
    const demoUser = DEMO_USERS[email];

    if (!demoUser) {
      setErrors({
        general: "Invalid email or password. Please use a demo account below.",
      });
      setLoading(false);
      return;
    }

    // Authenticate the user in AuthContext
    login(demoUser);

    // Redirect to the appropriate role dashboard
    const destinationPath = getDashboardPath(demoUser.role);
    navigate(destinationPath, { replace: true });

    setLoading(false);
  };

  // Helper to autofill the form when testing different roles
  const handleSelectDemoUser = (email) => {
    setForm({
      email,
      password: "Password123!",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ------------------------------------------------------------------ */}
      {/* Left Branding Section                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#101D35] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-32 -left-32 blur-3xl" />
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full -bottom-32 -right-20 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              A
            </div>

            <div>
              <h1 className="text-white text-xl font-bold tracking-wide">
                ANJAYA
              </h1>
              <p className="text-slate-400 text-xs tracking-[3px]">CRM PLATFORM</p>
            </div>
          </div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-2 text-sm">
            <CheckCircle2 size={15} />
            Multi-Tenant CRM Architecture
          </span>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mt-7">
            Manage your sales.
            <span className="text-blue-400"> Grow your business.</span>
          </h2>

          <p className="text-slate-400 mt-6 text-base leading-7">
            Manage leads, track pipelines, coordinate meetings and build
            stronger customer relationships — all in one unified CRM.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Shared Lead & Pipeline management",
              "Role-based access for SuperAdmin, Owner, Manager & Agent",
              "Prepared for ASP.NET Core Web API & SQL Server",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-slate-300 text-sm"
              >
                <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Anjaya Systems. All rights reserved.
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right Login Section                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>

            <div>
              <h1 className="text-slate-900 text-lg font-bold">ANJAYA CRM</h1>
              <p className="text-slate-500 text-xs tracking-[2px]">SYSTEMS</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your credentials to access your CRM workspace.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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
                  placeholder="name@company.com"
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => alert("Password reset functionality will connect to ASP.NET Core Identity.")}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />

              <label
                htmlFor="rememberMe"
                className="text-sm text-slate-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* General Submission Error */}
            {errors.general && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition shadow-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* -------------------------------------------------------------- */}
          {/* Developer Quick-Login Box (For Testing All 4 Roles)             */}
          {/* -------------------------------------------------------------- */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles size={15} className="text-amber-500" />
              <span>Quick Test: Click a role to autofill</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleSelectDemoUser("superadmin@anjaya.com")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-xs"
              >
                <p className="font-semibold text-slate-800">SuperAdmin</p>
                <p className="text-[11px] text-slate-500 truncate">superadmin@anjaya.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser("owner@abc.com")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-xs"
              >
                <p className="font-semibold text-slate-800">Owner</p>
                <p className="text-[11px] text-slate-500 truncate">owner@abc.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser("manager@abc.com")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-xs"
              >
                <p className="font-semibold text-slate-800">Manager</p>
                <p className="text-[11px] text-slate-500 truncate">manager@abc.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser("agent@abc.com")}
                className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-xs"
              >
                <p className="font-semibold text-slate-800">Agent</p>
                <p className="text-[11px] text-slate-500 truncate">agent@abc.com</p>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Demo environment: any password is accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
