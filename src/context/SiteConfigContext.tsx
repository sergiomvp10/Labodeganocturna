"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api, BannerAPI, FooterAPI, OrderAPI } from "@/lib/api";

export interface BannerItem {
  id: string;
  image: string;
  active: boolean;
  order: number;
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItem[];
  paymentMethod: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  createdAt: string;
  notes: string;
}

export interface FooterConfig {
  cities: string[];
  schedule: string;
  scheduleSub: string;
  whatsapp: string;
  description: string;
}

const STATUS_FROM_API: Record<string, Order["status"]> = {
  pendiente: "pending",
  confirmado: "confirmed",
  preparando: "preparing",
  entregado: "delivered",
  cancelado: "cancelled",
};

const STATUS_TO_API: Record<Order["status"], string> = {
  pending: "pendiente",
  confirmed: "confirmado",
  preparing: "preparando",
  delivered: "entregado",
  cancelled: "cancelado",
};

function toOrder(o: OrderAPI): Order {
  return {
    ...o,
    subtotal: o.subtotal ?? 0,
    discount: o.discount ?? 0,
    shipping: o.shipping ?? 0,
    status: STATUS_FROM_API[o.status] ?? (o.status as Order["status"]),
    items: o.items.map((i) => ({ productId: i.productId || 0, name: i.name, quantity: i.quantity, price: i.price })),
  };
}

interface SiteConfigContextType {
  banners: BannerItem[];
  setBanners: (b: BannerItem[]) => void;
  refreshBanners: () => Promise<void>;
  orders: Order[];
  setOrders: (o: Order[]) => void;
  refreshOrders: () => Promise<void>;
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;
  footerConfig: FooterConfig;
  setFooterConfig: (f: FooterConfig) => void;
  refreshFooter: () => Promise<void>;
  featuredIds: number[];
  setFeaturedIds: (ids: number[]) => void;
  offerIds: number[];
  setOfferIds: (ids: number[]) => void;
  cartSuggestionIds: number[];
  setCartSuggestionIds: (ids: number[]) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const DEFAULT_FOOTER: FooterConfig = {
  cities: ["Duitama", "Tunja", "Sogamoso"],
  schedule: "Abierto 23 horas al día",
  scheduleSub: "Todos los días del año",
  whatsapp: "+57 311 226 0769",
  description: "Tu licorería de confianza con servicio a domicilio 23 horas al día.",
};

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [banners, setBannersState] = useState<BannerItem[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [footerConfig, setFooterConfigState] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [featuredIds, setFeaturedIdsState] = useState<number[]>([]);
  const [offerIds, setOfferIdsState] = useState<number[]>([]);
  const [cartSuggestionIds, setCartSuggestionIdsState] = useState<number[]>([]);

  const refreshBanners = useCallback(async () => {
    try {
      const data = await api.getBanners();
      setBannersState(data.map((b: BannerAPI) => ({ id: String(b.id), image: b.image, active: b.active, order: b.order })));
    } catch {}
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const data = await api.getOrders();
      setOrdersState(data.map(toOrder));
    } catch {}
  }, []);

  const refreshFooter = useCallback(async () => {
    try {
      const data = await api.getFooter();
      setFooterConfigState(data);
    } catch {}
  }, []);

  useEffect(() => {
    async function loadAll() {
      try {
        const [bannersData, ordersData, footerData, featuredData, offersData, suggestionsData] = await Promise.all([
          api.storefront.banners(),
          api.getOrders().catch(() => [] as OrderAPI[]),
          api.storefront.footer(),
          api.getFeaturedIds(),
          api.getOfferIds(),
          api.getCartSuggestionIds().catch(() => [] as number[]),
        ]);
        setBannersState(bannersData.map((b: BannerAPI) => ({ id: String(b.id), image: b.image, active: b.active, order: b.order })));
        setOrdersState(ordersData.map(toOrder));
        setFooterConfigState(footerData as FooterConfig);
        setFeaturedIdsState(featuredData);
        setOfferIdsState(offersData);
        setCartSuggestionIdsState(suggestionsData);
      } catch {}
    }
    loadAll();
  }, []);

  const setBanners = (b: BannerItem[]) => {
    setBannersState(b);
  };

  const setOrders = (o: Order[]) => {
    setOrdersState(o);
  };

  const addOrder = (o: Order) => {
    const updated = [o, ...orders];
    setOrders(updated);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    api.updateOrderStatus(id, STATUS_TO_API[status]).catch(() => {});
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
  };

  const deleteOrder = (id: string) => {
    api.deleteOrder(id).catch(() => {});
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
  };

  const setFooterConfig = (f: FooterConfig) => {
    setFooterConfigState(f);
    api.updateFooter(f as FooterAPI).catch(() => {});
  };

  const setFeaturedIds = (ids: number[]) => {
    setFeaturedIdsState(ids);
    api.setFeaturedIds(ids).catch(() => {});
  };

  const setOfferIds = (ids: number[]) => {
    setOfferIdsState(ids);
    api.setOfferIds(ids).catch(() => {});
  };

  const setCartSuggestionIds = (ids: number[]) => {
    setCartSuggestionIdsState(ids);
    api.setCartSuggestionIds(ids).catch(() => {});
  };

  return (
    <SiteConfigContext.Provider
      value={{
        banners,
        setBanners,
        refreshBanners,
        orders,
        setOrders,
        refreshOrders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        footerConfig,
        setFooterConfig,
        refreshFooter,
        featuredIds,
        setFeaturedIds,
        offerIds,
        setOfferIds,
        cartSuggestionIds,
        setCartSuggestionIds,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error("useSiteConfig must be used within SiteConfigProvider");
  return context;
}
