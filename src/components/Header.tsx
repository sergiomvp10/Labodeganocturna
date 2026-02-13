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
    <header className="bg-brand-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-brand-red rounded-lg p-2">
              <span className="text-white font-bold text-lg md:text-xl">LBN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg md:text-xl leading-tight">
                La Bodega
              </h1>
              <p className="text-brand-gold text-xs md:text-sm font-medium -mt-1">
                Nocturna
              </p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-12 rounded-md text-sm bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button className="absolute right-0 top-0 h-10 w-10 bg-brand-red rounded-r-md flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="text-white hover:text-brand-gold transition-colors hidden md:flex items-center gap-1 cursor-pointer">
              <User size={22} />
              <span className="text-sm">Mi Cuenta</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-brand-gold transition-colors flex items-center gap-1 relative cursor-pointer"
            >
              <ShoppingCart size={22} />
              <span className="hidden md:inline text-sm">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 md:-top-2 md:-right-4 bg-brand-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <nav className="hidden md:block border-t border-white/10">
          <ul className="flex items-center gap-0">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/#${cat.slug}`}
                  className="block px-4 py-3 text-white text-sm font-medium hover:bg-brand-red transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#ofertas"
                className="block px-4 py-3 text-brand-gold text-sm font-bold hover:bg-brand-red transition-colors"
              >
                🔥 Ofertas
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10">
          <div className="px-4 py-3">
            <div className="relative w-full mb-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-12 rounded-md text-sm bg-white text-brand-text focus:outline-none"
              />
              <button className="absolute right-0 top-0 h-10 w-10 bg-brand-red rounded-r-md flex items-center justify-center cursor-pointer">
                <Search size={18} className="text-white" />
              </button>
            </div>
          </div>
          <ul>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/#${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-white text-sm hover:bg-brand-red transition-colors border-t border-white/5"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#ofertas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-3 text-brand-gold text-sm font-bold hover:bg-brand-red transition-colors border-t border-white/5"
              >
                🔥 Ofertas
              </Link>
            </li>
            <li>
              <button className="w-full text-left px-6 py-3 text-white text-sm hover:bg-brand-red transition-colors border-t border-white/5 cursor-pointer">
                <User size={16} className="inline mr-2" />
                Mi Cuenta
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
