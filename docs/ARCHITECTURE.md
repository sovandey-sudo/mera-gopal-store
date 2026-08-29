# Architecture Document

## Overview

This is a full-stack Next.js application designed as a mobile-first Progressive Web App (PWA) for a devotional products + astrology marketplace.

## Design Principles

1. **Mobile-First & Responsive** — Works excellently on phones, tablets, MacBooks, and desktops.
2. **Database-Driven** — All products, prices, stock, and content come from the database.
3. **Server-Side Authority** — Prices, discounts, stock, and order totals are always calculated on the server.
4. **Security by Design** — Authentication, authorization, input validation, and file upload security from day one.
5. **Modular** — Astrology and Gemstone modules are isolated so they can be expanded later.
6. **Zero-Cost Start** — Uses free tiers and open-source tools exclusively for the MVP.

## Folder Structure

```
devotional-store/
├── prisma/                 # Database schema, migrations, seed
├── public/                 # Static assets + local image uploads
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Storefront routes (future grouping)
│   │   ├── (admin)/        # Admin routes (protected)
│   │   ├── api/            # API routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/             # Reusable primitives
│   │   ├── store/          # Customer-facing components
│   │   ├── admin/          # Admin components
│   │   └── astrology/      # Astrology UI components
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── validations/    # Zod schemas
│   │   ├── pricing/        # Server-side cart & discount logic
│   │   ├── storage/        # Image upload abstraction
│   │   └── astrology/      # Calculation interface + rules
│   ├── types/
│   ├── hooks/
│   └── middleware.ts
├── docs/                   # Documentation
├── tests/
├── .env.example
└── ...
```

## Technology Decisions

| Concern              | Choice                     | Rationale |
|----------------------|----------------------------|---------|
| Framework            | Next.js 15 App Router      | Full-stack, excellent DX, free Vercel hosting |
| Language             | TypeScript                 | Type safety, fewer bugs |
| Styling              | Tailwind CSS               | Mobile-first, fast development |
| Database             | PostgreSQL + Prisma        | Relational integrity, type-safe queries |
| Auth                 | Auth.js (NextAuth v5)      | Secure, free, Next.js native |
| Validation           | Zod                        | Runtime + compile-time safety |
| Image Storage        | Abstraction (local first)  | Zero-cost start, easy to switch later |
| Payments             | Abstraction layer          | Ready for Razorpay without hard-coding |
| Astrology            | Interface + Rule Engine    | Real calculations later, no fake data |

## Compatibility

- **Phones** (320px–430px): Optimized touch UI
- **Tablets** (768px–1024px): Adaptive layouts
- **Laptops / MacBooks** (1280px+): Desktop experience
- **PWA**: Installable on mobile home screen

## Next Steps (Phase 2)

- Define complete Prisma schema
- Create migrations
- Seed development data
- Set up Auth.js basics

---

## Phase Status (Complete)

All 10 planned phases have been implemented:

1. Project architecture & scaffolding
2. Full Prisma schema + seed
3. Public storefront
4. Admin dashboard + product management
5. Server-side bundle pricing engine
6. Customer accounts & addresses
7. Payment abstraction + checkout
8. Astrology calculation interface
9. Gemstone recommendation rule engine
10. Security documentation & hardening

The application is structured so future features (wishlist, reviews, real Swiss Ephemeris, Razorpay, image CDN, etc.) can be added without rebuilding the core.
