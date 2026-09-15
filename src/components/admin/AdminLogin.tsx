import React, { useState } from "react";
import { Lock, Mail, KeyRound, Flame, ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { loginAdmin } from "../../services/api";
import { AdminUser } from "../../types";

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState("admin@himalayanflames.com");
  const [password, setPassword] = useState("Admin@Himalayan2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await loginAdmin(email, password);
      onLoginSuccess(response.user);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-amber-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToWebsite}
          id="admin-back-to-website-btn"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurant Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-red-600 p-0.5 mx-auto shadow-xl shadow-amber-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-7 h-7 text-amber-500" />
            </div>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white tracking-tight">
            Restaurant Admin Portal
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Himalayan Flames House of Momo • Secure Operations
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-neutral-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-neutral-800">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@himalayanflames.com"
                  id="admin-login-email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  id="admin-login-password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              id="admin-login-submit-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 disabled:opacity-50 transition active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Secure Admin Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Default Master Credentials Pre-filled</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              admin@himalayanflames.com • Admin@Himalayan2026!
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400">
          Protected by role-based backend authorization & session authentication.
        </div>
      </div>
    </div>
  );
};
