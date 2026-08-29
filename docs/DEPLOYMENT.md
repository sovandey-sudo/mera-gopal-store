# Deployment Guide

## Zero-Cost Recommended Stack

1. **Code**: GitHub (free)
2. **Hosting**: Vercel (free tier — perfect for Next.js)
3. **Database**: Neon.tech or Supabase (free PostgreSQL tier)
4. **Images**: Local / public folder initially → Cloudflare R2 free tier later

## Steps (after Phase 1+)

1. Push code to GitHub
2. Create project on Vercel and connect the repo
3. Add environment variables in Vercel dashboard
4. Create free Neon/Supabase database and copy DATABASE_URL
5. Run migrations (via Vercel build or manually)
6. Deploy

## Local Development Database

You can use Docker:

```bash
docker run --name devotional-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=devotional_store -p 5432:5432 -d postgres:16
```

Then set in `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devotional_store?schema=public"
```

## Database Migrations (Production)

### Development
```bash
npm run db:push          # quick schema sync (dev only)
npm run db:seed          # seed sample data (dev only)
```

### Production-safe workflow
```bash
# Create a migration from schema changes (does not apply yet)
npx prisma migrate dev --name descriptive_name --create-only

# Review the SQL in prisma/migrations/...

# Apply migrations in production / CI
npx prisma migrate deploy

# Generate client
npx prisma generate
```

**Never run `db:push` or `db:seed` against production databases with real customer data.**

Seed credentials (`admin@devotionalstore.com` / `Admin@12345`) are for **local development only**.
In production, create the first admin via a secure one-time script or environment-driven bootstrap — never commit production passwords.

## Rate Limits (in-memory)

| Endpoint area | Limit | Window |
|---------------|-------|--------|
| Login | 10 | 15 minutes |
| Registration | 5 | 1 hour |
| Checkout | 10 | 15 minutes |
| Astrology | 20 | 15 minutes |

Exceeded requests receive HTTP 429 with `Retry-After`.
For multi-instance production, replace with Redis/Upstash.
