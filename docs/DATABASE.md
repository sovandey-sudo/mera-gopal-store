# Database Document

## Engine
PostgreSQL + Prisma ORM

## Models Implemented (Phase 2)

### Authentication
- **User** — with Role (SUPER_ADMIN, ADMIN, CUSTOMER)
- **Account**, **Session**, **VerificationToken** — Auth.js compatible

### Catalog
- **Category** — hierarchical support (parent/children)
- **Product** — full fields including pricing, inventory, certificate options, SEO, productType
- **ProductImage** — multiple images per product with primary flag and display order

### Bundle / Savings
- **BundleOffer** — configurable minimum quantity, discount type (fixed, percentage, free shipping etc.)
- **BundleOfferProduct** & **BundleOfferCategory** — join tables for eligibility

### Orders
- **Address**
- **Order** — with status enums and address snapshots
- **OrderItem** — price & name snapshots for historical accuracy
- **Payment** — status only (no card data stored)

### Astrology Foundation
- **AstrologyProfile** — birth details (optional link to user)
- **GemstoneRule** — configurable recommendation rules

### System
- **AuditLog**
- **SiteSetting** — key/value for configurable settings (e.g. min bundle quantity)

## Important Design Decisions

1. **Price snapshots** in OrderItem — historical orders never change when product prices update.
2. **Server-side authority** — all pricing logic will use these models on the backend.
3. **Soft flags** — `isActive`, `isFeatured`, `isBundleEligible` instead of hard deletes where possible.
4. **Certificate fields** are optional and admin-controlled only. No fake certificates are generated.
5. **Astrology** models are present but calculation engine comes in later phases.

## Indexes
Proper indexes added on slug, SKU, orderNumber, email, foreign keys, status fields, and dates.

## Seed Data
Running `npm run db:seed` creates:
- Super Admin & Admin users
- 11 categories
- 10 sample products (with placeholder images)
- Default 5-item bundle offer (₹100 off)
- Basic site settings
