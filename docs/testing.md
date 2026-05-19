# Testing

## Required Checks

Run these checks for the current website cleanup line:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm build` runs `nuxt generate` and produces the static output for Cloudflare Pages.

## Playwright Status

Playwright is intentionally deferred after the homepage and builder overhaul.

The existing `tests/e2e` files and `playwright.config.ts` are retained as historical scaffolding, but the tests still reference the retired `/resources`, `/authors`, and `/servers` setup flow. Do not treat those tests as current product coverage until they are rebuilt.

Future e2e coverage should be rebuilt around:

- `/` source selection and validation
- successful navigation to `/builder`
- direct `/builder` redirect without an active source
- design and advanced controls updating preview URLs
- save and copy output behavior
- legacy route redirects

Playwright was not repaired as part of this cleanup pass.
