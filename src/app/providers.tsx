"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { CityProvider } from "@/context/CityContext";
import { CityImagesProvider } from "@/context/CityImagesContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteConfigProvider>
      <CityImagesProvider>
        <CityProvider>
          <CartProvider>{children}</CartProvider>
        </CityProvider>
      </CityImagesProvider>
    </SiteConfigProvider>
  );
}
