"use client";

import { Menu, Phone, ShoppingCart, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { categories } from "@/data/products";
import Link from "next/link";

export default function FloatingSidebar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-center gap-1 bg-brand-dark/90 backdrop-blur-md border border-brand-gold/20 rounded-2xl py-3 px-2 shadow-2xl">
        <button
          onClick={() => { setShowMenu(!showMenu); setShowSearch(false); }}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer"
        >
          <Menu size={22} />
        </button>

        <a
          href="tel:+573000000000"
          className="w-12 h-12 flex items-center justify-center rounded-xl text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
        >
          <Phone size={22} />
        </a>

        <button
          onClick={() => setIsCartOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-gold text-brand-black hover:bg-brand-gold-light transition-all cursor-pointer relative"
        >
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>

        <button
          onClick={() => { setShowSearch(!showSearch); setShowMenu(false); }}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer"
        >
          <Search size={22} />
        </button>

        <Link
          href="/admin"
          className="w-12 h-12 flex items-center justify-center rounded-xl text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer"
        >
          <User size={22} />
        </Link>
      </div>

      {showMenu && (
        <div className="fixed right-20 top-1/2 -translate-y-1/2 z-[79] bg-brand-dark/95 backdrop-blur-md border border-brand-gold/20 rounded-2xl shadow-2xl py-2 w-56">
          <ul>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/#${cat.slug}`}
                  onClick={() => setShowMenu(false)}
                  className="block px-5 py-2.5 text-sm text-brand-muted hover:text-brand-gold hover:bg-brand-gold/5 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSearch && (
        <div className="fixed right-20 top-1/2 -translate-y-1/4 z-[79] bg-brand-dark/95 backdrop-blur-md border border-brand-gold/20 rounded-2xl shadow-2xl p-4 w-72">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full h-10 pl-10 pr-4 rounded-full text-sm bg-brand-dark2 text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/50 placeholder-brand-muted"
            />
          </div>
        </div>
      )}
    </>
  );
}
