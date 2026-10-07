"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";

export default function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare, maxCompareLimit } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-2xl p-3 sm:p-4 animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Info and Thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
            <Scale className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Product Comparison
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {compareList.length} / {maxCompareLimit}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {compareList.length < 2
                ? "Select at least 2 products to compare"
                : "Ready to compare specs side-by-side"}
            </p>
          </div>
        </div>

        {/* Center/Right: Product items preview */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative group w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center"
                title={product.title}
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                  aria-label={`Remove ${product.title}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-10 h-10 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs font-semibold"
              >
                +
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={clearCompare}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
              title="Clear comparison list"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link
              href="/compare"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
