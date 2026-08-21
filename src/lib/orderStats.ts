import { Order } from "@/context/SiteConfigContext";

const BOGOTA_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * El backend guarda created_at con datetime('now'), es decir UTC y sin sufijo
 * de zona, formato "YYYY-MM-DD HH:MM:SS". Sin normalizarlo, los navegadores lo
 * interpretan como hora local (o como fecha invalida, en Safari).
 */
export function parseOrderDate(value: string): Date {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const withZone = /(Z|[+-]\d{2}:?\d{2})$/.test(normalized)
    ? normalized
    : `${normalized}Z`;
  return new Date(withZone);
}

/** Fecha del pedido en hora de Colombia, como YYYY-MM-DD. */
export function bogotaDayKey(date: Date): string {
  return new Date(date.getTime() - BOGOTA_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

/** Hora del dia (0-23) en hora de Colombia. */
export function bogotaHour(date: Date): number {
  return new Date(date.getTime() - BOGOTA_OFFSET_MS).getUTCHours();
}

export type RangeKey = "today" | "week" | "month" | "all";

export const RANGE_DAYS: Record<Exclude<RangeKey, "all">, number> = {
  today: 1,
  week: 7,
  month: 30,
};

export interface Ranked {
  label: string;
  quantity: number;
  revenue: number;
}

export interface DayPoint {
  day: string;
  revenue: number;
  orders: number;
}

export interface OrderStats {
  orders: number;
  revenue: number;
  averageTicket: number;
  units: number;
  delivered: number;
  cancelled: number;
  pending: number;
  freeShipping: number;
  discountGiven: number;
  topProducts: Ranked[];
  byCity: Ranked[];
  byHour: { hour: number; orders: number }[];
  byDay: DayPoint[];
}

function rank(map: Map<string, Ranked>): Ranked[] {
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export function filterByRange(orders: Order[], range: RangeKey): Order[] {
  if (range === "all") return orders;
  const today = bogotaDayKey(new Date());
  const from = bogotaDayKey(
    new Date(Date.now() - (RANGE_DAYS[range] - 1) * 86400000)
  );
  return orders.filter((o) => {
    const day = bogotaDayKey(parseOrderDate(o.createdAt));
    return day >= from && day <= today;
  });
}

export function computeStats(orders: Order[]): OrderStats {
  const valid = orders.filter((o) => o.status !== "cancelled");
  const products = new Map<string, Ranked>();
  const cities = new Map<string, Ranked>();
  const hours = new Map<number, number>();
  const days = new Map<string, DayPoint>();

  let revenue = 0;
  let units = 0;
  let freeShipping = 0;
  let discountGiven = 0;

  for (const order of valid) {
    revenue += order.total;
    discountGiven += order.discount;
    if (order.shipping === 0) freeShipping += 1;

    for (const item of order.items) {
      units += item.quantity;
      const current = products.get(item.name) ?? {
        label: item.name,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += item.quantity;
      current.revenue += item.price * item.quantity;
      products.set(item.name, current);
    }

    const city = cities.get(order.city) ?? {
      label: order.city,
      quantity: 0,
      revenue: 0,
    };
    city.quantity += 1;
    city.revenue += order.total;
    cities.set(order.city, city);

    const date = parseOrderDate(order.createdAt);
    const hour = bogotaHour(date);
    hours.set(hour, (hours.get(hour) ?? 0) + 1);

    const dayKey = bogotaDayKey(date);
    const day = days.get(dayKey) ?? { day: dayKey, revenue: 0, orders: 0 };
    day.revenue += order.total;
    day.orders += 1;
    days.set(dayKey, day);
  }

  return {
    orders: valid.length,
    revenue,
    averageTicket: valid.length ? revenue / valid.length : 0,
    units,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    pending: orders.filter((o) => o.status === "pending").length,
    freeShipping,
    discountGiven,
    topProducts: rank(products),
    byCity: rank(cities),
    byHour: [...hours.entries()]
      .map(([hour, count]) => ({ hour, orders: count }))
      .sort((a, b) => a.hour - b.hour),
    byDay: [...days.values()].sort((a, b) => a.day.localeCompare(b.day)),
  };
}
