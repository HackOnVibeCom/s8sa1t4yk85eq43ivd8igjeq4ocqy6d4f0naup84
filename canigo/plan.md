# CANIGO implementation plan

## Scope and source of truth

The uploaded CANIGO Project Blueprint is the approved product plan. This implementation targets the hackathon MVP: a mobility-first, public discovery and contribution experience with claim-level evidence, freshness, transparent trust states, community review, moderation, and an AI-assisted contribution flow. Future communication, sensory, expanded access contexts, paid sustainability, and large-scale growth features remain documented but are not required for the first runnable release.

## Architecture

- **Web app:** Next.js App Router, React, TypeScript and Tailwind CSS. Public routes render discovery and venue profiles without login; protected UI is progressively enhanced around the same domain model.
- **API:** Next.js route handlers under `app/api`, with consistent `{ data, error }` JSON envelopes, Zod validation, role checks, rate limiting hooks and domain services for status transitions.
- **Data:** Prisma ORM with SQLite by default, schema-managed relations/indexes, seed/demo data and audit tables. Prisma Client is isolated in the server-only `lib/prisma.ts` singleton; PostgreSQL can be selected for production with reviewed migrations.
- **Storage:** Private image storage is an optional provider boundary. Upload endpoints fail honestly until a secure storage adapter is configured.
- **Maps:** Map/list discovery has a functional searchable list and a map-compatible surface. MapLibre provider configuration is optional; missing map credentials show a clear setup state instead of fabricated map results.
- **AI:** A server-only adapter for an **open-source vision model**, defaulting to `Qwen2.5-VL-7B-Instruct` through a user-configured OpenAI-compatible inference endpoint (self-hosted, Ollama-compatible gateway, vLLM, or another compatible open-source-model host). The adapter never calls Gemini or another closed model. It sends only the selected attribute context and uploaded image, requests constrained JSON, validates the response, stores the draft separately from claims, explains uncertainty and cannot-determine fields, and requires contributor confirmation. If the endpoint or model is not configured, the UI reports AI as unavailable; it never invents a successful result.
- **Deployment:** standard Node.js/Next.js deployment with Prisma setup documentation. The ZIP runs locally using SQLite without managed service credentials. Any managed host is optional infrastructure, not a required part of the application stack.

## Open-source-only delivery note

The application source, runtime libraries, database layer, map layer, and AI layer are selected from open-source technologies or open-source model weights: Next.js, React, TypeScript, Tailwind CSS, Lucide, Zod, Prisma/SQLite, MapLibre-compatible interfaces, Node.js, and Qwen2.5-VL-7B-Instruct. No closed AI model, proprietary SDK, or vendor-locked browser dependency is required. External services are optional adapters documented in `.env.example`; demo mode works without them.

## Open-source AI decision

The blueprint’s vision-model requirement is preserved, but Gemini is replaced by an open-source-only provider boundary. The default recommended model is Qwen2.5-VL-7B-Instruct because it supports image understanding and structured instruction following while remaining deployable through a self-hosted or compatible inference service. The integration is model-agnostic at runtime through:

- `OPEN_SOURCE_VISION_API_URL` — required endpoint for a compatible `/chat/completions` service.
- `OPEN_SOURCE_VISION_API_KEY` — optional server-only key for a hosted open-source model endpoint.
- `OPEN_SOURCE_VISION_MODEL` — model identifier, defaulting to `Qwen2.5-VL-7B-Instruct`.
- `AI_ANALYSIS_ENABLED` — explicit feature flag; false when the endpoint is missing.

AI output is limited to visible observations such as apparent steps, a visible sloped surface, or a visible lift door. It must not claim legal compliance, exact dimensions, operational status, restroom compliance, or a complete barrier-free route. AI confidence is stored and displayed as visual interpretation confidence, never accessibility confidence.

## Product design

