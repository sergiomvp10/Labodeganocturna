"use client";

import { useCart } from "@/context/CartContext";
import { useCity } from "@/context/CityContext";
import { useProducts } from "@/context/ProductsContext";
import { api } from "@/lib/api";
import { Product } from "@/data/products";
import { saveLastOrder } from "@/lib/lastOrder";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, CheckCircle, Loader2, Ticket, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "cart" | "checkout" | "confirmation";

const PAYMENT_METHODS = ["Efectivo", "Nequi", "Bre-b"];

export default function CartSidebar() {
  const { items, addToCart, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { selectedCity } = useCity();
  const { products } = useProducts();
  const router = useRouter();

  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(selectedCity);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [suggestedIds, setSuggestedIds] = useState<number[]>([]);

  useEffect(() => {
    api.storefront
      .cartSuggestions()
      .then((data) => setSuggestedIds(data.map((p) => p.id)))
      .catch(() => {});
  }, []);

  const discountAmount = Math.round(totalPrice * couponDiscount / 100);
  const priceAfterCoupon = totalPrice - discountAmount;
  const shipping = priceAfterCoupon >= 200000 ? 0 : 6000;
  const finalTotal = priceAfterCoupon + shipping;

  const inCartIds = new Set(items.map((i) => i.product.id));
  const cartCategories = new Set(items.map((i) => i.product.category.toLowerCase()));
  const candidates = products.filter((p) => p.inStock && !inCartIds.has(p.id));
  const curated = suggestedIds
    .map((id) => candidates.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
  const suggestions = (curated.length > 0
    ? curated
    : [
        ...candidates.filter((p) => cartCategories.has(p.category.toLowerCase())),
        ...candidates.filter((p) => !cartCategories.has(p.category.toLowerCase()) && p.featured),
        ...candidates.filter((p) => !cartCategories.has(p.category.toLowerCase()) && !p.featured),
      ]
  ).slice(0, 6);

  const handleValidateCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponError("");
    setValidatingCoupon(true);
    try {
      const res = await api.storefront.validateCoupon(code);
      if (res.valid) {
        setCouponDiscount(res.discount);
        setCouponApplied(res.code);
        setCouponError("");
      } else {
        setCouponDiscount(0);
        setCouponApplied("");
        setCouponError("Cupón no válido");
      }
    } catch {
      setCouponError("Error al validar");
    }
    setValidatingCoupon(false);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied("");
    setCouponError("");
  };

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
        total: finalTotal,
        notes: couponApplied ? `Cupón: ${couponApplied} (-${couponDiscount}%)` : "",
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
      });
      saveLastOrder({
        id: res.id,
        clientName: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        paymentMethod: payment,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        subtotal: totalPrice,
        discount: discountAmount,
        coupon: couponApplied,
        shipping,
        total: finalTotal,
      });
      setOrderId(res.id);
      clearCart();
      setIsCartOpen(false);
      router.push(`/gracias?pedido=${res.id}`);
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
                            loading="lazy"
                            decoding="async"
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-brand-text font-medium truncate">
                            {item.product.name}
                          </h4>
                          <p className="price text-brand-gold font-bold text-sm mt-1">
                            ${item.product.price.toLocaleString("es-CO")}
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

                  {suggestions.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-brand-gold/10">
                      <h3 className="text-sm font-bold text-brand-text mb-3">
                        Tal vez quisieras agregar...
                      </h3>
                      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                        {suggestions.map((p) => (
                          <div
                            key={p.id}
                            className="w-28 shrink-0 bg-brand-dark2 rounded-xl border border-brand-gold/10 p-2 flex flex-col"
                          >
                            <div className="h-20 bg-brand-dark rounded-lg overflow-hidden flex items-center justify-center mb-2">
                              <img
                                src={p.image}
                                alt={p.name}
                                loading="lazy"
                                decoding="async"
                                width={96}
                                height={80}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-[11px] text-brand-text leading-snug line-clamp-2 mb-1">
                              {p.name}
                            </p>
                            <p className="price text-xs font-bold text-brand-gold mt-auto mb-2">
                              ${p.price.toLocaleString("es-CO")}
                            </p>
                            <button
                              onClick={() => addToCart(p)}
                              aria-label={`Agregar ${p.name} al carrito`}
                              className="w-full flex items-center justify-center gap-1 bg-brand-gold/15 text-brand-gold text-[11px] font-bold py-1.5 rounded-md hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer"
                            >
                              <Plus size={12} strokeWidth={3} />
                              Agregar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t border-brand-gold/20 space-y-3">
                    {totalPrice < 200000 ? (
                      <p className="text-xs text-brand-muted text-center">
                        Agrega ${(200000 - totalPrice).toLocaleString("es-CO")} más para envío gratis
                      </p>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-lg border border-green-400/30 bg-green-400/10 px-3 py-2">
                        <Truck size={16} className="text-green-400 shrink-0" />
                        <p className="text-sm font-bold tracking-wide text-green-400">
                          TIENES ENVÍO GRATIS
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm text-brand-muted">Total</span>
                      <span className="price text-2xl font-bold text-brand-gold">
                        ${totalPrice.toLocaleString("es-CO")}
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
                    <span className="price text-brand-muted flex-shrink-0 font-medium">
                      ${(item.product.price * item.quantity).toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}
                <div className="border-t border-brand-gold/15 pt-3 mt-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Subtotal</span>
                    <span className="price text-sm text-brand-text font-medium">${totalPrice.toLocaleString("es-CO")}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-400 flex items-center gap-1">
                        <Ticket size={14} />
                        {couponApplied} (-{couponDiscount}%)
                      </span>
                      <span className="price text-sm text-green-400 font-medium">-${discountAmount.toLocaleString("es-CO")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Envío</span>
                    <span className={`text-sm font-medium ${shipping === 0 ? "text-green-400" : "text-brand-text"}`}>
                      {shipping === 0 ? "Gratis" : "$6,000"}
                    </span>
                  </div>
                  <div className="border-t border-brand-gold/15 pt-2 flex justify-between items-center">
                    <span className="text-sm font-bold text-brand-text">Total</span>
                    <span className="price text-xl font-bold text-brand-gold">${finalTotal.toLocaleString("es-CO")}</span>
                  </div>
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

              <div className="bg-brand-dark2 rounded-2xl border border-brand-gold/15 p-4">
                <label className="block text-xs font-semibold text-brand-gold/70 uppercase tracking-wider mb-2">Cupón de descuento</label>
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-green-400" />
                      <span className="text-green-400 font-mono font-bold text-sm">{couponApplied}</span>
                      <span className="text-green-400/70 text-xs">(-{couponDiscount}%)</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-400/50 hover:text-red-400 cursor-pointer transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleValidateCoupon(); }}
                      placeholder="Código del cupón"
                      className="flex-1 h-11 px-4 rounded-xl text-sm font-mono tracking-wider bg-brand-dark text-brand-text border border-brand-gold/20 focus:outline-none focus:border-brand-gold/60 placeholder-brand-muted/50 uppercase"
                    />
                    <button
                      onClick={handleValidateCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 h-11 rounded-xl bg-brand-gold/20 text-brand-gold font-bold text-sm hover:bg-brand-gold/30 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {validatingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Aplicar"}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              )}

              <div style={{ marginTop: "24px", marginBottom: "12px" }} className="flex flex-col items-center gap-2">
                <img src="/divider-gold.png" alt="" style={{ width: "70%", height: "auto", opacity: 0.85 }} />
                {shipping === 0 && (
                  <p className="text-green-400 text-sm font-bold tracking-wide">🚚 ¡Envío Gratis!</p>
                )}
                <p className="text-brand-muted text-xs">🕐 Entrega estimada: 30-45 min</p>
              </div>

              <div style={{ marginBottom: "8px" }}>
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
                      <span className="relative">{`Confirmar pedido · $${finalTotal.toLocaleString("es-CO")}`}</span>
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
