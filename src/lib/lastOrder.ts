export interface LastOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface LastOrder {
  id: string;
  clientName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  items: LastOrderItem[];
  subtotal: number;
  discount: number;
  coupon: string;
  shipping: number;
  total: number;
}

const STORAGE_KEY = "lbn_last_order";

export function saveLastOrder(order: LastOrder): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* sessionStorage no disponible */
  }
}

export function loadLastOrder(orderId: string): LastOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const order = JSON.parse(raw) as LastOrder;
    return order.id === orderId ? order : null;
  } catch {
    return null;
  }
}

const money = (value: number) => `$${value.toLocaleString("es-CO")}`;

export function buildOrderWhatsAppMessage(order: LastOrder): string {
  const lines = [
    `Hola, soy ${order.clientName} y acabo de hacer el pedido *#${order.id}*.`,
    "",
    "*Productos:*",
    ...order.items.map(
      (i) => `• ${i.quantity} x ${i.name} — ${money(i.price * i.quantity)}`
    ),
    "",
    `Subtotal: ${money(order.subtotal)}`,
  ];

  if (order.discount > 0) {
    lines.push(
      `Descuento${order.coupon ? ` (${order.coupon})` : ""}: -${money(order.discount)}`
    );
  }

  lines.push(
    `Envío: ${order.shipping === 0 ? "Gratis" : money(order.shipping)}`,
    `*Total: ${money(order.total)}*`,
    "",
    `Pago: ${order.paymentMethod}`,
    `Entrega: ${order.address}, ${order.city}`,
    `Teléfono: ${order.phone}`
  );

  return lines.join("\n");
}
