# Devotional Store

Premium mobile-first e-commerce platform for devotional products, puja items, gemstones, and astrology services.

Built as a real, maintainable, secure full-stack application (not a visual prototype).

## Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS (mobile-first, PWA-ready) |
| Database | PostgreSQL + Prisma ORM |
| Auth | Auth.js (NextAuth v5) |
| Validation | Zod |
| Payments | Abstraction layer (mock sandbox → Razorpay-ready) |
| Astrology | Interface + stub engine (Swiss Ephemeris-ready) |

## Features Implemented

### Catalogue
- Realistic, database-driven product catalogue across 11 categories
- Admin-managed photos, prices, stock, certificates (disclosure only)
- No invented lab numbers or medical claims



### Storefront
- Homepage with featured products & categories
- Product listing, filters, search
- Product detail with stock & certificate info
- Shopping cart with **server-side** price calculation
- **5-item transportation savings** system
- Checkout + mock payment flow
- Order confirmation

### Customer
- Registration & login
- Account dashboard
- Address book (with ownership protection)
- Order history (own orders only)

### Admin
- Secure admin login (role-based)
- Dashboard metrics
- Product create / edit
- Category overview
- Bundle offer configuration

### Astrology
- Kundli birth-details form
- Calculation service interface (honest stub — no fake data)
- Gemstone recommendation rule engine
- Mapping to real catalog products
- Clear disclaimers throughout

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL (local Docker, Neon, or Supabase free tier)

### Setup

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and AUTH_SECRET (openssl rand -base64 32)

npm run db:push
npm run db:seed
npm run dev

# Minimal regression tests (no DB required)
npm test
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin
- Email: `admin@devotionalstore.com`
- Password: `Admin@12345` (**LOCAL DEVELOPMENT SEED ONLY — never use in production**)

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [Security](docs/SECURITY.md)
- [Testing](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)

## Development Phases (All Complete)

- [x] **Phase 1** — Project setup & architecture
- [x] **Phase 2** — Database models, migrations & seed data
- [x] **Phase 3** — Public storefront
- [x] **Phase 4** — Admin dashboard, auth, product CRUD
- [x] **Phase 5** — 5-item / Bundle savings (server-side)
- [x] **Phase 6** — Customer accounts
- [x] **Phase 7** — Payment abstraction & checkout
- [x] **Phase 8** — Astrology foundation
- [x] **Phase 9** — Gemstone prediction engine
- [x] **Phase 10** — Security review & documentation
- [x] **Phase 11** — Business MVP completion (catalogue, pages, disclosures)
- [x] **Phase 12** — Final MVP validation (freeze feature set)

## Important Notes

- **Zero-cost MVP**: Uses free open-source tools and free tiers only.
- **No fake data**: Astrology does not invent planetary positions. Certificates are not fabricated.
- **Server authority**: Prices, discounts, stock, and payment status are always verified on the server.
- **Mobile-first**: Designed for phones, tablets, and desktops; PWA-ready.

## Before Production

See [docs/SECURITY.md](docs/SECURITY.md) and [docs/TESTING.md](docs/TESTING.md) for the full launch checklist.

Key items:
1. Strong secrets
2. Real payment gateway
3. Rate limiting
4. Privacy / Terms pages content review
5. Database backups

## License

Private — All rights reserved.


## MVP status (Phase 12)

Feature set is **frozen** after Phase 12 closure.

- Staging / demonstration MVP with security hardening
- **Not** production-ready for real payments
- Kundli calculation engine remains under development
- Seed product images are development placeholders

See `docs/SECURITY.md` and `docs/TESTING.md`.
