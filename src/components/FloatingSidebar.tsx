"use client";

import { Menu, Phone, ShoppingCart, Search, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useState, useRef, useEffect } from "react";
import { useCategories } from "@/context/CategoriesContext";
import Link from "next/link";
import { Product } from "@/data/products";

export default function FloatingSidebar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { categories } = useCategories();
  const { products } = useProducts();
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const filteredProducts: Product[] = searchQuery.trim().length >= 2
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  const handleSelectProduct = (id: number) => {
    setSearchQuery("");
    setShowSearch(false);
    window.location.href = `/producto/${id}`;
  };

  const handleCloseSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
  };

  return (
    <>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-center gap-1 bg-brand-dark/90 backdrop-blur-md border border-brand-gold/20 rounded-2xl py-3 px-2 shadow-2xl">
        <button
          onClick={() => { setShowMenu(!showMenu); setShowSearch(false); setSearchQuery(""); }}
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
          id="cart-icon-target"
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
          onClick={() => { setShowSearch(!showSearch); setShowMenu(false); if (showSearch) setSearchQuery(""); }}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
            showSearch
              ? "text-brand-gold bg-brand-gold/10"
              : "text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10"
          }`}
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
        <>
          <div
            className="fixed inset-0 z-[89] bg-black/40 backdrop-blur-sm"
            onClick={handleCloseSearch}
          />
          <div className="fixed inset-x-4 top-[10vh] z-[90] max-w-lg mx-auto">
            <div className="bg-brand-dark border border-brand-gold/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-gold/15">
                <Search size={20} className="text-brand-gold flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar productos, marcas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-brand-text text-base placeholder-brand-muted/60 focus:outline-none"
                />
                <button
                  onClick={handleCloseSearch}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>


              {searchQuery.trim().length >= 2 && filteredProducts.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-brand-muted text-sm">No se encontraron productos para &quot;{searchQuery}&quot;</p>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div className="max-h-[60vh] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-gold/5 transition-colors cursor-pointer border-b border-brand-gold/10 last:border-b-0"
                    >
                      <div className="w-12 h-12 flex-shrink-0 bg-brand-dark2 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm text-brand-text font-medium truncate">{product.name}</p>
                        <p className="text-xs text-brand-muted">{product.brand} · {product.category}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-brand-gold">${product.price.toLocaleString()}</p>
                        {product.discount && (
                          <span className="text-[10px] font-bold text-red-400">{product.discount}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
