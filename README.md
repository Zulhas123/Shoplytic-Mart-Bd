# Shoplytic

Simple Commerce. Fast Shopping. Clean Experience.

Minimal e-commerce app built with **Next.js (App Router)** + **Prisma** + **PostgreSQL**, organized using a Clean Architecture style:

- `src/domain`: entities + repository interfaces
- `src/application`: use-cases (business workflows)
- `src/infrastructure`: Prisma + API wiring
- `src/presentation`: UI components, hooks, client state

## Features (MVP)

- Auth: register, login, logout (JWT in HttpOnly cookie)
- Users: profile update (name/address)
- Products: list, details, search, category filter
- Cart: add/remove/update quantity (Zustand + localStorage)
- Checkout: shipping form + place order
- Orders: order history + details
- Admin (minimal): products CRUD, users list, orders list, categories create/list
- Protected routes for user/admin (middleware + API enforcement)

## Prerequisites

- Node.js (tested with Node 24)
- PostgreSQL (recommended via Docker)

## Setup

1) Install dependencies

```bash
npm install --cache ./.npm-cache
```

2) Configure environment

Copy `.env.example` → `.env` (a default `.env` is included for local dev).

3) Start PostgreSQL

```bash
docker compose up -d
```

4) Run migrations

```bash
npm run prisma:migrate
```

5) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- The **first registered user becomes `ADMIN`** (for easy local setup).
- `JWT_SECRET` must be set (and should be long/random in production).

