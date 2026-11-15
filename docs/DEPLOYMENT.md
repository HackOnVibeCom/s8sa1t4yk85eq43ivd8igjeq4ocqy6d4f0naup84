# Deployment

## Configured workflow

`.github/workflows/deploy.yml` defines a GitHub Actions workflow named "Deploy to Cloudflare Pages". It runs on pushes to `main` and manual dispatch, builds the application and deploys to Cloudflare Pages when `CLOUDFLARE_API_TOKEN` is available. The project name comes from the `CF_PROJECT_NAME` repository variable or, by default, the repository name. The workflow attempts to attach a project-specific `hackonvibe.com` domain.

## Verification status

- Provider configured in repository workflow: Cloudflare Pages.
- A public production URL: **not verified**.
- Successful, current production deployment: **not verified**.
- External access, sign-in and main journey: **not tested against a deployed site**.

The workflow's domain construction is not proof that the domain exists, is assigned to this team, serves the current build, or is publicly usable. The project variable may override the default. Do not submit a guessed `pages.dev` or `hackonvibe.com` URL. Open the latest successful deployment and test the actual URL as a signed-out external user first.

## Deployment requirements and checks

1. Confirm the repository's Actions secret `CLOUDFLARE_API_TOKEN` is available to the workflow.
2. Confirm any `CF_PROJECT_NAME` override is intentional.
3. Inspect the latest workflow run for build and deploy success.
4. Copy the actual deployment URL from Cloudflare Pages/GitHub Actions.
5. Open that URL in a private browser window and test mobile and desktop layouts.
6. Verify Supabase Auth, RLS-backed paths and the server-side `GEMINI_API_KEY` in the deployed runtime.
7. Record only the verified URL in the HackOnVibe dashboard.

## Runtime secrets

The assistant requires `GEMINI_API_KEY` in the server/runtime environment. Do not place it in a `VITE_` variable. No AgentRouter credentials or integration are configured.
