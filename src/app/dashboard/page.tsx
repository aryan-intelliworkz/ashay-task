"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getDashboardMetrics, DashboardStats } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import ConceptCard from "@/components/learning/ConceptCard";
import { Product } from "@/types";
import {
  User as UserIcon,
  ShoppingBag,
  Package,
  Users,
  Tags,
  Award,
  LogOut,
  ShieldCheck,
  Key,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, refreshProfile } = useAuth();
  const { totalItems } = useCart();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Protected Route Check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load Dashboard API Metrics
  useEffect(() => {
    async function loadStats() {
      try {
        setStatsLoading(true);
        const data = await getDashboardMetrics();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setStatsLoading(false);
      }
    }

    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshProfile(), getDashboardMetrics().then(setStats)]);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Validating authentication session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Authentication Required
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The Dashboard is a protected route. Please sign in with a DummyJSON account to view this page.
          </p>
          <Link
            href="/login?redirect=/dashboard"
            className="block w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.firstName}
                  className="w-16 h-16 rounded-2xl border-2 border-indigo-500 shadow-md bg-indigo-50 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-md">
                  {user.firstName[0]}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user.firstName}!
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                  {user.role || "Authenticated User"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Signed in as <code className="font-mono text-indigo-600 dark:text-indigo-400">@{user.username}</code> ({user.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-300 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 1. Dashboard Metrics Requirement: Total products, Total users, Categories, Active Cart */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric: Total Products */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Products</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {statsLoading ? "..." : stats?.totalProducts || 194}
              </h3>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                Live DummyJSON catalog
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Metric: Total Users */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {statsLoading ? "..." : stats?.totalUsers || 208}
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Registered mock users
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Metric: Total Categories */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Categories</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {statsLoading ? "..." : stats?.totalCategories || 24}
              </h3>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Product departments
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Tags className="w-6 h-6" />
            </div>
          </div>

          {/* Metric: Active User Cart */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Your Cart</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {totalItems} Items
              </h3>
              <Link href="/cart" className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                View Cart →
              </Link>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* User Details & JWT Token Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-indigo-500" />
                <span>User Profile (DummyJSON Payload)</span>
              </h3>
              <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-semibold">
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Full Name</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Email Address</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {user.email}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Username</span>
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                  @{user.username}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">Account ID</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  #{user.id}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/products"
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Product Catalog</span>
              </Link>
            </div>
          </div>

          {/* Interactive JWT Token Inspector */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span>JWT Authentication Token</span>
              </h3>
              <button
                onClick={handleCopyToken}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedToken ? "Copied!" : "Copy Token"}
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This token is stored in <code className="text-indigo-600">localStorage</code> and <code className="text-indigo-600">document.cookie</code> to keep you authenticated while navigating across all pages.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] break-all border border-slate-800 leading-relaxed max-h-28 overflow-y-auto">
              {token || "No active token"}
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Session Status:</strong> Valid & Active. Navigating through pages preserves this login state without re-entering credentials.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Recently / Relevant Products Requirement */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>API Live Data</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Recently & Relevant Products
              </h2>
              <p className="text-xs text-slate-500">
                Products fetched dynamically from DummyJSON for the dashboard
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({stats?.totalProducts || 194})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
                >
                  <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats?.recentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick View Modal */}
        <QuickViewModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </div>
  );
}
