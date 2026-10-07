"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";
import ConceptCard from "@/components/learning/ConceptCard";
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShoppingBag,
  Layers,
  Database,
  KeyRound,
  Cpu,
  Heart,
  Scale,
  PackageCheck,
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 space-y-14">
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
              <span>Wishlist • Product Compare • Recently Viewed • Shareable Lists</span>
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
              Explore <strong>Recently Viewed Products</strong>, save items to your <strong>Wishlist</strong>,
              compare specs across products, share custom lists, and re-order with 1-click.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Catalog</span>
              </Link>

              <Link
                href="/wishlist"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>My Wishlist</span>
              </Link>

              <Link
                href="/compare"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Compare Products</span>
              </Link>
            </div>

            {/* Architecture Highlights pills */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl text-left">
              <Link
                href="/dashboard"
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>1. Dashboard</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  User profile, token inspection, and recent activity
                </p>
              </Link>

              <Link
                href="/wishlist"
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>2. Wishlist Hub</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Save favorites with navbar badge and instant move-to-cart
                </p>
              </Link>

              <Link
                href="/compare"
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>3. Product Compare</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Side-by-side spec comparison table for up to 3 products
                </p>
              </Link>

              <Link
                href="/orders"
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                  <PackageCheck className="w-4 h-4 text-fuchsia-400" />
                  <span>4. 1-Click Re-order</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Save orders and re-populate shopping cart in one click
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
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

      {/* 3. Recently Viewed Section on Homepage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyViewedSection
          title="Pick Up Where You Left Off (Recently Viewed)"
          subtitle="Your last 5 opened products are saved automatically"
          onQuickView={(p) => setSelectedProduct(p)}
        />
      </section>

      {/* 4. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* 5. Trending Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
