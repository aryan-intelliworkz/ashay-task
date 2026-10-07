"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import { getProductById } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import ShareModal from "@/components/products/ShareModal";
import {
  Share2,
  ShoppingCart,
  Check,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Copy,
} from "lucide-react";

function SharedListContent() {
  const searchParams = useSearchParams();
  const rawIds = searchParams.get("ids") || "";
  const title = searchParams.get("title") || "Shared Product Selection";

  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addedAll, setAddedAll] = useState(false);

  useEffect(() => {
    async function restoreSharedProducts() {
      if (!rawIds.trim()) {
        setLoading(false);
        return;
      }

      const idArray = rawIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      try {
        setLoading(true);
        const fetched = await Promise.all(
          idArray.map(async (id) => {
            try {
              return await getProductById(id);
            } catch (err) {
              console.error(`Failed to fetch product ${id}`, err);
              return null;
            }
          })
        );
        setProducts(fetched.filter((p): p is Product => p !== null));
      } catch (err) {
        console.error("Error restoring shared products list", err);
      } finally {
        setLoading(false);
      }
    }

    restoreSharedProducts();
  }, [rawIds]);

  const handleAddAllToCart = () => {
    products.forEach((p) => {
      addToCart(p, 1);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Shared Product List Restored</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Restored {products.length} product{products.length === 1 ? "" : "s"} from the shared link
          </p>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Share Again</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              {addedAll ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added All ({products.length})</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add All to Cart • ${totalPrice.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No Products Found in this Link
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The shared link might be invalid or the products could not be retrieved from the catalog.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Browse Full Catalog</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Share Modal */}
      <ShareModal
        products={products}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        customTitle={title}
      />
    </div>
  );
}

export default function SharedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
              <span>Restoring shared product list...</span>
            </div>
          }
        >
          <SharedListContent />
        </Suspense>
      </div>
    </div>
  );
}
