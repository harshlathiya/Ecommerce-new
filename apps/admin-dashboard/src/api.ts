import { createApiClient } from "@ecom/api-client";

const baseUrl = import.meta.env.VITE_API_URL || "";

export function getClient() {
  return createApiClient({
    baseUrl,
    getToken: () => localStorage.getItem("ecom_admin_token"),
    getStoreId: () => localStorage.getItem("ecom_admin_store_id"),
  });
}
