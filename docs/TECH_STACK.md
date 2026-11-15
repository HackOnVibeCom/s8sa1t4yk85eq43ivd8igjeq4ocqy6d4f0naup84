# Technology stack

| Technology | Use in CANIGO |
|---|---|
| React 18 | User interface and component model |
| TypeScript | Application source and type checking |
| Vite | Local development server and static production build |
| Tailwind CSS | Utility-based responsive styling |
| Supabase Auth | User sign-in and signup |
| Supabase Postgres / RLS | Cloud application records and access control |
| Supabase Storage | Configured path for user-uploaded evidence |
| Google Gemini API | Server-side assistant response generation |
| React Leaflet | Interactive map UI |
| OpenStreetMap | Map tiles |
| Web Speech API | Optional browser speech recognition and synthesis |
| Cloudflare Pages | Deployment target configured in GitHub Actions; a live deployment is not confirmed |

## Provider accuracy

The checked-in assistant endpoint calls Gemini. The application does not currently use OpenRouter or AgentRouter. The AgentRouter key posted in chat is compromised and must be revoked. Before implementing a provider change, obtain the provider's current API documentation (base URL, authentication scheme, request/response format and model identifier) from a trusted source, rotate the exposed key, and configure the replacement as a server-side secret. Never commit a key or expose it through a `VITE_` variable.

## Dependencies and runtime

Use the versions in `package.json` and the lockfile. The deployment workflow uses Node.js 20. The repository does not currently declare a dedicated lint or automated test script; `npm run build` is the available baseline validation.
