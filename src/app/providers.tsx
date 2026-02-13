"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { CityProvider } from "@/context/CityContext";
import { CityImagesProvider } from "@/context/CityImagesContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CityImagesProvider>
      <CityProvider>
        <CartProvider>{children}</CartProvider>
      </CityProvider>
    </CityImagesProvider>
  );
}
