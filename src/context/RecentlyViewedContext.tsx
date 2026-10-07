"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  removeRecentlyViewed: (productId: number) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENT_ITEMS = 5;

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recently_viewed_products");
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recently viewed products from storage", e);
    }
  }, []);

  const saveToStorage = (items: Product[]) => {
    try {
      localStorage.setItem("recently_viewed_products", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save recently viewed products", e);
    }
  };

  const addRecentlyViewed = (product: Product) => {
    if (!product || !product.id) return;
    setRecentlyViewed((prev) => {
      // Remove if already exists so we can prepend as most recent
      const filtered = prev.filter((item) => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  };

  const removeRecentlyViewed = (productId: number) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveToStorage(updated);
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("recently_viewed_products");
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        removeRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
