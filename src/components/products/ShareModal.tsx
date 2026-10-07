"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Mail,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ShareModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  customTitle?: string;
}

export default function ShareModal({
  products,
  isOpen,
  onClose,
  customTitle = "My Curated Product Selection",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      const ids = products.map((p) => p.id).join(",");
      const url = `${window.location.origin}/shared?ids=${ids}&title=${encodeURIComponent(
        customTitle
      )}`;
      setShareUrl(url);
    }
  }, [products, customTitle, isOpen]);

  if (!isOpen || products.length === 0) return null;

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: `NextCart: ${customTitle}`,
          text: `Check out these ${products.length} products curated on NextCart!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share dismissed or failed", err);
      }
    } else {
      handleCopy();
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out these products on NextCart: ${shareUrl}`
  )}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out these products on NextCart: ${shareUrl}`
  )}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(
    `Shared Product List: ${customTitle}`
  )}&body=${encodeURIComponent(
    `Hi,\n\nI wanted to share this product list with you on NextCart:\n${shareUrl}\n\nEnjoy shopping!`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Share Product List
              </h3>
              <p className="text-xs text-slate-500">
                Anyone with this link will instantly restore these {products.length} products
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Products Preview Ribbon */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Included Products ({products.length})
            </span>
            <span className="text-slate-400 text-[11px]">IDs: {products.map((p) => p.id).join(", ")}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shrink-0 max-w-[200px]"
              >
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-900 p-0.5"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.title}
                  </p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shareable Link Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Shareable URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 select-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social Shares */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Or share directly via:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Twitter / X</span>
            </a>

            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
