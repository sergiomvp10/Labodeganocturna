"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface SiteConfigContextType {
  banners: BannerItem[];
  setBanners: (b: BannerItem[]) => void;
  orders: Order[];
  setOrders: (o: Order[]) => void;
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  footerConfig: FooterConfig;
  setFooterConfig: (f: FooterConfig) => void;
  featuredIds: number[];
  setFeaturedIds: (ids: number[]) => void;
  offerIds: number[];
  setOfferIds: (ids: number[]) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const DEFAULT_FOOTER: FooterConfig = {
  cities: ["Duitama", "Tunja", "Sogamoso"],
  schedule: "Abierto 23 horas al día",
  scheduleSub: "Todos los días del año",
  whatsapp: "+57 300 000 0000",
  description: "Tu licorería de confianza con servicio a domicilio 23 horas al día.",
};

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=500&fit=crop",
    active: true,
    order: 0,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1200&h=500&fit=crop",
    active: true,
    order: 1,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&h=500&fit=crop",
    active: true,
    order: 2,
  },
];

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-001",
    clientName: "Carlos Rodríguez",
    phone: "+57 310 555 1234",
    city: "Duitama",
    address: "Cra 15 #20-45, Barrio Centro",
    items: [
      { productId: 2, name: "Whisky Buchanan's 12 Años", quantity: 1, price: 130000 },
      { productId: 17, name: "Coca-Cola 1.5L", quantity: 2, price: 5500 },
    ],
    paymentMethod: "Efectivo",
    total: 141000,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    notes: "",
  },
  {
    id: "ORD-002",
    clientName: "María García",
    phone: "+57 320 888 5678",
    city: "Tunja",
    address: "Calle 19 #10-32, Centro Histórico",
    items: [
      { productId: 8, name: "Ron Medellín 8 Años", quantity: 2, price: 52000 },
      { productId: 20, name: "Papas Margarita Natural", quantity: 3, price: 5000 },
    ],
    paymentMethod: "Nequi",
    total: 119000,
    status: "confirmed",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    notes: "Llamar antes de llegar",
  },
  {
    id: "ORD-003",
    clientName: "Andrés Martínez",
    phone: "+57 315 222 9012",
    city: "Sogamoso",
    address: "Cra 11 #15-78, Barrio Santa Ana",
    items: [
      { productId: 11, name: "Champagne Moët & Chandon", quantity: 1, price: 180000 },
      { productId: 15, name: "Crema de Whisky Baileys", quantity: 1, price: 62000 },
    ],
    paymentMethod: "Daviplata",
    total: 242000,
    status: "delivered",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: "",
  },
];

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [banners, setBannersState] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [footerConfig, setFooterConfigState] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [featuredIds, setFeaturedIdsState] = useState<number[]>([]);
  const [offerIds, setOfferIdsState] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedBanners = localStorage.getItem("lbn_banners");
    const storedOrders = localStorage.getItem("lbn_orders");
    const storedFooter = localStorage.getItem("lbn_footer");
    const storedFeatured = localStorage.getItem("lbn_featured_ids");
    const storedOffers = localStorage.getItem("lbn_offer_ids");

    if (storedBanners) setBannersState(JSON.parse(storedBanners));
    if (storedOrders) setOrdersState(JSON.parse(storedOrders));
    else {
      setOrdersState(SAMPLE_ORDERS);
      localStorage.setItem("lbn_orders", JSON.stringify(SAMPLE_ORDERS));
    }
    if (storedFooter) setFooterConfigState(JSON.parse(storedFooter));
    if (storedFeatured) setFeaturedIdsState(JSON.parse(storedFeatured));
    if (storedOffers) setOfferIdsState(JSON.parse(storedOffers));
    setLoaded(true);
  }, []);

  const setBanners = (b: BannerItem[]) => {
    setBannersState(b);
    localStorage.setItem("lbn_banners", JSON.stringify(b));
  };

  const setOrders = (o: Order[]) => {
    setOrdersState(o);
    localStorage.setItem("lbn_orders", JSON.stringify(o));
  };

  const addOrder = (o: Order) => {
    const updated = [o, ...orders];
    setOrders(updated);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
  };

  const setFooterConfig = (f: FooterConfig) => {
    setFooterConfigState(f);
    localStorage.setItem("lbn_footer", JSON.stringify(f));
  };

  const setFeaturedIds = (ids: number[]) => {
    setFeaturedIdsState(ids);
    localStorage.setItem("lbn_featured_ids", JSON.stringify(ids));
  };

  const setOfferIds = (ids: number[]) => {
    setOfferIdsState(ids);
    localStorage.setItem("lbn_offer_ids", JSON.stringify(ids));
  };

  if (!loaded) return null;

  return (
    <SiteConfigContext.Provider
      value={{
        banners,
        setBanners,
        orders,
        setOrders,
        addOrder,
        updateOrderStatus,
        footerConfig,
        setFooterConfig,
        featuredIds,
        setFeaturedIds,
        offerIds,
        setOfferIds,
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
