"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Cpu,
  KeyRound,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<"auth" | "csr-ssr" | "api" | "routing">("auth");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Next.js Architecture & Beginner Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How This Application Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A comprehensive reference guide explaining Next.js App Router, Authentication flows,
            Server vs Client-Side Rendering, and REST API integration with DummyJSON.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab("auth")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "auth"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>1. Authentication Flow</span>
          </button>

          <button
            onClick={() => setActiveTab("csr-ssr")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "csr-ssr"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. CSR vs SSR</span>
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "api"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>3. DummyJSON API Calls</span>
          </button>

          <button
            onClick={() => setActiveTab("routing")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "routing"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. App Router Structure</span>
          </button>
        </div>

        {/* Tab 1: Authentication Flow */}
        {activeTab === "auth" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 uppercase">
                  Authentication & Security
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Understanding the Login & Protected Route Flow
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                How user credentials turn into authenticated sessions in Next.js.
              </p>
            </div>

            {/* Visual Step-by-Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">User Submits Form</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  User enters username/password on <code className="text-indigo-600">/login</code> and clicks Sign In.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">DummyJSON API Call</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  POST request sent to <code className="text-indigo-600">https://dummyjson.com/auth/login</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Persist JWT Token</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Token saved in <code className="text-indigo-600">localStorage</code> and <code className="text-indigo-600">document.cookie</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Access Dashboard</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Protected <code className="text-indigo-600">/dashboard</code> allows entry and displays user stats.
                </p>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>AuthContext Implementation:</span>
                <button
                  onClick={() =>
                    copyCode(
                      "auth-code",
                      `export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    setUser(data);
    setToken(data.token);
    localStorage.setItem("auth_token", data.token);
    document.cookie = \`auth_token=\${data.token}; path=/;\`;
  };
}`
                    )
                  }
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  {copiedSection === "auth-code" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === "auth-code" ? "Copied" : "Copy Code"}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                <code>{`// File: src/context/AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    setUser(data);
    setToken(data.token);
    localStorage.setItem("auth_token", data.token);
    document.cookie = \`auth_token=\${data.token}; path=/;\`;
  };
}`}</code>
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
              >
                <span>Try the Login Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: CSR vs SSR */}
        {activeTab === "csr-ssr" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 uppercase">
                Rendering Strategies
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Client-Side Rendering (CSR) vs Server Components (RSC)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                When and why to use the <code className="font-mono text-indigo-600">"use client"</code> directive in Next.js.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Server Components */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Server Component (Default)
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Renders on the Node.js server before HTML is sent to browser.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Zero JavaScript bundle impact for the client.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Best for static content, SEO meta tags, and direct database queries.</span>
                  </li>
                  <li className="flex items-start gap-2 text-rose-500 font-medium">
                    <span>✕ Cannot use useState, useEffect, or onClick handlers.</span>
                  </li>
                </ul>
              </div>

              {/* Client Components */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Client Component ("use client")
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
                    <span>Executes in the user's browser with full DOM access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
                    <span>Supports React hooks: useState, useEffect, useContext.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
                    <span>Handles user interactions: search typing, clicks, modals.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />
                    <span>Used on `/products`, `/login`, and `/cart` pages in this app.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: DummyJSON API */}
        {activeTab === "api" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                REST Endpoints
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                DummyJSON Endpoints Used in this Project
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                A clean breakdown of mock REST APIs integrated in this starter.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                    POST
                  </span>
                  <code className="text-xs font-bold text-slate-900 dark:text-white ml-2">
                    https://dummyjson.com/auth/login
                  </code>
                  <p className="text-xs text-slate-500 mt-1">
                    Authenticates user credentials and returns JWT Bearer token and user object.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                  Used in `/login`
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-mono">
                    GET
                  </span>
                  <code className="text-xs font-bold text-slate-900 dark:text-white ml-2">
                    https://dummyjson.com/products?limit=20&skip=0
                  </code>
                  <p className="text-xs text-slate-500 mt-1">
                    Fetches paginated products list with thumbnail, title, price, and ratings.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                  Used in `/products`
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-mono">
                    GET
                  </span>
                  <code className="text-xs font-bold text-slate-900 dark:text-white ml-2">
                    https://dummyjson.com/products/:id
                  </code>
                  <p className="text-xs text-slate-500 mt-1">
                    Fetches single product details, image gallery, reviews, and warranty info.
                  </p>
                </div>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                  Used in `/products/[id]`
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: App Router Structure */}
        {activeTab === "routing" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 uppercase">
                Folder Structure
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Next.js App Router File Directory
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                How routes map directly to folders in the <code className="font-mono text-indigo-600">src/app</code> directory.
              </p>
            </div>

            <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              <code>{`src/
├── app/
│   ├── layout.tsx         -> Global Root Layout (Navbar, Providers, Footer)
│   ├── page.tsx           -> Product Landing Page (/)
│   ├── products/
│   │   ├── page.tsx       -> Product Catalog with Search & Filter (/products)
│   │   └── [id]/
│   │       └── page.tsx   -> Dynamic Product Detail Route (/products/1, /products/2...)
│   ├── login/
│   │   └── page.tsx       -> Login Flow with DummyJSON Mock Auth (/login)
│   ├── dashboard/
│   │   └── page.tsx       -> Protected User Dashboard (/dashboard)
│   ├── cart/
│   │   └── page.tsx       -> Shopping Cart & Checkout (/cart)
│   └── learn/
│       └── page.tsx       -> This Beginner Learning Hub (/learn)
├── context/
│   ├── AuthContext.tsx    -> User session, login, logout, token persistence
│   └── CartContext.tsx    -> Cart items, quantities, subtotal calculation
├── lib/
│   └── api.ts             -> REST API helpers for DummyJSON endpoints
└── types/
    └── index.ts           -> TypeScript data definitions (User, Product, etc.)`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
