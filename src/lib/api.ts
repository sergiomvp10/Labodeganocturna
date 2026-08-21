const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://labodega-nocturna-backend.fly.dev";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lbn_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error de red" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string; role: string } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ username, password }) }
    ),

  getUsers: () =>
    request<{ id: number; username: string; role: string; createdAt: string }[]>("/api/auth/users"),

  createUser: (username: string, password: string, role: string) =>
    request<{ id: number; username: string; role: string; createdAt: string }>(
      "/api/auth/users",
      { method: "POST", body: JSON.stringify({ username, password, role }) }
    ),

  updateUser: (id: number, data: { username?: string; password?: string; role?: string }) =>
    request<{ ok: boolean }>(`/api/auth/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteUser: (id: number) =>
    request<{ ok: boolean }>(`/api/auth/users/${id}`, { method: "DELETE" }),

  getProducts: () =>
    request<ProductAPI[]>("/api/products/lite"),

  getProduct: (id: number) =>
    request<ProductAPI>(`/api/products/${id}`),

  createProduct: (p: ProductAPI) =>
    request<{ id: number; ok: boolean }>("/api/products", {
      method: "POST",
      body: JSON.stringify(p),
    }),

  updateProduct: (id: number, p: Partial<ProductAPI>) =>
    request<{ ok: boolean }>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(p),
    }),

  deleteProduct: (id: number) =>
    request<{ ok: boolean }>(`/api/products/${id}`, { method: "DELETE" }),

  getOrders: () =>
    request<OrderAPI[]>("/api/orders"),

  createOrder: (o: OrderCreateAPI) =>
    request<{ id: string; ok: boolean }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(o),
    }),

  updateOrderStatus: (id: string, status: string) =>
    request<{ ok: boolean }>(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  deleteOrder: (id: string) =>
    request<{ ok: boolean }>(`/api/orders/${id}`, { method: "DELETE" }),

  getBanners: () =>
    request<BannerAPI[]>("/api/banners"),

  createBanner: (image: string, active: boolean, order: number) =>
    request<{ id: number; ok: boolean }>("/api/banners", {
      method: "POST",
      body: JSON.stringify({ image, active, order }),
    }),

  updateBanner: (id: number, data: { image?: string; active?: boolean; order?: number }) =>
    request<{ ok: boolean }>(`/api/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteBanner: (id: number) =>
    request<{ ok: boolean }>(`/api/banners/${id}`, { method: "DELETE" }),

  getFooter: () =>
    request<FooterAPI>("/api/config/footer"),

  updateFooter: (f: FooterAPI) =>
    request<{ ok: boolean }>("/api/config/footer", {
      method: "PUT",
      body: JSON.stringify(f),
    }),

  getFeaturedIds: () =>
    request<number[]>("/api/config/featured"),

  setFeaturedIds: (ids: number[]) =>
    request<{ ok: boolean }>("/api/config/featured", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    }),

  getOfferIds: () =>
    request<number[]>("/api/config/offers"),

  setOfferIds: (ids: number[]) =>
    request<{ ok: boolean }>("/api/config/offers", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    }),

  getCartSuggestionIds: () =>
    request<number[]>("/api/config/cart-suggestions"),

  setCartSuggestionIds: (ids: number[]) =>
    request<{ ok: boolean }>("/api/config/cart-suggestions", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    }),

  getCategories: () =>
    request<CategoryAPI[]>("/api/categories"),

  createCategory: (data: { name: string; slug: string; subcategories: string[]; image: string }) =>
    request<{ id: number; ok: boolean }>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id: number, data: Partial<CategoryAPI>) =>
    request<{ ok: boolean }>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: number) =>
    request<{ ok: boolean }>(`/api/categories/${id}`, { method: "DELETE" }),

  getCoupons: () =>
    request<CouponAPI[]>("/api/config/coupons"),

  setCoupons: (coupons: CouponAPI[]) =>
    request<{ ok: boolean }>("/api/config/coupons", {
      method: "PUT",
      body: JSON.stringify({ coupons }),
    }),

  storefront: {
    products: () => request<ProductAPI[]>("/api/storefront/products"),
    featured: () => request<ProductAPI[]>("/api/storefront/featured"),
    offers: () => request<ProductAPI[]>("/api/storefront/offers"),
    cartSuggestions: () => request<ProductAPI[]>("/api/storefront/cart-suggestions"),
    banners: () => request<BannerAPI[]>("/api/storefront/banners"),
    footer: () => request<FooterAPI>("/api/storefront/footer"),
    categories: () => request<CategoryAPI[]>("/api/storefront/categories"),
    validateCoupon: (code: string) =>
      request<{ valid: boolean; discount: number; code: string }>("/api/storefront/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
  },
};

export interface ProductAPI {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating: number;
  reviews: number;
  volume: string;
  brand: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  discount?: string | null;
}

export interface OrderItemAPI {
  productId?: number | null;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderAPI {
  id: string;
  clientName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  status: string;
  notes: string;
  createdAt: string;
  items: OrderItemAPI[];
}

export interface OrderCreateAPI {
  clientName: string;
  phone: string;
  city: string;
  address: string;
  items: OrderItemAPI[];
  paymentMethod: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  notes: string;
}

export interface BannerAPI {
  id: number;
  image: string;
  active: boolean;
  order: number;
}

export interface FooterAPI {
  cities: string[];
  schedule: string;
  scheduleSub: string;
  whatsapp: string;
  description: string;
}

export interface CategoryAPI {
  id: number;
  name: string;
  slug: string;
  subcategories: string[];
  image: string;
}

export interface CouponAPI {
  code: string;
  discount: number;
  active: boolean;
}
