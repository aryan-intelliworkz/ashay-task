"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useAuth,
  useCart,
  useWishlist,
  useCompare,
  useOrders,
  useRecentlyViewed,
} from "@/redux/hooks";
import { getDashboardMetrics, DashboardStats } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";
import ConceptCard from "@/components/learning/ConceptCard";
import { Product } from "@/types";
import {
  User as UserIcon,
  ShoppingBag,
  Package,
  Users,
  Tags,
  LogOut,
  ShieldCheck,
  Key,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Heart,
  Scale,
  PackageCheck,
  Calendar,
  RotateCcw,
  Check,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, refreshProfile } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { orders, reorder } = useOrders();
  const { recentlyViewed } = useRecentlyViewed();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);

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
    try {
      await Promise.allSettled([
        refreshProfile(),
        getDashboardMetrics().then(setStats),
      ]);
    } catch (e) {
      console.warn("Refresh error:", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleReorder = (orderId: string) => {
    const res = reorder(orderId);
    if (res.success) {
      setReorderedOrderId(orderId);
      setTimeout(() => setReorderedOrderId(null), 2000);
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

        {/* Dashboard Quick Navigation & Activity Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Cart Items */}
          <Link
            href="/cart"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-indigo-500 transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Cart</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {totalItems} Items
              </h3>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                View Shopping Cart →
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </Link>

          {/* Metric 2: Wishlist Count */}
          <Link
            href="/wishlist"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-rose-500 transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Saved Wishlist</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {wishlistCount} Saved
              </h3>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium group-hover:underline">
                View Wishlist →
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 fill-rose-500/20" />
            </div>
          </Link>

          {/* Metric 3: Orders History Count */}
          <Link
            href="/orders"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-emerald-500 transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Your Orders</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {orders.length} Placed
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
                Order History & Re-order →
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <PackageCheck className="w-6 h-6" />
            </div>
          </Link>

          {/* Metric 4: Compare Tray */}
          <Link
            href="/compare"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-amber-500 transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Compare Slot</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {compareCount} / 3 Items
              </h3>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium group-hover:underline">
                Open Comparison Table →
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* 1. RECENTLY VIEWED PRODUCTS (Last 5 opened products) */}
        <RecentlyViewedSection
          title="Recently Viewed (Last 5 Opened Products)"
          subtitle="Products you recently inspected in details or quick view"
          onQuickView={(p) => setSelectedProduct(p)}
          showEmptyState={true}
        />

        {/* 2. RECENT ORDER HISTORY & 1-CLICK RE-ORDER ON DASHBOARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recent Orders & Re-Order
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quickly add items from past orders back into your cart
                </p>
              </div>
            </div>

            <Link
              href="/orders"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All Orders ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500">No order history recorded yet.</p>
              <Link
                href="/products"
                className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                Start Shopping Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 2).map((order) => {
                const isReordered = reorderedOrderId === order.id;
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          #{order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {order.items.length} product(s) • Total: ${order.finalTotal.toFixed(2)} •{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleReorder(order.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isReordered
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        }`}
                      >
                        {isReordered ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-order Items</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

        {/* 3. Catalog Live Data Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>DummyJSON Live Catalog</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Featured & Popular Products
              </h2>
              <p className="text-xs text-slate-500">
                Live products fetched directly from DummyJSON REST endpoints
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
