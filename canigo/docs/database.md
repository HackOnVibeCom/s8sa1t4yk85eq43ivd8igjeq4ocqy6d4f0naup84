# Database setup (Prisma + SQLite)

CANIGO uses Prisma ORM and SQLite by default. Both are open-source and run locally; no Supabase account or managed database is required.

1. Copy `.env.example` to `.env` (the default `DATABASE_URL` stores data in `prisma/dev.db`).
2. Run `npm install`.
3. Run `npm run db:generate` to generate Prisma Client.
4. Run `npm run db:push` to create/update the local schema.
5. Run `npm run db:seed` to load the clearly labeled sample venue records.
6. Run `npm run dev`.

Set `DATABASE_URL` to a Prisma-supported PostgreSQL URL when deploying to PostgreSQL; change the datasource provider to `postgresql` and generate migrations for that deployment. Do not commit production credentials or database files. API route handlers use the server-only singleton in `lib/prisma.ts`; browser UI requests the same Next.js API routes. When no database is initialized, public discovery uses clearly labeled demo records and write endpoints return a setup error rather than pretending data was saved.

The schema stores profiles, venues, claim-level observations, contributions, reactions (one per user/contribution), comments, reports, verification events and moderation actions. Authentication/session issuance and private file storage remain integration work; the API does not treat a client-supplied identity header as production authentication.
