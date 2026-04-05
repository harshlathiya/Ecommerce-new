import type { OrderStatus, UserRole } from "@ecom/utils";

export interface StoreBranding {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  domain?: string;
}

export interface Store {
  _id: string;
  name: string;
  slug: string;
  branding: StoreBranding;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  storeId?: string;
  firstName?: string;
  lastName?: string;
}

export interface ProductVariant {
  name: string;
  sku?: string;
  priceDelta?: number;
  inventory: number;
}

export interface Product {
  _id: string;
  storeId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPercent?: number;
  category: string;
  inventory: number;
  images: string[];
  variants: ProductVariant[];
  seo?: { title?: string; description?: string };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantSku?: string;
  quantity: number;
  title: string;
  unitPrice: number;
  image?: string;
}

export interface Cart {
  _id: string;
  storeId: string;
  userId?: string;
  guestToken?: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  storeId: string;
  userId?: string;
  guestEmail?: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  paymentProvider?: "stripe" | "razorpay";
  paymentIntentId?: string;
  invoiceNumber?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  storeId: string;
  productId: string;
  userId?: string;
  rating: number;
  title?: string;
  body: string;
  moderated: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  storeId: string;
  code: string;
  percentOff?: number;
  amountOff?: number;
  expiresAt?: string;
  active: boolean;
}
