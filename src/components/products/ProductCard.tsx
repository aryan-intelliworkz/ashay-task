"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import {
  useCart,
  useWishlist,
  useCompare,
  useRecentlyViewed,
} from "@/redux/hooks";
import { Star, ShoppingCart, Eye, Check, Heart, Scale, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const { addRecentlyViewed } = useRecentlyViewed();
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Check if item is already in cart
  const cartItem = items.find((item) => item.product.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity < product.stock) {
      updateQuantity(product.id, cartQuantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, cartQuantity - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleProductClick = () => {
    addRecentlyViewed(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addRecentlyViewed(product);
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Calculate discounted original price estimate
  const originalPrice = (
    product.price /
    (1 - (product.discountPercentage || 0) / 100)
  ).toFixed(2);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Discount Badge & Category Tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {product.discountPercentage > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
        <span className="bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
      </div>

      {/* Top-Right Quick Action Icons (Wishlist, Compare, Quick View) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
            isFavorited
              ? "bg-rose-50 text-rose-500 border border-rose-200 dark:bg-rose-950/80 dark:border-rose-900 scale-105"
              : "bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800"
          }`}
          title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorited ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>

        {/* Compare Button */}
        <button
          onClick={handleCompareToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
            isCompared
              ? "bg-indigo-600 text-white shadow-indigo-600/30 scale-105"
              : "bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800"
          }`}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
          aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
        >
          <Scale className="w-4 h-4" />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-white hover:text-indigo-600"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Image Link */}
      <Link
        href={`/products/${product.id}`}
        onClick={handleProductClick}
        className="relative w-full pt-[80%] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
      >
        <img
          src={product.thumbnail || product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Brand */}
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-500 dark:text-slate-400">
            <span className="font-medium truncate max-w-[120px]">
              {product.brand || "Generic"}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} onClick={handleProductClick}>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price & Quantity Controls / Add to Cart Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Increment / Decrement Quantity Buttons or Add Button */}
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={handleDecrement}
                className="p-2 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
                title="Decrement quantity"
                aria-label="Decrement quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 min-w-[20px] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={cartQuantity >= product.stock}
                className="p-2 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Increment quantity"
                aria-label="Increment quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all duration-200 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 active:scale-95"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Add to cart"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

