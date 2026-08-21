"use client";

import { useEffect, useMemo, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { customersFromOrders, customersToCsv, normalizePhone } from "@/lib/customers";
import { parseOrderDate } from "@/lib/orderStats";
import { whatsappLink } from "@/lib/whatsapp";
import { Download, MessageCircle, Search } from "lucide-react";

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
    year: "numeric",
    timeZone: "America/Bogota",
  });

export default function ClientesPage() {
  const { orders, refreshOrders } = useSiteConfig();
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const customers = useMemo(() => customersFromOrders(orders), [orders]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    const digits = normalizePhone(term);
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term) ||
        c.city.toLowerCase().includes(term) ||
        (digits.length > 0 && c.phone.includes(digits))
    );
  }, [customers, search]);

  const downloadCsv = () => {
    const url = URL.createObjectURL(
      new Blob([customersToCsv(filtered)], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "clientes-labodega23.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[#888] text-sm">
          Clientes que ya han pedido, con los datos de su pedido más reciente.
        </p>
        <span className="text-[#666] text-sm shrink-0">{customers.length} clientes</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono, dirección o ciudad"
            className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>
        <button
          onClick={downloadCsv}
          disabled={filtered.length === 0}
          className="flex items-center justify-center gap-2 bg-[#c9a84c]/15 text-[#c9a84c] px-4 py-2.5 rounded-lg text-sm hover:bg-[#c9a84c]/25 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Descargar CSV
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center text-[#666] text-sm">
          {customers.length === 0 ? "Aún no hay clientes con pedidos." : "Ningún cliente coincide con la búsqueda."}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#888] text-xs uppercase border-b border-[#222]">
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Teléfono</th>
                <th className="text-left px-4 py-3 font-medium">Dirección</th>
                <th className="text-left px-4 py-3 font-medium">Ciudad</th>
                <th className="text-right px-4 py-3 font-medium">Pedidos</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Último pedido</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.phone} className="border-b border-[#1a1a1a] last:border-0">
                  <td className="px-4 py-3 text-white whitespace-nowrap">{c.name || "Sin nombre"}</td>
                  <td className="px-4 py-3 text-[#aaa] whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-3 text-[#aaa]">{c.address || "—"}</td>
                  <td className="px-4 py-3 text-[#aaa] whitespace-nowrap">{c.city || "—"}</td>
                  <td className="px-4 py-3 text-[#aaa] text-right">{c.orders}</td>
                  <td className="px-4 py-3 text-[#c9a84c] text-right whitespace-nowrap">
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-[#888] whitespace-nowrap">{formatDate(c.lastOrderAt)}</td>
                  <td className="px-4 py-3">
                    <a
                      href={whatsappLink(c.phone, `Hola ${c.name}, te escribimos de La Bodega Nocturna 23.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 px-3 py-1.5 rounded-lg text-xs hover:bg-green-500/25 transition-colors whitespace-nowrap"
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
