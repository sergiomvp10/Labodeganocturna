"use client";

import { useEffect, useMemo, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import {
  computeStats,
  filterByRange,
  RangeKey,
  Ranked,
} from "@/lib/orderStats";
import {
  TrendingUp,
  ShoppingCart,
  Receipt,
  Truck,
  Package,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";

const RANGE_LABELS: Record<RangeKey, string> = {
  today: "Hoy",
  week: "7 días",
  month: "30 días",
  all: "Todo",
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const formatDay = (day: string) => {
  const [, month, date] = day.split("-");
  return `${date}/${month}`;
};

export default function EstadisticasPage() {
  const { orders, refreshOrders } = useSiteConfig();
  const [range, setRange] = useState<RangeKey>("week");

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(refreshOrders, 60000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const stats = useMemo(
    () => computeStats(filterByRange(orders, range)),
    [orders, range]
  );

  const maxDayRevenue = Math.max(1, ...stats.byDay.map((d) => d.revenue));
  const maxHourOrders = Math.max(1, ...stats.byHour.map((h) => h.orders));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              range === key
                ? "bg-[#c9a84c]/20 text-[#c9a84c] ring-1 ring-[#c9a84c]/40"
                : "bg-[#1a1a1a] text-[#888] hover:text-white"
            }`}
          >
            {RANGE_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={<TrendingUp size={16} />}
          label="Ventas"
          value={formatPrice(stats.revenue)}
        />
        <MetricCard
          icon={<ShoppingCart size={16} />}
          label="Pedidos"
          value={String(stats.orders)}
          hint={`${stats.units} unidades`}
        />
        <MetricCard
          icon={<Receipt size={16} />}
          label="Ticket promedio"
          value={formatPrice(stats.averageTicket)}
        />
        <MetricCard
          icon={<Truck size={16} />}
          label="Envíos gratis"
          value={String(stats.freeShipping)}
          hint={
            stats.orders
              ? `${Math.round((stats.freeShipping / stats.orders) * 100)}% de los pedidos`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Entregados" value={String(stats.delivered)} />
        <MetricCard label="Pendientes" value={String(stats.pending)} />
        <MetricCard label="Cancelados" value={String(stats.cancelled)} />
        <MetricCard
          icon={<Ticket size={16} />}
          label="Descuentos dados"
          value={formatPrice(stats.discountGiven)}
        />
      </div>

      <Panel title="Ventas por día" icon={<TrendingUp size={14} />}>
        {stats.byDay.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">
            {stats.byDay.map((d) => (
              <div key={d.day} className="flex items-center gap-3 text-sm">
                <span className="text-[#888] w-12 shrink-0">{formatDay(d.day)}</span>
                <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9a84c] rounded-full"
                    style={{ width: `${(d.revenue / maxDayRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-[#c9a84c] w-24 text-right shrink-0">
                  {formatPrice(d.revenue)}
                </span>
                <span className="text-[#666] w-16 text-right shrink-0">
                  {d.orders} ped.
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Productos más vendidos" icon={<Package size={14} />}>
          {stats.topProducts.length === 0 ? (
            <Empty />
          ) : (
            <RankedList items={stats.topProducts.slice(0, 10)} unit="uds" />
          )}
        </Panel>

        <Panel title="Pedidos por ciudad" icon={<MapPin size={14} />}>
          {stats.byCity.length === 0 ? (
            <Empty />
          ) : (
            <RankedList items={stats.byCity} unit="ped." />
          )}
        </Panel>
      </div>

      <Panel title="Horas con más pedidos" icon={<Clock size={14} />}>
        {stats.byHour.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-2">
            {stats.byHour.map((h) => (
              <div key={h.hour} className="flex items-center gap-3 text-sm">
                <span className="text-[#888] w-14 shrink-0">
                  {String(h.hour).padStart(2, "0")}:00
                </span>
                <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9a84c]/70 rounded-full"
                    style={{ width: `${(h.orders / maxHourOrders) * 100}%` }}
                  />
                </div>
                <span className="text-[#aaa] w-16 text-right shrink-0">
                  {h.orders} ped.
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#888] text-xs uppercase tracking-wider mb-2">
        {icon}
        {label}
      </div>
      <div className="text-white text-xl font-bold">{value}</div>
      {hint && <div className="text-[#666] text-xs mt-1">{hint}</div>}
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4">
      <h2 className="flex items-center gap-2 text-[#c9a84c] text-xs uppercase tracking-wider mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function RankedList({ items, unit }: { items: Ranked[]; unit: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3 text-sm">
          <span className="text-[#666] w-5 shrink-0">{i + 1}.</span>
          <span className="text-white flex-1 truncate">{item.label}</span>
          <span className="text-[#888] w-20 text-right shrink-0">
            {item.quantity} {unit}
          </span>
          <span className="text-[#c9a84c] w-24 text-right shrink-0">
            {formatPrice(item.revenue)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return <div className="text-[#666] text-sm py-6 text-center">Sin datos</div>;
}
