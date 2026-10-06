"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ConceptCard from "@/components/learning/ConceptCard";
import {
  Lock,
  User as UserIcon,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, isAuthenticated, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard or intended route
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  // Demo accounts provided by DummyJSON
  const demoAccounts = [
    { username: "emilys", password: "emilyspass", name: "Emily Johnson", role: "Manager" },
    { username: "michaelw", password: "michaelwpass", name: "Michael Williams", role: "Buyer" },
    { username: "sophiah", password: "sophiahpass", name: "Sophia Martinez", role: "Customer" },
  ];

  const handleFillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ username, password });
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to log in. Please verify your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Main Login Form (7 Cols) */}
      <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Account Credentials
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">DummyJSON Auth API</span>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. emilys"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. emilyspass"
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with DummyJSON...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In & Go to Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Preset Demo Accounts (5 Cols) */}
      <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1-Click Demo Accounts
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Click any sample account below to automatically fill in valid credentials provided by DummyJSON:
        </p>

        <div className="space-y-2.5">
          {demoAccounts.map((acc) => (
            <button
              key={acc.username}
              type="button"
              onClick={() => handleFillDemo(acc.username, acc.password)}
              className={`w-full text-left p-3 rounded-2xl border transition-all ${
                username === acc.username
                  ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40"
                  : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {acc.name}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {acc.role}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>user: {acc.username}</span>
                <span>pass: {acc.password}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Real JWT token will be generated on login.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>DummyJSON Authentication Flow</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to NextCart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Test real JWT authentication using DummyJSON's mock auth API and learn how Next.js handles user sessions.
          </p>
        </div>

        {/* Next.js Auth Explainer Callout */}
        <ConceptCard
          title="Understanding Authentication in Next.js"
          badge="Auth Flow Guide"
          type="auth"
          defaultExpanded={true}
          summary="Here is what happens under the hood when you click 'Sign In':"
          keyPoints={[
            "1. Client makes a POST request to `https://dummyjson.com/auth/login` with username & password.",
            "2. DummyJSON verifies credentials and responds with a JWT Access Token + full User Profile payload.",
            "3. React AuthContext saves token into `localStorage` (for browser state) and `document.cookie` (for server-side/middleware checks).",
            "4. The router navigates to `/dashboard`, where the protected layout verifies `isAuthenticated === true`.",
          ]}
          codeSnippet={`// File: src/context/AuthContext.tsx
const login = async (credentials) => {
  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  
  // Store session
  localStorage.setItem("auth_token", data.token);
  document.cookie = \`auth_token=\${data.token}; path=/;\`;
  setUser(data);
};`}
        />

        {/* Suspense Boundary for useSearchParams */}
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-500">
              Loading authentication form...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
