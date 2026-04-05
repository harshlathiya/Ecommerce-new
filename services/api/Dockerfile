FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY packages/utils ./packages/utils
COPY packages/api-client ./packages/api-client
COPY packages/ui ./packages/ui
COPY apps/storefront/package.json ./apps/storefront/package.json
COPY apps/admin-dashboard/package.json ./apps/admin-dashboard/package.json
COPY services/api ./services/api

RUN npm install --workspace=@ecom/utils --workspace=@ecom/api

RUN npm run build -w @ecom/utils && npm run build -w @ecom/api

ENV NODE_ENV=production
EXPOSE 4000
WORKDIR /app/services/api
CMD ["node", "dist/index.js"]
