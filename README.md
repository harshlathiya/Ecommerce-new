# Multi-tenant ecommerce (MERN monorepo)

One backend and shared packages power multiple isolated stores (`storeId` on documents + `x-store-id` header). Super admins manage stores globally; store admins manage a single tenant; customers shop with optional guest carts.

## Monorepo layout

```
apps/
  admin-dashboard/   # Vite + React — super admin + store admin (select store)
  storefront/        # Vite + React — theme from store branding
packages/
  api-client/        # Typed fetch wrapper
  ui/                # Shared primitives (Button, Input, Card, ThemeRoot)
  utils/             # Shared types + helpers (formatCurrency, slugify)
services/
  api/               # Express + Mongoose API
```

## Quick start

1. **MongoDB** — local or Docker:

   ```bash
   docker compose up -d mongo
   ```

2. **Environment** — copy `.env.example` to `services/api/.env` (or repo root) and set `JWT_SECRET`, `MONGODB_URI`.

3. **Install & seed**

   ```bash
   npm install
   npm run seed -w @ecom/api
   ```

   Default credentials (override with env in `.env.example`):

   - Super admin: `admin@example.com` / `ChangeMe123!`
   - Store admin: `store@example.com` / `ChangeMe123!`
   - Demo store slug: `demo-store`

4. **Run**

   ```bash
   npm run dev
   ```

   - API: http://localhost:4000  
   - Storefront: http://localhost:5173 (set `VITE_DEFAULT_STORE_SLUG=demo-store` or pick slug in UI)  
   - Admin: http://localhost:5174 — login as super admin, create/select store, add products  

   Vite proxies `/api` to the API in dev when `VITE_API_URL` is empty.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | API + storefront + admin |
| `npm run build` | Build all workspaces |
| `npm test` | Vitest (API health + utils) |
| `npm run test:e2e` | Playwright smoke (storefront) |
| `npm run lint` | ESLint |
| `npm run seed -w @ecom/api` | Seed super admin, demo store, products |

## API overview

- **Auth** — `POST /api/auth/signup|login`, `GET /api/auth/me`, password reset stubs  
- **Stores** — `GET/POST/DELETE /api/stores` (super admin); `GET /api/stores/by-slug/:slug`, `GET /api/stores/by-id/:id` (public)  
- **Tenant routes** (require `x-store-id` header): products, cart, orders, payments, reviews, coupons, wishlist, admin metrics, SEO helpers  
- **Webhooks** — `POST /api/webhooks/payments` (no tenant header; verify signatures in production)

## Security notes

- Use strong `JWT_SECRET`, HTTPS, and Stripe/Razorpay webhook signature verification in production.  
- Payment and email paths include stubs; wire real SDKs where marked in code.  
- Rate limiting is applied on auth routes; Helmet + `express-mongo-sanitize` are enabled.

## Docker

`docker compose up` builds the API image and runs API + MongoDB. Ensure `JWT_SECRET` is set for production.

## CI

GitHub Actions runs `npm ci`, `npm run build`, and `npm test` on push/PR.

---

### 1. System design (high level)

- **Multi-tenancy**: All tenant-owned data is scoped by `storeId`. `resolveTenant` validates the store exists; routes enforce admin vs customer rules via middleware.  
- **Auth**: JWT in `Authorization: Bearer`; roles `super_admin`, `store_admin`, `customer`.  
- **Checkout**: Guest carts use `guestToken`; merge into user cart on login. Orders snapshot line items and adjust inventory.

### 2. Database schema (collections)

- `stores` — name, slug, branding (logo, colors, domain)  
- `users` — email, password hash, role, optional `storeId`  
- `products` — store-scoped, variants, SEO, inventory  
- `carts` — `userId` or `guestToken` + line items  
- `orders` — status machine, totals, shipping address, invoice number  
- `reviews`, `coupons`, `wishlists` — all store-scoped  

### 3. Deployment (outline)

1. Provision MongoDB (Atlas or managed).  
2. Set env vars on API service.  
3. Run `npm run build` and deploy `services/api/dist` with `node dist/index.js`.  
4. Deploy static assets from `apps/storefront/dist` and `apps/admin-dashboard/dist` behind CDN; set `VITE_API_URL` at build time to public API URL.  
5. Configure CORS `CORS_ORIGIN` to storefront/admin origins.

### 4. Testing plan

- **Unit**: Vitest for utils + API app smoke (`GET /api/health`).  
- **Integration**: Extend with supertest + test MongoDB for auth and tenant CRUD.  
- **E2E**: Playwright storefront smoke; expand with seeded data + API up.

### 5. Performance

- Add Redis for session/rate-limit backing; cache product lists per store.  
- CDN for images; lazy-load images on storefront.  
- Mongo indexes on `storeId`, order dates, product slug per store.

### 6. Checklist

- [x] Monorepo with API, storefront, admin, shared packages  
- [x] Tenant isolation middleware + `storeId` on models  
- [x] JWT auth + roles + guest cart + merge  
- [x] Products, cart, orders, payments (stub), reviews, coupons, wishlist  
- [x] Admin metrics, SEO sitemap + product JSON-LD endpoint  
- [x] Docker Compose, CI, seed script  
- [ ] Production Stripe/Razorpay SDK + webhook signatures  
- [ ] Transactional email provider  
- [ ] CSRF strategy if using cookie-based auth cross-site  
