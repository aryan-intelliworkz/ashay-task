"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderItem, OrderShippingDetails } from "@/types";

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const STORAGE_KEY = "user_orders_history";

const saveOrdersToStorage = (items: Order[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save orders to storage", e);
    }
  }
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    initializeOrders: (state) => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            state.orders = JSON.parse(saved);
          }
        } catch (e) {
          console.error("Failed to load orders history from storage", e);
        }
      }
    },
    placeOrder: (
      state,
      action: PayloadAction<{
        items: OrderItem[];
        subtotal: number;
        totalDiscount: number;
        finalTotal: number;
        paymentMethod: "credit-card" | "paypal" | "cod";
        shippingAddress: OrderShippingDetails;
      }>
    ) => {
      const data = action.payload;
      const newOrder: Order = {
        id: `NC-${Date.now().toString().slice(-6)}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        date: new Date().toISOString(),
        items: data.items,
        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        finalTotal: data.finalTotal,
        status: "Processing",
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
      };

      state.orders.unshift(newOrder);
      saveOrdersToStorage(state.orders);
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      saveOrdersToStorage(state.orders);
    },
    clearOrders: (state) => {
      state.orders = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const {
  initializeOrders,
  placeOrder,
  deleteOrder,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
