import type {
  Cart,
  Coupon,
  Order,
  Product,
  Review,
  Store,
  User,
} from "./types.js";

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | null;
  getStoreId?: () => string | null;
}

async function request<T>(
  path: string,
  options: ApiClientOptions,
  init?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  const token = options.getToken?.();
  if (token) headers.Authorization = `Bearer ${token}`;
  const storeId = options.getStoreId?.();
  if (storeId) headers["x-store-id"] = storeId;

  const res = await fetch(`${options.baseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
    data?: unknown;
  };
  if (!res.ok) {
    const msg =
      typeof data.error === "string"
        ? data.error
        : data.error
          ? JSON.stringify(data.error)
          : res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

export function createApiClient(opts: ApiClientOptions) {
  const base = opts;

  return {
    auth: {
      signup: (body: {
        email: string;
        password: string;
        role?: string;
        storeId?: string;
        firstName?: string;
        lastName?: string;
      }) =>
        request<{ success: boolean; data: { user: User; token: string } }>(
          "/api/auth/signup",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      login: (body: { email: string; password: string }) =>
        request<{ success: boolean; data: { user: User; token: string } }>(
          "/api/auth/login",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      me: () =>
        request<{ success: boolean; data: { user: User } }>(
          "/api/auth/me",
          base
        ),
      forgotPassword: (body: { email: string }) =>
        request<{ success: boolean; data: { message: string } }>(
          "/api/auth/forgot-password",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      resetPassword: (body: { token: string; password: string }) =>
        request<{ success: boolean; data: { message: string } }>(
          "/api/auth/reset-password",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
    },
    stores: {
      list: () =>
        request<{ success: boolean; data: { stores: Store[] } }>(
          "/api/stores",
          base
        ),
      create: (body: {
        name: string;
        slug?: string;
        branding?: Store["branding"];
      }) =>
        request<{ success: boolean; data: { store: Store } }>(
          "/api/stores",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      getBySlug: (slug: string) =>
        request<{ success: boolean; data: { store: Store } }>(
          `/api/stores/by-slug/${encodeURIComponent(slug)}`,
          base
        ),
      getById: (id: string) =>
        request<{ success: boolean; data: { store: Store } }>(
          `/api/stores/by-id/${encodeURIComponent(id)}`,
          base
        ),
      remove: (id: string) =>
        request<{ success: boolean; data: { ok: boolean } }>(
          `/api/stores/${id}`,
          base,
          { method: "DELETE" }
        ),
    },
    products: {
      list: (q?: string) =>
        request<{ success: boolean; data: { products: Product[] } }>(
          `/api/products${q ? `?${q}` : ""}`,
          base
        ),
      get: (id: string) =>
        request<{ success: boolean; data: { product: Product } }>(
          `/api/products/${id}`,
          base
        ),
      create: (body: Partial<Product>) =>
        request<{ success: boolean; data: { product: Product } }>(
          "/api/products",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      update: (id: string, body: Partial<Product>) =>
        request<{ success: boolean; data: { product: Product } }>(
          `/api/products/${id}`,
          base,
          { method: "PATCH", body: JSON.stringify(body) }
        ),
      remove: (id: string) =>
        request<{ success: boolean; data: { ok: boolean } }>(
          `/api/products/${id}`,
          base,
          { method: "DELETE" }
        ),
      bulk: (products: Partial<Product>[]) =>
        request<{ success: boolean; data: { created: number } }>(
          "/api/products/bulk",
          base,
          { method: "POST", body: JSON.stringify({ products }) }
        ),
    },
    cart: {
      get: (guestToken?: string) =>
        request<{
          success: boolean;
          data: { cart: Cart; guestToken?: string };
        }>(
          `/api/cart${guestToken ? `?guestToken=${encodeURIComponent(guestToken)}` : ""}`,
          base
        ),
      add: (body: {
        productId: string;
        quantity?: number;
        variantSku?: string;
        guestToken?: string;
      }) =>
        request<{ success: boolean; data: { cart: Cart; guestToken?: string } }>(
          "/api/cart/items",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      updateQty: (body: {
        productId: string;
        quantity: number;
        variantSku?: string;
        guestToken?: string;
      }) =>
        request<{ success: boolean; data: { cart: Cart } }>(
          "/api/cart/items",
          base,
          { method: "PATCH", body: JSON.stringify(body) }
        ),
      remove: (body: {
        productId: string;
        variantSku?: string;
        guestToken?: string;
      }) =>
        request<{ success: boolean; data: { cart: Cart } }>(
          "/api/cart/items",
          base,
          { method: "DELETE", body: JSON.stringify(body) }
        ),
      merge: (guestToken: string) =>
        request<{ success: boolean; data: { cart: Cart } }>(
          "/api/cart/merge",
          base,
          { method: "POST", body: JSON.stringify({ guestToken }) }
        ),
    },
    orders: {
      list: () =>
        request<{ success: boolean; data: { orders: Order[] } }>(
          "/api/orders",
          base
        ),
      create: (body: {
        shippingAddress: Order["shippingAddress"];
        guestEmail?: string;
        guestToken?: string;
        currency?: string;
      }) =>
        request<{ success: boolean; data: { order: Order } }>(
          "/api/orders",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      updateStatus: (id: string, status: Order["status"]) =>
        request<{ success: boolean; data: { order: Order } }>(
          `/api/orders/${id}/status`,
          base,
          { method: "PATCH", body: JSON.stringify({ status }) }
        ),
      getInvoice: (id: string) =>
        request<{
          success: boolean;
          data: {
            invoice: {
              number?: string;
              orderId: string;
              items: Order["items"];
              subtotal: number;
              shipping: number;
              tax: number;
              total: number;
              currency: string;
              shippingAddress: Order["shippingAddress"];
              status: Order["status"];
              createdAt?: string;
            };
          };
        }>(`/api/orders/${id}/invoice`, base),
    },
    payments: {
      createIntent: (body: { orderId: string; provider: "stripe" | "razorpay" }) =>
        request<{
          success: boolean;
          data: { clientSecret?: string; orderId: string; provider: string };
        }>("/api/payments/create-intent", base, {
          method: "POST",
          body: JSON.stringify(body),
        }),
      refund: (orderId: string) =>
        request<{ success: boolean; data: { message: string } }>(
          "/api/payments/refund",
          base,
          { method: "POST", body: JSON.stringify({ orderId }) }
        ),
    },
    seo: {
      sitemap: (baseUrl?: string) =>
        fetch(
          `${opts.baseUrl.replace(/\/$/, "")}/api/seo/sitemap.xml${baseUrl ? `?baseUrl=${encodeURIComponent(baseUrl)}` : ""}`,
          {
            headers: {
              ...(opts.getStoreId?.() ? { "x-store-id": opts.getStoreId()! } : {}),
            },
          }
        ).then((r) => r.text()),
      productSchema: (productId: string) =>
        request<{ success: boolean; data: { schema: Record<string, unknown> } }>(
          `/api/seo/product-schema/${encodeURIComponent(productId)}`,
          base
        ),
    },
    reviews: {
      list: (productId: string) =>
        request<{ success: boolean; data: { reviews: Review[] } }>(
          `/api/reviews?productId=${encodeURIComponent(productId)}`,
          base
        ),
      create: (body: {
        productId: string;
        rating: number;
        title?: string;
        body: string;
      }) =>
        request<{ success: boolean; data: { review: Review } }>(
          "/api/reviews",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
      moderate: (id: string, moderated: boolean) =>
        request<{ success: boolean; data: { review: Review } }>(
          `/api/reviews/${id}/moderate`,
          base,
          { method: "PATCH", body: JSON.stringify({ moderated }) }
        ),
    },
    admin: {
      metrics: () =>
        request<{
          success: boolean;
          data: {
            revenue: number;
            orderCount: number;
            topProducts: { productId: string; title: string; units: number }[];
          };
        }>("/api/admin/metrics", base),
    },
    coupons: {
      list: () =>
        request<{ success: boolean; data: { coupons: Coupon[] } }>(
          "/api/coupons",
          base
        ),
      create: (body: Partial<Coupon>) =>
        request<{ success: boolean; data: { coupon: Coupon } }>(
          "/api/coupons",
          base,
          { method: "POST", body: JSON.stringify(body) }
        ),
    },
    wishlist: {
      get: () =>
        request<{ success: boolean; data: { productIds: string[] } }>(
          "/api/wishlist",
          base
        ),
      toggle: (productId: string) =>
        request<{ success: boolean; data: { productIds: string[] } }>(
          "/api/wishlist/toggle",
          base,
          { method: "POST", body: JSON.stringify({ productId }) }
        ),
    },
  };
}
