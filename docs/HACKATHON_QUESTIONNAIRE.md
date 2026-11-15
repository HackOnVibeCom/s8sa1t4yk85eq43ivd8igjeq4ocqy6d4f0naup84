# HackOnVibe 2026 — Questionnaire answer bank

## Official Questionnaire Mapping

**The official HackOnVibe questionnaire is not present in this repository.** Obtain the actual questions from the organizer's Discord or the HackOnVibe submission dashboard. The questions below are a prepared answer bank, not the official questionnaire. Map each official question to the closest answer, then edit for the exact wording and character limits before submitting.

| Prepared answer | Topic |
|---|---|
| 1 | Product definition |
| 2 | Problem |
| 3 | Target users |
| 4 | Solution |
| 5 | Features |
| 6 | AI role |
| 7 | AI model and APIs |
| 8 | Architecture |
| 9 | Technologies |
| 10 | Differentiation |
| 11 | Primary journey |
| 12 | User value |
| 13 | Social impact |
| 14 | Sustainability |
| 15 | Customers and partners |
| 16 | Monetization |
| 17 | First users |
| 18 | Hackathon work |
| 19 | Limitations |
| 20 | Next steps |

## Prepared answers

### 1. What is CANIGO?

CANIGO is a community-oriented prototype for discovering and sharing practical accessibility information about public places before visiting them.

### 2. What problem are you solving?

People with disabilities and their companions can have difficulty planning a visit when accessibility information is missing, vague, outdated or unsupported by useful context. CANIGO is designed to bring venue attributes, observations and photographs into one discovery journey.

### 3. Who are your target users?

The intended users are people with disabilities and varied access needs, caregivers and companions, community members who can contribute observations, and venue operators or moderators who want to understand reported barriers. These are intended audiences, not a claim of validated customer demand.

### 4. What is your solution?

CANIGO provides venue discovery and detail views with accessibility attributes, a community contribution interface, evidence-oriented views and an AI assistant for supported in-app interactions. It presents observations as context, not as an automatic accessibility certification.

### 5. What are the key features?

The codebase includes venue browsing and details, a React Leaflet map using OpenStreetMap tiles, Supabase citizen authentication, a multi-step contribution form, community/report/moderation views, and a Gemini-powered assistant with optional browser speech input/output. Venue coverage is sample-limited, and some contribution, evidence and feedback flows are incomplete or local-only.

### 6. How does AI contribute to the product?

The assistant can respond to user questions in the context of CANIGO and return a constrained set of supported application actions. Its purpose is to help users navigate the product and available information. It does not independently verify accessibility, certify a venue or authenticate photo evidence.

### 7. Which AI model and APIs are used?

The checked-in assistant endpoint calls Google's Gemini `gemini-2.5-flash` `generateContent` API, using a server-side `GEMINI_API_KEY`. Browser Web Speech APIs provide optional speech recognition and synthesis; this is not Gemini Live. A successful production Gemini response has not been verified. AgentRouter and OpenRouter are not integrated.

### 8. How does the technical architecture work?

The browser app is built with React and TypeScript. Supabase Auth handles account access, while Supabase Postgres with Row Level Security stores configured application/community records. Supabase Storage is used for configured evidence paths. A server-side endpoint calls Gemini so the provider key is not exposed in the browser. React Leaflet displays OpenStreetMap tiles. GitHub Actions configures a Cloudflare Pages workflow, but the live deployment is not verified.

### 9. What technologies did you use?

React 18, TypeScript, Vite, Tailwind CSS, Supabase Auth/Postgres/Storage, Google Gemini API, React Leaflet, OpenStreetMap and browser Web Speech APIs.

### 10. What makes your implementation different?

CANIGO is organized around practical, evidence-aware access information rather than a single generic venue label. It combines venue browsing, community observations and an assistant in one prototype. The repository does not establish a unique market position or comparative user-study result; its distinctive value remains a product hypothesis to validate.

### 11. What is the primary user journey?

A visitor finds a venue, reviews its listed accessibility attributes and evidence, and decides what additional information they need. A signed-in community member can prepare an observation for contribution. The complete cloud persistence and verification journey still needs end-to-end testing.

### 12. What value does the product provide?

CANIGO aims to make available access details easier to discover and compare, and to give people a way to share observations that may help others plan. Its usefulness depends on reliable, current data and clear evidence context.

### 13. What is the real-world or social impact?

The intended impact is to support more informed planning and make accessibility barriers more visible to communities and venue operators. No impact metrics, user outcomes, testimonials or partnerships are claimed.

### 14. How can the product become sustainable?

Potential sustainability approaches include community or nonprofit partnerships and optional venue tools for maintaining information. Any future model should preserve independent community reporting, avoid pay-to-rank accessibility claims and protect user trust. No operating or revenue model is currently validated.

### 15. Who are the potential customers or partners?

Potential future partners could include disability-led organizations, local community groups, tourism and civic organizations, and venue operators. No partnership or customer relationship is currently claimed.

### 16. What is the monetization strategy?

There is no active monetization strategy or revenue. Options to evaluate include optional venue data-management services or grants/partnership support, while keeping community observations independent and core access information trustworthy.

### 17. How will you acquire your first users?

A potential first step is to work with local disability-led groups and community organizations to review the product and test a small, consent-based pilot. This is a proposed next step, not an existing acquisition channel or partnership.

### 18. What did the team build during the hackathon?

The CANIGO repository contains a React/TypeScript application with venue discovery and detail views, a map interface, Supabase authentication and data policies, contribution/community interfaces, and a Gemini assistant path. The team should confirm which changes were completed during the event and adjust this answer to match the verified event contributions.

### 19. What are the current limitations?

The public deployment and judge access are unverified. Venue information is sample-limited; contribution/evidence persistence and community feedback are incomplete; some report and moderation views include fixed or hardcoded sample values. The Gemini response and voice workflows need live verification. The assistant does not certify accessibility, and no accessibility conformance audit or automated test suite is documented.

### 20. What are the next steps?

Verify and publish a working deployment; test the primary journey with an external account; complete and test Supabase-backed contributions and moderation; validate assistant behavior and user-facing evidence boundaries; conduct accessibility testing with people with relevant lived experience; and obtain the official organizer questionnaire and finish the required submissions.

## Team

| GitHub username | Team member | Designation |
|---|---|---|
| `KanishJebaMathewM` | Kanish Jeba Mathew M | Team Lead |
| `tharunrajcse` | Tharun Raj S | Not specified |
| `MadheshLoganathan123` | L. Madhesh | Not specified |
