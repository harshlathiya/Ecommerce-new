import { useEffect, useState } from "react";
import type { Store } from "@ecom/api-client";
import { getClient } from "./api.js";

function isObjectId(s: string): boolean {
  return /^[a-f\d]{24}$/i.test(s);
}

export function useStoreTheme() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("ecom_store_id");
    const slug =
      import.meta.env.VITE_DEFAULT_STORE_SLUG ||
      localStorage.getItem("ecom_store_slug");

    async function run() {
      try {
        const client = getClient();
        if (id && isObjectId(id)) {
          const res = await client.stores.getById(id);
          setStore(res.data.store);
          localStorage.setItem("ecom_store_slug", res.data.store.slug);
          return;
        }
        if (slug) {
          const res = await client.stores.getBySlug(slug);
          setStore(res.data.store);
          localStorage.setItem("ecom_store_id", res.data.store._id);
          localStorage.setItem("ecom_store_slug", res.data.store.slug);
        }
      } catch {
        setStore(null);
      } finally {
        setLoading(false);
      }
    }
    void run();
  }, []);

  return { store, loading };
}
