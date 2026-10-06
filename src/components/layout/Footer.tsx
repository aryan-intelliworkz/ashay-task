import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, ShieldCheck, Zap, Code2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      {/* Feature perks bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Next.js App Router
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Server Components (RSC) + Client Components (CSR)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Mock JWT Authentication
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Integrated with DummyJSON `/auth/login` endpoint
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Beginner Friendly Code
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Clear explanations, type-safe API queries, clean state
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Tailwind CSS Styled
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Responsive design, modern cards, and interactive modals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Next<span className="text-indigo-600 dark:text-indigo-400">Cart</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              An educational e-commerce application built to demonstrate Next.js App Router,
              Authentication flow, Server vs Client Side Rendering, API calls with DummyJSON,
              and global state management in React.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              App Routes
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Product Landing Page (Home)
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Product Catalog & Filters
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Login Flow (DummyJSON Auth)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  User Dashboard (Protected)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Learning Guides
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Client vs Server Rendering
                </Link>
              </li>
              <li>
                <Link href="/learn#auth" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Authentication & JWT Flow
                </Link>
              </li>
              <li>
                <Link href="/learn#api" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  API Fetching Patterns
                </Link>
              </li>
              <li>
                <a
                  href="https://dummyjson.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  DummyJSON API Reference ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NextCart. Built for learning Next.js.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Powered by <a href="https://dummyjson.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">DummyJSON</a> API
          </p>
        </div>
      </div>
    </footer>
  );
}
