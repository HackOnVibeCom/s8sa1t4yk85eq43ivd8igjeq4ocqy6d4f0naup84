# Authentication and data access

## Authentication

Citizen authentication is handled by Supabase Auth. The application does not silently assign a signed-out visitor the citizen role, and there are no hardcoded administrator credentials in the client. A profile is created for a new auth user by the checked-in database trigger; its default role is `citizen`.

Administrator access depends on the `profiles.role` value being assigned by a trusted project administrator. Do not grant admin access through frontend configuration, user-editable metadata, or a shared demo password.

## Row Level Security

The migration enables Row Level Security on community reactions and comments and defines policies for authenticated users. Reaction writes are constrained by the authenticated user identity and the existence/visibility of the target post. If a write is rejected, confirm the user is authenticated, the post is a persisted visible record, and the migration/policies are applied. Do not disable RLS or broaden policies as a workaround.

The community feed in cloud mode must be backed by persisted community post records. Bundled display samples are not valid cloud rows for a foreign-key-like policy check.

## Data responsibilities

- The browser uses the Supabase anon/publishable key; RLS is the security boundary for client operations.
- Secret provider credentials belong only in the server/runtime environment.
- Profile roles and moderation decisions must be protected from user-controlled updates.
- Public content should not contain personal or sensitive information that a contributor did not intend to publish.

See the SQL migration in `supabase/migrations` for the deployed schema and policies. The migration is authoritative if this document and the SQL differ.
