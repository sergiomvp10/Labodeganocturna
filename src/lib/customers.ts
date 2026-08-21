import type { Order } from "@/context/SiteConfigContext";
import { parseOrderDate } from "./orderStats";

export interface Customer {
  phone: string;
  name: string;
  address: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastOrderAt: string;
}

/** El telefono es la identidad del cliente: llega con espacios, guiones o +57. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("57") && digits.length > 10 ? digits.slice(2) : digits;
}

/**
 * Un cliente por telefono, con los datos de su pedido mas reciente (los clientes
 * cambian de direccion) y el acumulado de todos sus pedidos.
 */
export function customersFromOrders(orders: Order[]): Customer[] {
  const byPhone = new Map<string, Customer>();

  for (const order of orders) {
    const phone = normalizePhone(order.phone);
    if (!phone) continue;
    const current = byPhone.get(phone);
    const isNewer = !current || parseOrderDate(order.createdAt) > parseOrderDate(current.lastOrderAt);
    byPhone.set(phone, {
      phone,
      name: isNewer ? order.clientName : current.name,
      address: isNewer ? order.address : current.address,
      city: isNewer ? order.city : current.city,
      orders: (current?.orders ?? 0) + 1,
      totalSpent: (current?.totalSpent ?? 0) + order.total,
      lastOrderAt: isNewer ? order.createdAt : current.lastOrderAt,
    });
  }

  return [...byPhone.values()].sort(
    (a, b) => parseOrderDate(b.lastOrderAt).getTime() - parseOrderDate(a.lastOrderAt).getTime()
  );
}

export function customersToCsv(customers: Customer[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = customers.map((c) =>
    [c.name, c.phone, c.address, c.city, String(c.orders), String(c.totalSpent), c.lastOrderAt]
      .map(escape)
      .join(",")
  );
  return ["Nombre,Telefono,Direccion,Ciudad,Pedidos,Total,Ultimo pedido", ...rows].join("\n");
}
