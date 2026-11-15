# API contract

All responses use `{ data, error }`. Validation errors return `422`; missing auth returns `401`; insufficient role returns `403`; missing setup returns `503` with a configuration code.

| Method | Route | Behavior |
|---|---|---|
| GET | `/api/venues` | Search/filter public venue records; demo records are labelled. |
| GET | `/api/venues/:id` | Return venue, claims and evidence references. |
| POST | `/api/venues` | Validates a venue candidate; requires connected auth/database. |
| POST | `/api/contributions` | Validates selected attribute, note, date and consent. |
| POST | `/api/uploads/presign` | Validates JPEG/PNG/WebP and 10MB limit; returns setup error when Storage is absent. |
| POST | `/api/contributions/:id/submit` | Queues a contribution as Reported/Evidence attached; never verifies. |
| GET | `/api/contributions/:id` | Returns contribution and venue context. |
| POST | `/api/contributions/:id/reactions` | Enforces one reaction per user/contribution in the schema contract. |
| POST | `/api/contributions/:id/comments` | Adds a moderated comment or reply. |
| POST | `/api/reports` | Queues abuse/privacy/outdated reports for human moderation. |
| POST | `/api/claims/:id/challenges` | Records contradiction/outdated context separately from the current claim. |
| GET | `/api/admin/moderation` | Moderator/administrator-only queue access. |
| POST | `/api/admin/moderation/:id/decision` | Requires action, reason code and explanation; returns immutable audit record. |
| POST | `/api/ai/analyze` | Authenticated server-only proxy to the configured open-source vision model; returns a validated draft or an honest setup/failure error. |

AI analysis is intentionally behind the server-only `lib/ai.ts` adapter. The current UI explains its open-source configuration rather than exposing an unauthenticated image-analysis endpoint.
