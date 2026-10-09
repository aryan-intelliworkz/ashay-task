"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface CompareState {
  items: Product[];
  maxCompareLimit: number;
  message: string | null;
}

const initialState: CompareState = {
  items: [],
  maxCompareLimit: 3,
  message: null,
};

const STORAGE_KEY = "user_compare_products";

const saveCompareToStorage = (items: Product[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save compare items to storage", e);
    }
  }
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    initializeCompare: (state) => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            state.items = JSON.parse(saved);
          }
        } catch (e) {
          console.error("Failed to load compare items from storage", e);
        }
      }
    },
    addToCompare: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!product || !product.id) return;

      if (state.items.some((item) => item.id === product.id)) {
        state.message = "Product is already in compare list";
        return;
      }

      if (state.items.length >= state.maxCompareLimit) {
        state.message = `You can only compare up to ${state.maxCompareLimit} products at a time. Please remove one first.`;
        return;
      }

      state.items.push(product);
      state.message = `Added "${product.title}" to comparison.`;
      saveCompareToStorage(state.items);
    },
    removeFromCompare: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.message = "Product removed from comparison";
      saveCompareToStorage(state.items);
    },
    toggleCompare: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!product || !product.id) return;

      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
        state.message = `Removed "${product.title}" from comparison.`;
      } else {
        if (state.items.length >= state.maxCompareLimit) {
          state.message = `You can only compare up to ${state.maxCompareLimit} products at a time. Please remove one first.`;
          return;
        }
        state.items.push(product);
        state.message = `Added "${product.title}" to comparison.`;
      }
      saveCompareToStorage(state.items);
    },
    clearCompare: (state) => {
      state.items = [];
      state.message = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    clearCompareMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  initializeCompare,
  addToCompare,
  removeFromCompare,
  toggleCompare,
  clearCompare,
  clearCompareMessage,
} = compareSlice.actions;

export default compareSlice.reducer;
