"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

interface CompareContextType {
  compareList: Product[];
  compareCount: number;
  isInCompare: (productId: number) => boolean;
  addToCompare: (product: Product) => { success: boolean; message?: string };
  removeFromCompare: (productId: number) => void;
  toggleCompare: (product: Product) => { success: boolean; message?: string };
  clearCompare: () => void;
  maxCompareLimit: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_LIMIT = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user_compare_products");
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load compare items from storage", e);
    }
  }, []);

  const saveCompareList = (items: Product[]) => {
    try {
      localStorage.setItem("user_compare_products", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save compare items", e);
    }
  };

  const isInCompare = (productId: number) => {
    return compareList.some((item) => item.id === productId);
  };

  const addToCompare = (product: Product): { success: boolean; message?: string } => {
    if (!product || !product.id) return { success: false, message: "Invalid product" };

    if (isInCompare(product.id)) {
      return { success: false, message: "Product is already in compare list" };
    }

    if (compareList.length >= MAX_COMPARE_LIMIT) {
      return {
        success: false,
        message: `You can only compare up to ${MAX_COMPARE_LIMIT} products at a time. Please remove one first.`,
      };
    }

    const updated = [...compareList, product];
    setCompareList(updated);
    saveCompareList(updated);
    return { success: true, message: `Added "${product.title}" to comparison.` };
  };

  const removeFromCompare = (productId: number) => {
    setCompareList((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveCompareList(updated);
      return updated;
    });
  };

  const toggleCompare = (product: Product): { success: boolean; message?: string } => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return { success: true, message: `Removed "${product.title}" from comparison.` };
    }
    return addToCompare(product);
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("user_compare_products");
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        compareCount: compareList.length,
        isInCompare,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        maxCompareLimit: MAX_COMPARE_LIMIT,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
