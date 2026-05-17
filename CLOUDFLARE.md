# Cloudflare Pages Deployment

This project is configured for static Cloudflare Pages deployment with Nuxt 4.

## Recommended Pages settings

```text
Build command: pnpm run generate
Build output directory: .output/public
Node.js version: 22
```

## Environment variables

```text
NUXT_PUBLIC_MCBANNERS_API_BASE=https://api.mcbanners.com
```

## Local Cloudflare preview

```bash
pnpm run preview:cloudflare
```

## Direct deploy with Wrangler

```bash
pnpm run deploy:cloudflare
```

## Why static generation?

The website is a static shell that calls the MCBanners API from the browser for validation, saving, and banner image generation. Static generation avoids a persistent SSR worker and lets Cloudflare serve pages from the edge CDN.

The app still prerenders the known public routes:

```text
/
/resources
/authors
/servers
```

The fallback rule in `public/_redirects` keeps future client-routed pages from returning a hard 404 before they are explicitly prerendered.
