"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import ConceptCard from "@/components/learning/ConceptCard";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Layers,
  Database,
  KeyRound,
  RefreshCw,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Client-side fetch demonstration
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [featuredRes, dealsRes] = await Promise.all([
          getProducts({ limit: 4, skip: 0 }),
          getProducts({ limit: 4, skip: 10 }),
        ]);
        setFeaturedProducts(featuredRes.products);
        setDealProducts(dealsRes.products);
      } catch (error) {
        console.error("Failed to load homepage products", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: "Smartphones", slug: "smartphones", icon: "📱", color: "from-blue-500 to-indigo-600" },
    { name: "Laptops", slug: "laptops", icon: "💻", color: "from-indigo-500 to-purple-600" },
    { name: "Fragrances", slug: "fragrances", icon: "✨", color: "from-pink-500 to-rose-600" },
    { name: "Skincare", slug: "skin-care", icon: "🧴", color: "from-emerald-500 to-teal-600" },
    { name: "Groceries", slug: "groceries", icon: "🥑", color: "from-amber-500 to-orange-600" },
    { name: "Home Decoration", slug: "home-decoration", icon: "🛋️", color: "from-violet-500 to-fuchsia-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -top-10 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Next.js App Router • DummyJSON Mock API • Tailwind CSS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              Modern E-Commerce <br />
              <span className="bg-gradient-to-r from-indigo-300 via-amber-200 to-indigo-100 bg-clip-text text-transparent">
                Made Simple for Beginners
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-indigo-200/80 max-w-2xl leading-relaxed">
              Learn how <strong>Login Flows</strong>, <strong>Client-Side Rendering (CSR)</strong>,
              <strong>REST API calls</strong>, and <strong>Protected Dashboards</strong> work in Next.js
              with real-world code and interactive components.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Products</span>
              </Link>

              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Test Login Flow</span>
              </Link>

              <Link
                href="/learn"
                className="px-5 py-3 rounded-xl text-indigo-200 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Read Architecture Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Architecture Highlights pills */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl text-left">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>1. Auth Flow</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  DummyJSON JWT login, token stored in Cookies & LocalStorage
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span>2. Client Rendering</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  `"use client"` components with hooks, state, and live filters
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>3. Mock API Calls</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Real HTTP REST requests to `https://dummyjson.com`
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <Layers className="w-4 h-4 text-fuchsia-400" />
                  <span>4. Dynamic Routing</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Pages mapped to `/products/[id]` with slug parameter resolution
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Popular Categories
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browse products filtered through the DummyJSON API categories
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col items-center text-center space-y-2"
              >
                <div className="text-2xl group-hover:scale-125 transition-transform duration-200">
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Live DummyJSON API</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Featured Products
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fetched dynamically from <code className="text-indigo-600 dark:text-indigo-400 font-mono">https://dummyjson.com/products</code>
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
              >
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Interactive Learning Explainer Box on Landing Page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next.js Beginner Guide</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              How does this page fetch and render data?
            </h3>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              In Next.js, pages can be rendered on the <strong>Server (SSR/SSG)</strong> or on the{" "}
              <strong>Client (CSR)</strong>. This page uses a Client Component (marked with{" "}
              <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-amber-300">"use client"</code>)
              which fetches data in the browser via React’s <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-amber-300">useEffect</code>.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/learn"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Open Next.js Interactive Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                See Product Filter Flow
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Trending Deals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Special discounts directly parsed from DummyJSON payload
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
