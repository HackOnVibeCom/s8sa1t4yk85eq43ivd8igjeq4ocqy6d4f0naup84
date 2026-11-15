# CANIGO

**Know before you go. Share what you find.**

CANIGO is a community-oriented prototype for discovering public places and reviewing accessibility information. It combines venue details, community contributions, evidence and a Gemini-powered assistant. The project is designed to make accessibility information easier to find; it does not independently certify venues or replace an in-person accessibility assessment.

> **Prototype status:** The repository contains sample venue data and several partially implemented or locally simulated interactions. Check the [known limitations](./docs/KNOWN_LIMITATIONS.md) before relying on information or presenting a feature as production-ready. No verified production URL or demo account is currently documented.

## What is in the project

- Search and browse venue information, with map and accessibility-oriented filters.
- View venue attributes and associated sample images.
- Sign in or create a citizen account through Supabase; the client does not provide hardcoded demo/admin credentials.
- Submit accessibility contributions with a multi-step form. Persistence and evidence handling depend on Supabase configuration and have limitations described below.
- Ask the CANIGO assistant questions and request supported in-app actions.
- Use browser speech recognition and speech synthesis for voice interaction where supported and permitted.
- Review moderation and community views. Some evidence, feedback and report interactions are prototype-only rather than persisted.

See the [feature status](./docs/FEATURES.md), [known limitations](./docs/KNOWN_LIMITATIONS.md), and [screenshots and assets guide](./docs/assets/README.md) for what has and has not been verified.

## Technology

- React 18, TypeScript, Vite, Tailwind CSS
- Supabase Auth, Postgres, Row Level Security and Storage
- Google Gemini API, called by a server-side endpoint
- React Leaflet and OpenStreetMap tiles
- Browser Web Speech APIs for speech input/output

The current assistant implementation uses **Gemini**, not AgentRouter or OpenRouter. A key shared in chat is exposed and must be revoked; it was not copied into the repository or environment. AgentRouter is not integrated because its API endpoint and contract have not been verified. See [AI and voice](./docs/AI_AND_VOICE.md).

## Run locally

### Requirements

- Node.js 20 or later (the repository's deployment workflow uses Node 20)
- npm
- A Supabase project for authentication and cloud persistence
- A Gemini API key to use the live AI endpoint

### Install and configure

```powershell
git clone https://github.com/HackOnVibeCom/s8sa1t4yk85eq43ivd8igjeq4ocqy6d4f0naup84.git
Set-Location s8sa1t4yk85eq43ivd8igjeq4ocqy6d4f0naup84
npm install
Copy-Item .env.example .env
```

Set the Supabase URL and public anon key in `.env`, then set `GEMINI_API_KEY` for the server-side assistant endpoint. Do not put secret keys in variables prefixed with `VITE_`, commit `.env`, or paste replacement secrets into chat. Apply the checked-in Supabase migrations to the project before testing features that require database tables or policies.

```powershell
npm run dev
```

Vite serves the app at `http://localhost:3000/`. Keep `.env` local and restrict access to the Supabase project. For more detail, see [local setup](./docs/LOCAL_SETUP.md), [architecture](./docs/ARCHITECTURE.md), and [security](./SECURITY.md).

## Authentication and access

There are no built-in citizen or administrator credentials. Citizen sign-in and signup require configured Supabase Auth. Administrative access depends on an administrator role assigned in the database; it must not be granted by client-side credentials. See [authentication and data](./docs/AUTH_AND_DATA.md).

## Deployment and submission

The repository includes a Cloudflare Pages GitHub Actions workflow. It requires the `CLOUDFLARE_API_TOKEN` Actions secret and may use a project-name override. A configured workflow is not proof of a successful deployment: the production URL has not been independently verified. Do not submit a guessed domain.

The HackOnVibe project description, customer-journey storyboard, questionnaire answer bank and completion tracker are in [`docs/`](./docs/). They are preparation materials, not proof that the website, video or questionnaire has been submitted.

## Development

```powershell
npm run build
git diff --check
```

The repository currently has no dedicated automated test or lint script. A successful build does not verify Supabase policies, external API credentials, microphone permissions, deployment availability or every user journey. The [contributing guide](./CONTRIBUTING.md) explains the current validation expectations.

## Team

The following team information was supplied by the team. No individual responsibilities are inferred beyond the supplied team-lead designation.

| GitHub username | Team member | Supplied designation |
|---|---|---|
| `KanishJebaMathewM` | Kanish Jeba Mathew M | Team Lead |
| `tharunrajcse` | Tharun Raj S | Not specified |
| `MadheshLoganathan123` | L. Madhesh | Not specified |

## Project documentation

- [Problem and impact](./docs/PROBLEM_AND_IMPACT.md)
- [Features and implementation status](./docs/FEATURES.md)
- [Primary user journeys](./docs/USER_JOURNEYS.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Technology choices](./docs/TECH_STACK.md)
- [Data model and persistence](./docs/DATA_MODEL.md)
- [AI and voice](./docs/AI_AND_VOICE.md)
- [Accessibility approach](./docs/ACCESSIBILITY.md)
- [Local setup](./docs/LOCAL_SETUP.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Known limitations](./docs/KNOWN_LIMITATIONS.md)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)
