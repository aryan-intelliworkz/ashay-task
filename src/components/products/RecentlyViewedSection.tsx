"use client";

import React from "react";
import Link from "next/link";
import { useRecentlyViewed } from "@/redux/hooks";
import ProductCard from "@/components/products/ProductCard";
import { History, Trash2, ArrowRight, Eye, Sparkles } from "lucide-react";
import { Product } from "@/types";

interface RecentlyViewedSectionProps {
  onQuickView?: (product: Product) => void;
  title?: string;
  subtitle?: string;
  showClear?: boolean;
  showEmptyState?: boolean;
}

export default function RecentlyViewedSection({
  onQuickView,
  title = "Recently Viewed Products",
  subtitle = "Last 5 products you explored across the store",
  showClear = true,
  showEmptyState = false,
}: RecentlyViewedSectionProps) {
  const { recentlyViewed, clearRecentlyViewed, isLoaded } = useRecentlyViewed();

  if (!isLoaded) {
    return null;
  }

  if (recentlyViewed.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
          <History className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          You haven't viewed any products yet. As you browse the catalog or open product details, your last 5 viewed products will automatically be tracked here.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {recentlyViewed.length} / 5
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {showClear && (
          <button
            onClick={clearRecentlyViewed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentlyViewed.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
}

