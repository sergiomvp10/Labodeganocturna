"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartSidebar() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-brand-dark text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} />
            <h2 className="font-bold text-lg">
              Mi Carrito ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:text-brand-gold transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-brand-muted text-sm">
              Agrega productos para comenzar tu pedido
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-brand-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md text-sm transition-colors cursor-pointer"
            >
              Seguir Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="w-16 h-16 shrink-0 bg-white rounded flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/100x100/eee/333?text=Img";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-brand-text truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-brand-muted">
                      {item.product.volume}
                    </p>
                    <p className="font-bold text-sm text-brand-text mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Subtotal:</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Domicilio:</span>
                <span className="font-semibold text-green-600">
                  {totalPrice >= 50000 ? "Gratis" : formatPrice(5000)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base border-t pt-3">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(
                    totalPrice + (totalPrice >= 50000 ? 0 : 5000)
                  )}
                </span>
              </div>
              <button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-sm transition-colors cursor-pointer">
                Finalizar Pedido por WhatsApp
              </button>
              <button
                onClick={clearCart}
                className="w-full text-brand-muted hover:text-red-500 text-sm py-1 transition-colors cursor-pointer"
              >
                Vaciar Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
