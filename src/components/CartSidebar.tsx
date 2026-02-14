"use client";

import { useCart } from "@/context/CartContext";
import { useCity } from "@/context/CityContext";
import { api } from "@/lib/api";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

type Step = "cart" | "checkout" | "confirmation";

const PAYMENT_METHODS = ["Efectivo", "Nequi", "Bre-b"];

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { selectedCity } = useCity();

  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(selectedCity);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isCartOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
    if (step === "confirmation") {
      setStep("cart");
      setName("");
      setPhone("");
      setAddress("");
      setOrderId("");
      setError("");
    }
  };

  const handleCheckout = () => {
    setCity(selectedCity);
    setStep("checkout");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await api.createOrder({
        clientName: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        paymentMethod: payment,
        total: totalPrice,
        notes: "",
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
      });
      setOrderId(res.id);
      clearCart();
      setStep("confirmation");
    } catch {
      setError("Error al enviar el pedido. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-brand-gold/10 z-[101] flex flex-col">
        {step === "cart" && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gold/20 bg-gradient-to-r from-brand-dark to-brand-dark2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-brand-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-text tracking-wide">
                    Mi Carrito
                  </h2>
                  <p className="text-xs text-brand-muted">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-brand-gold/20 mb-4" />
                  <p className="text-brand-muted text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
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

                  <div className="mt-6 pt-5 border-t border-brand-gold/20 space-y-3">
                    {totalPrice < 150000 && (
                      <p className="text-xs text-brand-muted text-center">
                        Agrega ${(150000 - totalPrice).toLocaleString()} más para envío gratis
                      </p>
                    )}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm text-brand-muted">Total</span>
                      <span className="text-2xl font-bold text-brand-gold">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="relative w-full py-4 bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-black font-bold rounded-2xl hover:from-yellow-500 hover:to-brand-gold transition-all cursor-pointer text-base tracking-wide shadow-lg shadow-brand-gold/20 active:scale-[0.98] overflow-hidden"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-2xl">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: "shimmer 2.5s ease-in-out infinite" }} />
                      </span>
                      <span className="relative">Hacer pedido</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {step === "checkout" && (
          <>
            <div className="relative flex items-center justify-center px-6 py-4 border-b border-brand-gold/20 bg-gradient-to-r from-brand-dark to-brand-dark2">
              <button onClick={() => setStep("cart")} className="absolute left-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors cursor-pointer">
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-lg font-bold text-brand-text tracking-wide">Completar pedido</h2>
              <button onClick={handleClose} className="absolute right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="bg-brand-dark2 rounded-2xl border border-brand-gold/15 p-5 space-y-3">
                <h3 className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Resumen</h3>
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm py-1">
                    <span className="text-brand-text truncate mr-3">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-brand-muted flex-shrink-0 font-medium">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-brand-gold/15 pt-3 mt-1 flex justify-between items-center">
                  <span className="text-sm font-bold text-brand-text">Total</span>
                  <span className="text-xl font-bold text-brand-gold">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-gold/70 uppercase tracking-wider mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full h-12 px-4 rounded-2xl text-base bg-brand-dark2 text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 placeholder-brand-muted/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gold/70 uppercase tracking-wider mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="300 000 0000"
                    className="w-full h-12 px-4 rounded-2xl text-base bg-brand-dark2 text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 placeholder-brand-muted/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gold/70 uppercase tracking-wider mb-2">Dirección</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, barrio"
                    className="w-full h-12 px-4 rounded-2xl text-base bg-brand-dark2 text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 placeholder-brand-muted/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gold/70 uppercase tracking-wider mb-2">Ciudad</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl text-base bg-brand-dark2 text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 appearance-none cursor-pointer transition-colors"
                  >
                    <option value="Duitama">Duitama</option>
                    <option value="Tunja">Tunja</option>
                    <option value="Sogamoso">Sogamoso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gold/70 uppercase tracking-wider mb-3">Forma de pago</label>
                  <div className="flex gap-3">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setPayment(m)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                          payment === m
                            ? "bg-brand-gold text-brand-black border-brand-gold shadow-md shadow-brand-gold/20"
                            : "bg-brand-dark2 text-brand-muted border-brand-gold/20 hover:border-brand-gold/40"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              )}

              <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="relative w-full py-4 bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-black font-bold rounded-2xl hover:from-yellow-500 hover:to-brand-gold transition-all cursor-pointer text-base tracking-wide shadow-lg shadow-brand-gold/20 active:scale-[0.98] overflow-hidden flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="relative">Enviando...</span>
                  </>
                ) : (
                  <>
                    <span className="absolute inset-0 overflow-hidden rounded-2xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: "shimmer 2.5s ease-in-out infinite" }} />
                    </span>
                    <span className="relative">{`Confirmar pedido · $${totalPrice.toLocaleString()}`}</span> 
                  </>
                )}
              </button>
              </div>
            </div>
          </>
        )}

        {step === "confirmation" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">
              ¡Pedido confirmado!
            </h2>
            <p className="text-brand-muted text-sm mb-6 max-w-xs">
              Tu pedido está siendo preparado y alistado para enviarse. Te contactaremos pronto.
            </p>
            {orderId && (
              <div className="bg-brand-dark2 rounded-xl border border-brand-gold/10 px-6 py-3 mb-8">
                <p className="text-xs text-brand-muted">Número de pedido</p>
                <p className="text-lg font-bold text-brand-gold">{orderId}</p>
              </div>
            )}
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-brand-gold text-brand-black font-bold rounded-xl hover:bg-brand-goldLight transition-colors cursor-pointer text-sm"
            >
              Volver a la tienda
            </button>
          </div>
        )}
      </div>
    </>
  );
}
