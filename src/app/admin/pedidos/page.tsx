"use client";

import { useEffect, useState } from "react";
import { useSiteConfig, Order } from "@/context/SiteConfigContext";
import { Search, ChevronDown, Eye, X, Phone, MapPin, CreditCard, Package, Trash2 } from "lucide-react";
import { parseOrderDate } from "@/lib/orderStats";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  preparing: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

export default function PedidosPage() {
  const { orders, updateOrderStatus, deleteOrder, refreshOrders } = useSiteConfig();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(refreshOrders, 30000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (d: string) => {
    return parseOrderDate(d).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Bogota",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, ID o teléfono..."
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] appearance-none pr-8 cursor-pointer"
            >
              <option value="">Todos</option>
              {(Object.keys(STATUS_LABELS) as Order["status"][]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
          </div>
        </div>
        <div className="text-[#666] text-sm">{filtered.length} pedidos</div>
      </div>

      <div className="grid gap-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[#c9a84c] font-mono text-sm font-bold">{order.id}</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="text-white font-medium">{order.clientName}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#888]">
                  <span className="flex items-center gap-1"><Phone size={12} />{order.phone}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{order.city}</span>
                  <span className="flex items-center gap-1"><CreditCard size={12} />{order.paymentMethod}</span>
                  <span className="flex items-center gap-1"><Package size={12} />{order.items.length} producto(s)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[#c9a84c] font-bold">{formatPrice(order.total)}</div>
                  <div className="text-xs text-[#666]">{formatDate(order.createdAt)}</div>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 rounded-lg hover:bg-white/10 text-[#aaa] hover:text-[#c9a84c] transition-colors cursor-pointer"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => { if (confirm("¿Eliminar este pedido?")) deleteOrder(order.id); }}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-[#aaa] hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-[#666] py-12">No hay pedidos</div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(status) => {
            updateOrderStatus(selectedOrder.id, status);
            setSelectedOrder({ ...selectedOrder, status });
          }}
          onDelete={() => {
            deleteOrder(selectedOrder.id);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  onDelete,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: Order["status"]) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/70">
      <div className="bg-[#111] border border-[#c9a84c]/20 rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <h2 className="text-white font-bold">Pedido {order.id}</h2>
          <button onClick={onClose} className="text-[#666] hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-xs text-[#888] uppercase tracking-wider mb-2">Cliente</h3>
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-1.5 text-sm">
              <div className="text-white font-medium">{order.clientName}</div>
              <div className="text-[#aaa] flex items-center gap-2"><Phone size={13} />{order.phone}</div>
              <div className="text-[#aaa] flex items-center gap-2"><MapPin size={13} />{order.city} - {order.address}</div>
              <div className="text-[#aaa] flex items-center gap-2"><CreditCard size={13} />{order.paymentMethod}</div>
            </div>
          </div>

          <div>
            <h3 className="text-xs text-[#888] uppercase tracking-wider mb-2">Productos</h3>
            <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-white">{item.name}</span>
                    <span className="text-[#666] ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-[#c9a84c]">
                    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#333] pt-2 flex justify-between text-sm">
                <span className="text-[#aaa]">Domicilio</span>
                <span className={order.shipping ? "text-[#aaa]" : "text-green-400"}>
                  {order.shipping ? formatPrice(order.shipping) : "Gratis"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#c9a84c]">
                  {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(order.total)}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div>
              <h3 className="text-xs text-[#888] uppercase tracking-wider mb-2">Notas</h3>
              <div className="bg-[#1a1a1a] rounded-lg p-3 text-sm text-[#aaa]">{order.notes}</div>
            </div>
          )}

          <div>
            <h3 className="text-xs text-[#888] uppercase tracking-wider mb-2">Estado</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_LABELS) as Order["status"][]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    order.status === s
                      ? STATUS_COLORS[s] + " ring-1 ring-current"
                      : "bg-[#1a1a1a] text-[#666] hover:text-white hover:bg-[#222]"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { if (confirm("¿Eliminar este pedido permanentemente?")) onDelete(); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
            Eliminar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
