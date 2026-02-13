"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { CityProvider } from "@/context/CityContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CityProvider>
      <CartProvider>{children}</CartProvider>
    </CityProvider>
  );
}
