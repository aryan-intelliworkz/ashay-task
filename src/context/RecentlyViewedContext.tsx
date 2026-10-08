"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  removeRecentlyViewed: (productId: number) => void;
  isLoaded: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENT_ITEMS = 5;
const STORAGE_KEY = "recently_viewed_products";

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, MAX_RECENT_ITEMS));
        }
      }
    } catch (e) {
      console.error("Failed to load recently viewed products from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addRecentlyViewed = useCallback((product: Product) => {
    if (!product || !product.id) return;

    setRecentlyViewed((prev) => {
      // Get current list, either from state or read localStorage if needed
      let current = prev;
      if (prev.length === 0 && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              current = parsed;
            }
          }
        } catch {
          // fallback to prev
        }
      }

      // Filter out existing occurrence of this product to push it to top
      const filtered = current.filter((item) => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recently viewed products", e);
      }

      return updated;
    });
  }, []);

  const removeRecentlyViewed = useCallback((productId: number) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recently viewed products", e);
      }
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear recently viewed products", e);
    }
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        removeRecentlyViewed,
        isLoaded,
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

