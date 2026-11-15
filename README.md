# CANIGO

CANIGO is a React/Vite accessibility discovery experience. The assistant supports typed and spoken messages, can carry out supported in-app actions, and can respond using Gemini.

## Run locally

1. Copy `.env.example` to `.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings. These are public client values; row-level security in the migration protects the data. Do not put a service-role key in the frontend.
3. Set `GEMINI_API_KEY` in `.env` to a Gemini API key. This key is read by the local Vite server and is not included in the browser bundle.
4. Apply `supabase/migrations/20261115000000_initial_schema.sql` in the Supabase SQL Editor.
5. Install dependencies with `npm install`, then start the app with `npm run dev`.

With Supabase configured, citizen accounts can register with email and password. Newly registered accounts receive the citizen role. To grant your own account admin access, first register and confirm its email, then run this once in the SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

The first admin sign-in seeds the sample venues, contributions, community posts, and reports when those collections are empty. If Supabase is not configured, the app continues to use its local demo sign-in and browser storage.

Community posts are published to the feed with a pending-review label and appear in the admin workspace immediately. Admin approval verifies them; rejection moves the post into an owner/admin-only archive, where the author can still see its rejected status in their profile. Comments and like/dislike reactions are stored separately and live changes are synchronized through Supabase Realtime.

If `GEMINI_API_KEY` is not configured, known navigation, search, save, and demonstration-route actions still work through the local fallback. Other assistant requests show an explicit configuration error.

## Deploy to Cloudflare Pages

Deploy the Vite app as usual. In the Cloudflare Pages project settings, add `GEMINI_API_KEY` as a server-side secret for the production environment (and preview if needed). The Pages Function at `functions/api/assistant.ts` uses this binding to call Gemini; do not create a `VITE_GEMINI_API_KEY` or expose the secret in client-side variables.

After a citizen signs in, the assistant opens automatically, greets them aloud, and asks the browser for microphone access. If permission is granted, it listens continuously until the user stops listening or closes the assistant. Typed messages remain available, and voice replies can be muted. Speech recognition support depends on the browser; typing remains available when voice is unsupported or permission is denied. The route planner currently displays only the app's sample CIT-to-Marina Beach route. It is not live navigation and does not compute routes for other locations.
