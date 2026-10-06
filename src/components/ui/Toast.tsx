"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, X } from "lucide-react";

export default function Toast() {
  const { notification, dismissNotification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950 text-emerald-100 border border-emerald-700/50 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-sm font-medium">{notification}</span>
      <button
        onClick={dismissNotification}
        className="ml-2 text-emerald-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
