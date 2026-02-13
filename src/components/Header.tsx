"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";
import Link from "next/link";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-brand-dark sticky top-0 z-50 border-b border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="shrink-0">
            <img
              src="/logo.jpg"
              alt="La Bodega Nocturna 23"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-12 rounded text-sm bg-brand-dark2 text-brand-text border border-brand-gold/30 focus:outline-none focus:border-brand-gold placeholder-brand-muted"
              />
              <button className="absolute right-0 top-0 h-10 w-10 bg-brand-gold rounded-r flex items-center justify-center hover:bg-brand-gold-light transition-colors cursor-pointer">
                <Search size={16} className="text-brand-black" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-brand-muted hover:text-brand-gold transition-colors hidden md:flex items-center gap-1.5 cursor-pointer">
              <User size={20} />
              <span className="text-xs uppercase tracking-wider">Cuenta</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-brand-muted hover:text-brand-gold transition-colors flex items-center gap-1.5 relative cursor-pointer"
            >
              <ShoppingCart size={20} />
              <span className="hidden md:inline text-xs uppercase tracking-wider">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 md:-top-2 md:-right-4 bg-brand-gold text-brand-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-brand-gold cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <nav className="hidden md:block border-t border-brand-gold/10">
          <ul className="flex items-center justify-center gap-0">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/#${cat.slug}`}
                  className="block px-3 py-2.5 text-brand-muted text-xs uppercase tracking-wider font-medium hover:text-brand-gold hover:bg-white/5 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-gold/10">
          <div className="px-6 py-3">
            <div className="relative w-full mb-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-12 rounded text-sm bg-brand-dark2 text-brand-text border border-brand-gold/30 focus:outline-none focus:border-brand-gold placeholder-brand-muted"
              />
              <button className="absolute right-0 top-0 h-10 w-10 bg-brand-gold rounded-r flex items-center justify-center cursor-pointer">
                <Search size={16} className="text-brand-black" />
              </button>
            </div>
          </div>
          <ul>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/#${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-brand-muted text-sm uppercase tracking-wider hover:text-brand-gold hover:bg-white/5 transition-colors border-t border-brand-gold/5"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <button className="w-full text-left px-6 py-3 text-brand-muted text-sm hover:text-brand-gold hover:bg-white/5 transition-colors border-t border-brand-gold/5 cursor-pointer">
                <User size={14} className="inline mr-2" />
                Mi Cuenta
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
