"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import {
  X,
  Star,
  ShoppingCart,
  Check,
  RotateCcw,
  Truck,
  ArrowRight,
  Heart,
  Scale,
  Share2,
  Plus,
  Minus,
} from "lucide-react";
import ShareModal from "@/components/products/ShareModal";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Set initial image and track recently viewed when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail || product.images?.[0] || "");
      setQuantity(1);
      setIsAdded(false);
      addRecentlyViewed(product);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const originalPrice = (
    product.price /
    (1 - (product.discountPercentage || 0) / 100)
  ).toFixed(2);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Media Column */}
          <div className="md:w-1/2 p-6 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <div className="relative aspect-square w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnail strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl border-2 p-1 bg-white dark:bg-slate-900 shrink-0 transition-all ${
                      selectedImage === img
                        ? "border-indigo-600 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-500">{product.brand}</span>
                </div>

                {/* Quick actions in modal */}
                <div className="flex items-center gap-1.5 mr-8">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isFavorited
                        ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/50 dark:border-rose-900"
                        : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500"
                    }`}
                    title={isFavorited ? "In Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500" : ""}`} />
                  </button>

                  <button
                    onClick={() => toggleCompare(product)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isCompared
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/50 dark:border-indigo-900"
                        : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600"
                    }`}
                    title={isCompared ? "In Comparison" : "Compare"}
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {product.title}
              </h2>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {product.stock} units in stock
                </span>
              </div>

              {/* Price Box */}
              <div className="flex items-baseline gap-2 py-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                      {Math.round(product.discountPercentage)}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {product.description}
              </p>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{product.shippingInformation || "Free standard shipping"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{product.returnPolicy || "30 days easy return"}</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Selector with increment and decrement buttons */}
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Decrement quantity"
                    aria-label="Decrement quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Increment quantity"
                    aria-label="Increment quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25"
                  } disabled:opacity-50`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* View Full Details Link */}
              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium pt-1"
              >
                <span>View full product page & reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        products={[product]}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        customTitle={product.title}
      />
    </>
  );
}
