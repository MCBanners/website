# MCBanners Website

Nuxt 4 + Nuxt UI frontend for building live-updating MCBanners image URLs for Minecraft resources, authors, and servers.

The current product is a focused two-route builder:

```text
/         Guided source entry and validation
/builder  Banner customization, preview, save, and output
```

Legacy setup routes (`/resources`, `/authors`, and `/servers`) are not active product pages. They redirect to `/`.

## Stack

- Nuxt 4
- Nuxt UI 4 + Tailwind CSS 4
- Pinia 3
- Nuxt Image 2
- Static Cloudflare Pages deployment via `nuxt generate`

## Requirements

- Node.js 22 or newer
- pnpm 11.1.1 via Corepack

```bash
corepack enable
pnpm install
```

## Environment

The website calls the MCBanners API from the browser. Local development defaults to:

```bash
NUXT_PUBLIC_MCBANNERS_API_BASE=http://localhost:3000
```

Use the production API when needed:

```bash
NUXT_PUBLIC_MCBANNERS_API_BASE=https://api.mcbanners.com
```

## Development

Run the website:

```bash
pnpm dev
```

Nuxt runs at `http://localhost:3000` by default. When running a local API at the same port, start Nuxt on another port:

```bash
pnpm dev -- --port 3001
```

## Current Checks

Required checks for this cleanup line:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Playwright coverage is intentionally deferred after the route and UI overhaul. The old e2e files still describe the retired `/resources`, `/authors`, and `/servers` flow and should be rebuilt around `/` to `/builder` before being treated as a gate again.

## Static Production Build

This project is optimized for static Cloudflare Pages deployment.

```bash
pnpm build
```

Generated output is written to:

```text
.output/public
```

Cloudflare Pages settings:

```text
Build command: pnpm build
Build output directory: .output/public
Node version: 22
```

## Deployment Notes

- Static routes prerendered by Nuxt: `/` and `/builder`.
- Legacy setup routes redirect to `/` through `routeRules` in `nuxt.config.ts`.
- Static OG metadata points at `public/og/mcbanners-og.png`.
- The app is dark-only. Nuxt UI color mode is pinned to dark and no theme switch is exposed.
- Generated folders such as `.nuxt`, `.output`, `dist`, `playwright-report`, and `test-results` should not be committed.
