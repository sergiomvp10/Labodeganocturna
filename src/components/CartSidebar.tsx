"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-brand-gold/10 z-[101] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-brand-gold/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-gold" />
            <h2 className="text-lg font-bold text-brand-text">
              Tu carrito ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-brand-muted hover:text-brand-gold cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-brand-gold/20 mb-4" />
              <p className="text-brand-muted text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-brand-dark2 rounded-xl border border-brand-gold/10"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-brand-dark rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-brand-text font-medium truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-brand-gold font-bold text-sm mt-1">
                      ${item.product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-brand-dark border border-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm text-brand-text font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-brand-dark border border-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-brand-muted hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-brand-gold/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-brand-muted text-sm">Total</span>
              <span className="text-xl font-bold text-brand-gold">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
            {totalPrice < 150000 && (
              <p className="text-xs text-brand-muted text-center">
                Agrega ${(150000 - totalPrice).toLocaleString()} más para envío gratis
              </p>
            )}
            <button className="w-full py-3.5 bg-brand-gold text-brand-black font-bold rounded-xl hover:bg-brand-goldLight transition-colors cursor-pointer text-sm">
              Hacer pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
