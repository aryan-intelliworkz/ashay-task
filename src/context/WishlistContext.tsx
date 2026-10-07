"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist from storage", e);
    }
  }, []);

  const saveWishlist = (items: Product[]) => {
    try {
      localStorage.setItem("user_wishlist", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      const updated = [product, ...prev];
      saveWishlist(updated);
      return updated;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveWishlist(updated);
      return updated;
    });
  };

  const toggleWishlist = (product: Product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated: Product[];
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
      } else {
        updated = [product, ...prev];
      }
      saveWishlist(updated);
      return updated;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("user_wishlist");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
