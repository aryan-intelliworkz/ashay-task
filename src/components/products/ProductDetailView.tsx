"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import {
  useCart,
  useWishlist,
  useCompare,
  useRecentlyViewed,
} from "@/redux/hooks";
import ConceptCard from "@/components/learning/ConceptCard";
import ShareModal from "@/components/products/ShareModal";
import RecentlyViewedSection from "@/components/products/RecentlyViewedSection";
import QuickViewModal from "@/components/products/QuickViewModal";
import {
  Star,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Package,
  ArrowLeft,
  Share2,
  Heart,
  Scale,
  Plus,
  Minus,
} from "lucide-react";

export default function ProductDetailView({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [selectedImage, setSelectedImage] = useState<string>(
    product.images?.[0] || product.thumbnail
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "specs">("desc");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Automatically save to Recently Viewed when opened
  useEffect(() => {
    if (product && product.id) {
      addRecentlyViewed(product);
    }
  }, [product]);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const originalPrice = (
    product.price /
    (1 - (product.discountPercentage || 0) / 100)
  ).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-indigo-600 transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-indigo-600 capitalize transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-xs">
              {product.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isFavorited
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{isFavorited ? "In Wishlist" : "Wishlist"}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => toggleCompare(product)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isCompared
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? "In Compare" : "Compare"}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Route Next.js Concept Explanation */}
        <ConceptCard
          title="Dynamic Routing in Next.js: app/products/[id]/page.tsx"
          badge="Folder-based Routing"
          type="routing"
          summary="This page is powered by Next.js Dynamic Routes. The folder name [id] matches any numeric or string ID in the URL."
          keyPoints={[
            "Next.js creates dynamic parameters automatically from bracketed directory names like [id].",
            "In Next.js 15/16 App Router, the page component receives `params: Promise<{ id: string }>`.",
            "You can fetch data for specific IDs on the server during request time or pre-generate with `generateStaticParams()`.",
            "Breadcrumbs and product metadata can be rendered with dynamic SEO tags using `generateMetadata()`.",
          ]}
          codeSnippet={`// File: src/app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id); // Fetch data for this specific product ID
  return <ProductDetailView product={product} />;
}`}
        />

        {/* Main Product Hero Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Media Gallery (Col 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
              />

              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl border-2 p-2 bg-slate-50 dark:bg-slate-950 shrink-0 transition-all ${
                      selectedImage === img
                        ? "border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions (Col 7-12) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Brand, Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    Brand: {product.brand}
                  </span>
                )}
                {product.sku && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {product.title}
              </h1>

              {/* Rating & Stock Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200/60 dark:border-amber-900/60">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)} / 5.0</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-medium text-slate-500">
                  {product.reviews?.length || 0} customer reviews
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                </span>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-base text-slate-400 line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                      Save ${(parseFloat(originalPrice) - product.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Value propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <Truck className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{product.shippingInformation || "Free standard shipping"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{product.warrantyInformation || "1 year manufacturer warranty"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{product.returnPolicy || "30-day return policy"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <Package className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Min order qty: {product.minimumOrderQuantity || 1}</span>
                </div>
              </div>
            </div>

            {/* Purchase CTA controls */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity increment and decrement buttons */}
                <div className="flex items-center justify-between sm:justify-start border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Decrement quantity"
                    aria-label="Decrement quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Increment quantity"
                    aria-label="Increment quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-emerald-500/25"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-[1.02]"
                  } disabled:opacity-50`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        Add to Cart • ${(product.price * quantity).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Free delivery on orders over $50</span>
                <Link href="/cart" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  View Cart & Checkout →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews and Specifications Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === "desc"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Description & Tags
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === "reviews"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {activeTab === "desc" && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{product.description}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.reviewerName}
                        </span>
                        <div className="flex items-center text-amber-500 text-xs font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        "{rev.comment}"
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(rev.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No reviews yet for this product.</p>
              )}
            </div>
          )}
        </div>

        {/* Recently Viewed Products Section */}
        <RecentlyViewedSection onQuickView={(p) => setQuickViewProduct(p)} />

        {/* Share Modal */}
        <ShareModal
          products={[product]}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          customTitle={product.title}
        />

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  );
}
