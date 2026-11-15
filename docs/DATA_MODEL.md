# Data model

The initial migration uses Supabase Postgres. Application state is split between structured identity/community tables and a JSON payload table used for several application record types.

## Main records

### `profiles`

One profile per `auth.users` account. It stores a role (`citizen` or `admin`), display profile fields and counters. A trigger creates a profile for a new account with the default `citizen` role.

### `app_records`

A shared record table with an `entity_type`, `record_id`, optional `owner_id`, JSON `payload`, and timestamps. The schema currently permits these record types:

- `venues`
- `contributions`
- `community_posts`
- `rejected_posts`
- `saved_lists`
- `notifications`
- `reports`

The primary key scopes an entity and record to its owner or the `global` scope. Policies determine which rows the client can read or mutate.

### Community reactions and comments

`community_post_reactions` stores one `like` or `dislike` per user/post. `community_post_comments` stores user-owned comments with a database-enforced non-empty content length limit. Both tables have RLS enabled.

## Moderation

The migration defines `current_user_is_admin()` and a `moderate_community_post` database function. The moderation function checks the trusted profile role and accepts the supported `Verified` and `Rejected` statuses. Rejection moves the post into the rejected record type and removes related reactions/comments.

## Storage and validation

Consult the SQL migration for storage buckets, MIME restrictions, object-size limits, grants and exact RLS policies. Configure the Supabase project by applying the migration; do not infer that a local `.env` alone provisions the database.

## Current limitation

The use of JSON payloads is flexible for a prototype, but it does not mean all UI fields are persisted or validated. Some contribution/evidence and feedback flows are local or incomplete. Verify each client write path against the schema and project policies before using real submissions.
