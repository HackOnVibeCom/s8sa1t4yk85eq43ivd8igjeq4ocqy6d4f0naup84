# Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`; the default database is `file:./dev.db` relative to Prisma's schema folder.
3. Run `npm install`, `npm run db:generate`, `npm run db:push`, `npm run db:seed`, then `npm run dev`.
4. Open `http://localhost:3000`.

Prisma Client is regenerated during install and by `db:generate`. Use `npm run db:push` for local schema changes. For a managed production database, configure a PostgreSQL `DATABASE_URL`, change the Prisma datasource provider to `postgresql`, create/review migrations, and configure backups. Never commit `.env` or a production DB file.

## Optional open-source vision model

Set `OPEN_SOURCE_VISION_API_URL`, optional server-only `OPEN_SOURCE_VISION_API_KEY`, `OPEN_SOURCE_VISION_MODEL`, and `AI_ANALYSIS_ENABLED=true` for an OpenAI-compatible endpoint serving an open-weights model. AI remains disabled if the endpoint is missing. Never expose inference credentials in browser code.

## External integrations not bundled

Production authentication and session issuance, private/sanitized image storage, image privacy processing, malware scanning, map tiles/geocoding and hosted model inference require operator-owned services. Their absence is reported honestly; the demo does not fabricate persistence, successful uploads or AI results.
