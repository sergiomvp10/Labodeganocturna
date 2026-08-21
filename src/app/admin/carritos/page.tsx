"use client";

import { useCallback, useEffect, useState } from "react";
import { AbandonedCartAPI, api } from "@/lib/api";
import { parseOrderDate } from "@/lib/orderStats";
import { buildRecoveryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { MessageCircle, Phone, MapPin, ShoppingCart, Trash2 } from "lucide-react";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  parseOrderDate(value).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });

export default function CarritosPage() {
  const [carts, setCarts] = useState<AbandonedCartAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api
      .getAbandonedCarts()
      .then(setCarts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  const handleDelete = async (id: number) => {
    await api.deleteAbandonedCart(id);
    setCarts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#888] text-sm">
          Carritos con teléfono que no terminaron el pedido. El bot avisa al grupo
          de Telegram 20 minutos después de que el cliente lo deja.
        </p>
        <span className="text-[#666] text-sm shrink-0">{carts.length} carritos</span>
      </div>

      {loading && <p className="text-[#666] text-sm">Cargando...</p>}

      {!loading && carts.length === 0 && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center text-[#666] text-sm">
          Sin carritos abandonados por ahora.
        </div>
      )}

      <div className="grid gap-3">
        {carts.map((cart) => (
          <div
            key={cart.id}
            className="bg-[#111] border border-[#222] rounded-xl p-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-white font-medium">
                  {cart.clientName || "Sin nombre"}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#888]">
                  <span className="flex items-center gap-1">
                    <Phone size={12} />
                    {cart.phone}
                  </span>
                  {cart.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {cart.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <ShoppingCart size={12} />
                    {cart.items.length} producto(s)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[#c9a84c] font-bold">
                    {formatPrice(cart.total)}
                  </div>
                  <div className="text-xs text-[#666]">
                    {formatDate(cart.updatedAt)}
                  </div>
                </div>
                <a
                  href={whatsappLink(cart.phone, buildRecoveryWhatsAppMessage(cart))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500/15 text-green-400 px-3 py-2 rounded-lg text-sm hover:bg-green-500/25 transition-colors"
                >
                  <MessageCircle size={16} />
                  Recuperar
                </a>
                <button
                  onClick={() => handleDelete(cart.id)}
                  className="p-2 rounded-lg hover:bg-red-400/10 text-[#aaa] hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="border-t border-[#222] pt-2 space-y-1">
              {cart.items.map((item, index) => (
                <div
                  key={`${cart.id}-${index}`}
                  className="flex justify-between text-xs text-[#aaa]"
                >
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
