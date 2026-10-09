"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface RecentlyViewedState {
  items: Product[];
  isLoaded: boolean;
  maxItems: number;
}

const initialState: RecentlyViewedState = {
  items: [],
  isLoaded: false,
  maxItems: 5,
};

const STORAGE_KEY = "recently_viewed_products";

const saveRecentlyViewedToStorage = (items: Product[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save recently viewed products to storage", e);
    }
  }
};

export const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    initializeRecentlyViewed: (state) => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              state.items = parsed.slice(0, state.maxItems);
            }
          }
        } catch (e) {
          console.error("Failed to load recently viewed products from storage", e);
        }
      }
      state.isLoaded = true;
    },
    addRecentlyViewed: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!product || !product.id) return;

      const filtered = state.items.filter((item) => item.id !== product.id);
      state.items = [product, ...filtered].slice(0, state.maxItems);
      saveRecentlyViewedToStorage(state.items);
    },
    removeRecentlyViewed: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveRecentlyViewedToStorage(state.items);
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const {
  initializeRecentlyViewed,
  addRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
} = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
