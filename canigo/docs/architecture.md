# Architecture

- Next.js App Router, React, TypeScript, Tailwind CSS and Lucide provide the open-source web application.
- `app/api/**` contains validated REST route handlers; server handlers use Prisma Client through `lib/prisma.ts`.
- Prisma schema is in `prisma/schema.prisma`; SQLite is the default local database. `lib/demo-data.ts` supplies explicitly labeled fallback sample content.
- `components/discovery-browser.tsx` consumes the public venues API and keeps discovery usable with sample content when local storage has not been seeded.
- `lib/ai.ts` is an optional server-side adapter to an operator-configured open-source vision model. It is disabled unless explicitly configured.
- Real authentication, private uploads, map tile/geocoding providers and the open-source inference endpoint require operator configuration. Demo identity headers are demonstration-only and must be replaced by a trusted session provider before public deployment.
