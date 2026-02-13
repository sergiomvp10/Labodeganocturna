"use client";

import { useState } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCity } from "@/context/CityContext";
import { categories } from "@/data/products";
import Link from "next/link";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { selectedCity, setIsCityModalOpen } = useCity();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-dark sticky top-0 z-50 border-b border-brand-gold/20">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-muted hover:text-brand-gold transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-gold transition-colors cursor-pointer"
            >
              <span>{selectedCity}</span>
            </button>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/logo.png"
              alt="La Bodega Nocturna 23"
              className="h-16 md:h-20 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-brand-muted hover:text-brand-gold transition-colors flex items-center gap-1.5 relative cursor-pointer"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-brand-dark border-t border-brand-gold/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-2.5">
          <div className="relative w-full">
            <button className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search size={16} className="text-brand-muted" />
            </button>
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full text-sm bg-brand-dark2 text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/50 placeholder-brand-muted"
            />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="bg-brand-dark border-t border-brand-gold/10">
          <div className="w-full">
            <ul className="py-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/#${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-3 text-brand-muted text-sm hover:text-brand-gold hover:bg-white/5 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
