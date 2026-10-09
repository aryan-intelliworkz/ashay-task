"use client";

import { useMemo, useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  loginUser,
  logout as logoutAction,
  refreshUserProfile,
} from "./slices/authSlice";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  dismissNotification as dismissNotificationAction,
} from "./slices/cartSlice";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  toggleWishlist as toggleWishlistAction,
  clearWishlist as clearWishlistAction,
} from "./slices/wishlistSlice";
import {
  addToCompare as addToCompareAction,
  removeFromCompare as removeFromCompareAction,
  toggleCompare as toggleCompareAction,
  clearCompare as clearCompareAction,
} from "./slices/compareSlice";
import {
  addRecentlyViewed as addRecentlyViewedAction,
  removeRecentlyViewed as removeRecentlyViewedAction,
  clearRecentlyViewed as clearRecentlyViewedAction,
} from "./slices/recentlyViewedSlice";
import {
  placeOrder as placeOrderAction,
  deleteOrder as deleteOrderAction,
  clearOrders as clearOrdersAction,
} from "./slices/ordersSlice";
import { Product, LoginCredentials, OrderItem, OrderShippingDetails } from "@/types";

// Standard typed Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 1. Redux-powered Auth Hook
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error((resultAction.payload as string) || "Login failed");
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const refreshProfile = useCallback(async () => {
    await dispatch(refreshUserProfile());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshProfile,
  };
}

// 2. Redux-powered Cart Hook
export function useCart() {
  const dispatch = useAppDispatch();
  const { items, notification } = useAppSelector((state) => state.cart);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      dispatch(addToCartAction({ product, quantity }));
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      dispatch(removeFromCartAction(productId));
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      dispatch(updateQuantityAction({ productId, quantity }));
    },
    [dispatch]
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const dismissNotification = useCallback(() => {
    dispatch(dismissNotificationAction());
  }, [dispatch]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const totalDiscount = useMemo(
    () =>
      items.reduce((sum, item) => {
        const originalPrice =
          item.product.price / (1 - (item.product.discountPercentage || 0) / 100);
        const savings = (originalPrice - item.product.price) * item.quantity;
        return sum + (savings > 0 ? savings : 0);
      }, 0),
    [items]
  );

  const finalTotal = subtotal;

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    totalDiscount,
    finalTotal,
    notification,
    dismissNotification,
  };
}

// 3. Redux-powered Wishlist Hook
export function useWishlist() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  const isInWishlist = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items]
  );

  const addToWishlist = useCallback(
    (product: Product) => {
      dispatch(addToWishlistAction(product));
    },
    [dispatch]
  );

  const removeFromWishlist = useCallback(
    (productId: number) => {
      dispatch(removeFromWishlistAction(productId));
    },
    [dispatch]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      dispatch(toggleWishlistAction(product));
    },
    [dispatch]
  );

  const clearWishlist = useCallback(() => {
    dispatch(clearWishlistAction());
  }, [dispatch]);

  return {
    wishlist: items,
    wishlistCount: items.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };
}

// 4. Redux-powered Compare Hook
export function useCompare() {
  const dispatch = useAppDispatch();
  const { items, maxCompareLimit, message } = useAppSelector(
    (state) => state.compare
  );

  const isInCompare = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items]
  );

  const addToCompare = useCallback(
    (product: Product) => {
      if (!product || !product.id) return { success: false, message: "Invalid product" };
      if (items.some((item) => item.id === product.id)) {
        return { success: false, message: "Product is already in compare list" };
      }
      if (items.length >= maxCompareLimit) {
        return {
          success: false,
          message: `You can only compare up to ${maxCompareLimit} products at a time. Please remove one first.`,
        };
      }
      dispatch(addToCompareAction(product));
      return { success: true, message: `Added "${product.title}" to comparison.` };
    },
    [dispatch, items, maxCompareLimit]
  );

  const removeFromCompare = useCallback(
    (productId: number) => {
      dispatch(removeFromCompareAction(productId));
    },
    [dispatch]
  );

  const toggleCompare = useCallback(
    (product: Product) => {
      if (items.some((item) => item.id === product.id)) {
        dispatch(removeFromCompareAction(product.id));
        return { success: true, message: `Removed "${product.title}" from comparison.` };
      }
      return addToCompare(product);
    },
    [dispatch, items, addToCompare]
  );

  const clearCompare = useCallback(() => {
    dispatch(clearCompareAction());
  }, [dispatch]);

  return {
    compareList: items,
    compareCount: items.length,
    isInCompare,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    maxCompareLimit,
    message,
  };
}

// 5. Redux-powered Recently Viewed Hook
export function useRecentlyViewed() {
  const dispatch = useAppDispatch();
  const { items, isLoaded } = useAppSelector((state) => state.recentlyViewed);

  const addRecentlyViewed = useCallback(
    (product: Product) => {
      dispatch(addRecentlyViewedAction(product));
    },
    [dispatch]
  );

  const removeRecentlyViewed = useCallback(
    (productId: number) => {
      dispatch(removeRecentlyViewedAction(productId));
    },
    [dispatch]
  );

  const clearRecentlyViewed = useCallback(() => {
    dispatch(clearRecentlyViewedAction());
  }, [dispatch]);

  return {
    recentlyViewed: items,
    addRecentlyViewed,
    removeRecentlyViewed,
    clearRecentlyViewed,
    isLoaded,
  };
}

// 6. Redux-powered Orders Hook
export function useOrders() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);
  const { addToCart } = useCart();

  const placeOrder = useCallback(
    (data: {
      items: OrderItem[];
      subtotal: number;
      totalDiscount: number;
      finalTotal: number;
      paymentMethod: "credit-card" | "paypal" | "cod";
      shippingAddress: OrderShippingDetails;
    }) => {
      const newOrder = {
        id: `NC-${Date.now().toString().slice(-6)}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        date: new Date().toISOString(),
        items: data.items,
        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        finalTotal: data.finalTotal,
        status: "Processing" as const,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
      };

      dispatch(placeOrderAction(data));
      return newOrder;
    },
    [dispatch]
  );

  const reorder = useCallback(
    (orderId: string) => {
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
    },
    [orders, addToCart]
  );

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      dispatch(deleteOrderAction(orderId));
    },
    [dispatch]
  );

  const clearOrders = useCallback(() => {
    dispatch(clearOrdersAction());
  }, [dispatch]);

  return {
    orders,
    placeOrder,
    reorder,
    getOrderById,
    clearOrders,
    deleteOrder,
  };
}
