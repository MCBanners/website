# Nuxt 4.6.1 upgrade

## Scope

Upgraded Nuxt from 4.4.8 to 4.6.1, the latest stable Nuxt 4 release checked for
this change. Nuxt 5 compatibility and experimental options remain disabled.
The static generator, prerender routes, source-validation flow, builder UI,
preview, save path, and route rules remain in place.

## Migration review

- Nuxt [upgrade guide](https://nuxt.com/docs/4.x/getting-started/upgrade),
  [4.5.0 release notes](https://github.com/nuxt/nuxt/releases/tag/v4.5.0),
  [4.6.0 release notes](https://github.com/nuxt/nuxt/releases/tag/v4.6.0), and
  [4.6.1 release notes](https://github.com/nuxt/nuxt/releases/tag/v4.6.1) were
  reviewed. Nuxt 4.5 moves the Vite builder to Vite 8/Rolldown, updates
  Unhead to v3, and updates unctx. Nuxt 4.6 adopts Nuxt CLI v4.
- The [Nuxt CLI v4 release](https://github.com/nuxt/cli/releases/tag/v4.0.0)
  removes `nuxt init`; this repository does not use that command. The CLI's
  minimum Node versions are reflected in `package.json`, `.nvmrc`, CI, and the
  Cloudflare Pages instructions.
- Vite's [migration guide](https://vite.dev/guide/migration.html) was checked.
  The project has no custom Vite/Rollup/esbuild options or user-authored Vite
  plugins requiring migration. The existing Nuxt modules continue to build.
- Existing `useHead` and `useSeoMeta` calls are compatible with Unhead v3 and
  required no changes.
- `@nuxt/test-utils` was raised from 4.0.3 to 4.3.3. Under the new framework
  resolution, the older version brought a second Vue runtime into the Nuxt
  application through its Nuxt module. This caused an `UApp` hydration
  mismatch. The updated version shares Nuxt's Vue runtime; production browser
  smoke tests then hydrated without new console errors.
- Nuxt 4.6.1 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`. The repository
  pins Node 22.22.3 for local use and CI. The package declares ESM so Node loads
  `nuxt.config.ts` without reparsing it. Cloudflare Pages supports selecting
  Node through `.nvmrc` or `NODE_VERSION`; the deployment notes specify both
  the pin and explicit environment-variable fallback. See Cloudflare's
  [build image configuration](https://developers.cloudflare.com/pages/configuration/build-image/).

## Measurements

Production generation was measured on Node 24.21.0 and pnpm 11.1.1, using the
same checkout machine. Build time is the median of three runs. JavaScript size
sums emitted `.js` chunks; gzip size is the sum of each chunk compressed
individually at level 9.

| Measure                |             Nuxt 4.4.8 baseline |                      Nuxt 4.6.1 | Change |
| ---------------------- | ------------------------------: | ------------------------------: | -----: |
| `pnpm run build`       | 18.70 s (18.63 / 18.96 / 18.70) | 12.09 s (12.05 / 12.17 / 12.09) | −35.3% |
| Emitted JavaScript     |                       612,635 B |                       640,655 B |  +4.6% |
| Per-chunk gzip total   |                       195,234 B |                       204,022 B |  +4.5% |
| JavaScript chunk count |                               9 |                              15 |     +6 |

These build numbers are local samples, not a controlled CI benchmark. The
baseline and upgraded runs used the same Node and pnpm versions.

A fresh Chromium session against the generated static site confirmed that the
home page rendered and hydrated, and that resource validation navigated into
the builder. The successful Spigot `6245` flow made one validation request,
one defaults request, one constants request, and one initial preview request.
Changing the theme kept the builder responsive and made one replacement
preview request. The preview image loaded, the customization controls were
present, and the page exposed its save action. The home page's three sample
banner image requests were also unchanged. `/` and `/builder` remain the
prerender targets; an uninitialized direct `/builder` visit returns to `/`,
while the validated builder entry opens the builder as before.

## Validation

- Node 22.22.3: `pnpm run check` passed (lint, Prettier check, typecheck, and
  41 tests across 8 files).
- Node 22.22.3: `pnpm run build` passed.
- A fresh production browser smoke passed on the home and validated builder
  flows, including customization and preview rendering.
- Vite 8/Rolldown reports non-fatal sourcemap warnings from the Tailwind Vite
  plugin and removes misplaced purity annotations in generated server chunks.
  Static generation completes successfully; these warnings did not affect the
  browser smoke.
