# Contributing

Contributions to CANIGO should improve correctness, clarity and practical accessibility without overstating what the product can verify.

## Before making a change

- Check the current implementation and existing Supabase policies before adding duplicate logic.
- Keep credentials and personal data out of source, tests, screenshots and commits.
- Do not add a client-side administrator password or bypass Row Level Security to make a flow appear successful.
- Distinguish sample content, user observations and independently verified information.

## Validate changes

```powershell
npm run build
git diff --check
```

Add focused tests when introducing behavior and when an existing test setup supports them. There is currently no project test or lint script; manually verify affected flows and report any external integration that could not be exercised.

## Contribution content

When modifying venue or community features, preserve attribution and evidence context. Do not claim that AI certifies accessibility. Avoid committing user-submitted photographs or identifying information without explicit authorization.
