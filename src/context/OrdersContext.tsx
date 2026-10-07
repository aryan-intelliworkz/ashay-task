"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderItem, OrderShippingDetails } from "@/types";
import { useCart } from "@/context/CartContext";

interface OrdersContextType {
  orders: Order[];
  placeOrder: (data: {
    items: OrderItem[];
    subtotal: number;
    totalDiscount: number;
    finalTotal: number;
    paymentMethod: "credit-card" | "paypal" | "cod";
    shippingAddress: OrderShippingDetails;
  }) => Order;
  reorder: (orderId: string) => { success: boolean; itemCount: number };
  getOrderById: (orderId: string) => Order | undefined;
  clearOrders: () => void;
  deleteOrder: (orderId: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user_orders_history");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load orders history from storage", e);
    }
  }, []);

  const saveOrders = (items: Order[]) => {
    try {
      localStorage.setItem("user_orders_history", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save orders history", e);
    }
  };

  const placeOrder = (data: {
    items: OrderItem[];
    subtotal: number;
    totalDiscount: number;
    finalTotal: number;
    paymentMethod: "credit-card" | "paypal" | "cod";
    shippingAddress: OrderShippingDetails;
  }): Order => {
    const newOrder: Order = {
      id: `NC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      items: data.items,
      subtotal: data.subtotal,
      totalDiscount: data.totalDiscount,
      finalTotal: data.finalTotal,
      status: "Processing",
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      saveOrders(updated);
      return updated;
    });

    return newOrder;
  };

  const reorder = (orderId: string): { success: boolean; itemCount: number } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !order.items || order.items.length === 0) {
      return { success: false, itemCount: 0 };
    }

    let addedCount = 0;
    order.items.forEach((item) => {
      if (item.product) {
        addToCart(item.product, item.quantity || 1);
        addedCount += item.quantity || 1;
      }
    });

    return { success: true, itemCount: addedCount };
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      saveOrders(updated);
      return updated;
    });
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem("user_orders_history");
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        placeOrder,
        reorder,
        getOrderById,
        clearOrders,
        deleteOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
