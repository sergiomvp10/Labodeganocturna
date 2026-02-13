"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { CityProvider } from "@/context/CityContext";
import { CityImagesProvider } from "@/context/CityImagesContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { FlyToCartProvider } from "@/context/FlyToCartContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteConfigProvider>
      <ProductsProvider>
        <CityImagesProvider>
          <CityProvider>
            <CartProvider>
              <FlyToCartProvider>{children}</FlyToCartProvider>
            </CartProvider>
          </CityProvider>
        </CityImagesProvider>
      </ProductsProvider>
    </SiteConfigProvider>
  );
}
