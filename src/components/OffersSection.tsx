"use client";

import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { api, ProductAPI } from "@/lib/api";
import { isTobaccoCategoryName } from "@/lib/tobacco";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

export default function OffersSection({ hideTobacco = false }: { hideTobacco?: boolean }) {
  const [offers, setOffers] = useState<Product[]>([]);

  useEffect(() => {
    api.storefront.offers().then((data) => {
      setOffers(
        data
          .map(toProduct)
          .filter((p) => !hideTobacco || !isTobaccoCategoryName(p.category))
      );
    }).catch(() => {});
  }, [hideTobacco]);

  if (offers.length === 0) return null;

  return (
    <section className="pt-10 md:pt-14 bg-brand-black overflow-hidden" style={{ paddingBottom: "12rem" }}>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center" style={{ marginBottom: "5rem" }}>
          <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
            Ahorra hoy
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
            Ofertas especiales
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {offers.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
