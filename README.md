# MCBanners Website

Nuxt 4 + Nuxt UI 4 frontend for generating and saving MCBanners image URLs for Minecraft resources, authors, and servers.

## Stack

- Nuxt 4
- Nuxt UI 4 + Tailwind CSS 4
- Pinia 3
- Nuxt Image 2
- Nuxt SEO
- Playwright E2E tests
- Static Cloudflare Pages deployment via `nuxt generate`

## Requirements

- Node.js 22 or newer
- pnpm 11.1.1 via Corepack

```bash
corepack enable
pnpm install
```

## Environment

Copy the example file when local overrides are needed:

```bash
cp .env.example .env
```

Available variables:

```bash
NUXT_PUBLIC_MCBANNERS_API_BASE=https://api.mcbanners.com
PLAYWRIGHT_PORT=4173
PLAYWRIGHT_API_PORT=4310
```

## Development

```bash
pnpm dev
```

The app runs at `http://localhost:3000` by default.

## Quality gates

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run test:e2e
```

For trace artifacts when debugging E2E failures:

```bash
pnpm run test:e2e:trace
pnpm run test:e2e:report
```

## Static production build

This project is optimized for static Cloudflare Pages deployment.

```bash
pnpm run generate
```

Generated output is written to:

```text
.output/public
```

Cloudflare Pages settings:

```text
Build command: pnpm run generate
Build output directory: .output/public
Node version: 22
```

## Cloudflare preview/deploy with Wrangler

```bash
pnpm run preview:cloudflare
pnpm run deploy:cloudflare
```

The included `wrangler.toml` declares `.output/public` as the Pages build output directory.

## Notes

- Runtime API calls use `NUXT_PUBLIC_MCBANNERS_API_BASE` and default to `https://api.mcbanners.com`.
- E2E tests start a local mock API server so tests are deterministic and do not depend on the live API.
- Generated folders such as `.nuxt`, `.output`, `playwright-report`, and `test-results` should not be committed.
