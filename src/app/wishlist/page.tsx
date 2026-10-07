"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import QuickViewModal from "@/components/products/QuickViewModal";
import ShareModal from "@/components/products/ShareModal";
import ConceptCard from "@/components/learning/ConceptCard";
import { Product } from "@/types";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ShoppingCart,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, wishlistCount, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [movedAll, setMovedAll] = useState(false);

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, 1);
    });
    setMovedAll(true);
    setTimeout(() => setMovedAll(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Wishlist
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                {wishlistCount} {wishlistCount === 1 ? "Item" : "Items"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your saved favorite products, ready to order or share anytime
            </p>
          </div>

          {wishlistCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Share Wishlist</span>
              </button>

              <button
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{movedAll ? "Added All to Cart!" : "Move All to Cart"}</span>
              </button>

              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {wishlistCount === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore the product catalog and click the heart icon on any product to save it here for later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
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
          products={wishlist}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          customTitle="My NextCart Wishlist"
        />
      </div>
    </div>
  );
}
