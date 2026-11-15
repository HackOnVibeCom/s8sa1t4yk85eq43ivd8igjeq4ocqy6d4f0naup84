# Primary user journeys

These flows describe the intended and currently available experience. Check the qualifications in [features](./FEATURES.md) before recording or presenting them.

## 1. Explore a place

1. Open the landing page and enter or select a search context.
2. Browse the available sample venue results.
3. Open a venue to inspect its listed accessibility information and photos.
4. Treat each attribute as a claim with a limited evidence context, not a guarantee of accessibility.

The application currently has a small sample dataset and does not provide a complete live place search or routing service.

## 2. Sign in as a citizen

1. Open Sign In.
2. Sign in with an account in the configured Supabase project, or use its supported signup flow.
3. Confirm that the signed-in user and role are loaded from the application/Supabase data.

There is no shared demo password. Public citizen signup does not grant administrator access.

## 3. Contribute an observation

1. Sign in through Supabase.
2. Open the contribution flow and follow its steps to select a venue, enter observations and add available evidence.
3. Submit the contribution and inspect the resulting status in the UI.

The form is a prototype. Do not promise that every observation field or file is saved, shared or reviewable until tested against the target Supabase project.

## 4. Ask the assistant

1. Open CANIGO's assistant.
2. Ask a question grounded in available venue/application data, or request a supported application action.
3. Review the text response and any resulting UI state.

When configured, the server endpoint calls Gemini. The assistant can be unavailable without a valid server-side key and does not independently inspect photos or certify accessibility.

## 5. Review a report or moderation item

Open the relevant community/admin view with an appropriately provisioned account. Some status changes are connected to Supabase, but several displayed values and evidence interactions remain prototype-only. Do not use the UI as an operational moderation system without a separate end-to-end verification.
