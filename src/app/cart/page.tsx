"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { Order, OrderShippingDetails } from "@/types";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  MapPin,
  Lock,
  X,
  PackageCheck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalDiscount,
    finalTotal,
    totalItems,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form State
  const [shippingDetails, setShippingDetails] = useState<OrderShippingDetails>({
    fullName: user ? `${user.firstName} ${user.lastName}` : "Alex Johnson",
    email: user ? user.email : "alex.johnson@example.com",
    address: user?.address?.city ? `452 Maple Ave, Suite 300` : "123 Innovation Way",
    city: user?.address?.city || "San Francisco",
    state: user?.address?.state || "CA",
    zipCode: "94107",
    country: user?.address?.country || "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal" | "cod">("credit-card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  // Sync user defaults when user logs in
  useEffect(() => {
    if (user) {
      setShippingDetails((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      }));
    }
  }, [user]);

  const handleOpenCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));

      const newOrder = placeOrder({
        items: orderItems,
        subtotal,
        totalDiscount,
        finalTotal,
        paymentMethod,
        shippingAddress: shippingDetails,
      });

      setIsProcessing(false);
      setCheckoutModalOpen(false);
      setPlacedOrder(newOrder);
      clearCart();
    }, 1000);
  };

  // Order Confirmed Screen
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Order Confirmed & Saved
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Thank you, {placedOrder.shippingAddress.fullName}!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Order <code className="font-mono font-bold text-indigo-600">#{placedOrder.id}</code> has been placed and recorded in your order history.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Items Ordered:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {placedOrder.items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping to:</span>
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Payment:</span>
              <span className="font-medium text-slate-900 dark:text-white capitalize">
                {placedOrder.paymentMethod.replace("-", " ")}
              </span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
              <span>Total Paid:</span>
              <span>${placedOrder.finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all text-center"
            >
              View Order History
            </Link>
            <Link
              href="/products"
              onClick={() => setPlacedOrder(null)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-slate-500">
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <div className="pt-2 space-y-2">
            <Link
              href="/products"
              className="block w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
            >
              Start Shopping Now
            </Link>
            <Link
              href="/orders"
              className="block w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              You have {totalItems} item{totalItems > 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 shrink-0 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </Link>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {product.category}
                      </span>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                        ${product.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Decrement quantity"
                        aria-label="Decrement quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Increment quantity"
                        aria-label="Increment quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Estimated Savings</span>
                  <span className="font-semibold">-${totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Taxes</span>
                <span className="font-semibold text-slate-900 dark:text-white">$0.00</span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleOpenCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </button>

            <div className="pt-2 space-y-2 text-center">
              <Link
                href="/orders"
                className="text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>View Order History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal with Shipping & Payment */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Secure Checkout
                  </h3>
                  <p className="text-xs text-slate-500">
                    Complete your order and save to history
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-6">
              {/* Shipping Address Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>1. Shipping Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.fullName}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingDetails.email}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, email: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.address}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, address: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.city}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, city: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                      State / Postal Code
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={shippingDetails.state}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, state: e.target.value })
                        }
                        placeholder="State"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        required
                        value={shippingDetails.zipCode}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, zipCode: e.target.value })
                        }
                        placeholder="ZIP"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                  <span>2. Payment Method</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("credit-card")}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                      paymentMethod === "credit-card"
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-500 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Credit Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                      paymentMethod === "paypal"
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-500 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    PayPal (Mock)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                      paymentMethod === "cod"
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-500 dark:text-indigo-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Submit CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total Due:</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Place Order Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
