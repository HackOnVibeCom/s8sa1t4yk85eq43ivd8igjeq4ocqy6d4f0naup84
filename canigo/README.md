# CANIGO — Know Before You Go

A civic-tech web app for inspectable, community-reported accessibility information about public places. The design keeps evidence, dates and uncertainty visible; it does not issue a single accessibility score or treat missing information as “No”.

## Open-source stack

Node.js, Next.js, React, TypeScript, Tailwind CSS, Lucide, Zod, Prisma ORM and SQLite. The default database is local and self-hostable; Supabase and its SDKs are not used. Optional AI connects only to a user-configured endpoint serving an open-weights vision model. Hosted map/AI infrastructure is optional, not required for the database or app.

## Run locally

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Prisma writes to `prisma/dev.db` by default. Public venue discovery loads records through `/api/venues`; seeded sample records are clearly marked demo and are not verified real-world accessibility information. The UI falls back to those samples when the database is not yet initialized.

## Database and API

`prisma/schema.prisma` defines profiles, venues, access claims, contributions, reactions, comments, reports, verification events and moderation actions. `lib/prisma.ts` is a server-only singleton. The Next.js REST handlers validate requests with Zod and use Prisma for core writes; `components/discovery-browser.tsx` fetches through the public API. See [docs/database.md](docs/database.md) for local setup and PostgreSQL deployment notes.

Authentication/session issuance and private image storage are not included as production-ready features. Header-based demo identities are not secure authentication and must be replaced before public launch. Upload presigning reports unavailable until a private storage provider is configured. Map tiles/geocoding and open-source vision inference likewise need operator-provided endpoints.

## Optional open-source vision model

Configure `OPEN_SOURCE_VISION_API_URL`, optional server-only `OPEN_SOURCE_VISION_API_KEY`, `OPEN_SOURCE_VISION_MODEL` and `AI_ANALYSIS_ENABLED=true` to use a self-hosted OpenAI-compatible service for an open-weights model such as Qwen2.5-VL-7B-Instruct. AI creates suggestions only; human confirmation is mandatory and the model cannot certify accessibility or operational conditions.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

See `docs/setup.md`, `docs/architecture.md`, and `docs/api.md` for further details. Use Node.js-compatible hosting; no managed vendor service is required.
