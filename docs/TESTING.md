# Testing Guide — Devotional Store MVP

## Automated regression

```bash
npm test
# or: node tests/mvp-regression.mjs
```

Covers:
- Rate-limit algorithm
- Guest order token (create / verify / reject tamper / reject other order)
- Image magic-byte validation (JPEG/PNG accept; EXE/HTML reject)
- Mock provider gate logic
- Stock over-quantity reject (not clamp)
- Inventory concurrency (last unit)
- 5-item savings eligibility
- Guest synthetic email isolation
- Price integrity (server vs client)

Does **not** replace full browser E2E testing.

## Manual smoke tests

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and AUTH_SECRET
# PAYMENT_PROVIDER=mock
npm run db:push
npm run db:seed
npm run dev
```

### Storefront
1. Homepage, categories, product detail, cart
2. Search active products only
3. Kundli form shows engine under development
4. Gemstone rules → real products

### Checkout & security
1. Guest checkout with new email → order + accessToken
2. Guest checkout using an existing customer's email → still guest order (not attached to that account)
3. Request qty > stock → HTTP 409, no order
4. Mixed cart with one over-stock line → entire checkout rejected
5. Mock payment without token → 403
6. Mock payment with valid token → success
7. Customer A cannot open Customer B order URL

### Admin
1. Admin login (dev seed only)
2. Product edit + image upload
3. Order status change
4. Non-admin cannot call admin APIs

## Build verification

```bash
npm run lint
npm run build
```

## Known MVP limitations
- Rate limiting is in-memory (not multi-instance)
- Product seed images are SVG placeholders
- Legal pages are drafts
- Real payment gateway not connected
- Full browser E2E suite not included
