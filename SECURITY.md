# Security policy

## Reporting a vulnerability

Do not post credentials, exploit details or personal data in a public issue. Contact the repository maintainers privately through the repository's GitHub security reporting facility if it is enabled. If it is unavailable, contact a repository owner through a private channel and include a concise description, impact and safe reproduction context.

This file does not establish a response-time commitment or a formal supported-version policy.

## Secret handling

- Never commit `.env` or API keys.
- Keep Gemini or other provider credentials on the server/runtime side; do not use `VITE_` prefixes for secrets.
- Treat any key pasted into chat, an issue, a log or a screenshot as exposed; revoke it and generate a replacement privately.
- Supabase anon/publishable keys are intended for clients only when paired with correctly configured RLS. Never place a service-role key in the browser.
- Do not disable RLS to work around an application error.

## Current credential notice

An AgentRouter credential was pasted into the conversation and must be revoked/rotated before any future use. It was not added to the repository or used by the app. A previously shared Gemini credential should also be rotated if it was real and remains active.
