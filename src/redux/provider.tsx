"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { initializeAuth } from "./slices/authSlice";
import { initializeCart } from "./slices/cartSlice";
import { initializeWishlist } from "./slices/wishlistSlice";
import { initializeCompare } from "./slices/compareSlice";
import { initializeRecentlyViewed } from "./slices/recentlyViewedSlice";
import { initializeOrders } from "./slices/ordersSlice";

function ReduxStateInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeCart());
    dispatch(initializeWishlist());
    dispatch(initializeCompare());
    dispatch(initializeRecentlyViewed());
    dispatch(initializeOrders());
  }, [dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxStateInitializer>{children}</ReduxStateInitializer>
    </Provider>
  );
}
