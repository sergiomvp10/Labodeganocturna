import { Order } from "@/context/SiteConfigContext";
import { AbandonedCartAPI } from "@/lib/api";

const money = (value: number) => `$${value.toLocaleString("es-CO")}`;

export function whatsappLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `57${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`;
}

const STATUS_MESSAGES: Record<Order["status"], (order: Order) => string> = {
  pending: (o) =>
    `Hola ${o.clientName}, recibimos tu pedido #${o.id} por ${money(o.total)}. Ya lo estamos revisando.`,
  confirmed: (o) =>
    `Hola ${o.clientName}, tu pedido #${o.id} por ${money(o.total)} quedó confirmado. Lo alistamos y te avisamos cuando salga.`,
  preparing: (o) =>
    `Hola ${o.clientName}, tu pedido #${o.id} va en camino a ${o.address}. Ten listos ${money(o.total)} en ${o.paymentMethod}.`,
  delivered: (o) =>
    `Hola ${o.clientName}, tu pedido #${o.id} fue entregado. Gracias por comprar en La Bodega Nocturna 23.`,
  cancelled: (o) =>
    `Hola ${o.clientName}, tu pedido #${o.id} fue cancelado. Si fue un error, escríbenos y lo reactivamos.`,
};

export function buildStatusWhatsAppMessage(order: Order): string {
  return STATUS_MESSAGES[order.status](order);
}

export function buildRecoveryWhatsAppMessage(cart: AbandonedCartAPI): string {
  const name = cart.clientName ? ` ${cart.clientName}` : "";
  const products = cart.items
    .map((i) => `${i.quantity} x ${i.name}`)
    .join(", ");
  return `Hola${name}, vimos que dejaste tu pedido a medias en La Bodega Nocturna 23 (${products}) por ${money(
    cart.total
  )}. ¿Quieres que te lo despachemos ahora?`;
}
