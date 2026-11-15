# Local setup

## Requirements

- Node.js 20 or later
- npm
- A Supabase project for sign-in and cloud-backed features
- A Gemini API key for the live assistant

The GitHub deployment workflow uses Node 20. The repository's package scripts are `dev`, `build` and `preview`.

## Install

```powershell
git clone https://github.com/HackOnVibeCom/s8sa1t4yk85eq43ivd8igjeq4ocqy6d4f0naup84.git
Set-Location s8sa1t4yk85eq43ivd8igjeq4ocqy6d4f0naup84
npm ci
Copy-Item .env.example .env
```

Fill these variables in the local `.env`:

| Variable | Purpose | Exposure |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Browser-visible |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key | Browser-visible; only safe with correct RLS |
| `GEMINI_API_KEY` | Server-side assistant API credential | Secret; never prefix with `VITE_` |

Never commit `.env`. Do not use a service-role key in the browser. The key posted in chat is exposed; revoke it and configure a newly generated key privately after verifying the intended provider contract.

## Configure Supabase

Apply the SQL migration from `supabase/migrations` to the project. Verify Auth signup settings and email confirmation requirements in that project's dashboard. Create or assign an administrator profile role only through a trusted administrative process.

## Start the application

```powershell
npm run dev
```

Open `http://localhost:3000/`. Sign-in, persisted records and Gemini responses will not work as live integrations unless the corresponding services, policies and credentials are valid.

## Validate

```powershell
npm run build
git diff --check
```

There is no dedicated test or lint script in `package.json`. A successful build is not an end-to-end integration test.
