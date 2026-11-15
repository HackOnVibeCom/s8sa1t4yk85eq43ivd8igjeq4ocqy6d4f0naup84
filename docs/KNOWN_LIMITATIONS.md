# Known limitations

This list reflects the source review performed while preparing the submission materials. It should be updated after fixes and end-to-end verification.

## Deployment and access

- No public production URL or successful current deployment was verified.
- No shared demo account exists in the frontend or repository.
- A configured deployment workflow can skip deployment when its Cloudflare secret is unavailable.

## Data and venue discovery

- The venue set is sample/static and centered on a limited Chennai-area scenario.
- Map tiles come from OpenStreetMap; venue data is not a comprehensive live map dataset.
- No production geocoder or turn-by-turn routing backend is established.
- Accessibility data may be incomplete, outdated or unsupported; no independent certification is performed.

## Contributions and community

- Contribution UI is more complete than its end-to-end cloud persistence; some fields/evidence are not fully saved.
- The photo-evidence page includes sample content and local state for feedback actions.
- Report flows include fixed sample venue/contribution references.
- Moderation views contain some database-backed operations but also hardcoded dashboard data and incomplete workflows.
- Community comments/reactions require persisted posts, an authenticated account and the migrated RLS policies.

## AI and voice

- The current assistant calls Gemini `gemini-2.5-flash`; a valid server-side key and reachable API are required.
- AgentRouter is not integrated, and the exposed key supplied in chat must be revoked.
- The assistant does not independently verify accessibility or certify venues.
- Voice uses browser speech recognition and synthesis, not Gemini Live or guaranteed real-time streaming.
- Browser support and microphone permissions can prevent automatic voice startup; it has not been verified across browsers.

## Quality assurance

- No automated test or lint scripts were found in `package.json`.
- Responsive design is present in source but has not been confirmed across a device/browser matrix.
- The build does not verify external credentials, RLS policies, production API behavior or the full user journey.