- **Design movement:** editorial civic-tech / calm evidence dashboard.
- **Core principles:** evidence before reassurance; uncertainty is readable; lived experience is respected; every action has a clear consequence.
- **Color philosophy:** navy anchors trust and legibility, teal marks active evidence and contribution, blue supports navigation, and warm neutrals keep pages calm. Status is communicated with text, icons and labels in addition to color.
- **Layout paradigm:** a split discovery canvas with compact filters/list on one side and an inspectable evidence panel on the other; venue pages use vertical evidence narratives rather than a score-centric dashboard.
- **Signature elements:** the CANIGO “open doorway” mark, claim cards with a left evidence rail, and explicit freshness/review metadata.
- **Interaction:** progressive disclosure; public inspection first, contribution second; no critical workflow depends on hover or color.
- **Animation:** restrained transitions only for panel changes, upload progress and status feedback; respect reduced motion.
- **Typography:** Inter/system sans for UI with strong numeric/date hierarchy; readable line length and fluid headings.
- **Brand essence:** Know before you go — practical, inspectable access information for real places; personality: grounded, transparent, useful.
- **Brand voice:** direct and non-certifying. Example copy: “See what was observed, when, and how it was checked.” / “Unknown is not the same as no.”
- **Wordmark:** CANIGO paired with a simple doorway/route glyph that remains recognizable at small sizes.
- **Signature brand color:** deep teal `#087F7B`, used as a restrained accent rather than a success guarantee.

## Main modules

1. Public landing, discovery, search/filter, map/list alternative and venue profile.
2. Claim-level accessibility dashboard with Yes/No/Partial/Unknown values and Reported, Evidence attached, Community corroborated, Independently reviewed, Disputed, Stale and Rejected/removed statuses.
3. Contribution flow with venue/attribute selection, image metadata, date, note, public/AI consent, duplicate warning and human review of AI draft observations.
4. Community contribution feed, photo gallery, comments/replies, Helpful, I observed this too, This differs from my visit, Outdated and Report reactions with one reaction per account/contribution.
5. CANIGO Proof evidence inspection and review history. Votes never verify claims; contradictory evidence can move status backwards.
6. Protected moderator dashboard and moderation queue with policy-controlled reasoned decisions and immutable audit history.
7. Auth/profile surfaces and role-aware access behavior. Demo mode uses an explicitly labelled demo session and never exposes private data.

## Project structure

```text
canigo/
  app/
    page.tsx
    discover/page.tsx
    venues/[id]/page.tsx
    contribute/page.tsx
    review/[id]/page.tsx
    moderation/page.tsx
    profile/page.tsx
    api/**/route.ts
    globals.css
  components/        reusable accessible UI and evidence cards
  lib/               domain types, demo data, validation, auth, rate-limit and AI adapter
  supabase/
    migrations/      schema and RLS SQL
    seed.sql
  tests/              unit and API smoke tests
  docs/               architecture, database, API and setup documentation
  public/             route manifest and local assets
  .env.example
  README.md
  Dockerfile
  package.json
```

## Build and validation workflow

1. Create the Next.js project files and design system.
2. Add demo-mode domain services and public routes so discovery and venue evidence work without credentials.
3. Add contribution/review/moderation flows and API route handlers with server-side validation.
4. Add SQL migrations, RLS policies, seed data and setup documentation.
5. Add the open-source vision adapter, JSON schema validation and honest unavailable/error states.
6. Run TypeScript checks, ESLint, unit/API tests and production build.
7. Start the development server, verify the route manifest and key public/API responses.
8. Run a read-only implementation audit against this plan and the blueprint, fix confirmed defects, then package the complete source folder as `CANIGO_COMPLETE_SOURCE_CODE.zip`.

## Known integration boundaries

Production authentication/private storage, a real MapLibre tile/geocoder provider, and the open-source vision endpoint require user-provided configuration. The application will document exact setup steps and display actionable setup errors. No API key, service-role key, private storage path, or fabricated AI response will be committed or exposed to the browser.
