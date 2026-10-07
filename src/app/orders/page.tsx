"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrders } from "@/context/OrdersContext";
import { useCart } from "@/context/CartContext";
import {
  PackageCheck,
  ShoppingBag,
  RotateCcw,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Trash2,
  Check,
} from "lucide-react";

export default function OrdersPage() {
  const { orders, reorder, deleteOrder, clearOrders } = useOrders();
  const { totalItems } = useCart();
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  const handleReorder = (orderId: string) => {
    const res = reorder(orderId);
    if (res.success) {
      setReorderedId(orderId);
      setTimeout(() => setReorderedId(null), 2500);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Order History
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track past purchases, view order breakdowns, and re-order in 1 click
            </p>
          </div>

          {orders.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearOrders}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop More</span>
              </Link>
            </div>
          )}
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No Orders Placed Yet
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              When you complete checkout in NextCart, your saved orders and receipt items will appear here for easy re-ordering and tracking.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isReordered = reorderedId === order.id;
              const formattedDate = new Date(order.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-all hover:border-indigo-200 dark:hover:border-indigo-900"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                          Order #{order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formattedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium">
                          Paid with {order.paymentMethod.replace("-", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Actions on this order */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReorder(order.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                          isReordered
                            ? "bg-emerald-600 text-white shadow-emerald-600/20"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                        }`}
                      >
                        {isReordered ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Items Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-order Items</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete order record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items Table/Grid */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/products/${item.product?.id}`}
                            className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 shrink-0 flex items-center justify-center overflow-hidden"
                          >
                            <img
                              src={item.product?.thumbnail}
                              alt={item.product?.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          </Link>

                          <div>
                            <Link href={`/products/${item.product?.id}`}>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-1">
                                {item.product?.title}
                              </h4>
                            </Link>
                            <p className="text-[11px] text-slate-500">
                              Qty: {item.quantity} × ${item.priceAtPurchase.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Shipping Summary */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs bg-slate-50/60 dark:bg-slate-950/40 p-4 rounded-2xl">
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Shipped to: {order.shippingAddress.fullName}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} {order.shippingAddress.zipCode},{" "}
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6">
                      <span className="text-slate-500 text-[11px] block">Order Total</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ${order.finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
