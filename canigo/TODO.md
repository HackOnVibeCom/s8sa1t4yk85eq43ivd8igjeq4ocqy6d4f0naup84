# CANIGO implementation checklist

> **Delivery status:** The runnable open-source demo, public discovery, claim-level evidence UI, contribution/review surfaces, REST contracts, Prisma schema/seed artifacts, documentation, tests and package build are implemented. Items that require operator-owned production authentication/private storage, a real map provider, or a deployed open-source vision endpoint remain explicitly documented as connected-mode setup work rather than being faked in demo mode.

## 1. Public discovery and venue evidence
- [ ] Public visitors can open CANIGO without registration, search venues by name/category, browse a searchable list, use map/list view controls, filter by mobility attributes, and open a venue profile.
- [ ] Seeded records are explicitly labelled demo data and never presented as verified real-world accessibility information.
- [ ] Every venue profile shows name, category, address, coordinates or map state, last observed date, evidence, and claim-level accessibility information.
- [ ] The UI never calculates or displays one overall accessibility score and never interprets missing data as No.

## 2. Claim-level information model
- [ ] Mobility attributes include step-free entrance, ramp, lift, entrance steps, measured doorway width, accessible restroom, accessible parking, drop-off, path surface, internal circulation, and seating accessibility.
- [ ] Claim values are Yes, No, Partial, or Unknown.
- [ ] Claim statuses are Reported, Evidence attached, Community corroborated, Independently reviewed, Disputed, Stale, and Rejected/removed.
- [ ] Each claim displays attribute, value, contributor note, evidence, observation date, verification status, and review date where available.
- [ ] Claims preserve current/previous status, evidence references, contributor reference, observed/submitted/reviewed timestamps, and review history.
- [ ] Claims can move backwards when contradictory evidence appears; owner-provided submissions are labelled and cannot override independent evidence without review.

## 3. Contribution and image handling
- [ ] Authenticated contributors can select a venue and attribute, upload JPEG/PNG/WebP, add an observation and date, provide public-display and AI-processing consent, and submit.
- [ ] Upload handling validates file size, MIME and file signature; duplicate-image detection, private originals, sanitized derivatives, EXIF removal, privacy processing, reports, and takedown paths are represented in the implementation/documentation.
- [ ] Contributions publish as Reported or Evidence attached, never automatically verified.
- [ ] Upload and integration failures show honest error states and never silently become fake successful responses.

## 4. Open-source AI-assisted observation
- [ ] The server-side AI integration uses only a configurable open-source vision model endpoint; Gemini is not used.
- [ ] The default documented model is Qwen2.5-VL-7B-Instruct through an OpenAI-compatible endpoint, configurable with server-only environment variables.
- [ ] The AI receives only selected-attribute context and the uploaded photograph and returns structured JSON with observations, visible evidence description, confidence, cannot-determine fields, and requires-human-confirmation.
- [ ] AI suggestions are stored separately from confirmed claims; contributors can accept, edit, or reject every suggestion.
- [ ] The AI never claims venue accessibility, legal ramp slope compliance, lift operation, restroom compliance, or a complete barrier-free route.
- [ ] Missing AI credentials disable the feature with a clear setup state; AI confidence is not accessibility confidence.

## 5. Community review
- [ ] Public contribution cards show photo, note, contributor label, linked claim, evidence status, observation date, and gallery context.
- [ ] Users can comment, reply, report, mark Helpful, independently confirm, challenge, and flag outdated information.
- [ ] Helpful, I observed this too, This differs from my visit, Outdated, and Report reactions are distinct.
- [ ] One permitted reaction per user per contribution is enforced by data constraints; helpful votes never verify claims.
- [ ] Independent confirmations and contradictory evidence are treated separately and are inspectable.

## 6. Moderation and audit
- [ ] A protected moderator dashboard/queue exposes submission, venue, attribute, contributor status, evidence preview, previous versions, confirmations, contradictions, and reports.
- [ ] Moderators can approve as reported, request evidence, mark disputed, mark stale, reject, or remove for policy violation.
- [ ] Every decision requires reason code, explanation, moderator identity, timestamp, and immutable audit history.
- [ ] Unauthorized users cannot access moderation functions; server-side authorization protect writes.

## 7. Security, privacy, accessibility
- [ ] Use server-side authentication, role-based permissions, RLS, input validation, rate limiting hooks, secure session handling, secret protection, output encoding, CSRF-aware write design, error logging and audit trails.
- [ ] Never expose passwords, API keys, service-role keys, private storage paths, unnecessary personal information, or exact contributor home locations.
- [ ] Interfaces use semantic HTML, keyboard navigation, labels, visible focus states, screen-reader support, responsive typography, WCAG-aware contrast, and text/icon labels in addition to status color.

## 8. Database, API and documentation
- [ ] Prisma schema, local SQLite database, seed data and schema documentation cover venues, venue_aliases, access_claims, contributions, evidence_assets, claim_evidence, comments, reactions, reports, verification_events, moderation_actions, user_profiles, and venue_claims.
- [ ] REST routes cover venue listing/detail/creation, contribution creation/submission/detail, upload presign, reactions, comments, reports, claim challenges, moderation listing and moderation decisions.
- [ ] `.env.example` documents Prisma DATABASE_URL, map provider, and open-source vision endpoint/model/key/feature flag placeholders.
- [ ] README documents install, local execution, build, tests, Prisma setup, storage setup, open-source model setup, demo mode, external limitations, and deployment.

## 9. Quality gate and packaging
- [ ] TypeScript, ESLint, production build, unit/API checks, route manifest and key public/API smoke tests pass.
- [ ] The complete runnable source folder is packaged as `CANIGO_COMPLETE_SOURCE_CODE.zip` and verified to contain source, migrations, tests, docs, configuration, and README.
