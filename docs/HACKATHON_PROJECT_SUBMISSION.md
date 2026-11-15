# HackOnVibe 2026 — Project website submission

## CANIGO

**One-line description:** CANIGO helps people discover and share practical accessibility information about public places before they visit.

### Problem

Accessibility information is often incomplete, difficult to compare or unsupported by useful context. People with disabilities and their companions may not know whether a venue's entrance, routes, seating or facilities will meet their needs until they arrive.

### Proposed solution

CANIGO brings venue details, accessibility attributes, photographs and community observations into a discovery experience. Users can browse places, contribute observations and use an AI assistant to navigate supported parts of the application. The product treats observations and photographs as evidence to consider, not automatic certification.

### Target users

- People with disabilities and people with varied access needs
- Caregivers, family members and travel companions
- Community contributors who can share recent observations
- Venue operators and moderators interested in understanding access barriers

These are intended users; no user research, customer validation or adoption metrics are claimed here.

### Key features and implementation status

- Venue browsing, details and accessibility attributes, using the repository's current sample data.
- Map interface built with React Leaflet and OpenStreetMap tiles.
- Supabase citizen sign-in/signup and role-aware application access when configured.
- Multi-step community contribution interface.
- Community, report and moderation views, with a mix of database-backed and prototype/local behavior.
- AI assistant that can answer within the application context and return constrained supported actions.
- Browser speech recognition and synthesis for optional voice interaction where supported.
- Responsive layouts are present in the source; a target-device accessibility/responsiveness audit is not complete.

Some journeys are partial and the available venue data is limited. See [known limitations](./KNOWN_LIMITATIONS.md) before relying on or demonstrating a flow.

### Meaningful AI functionality

The assistant endpoint calls Google's Gemini `gemini-2.5-flash` `generateContent` API and returns a response with a constrained set of application actions. This can help a user navigate or interact with CANIGO. AI does not independently inspect evidence, verify accessibility attributes, certify a venue or replace user judgment.

The Gemini request path is implemented, but a successful live response has not been verified for the production environment. AgentRouter and OpenRouter are not integrated. Voice uses browser speech APIs and is not Gemini Live streaming.

### Technical architecture

The React/TypeScript browser application uses Supabase Auth and Postgres with Row Level Security for identity and data, Supabase Storage for configured evidence paths, and a server-side assistant endpoint for Gemini calls. React Leaflet renders map UI over OpenStreetMap tiles. GitHub Actions configures a Cloudflare Pages deployment workflow.

### Technology stack

React 18, TypeScript, Vite, Tailwind CSS, Supabase Auth/Postgres/Storage, Google Gemini API, React Leaflet, OpenStreetMap and browser Web Speech APIs.

### Real-world impact

By making practical access observations easier to discover and contribute, CANIGO aims to help people plan visits with more context and to make reported barriers more visible. Impact will depend on accurate, maintained data and inclusive community participation. No outcome metrics, partnerships or testimonials are claimed.

### Business and sustainability model

The current project is a prototype and has no verified revenue or operating model. Potential future directions include venue tools for keeping accessibility information current, partnerships with community organizations, or optional venue services that do not control or suppress community reports. Any model should preserve user trust, protect independent observations and avoid pay-to-rank accessibility claims.

### Deployment and judge access

- **Production website URL:** Not verified. Do not submit a guessed domain.
- **Deployment provider configured in the repository:** Cloudflare Pages via GitHub Actions.
- **Publicly accessible:** Not verified.
- **Authentication:** Supabase authentication is required for citizen contribution/account features; administrative views require an admin role. Public access to the deployed site is not verified.
- **Demo data:** The repository contains sample venue and community content, including a Garden Café scenario. This is not evidence of live or comprehensive local data.
- **Main user journeys:** Some UI flows exist, but the complete external, Supabase-backed journey has not been verified.
- **AI assistant:** Gemini integration exists in code; a successful production response has not been verified.
- **Mobile:** Responsive layouts are implemented in source; a full device/browser test has not been completed.

The workflow requires the `CLOUDFLARE_API_TOKEN` GitHub Actions secret and may use a `CF_PROJECT_NAME` override. The actual project name, current successful deployment and assigned public URL must be checked in GitHub Actions/Cloudflare before a URL is entered in the dashboard.

### Demo account instructions

No shared demo account or password is available. If a judge account is needed, create a citizen account through the configured Supabase signup flow and verify it before sharing credentials through the organizer's approved private method. Do not use a hardcoded admin account. Administrator access must be provisioned by a trusted project administrator.

### Important known limitations

- Production URL, external availability and judge access are unverified.
- Venue coverage is sample/static and limited; map UI is not a live venue search or routing service.
- Some contribution fields and photo-evidence interactions are not fully persisted.
- Several community feedback and report actions are local or use fixed sample records.
- Admin dashboard metrics include hardcoded values; moderation is not a complete operational case-management system.
- AI and voice need valid credentials/permissions and have not been verified end to end.
- No accessibility conformance audit or automated test/lint suite is present.

### Team

Team information supplied by the team; no individual responsibilities are inferred beyond the stated lead designation.

| GitHub username | Team member | Designation |
|---|---|---|
| `KanishJebaMathewM` | Kanish Jeba Mathew M | Team Lead |
| `tharunrajcse` | Tharun Raj S | Not specified |
| `MadheshLoganathan123` | L. Madhesh | Not specified |
