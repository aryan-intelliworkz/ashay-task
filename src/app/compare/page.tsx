"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCompare, useCart, useWishlist } from "@/redux/hooks";
import ShareModal from "@/components/products/ShareModal";
import { Product } from "@/types";
import {
  Scale,
  Trash2,
  ShoppingCart,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Package,
  Share2,
  ArrowLeft,
  X,
  Plus,
} from "lucide-react";

export default function ComparePage() {
  const { compareList, compareCount, removeFromCompare, clearCompare, maxCompareLimit } =
    useCompare();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedIds, setAddedIds] = useState<{ [id: number]: boolean }>({});
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Product Comparison
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {compareCount} / {maxCompareLimit} Products
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Compare specs, ratings, pricing, and policies side-by-side (up to {maxCompareLimit} items)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {compareCount > 0 && (
              <>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Share Comparison</span>
                </button>

                <button
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Products</span>
            </Link>
          </div>
        </div>

        {/* Comparison Content */}
        {compareCount === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
              <Scale className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No Products Selected for Comparison
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse our catalog and click the scale/compare icon on any product (up to 3 products) to evaluate their differences side-by-side.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Explore Product Catalog</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 sm:p-6 w-48 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/70 dark:bg-slate-950/50">
                      Product Spec
                    </th>
                    {compareList.map((product) => (
                      <th
                        key={product.id}
                        className="p-4 sm:p-6 min-w-[240px] sm:min-w-[280px] align-top bg-white dark:bg-slate-900"
                      >
                        <div className="space-y-3 relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-1 -right-1 p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove from compare"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <Link
                            href={`/products/${product.id}`}
                            className="block aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 overflow-hidden group"
                          >
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </Link>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              {product.category}
                            </span>
                            <Link href={`/products/${product.id}`}>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-2">
                                {product.title}
                              </h3>
                            </Link>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-xs text-rose-500 font-bold">
                                {Math.round(product.discountPercentage)}% OFF
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock <= 0}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                              addedIds[product.id]
                                ? "bg-emerald-600 text-white"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                            } disabled:opacity-50`}
                          >
                            {addedIds[product.id] ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Placeholder columns if < 3 */}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, idx) => (
                      <th
                        key={`empty-col-${idx}`}
                        className="p-4 sm:p-6 min-w-[240px] sm:min-w-[280px] bg-slate-50/40 dark:bg-slate-950/20 border-dashed border-l border-slate-200 dark:border-slate-800 align-middle text-center"
                      >
                        <div className="flex flex-col items-center justify-center p-8 space-y-2 text-slate-400">
                          <Plus className="w-8 h-8 opacity-40" />
                          <p className="text-xs font-semibold">Slot Available</p>
                          <Link
                            href="/products"
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            Add product to compare
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {/* Rating */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Rating & Reviews
                    </td>
                    {compareList.map((p) => (
                      <td key={`rating-${p.id}`} className="p-4">
                        <div className="flex items-center gap-1.5 font-bold text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{p.rating.toFixed(1)} / 5.0</span>
                          <span className="text-slate-400 text-[11px] font-normal">
                            ({p.reviews?.length || 0} reviews)
                          </span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-rating-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Brand
                    </td>
                    {compareList.map((p) => (
                      <td key={`brand-${p.id}`} className="p-4 font-medium text-slate-900 dark:text-white">
                        {p.brand || "Generic"}
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-brand-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Availability
                    </td>
                    {compareList.map((p) => (
                      <td key={`stock-${p.id}`} className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.stock > 0
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} units available` : "Out of stock"}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-stock-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Shipping */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Shipping
                    </td>
                    {compareList.map((p) => (
                      <td key={`shipping-${p.id}`} className="p-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{p.shippingInformation || "Free standard shipping"}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-shipping-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Warranty */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Warranty
                    </td>
                    {compareList.map((p) => (
                      <td key={`warranty-${p.id}`} className="p-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{p.warrantyInformation || "1 year warranty"}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-warranty-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Return Policy */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Return Policy
                    </td>
                    {compareList.map((p) => (
                      <td key={`return-${p.id}`} className="p-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{p.returnPolicy || "30 days easy return"}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-return-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* SKU / Identification */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      SKU Code
                    </td>
                    {compareList.map((p) => (
                      <td key={`sku-${p.id}`} className="p-4 font-mono text-slate-500">
                        {p.sku || `SKU-${p.id}`}
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-sku-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-950/30">
                      Description
                    </td>
                    {compareList.map((p) => (
                      <td key={`desc-${p.id}`} className="p-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {p.description}
                      </td>
                    ))}
                    {Array.from({ length: maxCompareLimit - compareList.length }).map((_, i) => (
                      <td key={`empty-desc-${i}`} className="p-4 text-slate-300">-</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Share Modal */}
        <ShareModal
          products={compareList}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          customTitle="NextCart Product Comparison"
        />
      </div>
    </div>
  );
}
