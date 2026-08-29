# Security Document — Devotional Store

**Last updated:** Phase 12 Final MVP Closure  
**Status:** Hardened staging MVP. Not a claim of complete production security.

---

## Implemented Controls

### Authentication
- Credentials login via Auth.js (NextAuth v5)
- Passwords hashed with bcrypt (cost 12)
- JWT sessions with role in token
- Separate admin login path
- Registration forces role `CUSTOMER`
- Inactive users cannot log in

### Authorization
- Middleware protects `/admin/*` (ADMIN / SUPER_ADMIN)
- Middleware protects `/account/*` (authenticated)
- Admin product/order APIs check role server-side
- Customer orders filtered by `customerId`
- Address delete verifies ownership
- Order confirmation requires owner session **or** signed guest token

### Guest checkout
- Guests are **not** linked to existing accounts by email
- Ephemeral user created with synthetic `guest+{token}@guest.local`
- Contact email stored on shipping snapshot only
- Order access via signed guest token

### Order access (anti-IDOR)
- Authenticated users: `order.customerId === session.user.id`
- Guests: HMAC-SHA256 token (`src/lib/security/order-token.ts`), 7-day TTL, order-bound
- Unauthorized access → 404 / login redirect (no order data leakage)

### Pricing & inventory
- All prices and discounts calculated on the server (`calculateCart`)
- Client prices/totals are never trusted
- Stock reserved with conditional `updateMany` (`stockQuantity: { gte: qty }`) inside a transaction
- Payment failure path restores stock once for PENDING orders

### Payments (mock only)
- Mock completion/fail routes require `PAYMENT_PROVIDER=mock`
- Payment amount taken from `order.total` in the database
- Provider order ID must match a payment record for that order

### Rate limiting (in-memory)
| Area | Limit | Window |
|------|-------|--------|
| Login | 10 | 15 minutes |
| Registration | 5 | 1 hour |
| Checkout | 10 | 15 minutes |
| Astrology | 20 | 15 minutes |

Exceeded requests → HTTP 429 + `Retry-After`.  
**WARNING:** In-memory only — not shared across multiple serverless instances. Use Redis/Upstash before multi-instance production.

### File upload
- Admin/SUPER_ADMIN only
- Magic-byte MIME detection (JPEG/PNG/WebP/GIF)
- Max 5MB
- Randomized filenames under `/public/uploads/products/`
- Rejects non-image / executable content

### HTTP headers
- X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection

### Secrets
- `.env` gitignored
- No production secrets in source
- Seed admin credentials are **local development only**

### Astrology / gemstones
- No fabricated planetary positions
- No invented certificate numbers
- Disclaimers on Kundli and gemstone pages

---

## Production blockers (do not skip)

1. Real payment gateway + signed webhooks (disable mock)
2. Shared rate limiting if multi-instance
3. Unique production `AUTH_SECRET`; no seed admin in live DB
4. HTTPS, backups, reviewed legal pages
5. External penetration test recommended

---

## Phase 10–12 hardening summary

| Item | Status |
|------|--------|
| Order IDOR | Fixed |
| Mock payment gate | Fixed |
| Rate limiting | Implemented (in-memory) |
| Inventory concurrency | Conditional transaction |
| Image upload | Secure admin upload |
| Payment fail stock restore | Implemented |
| Admin order status | Implemented |
| Default credentials in UI | Dev-only display |

This document does **not** claim the application is 100% secure or production-ready.
