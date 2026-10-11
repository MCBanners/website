# Builder control lazy loading

## Framework behavior

- Nuxt 4 supports lazy component imports with the `Lazy` prefix. Its official
  [`components/` guide](https://nuxt.com/docs/4.x/directory-structure/app/components#dynamic-imports)
  says the component code is delayed until the component is rendered. A `v-if`
  around a lazy component makes the import conditional; using a lazy component
  without conditional rendering still loads it during the initial render.
- Vue's [`defineAsyncComponent`](https://vuejs.org/guide/components/async)
  provides the underlying async-component behavior: the loader runs when the
  component is rendered. A dynamic `import()` is a bundler split point. Vue's
  wrapper also supports loading/error components, with a default 200 ms delay
  before showing its loading component when configured.
- For tab-specific render selection, Nuxt's component guide documents dynamic
  components via `resolveComponent` or direct imports from `#components`. Avoid
  computed/variable import paths: the compiler needs statically analyzable
  component names/imports for generated chunks.
- Vue's [`<KeepAlive>` guide](https://vuejs.org/guide/built-ins/keep-alive)
  notes that switching dynamic components normally unmounts the inactive
  instance, discarding its local state. `<KeepAlive>` preserves that instance
  state, but should only be added if controls have local state that is not
  already stored in the builder's Pinia state. Cached components are deactivated
  rather than unmounted, so cleanup tied only to unmount does not run on tab
  changes.

## Implications for the builder

- Keep the currently selected control in the initial render so it stays
  immediately available; lazy-load only controls hidden by the selected source
  type or inactive tab.
- Use explicit component references or Nuxt's literal auto-import names and
  conditional rendering. Confirm in a production browser that inactive
  controls' chunks are not fetched or prefetched before their tab is selected.
- Builder customization values should remain in Pinia when switching controls.
  Preserve any meaningful component-local state separately or use
  `<KeepAlive>` selectively; do not cache every control without evidence.
- Lazy imports split chunks but do not guarantee lower transferred bytes or
  faster overall interactions. Record actual browser transfers and first tab
  activation latency before deciding whether to keep the split.

## Production measurements

Measured on 2026-10-11 from `master` (`d97c033`) and a temporary lazy-loading
prototype, using `pnpm run generate` and cold Chromium contexts against the
generated static site on localhost. Measurements include a plain Python static
server and a second standard-library server that gzipped JavaScript responses.
The plain run measures uncompressed bytes; gzip is a closer proxy for Cloudflare
Pages, though it does not use Cloudflare's Brotli. Builder readiness is from
the Continue button click to the initially selected logo slider appearing.
Tab latency is from the Resource tab click to its control fields appearing.

| Metric                                       |                `master` |           Lazy controls |           Change |
| -------------------------------------------- | ----------------------: | ----------------------: | ---------------: |
| Production generation wall time              |                 11.39 s |                 11.30 s |          -0.09 s |
| Cold homepage JavaScript, plain              | 14 requests / 493,329 B | 15 requests / 493,760 B |           +431 B |
| Cold homepage JavaScript, gzip               | 14 requests / 171,901 B | 15 requests / 172,676 B |           +775 B |
| Builder JavaScript before another tab, plain |               675,738 B |               643,593 B | -32,145 B (4.8%) |
| Builder JavaScript before another tab, gzip  |               216,722 B |               213,806 B |  -2,916 B (1.3%) |
| Initial builder readiness, plain             |                  619 ms |                  629 ms |           +10 ms |
| Initial builder readiness, gzip              |                  615 ms |                  592 ms |           -23 ms |
| First Resource tab activation, plain         |                   25 ms |                   49 ms |           +24 ms |
| First Resource tab activation, gzip          |                   25 ms |                   38 ms |           +13 ms |

The builder chunk went from 182.10 KB to 149.53 KB uncompressed. With gzip, its
browser `encodedBodySize` went from 45,521 B to 40,830 B. Activating Resource
fetched two control chunks (4,293 B compressed, 4,893 B including headers).
Total JavaScript then measured 218,699 B, 1,977 B above the eager builder.
Browser smoke checks reached the real Resource builder and activated the
Resource tab. Author and Server builder smoke checks used a browser-local
`isValid` response stub because the live service rejected test usernames and
would not validate the synthetic server address; the application still fetched
normal defaults and rendered Author, Server, and MOTD controls.

## Decision

Keep the existing eager imports. The prototype reduced the compressed builder
entry by about 2.9 KB (1.3%), then transferred about 2 KB more than the eager
version after the first Resource control opened. It also added two requests
and about 13 ms to that tab switch in the gzip run. The plain transfer showed a
larger byte reduction because it did not compress responses; the compressed
browser result is the more relevant deployment comparison. The prototype was
reverted after measurement. The regression test retained for this investigation
checks default Logo rendering, Resource and Server tab selection, and settings
preservation across tabs.

## Sources

- Nuxt 4 [`components/` directory guide](https://nuxt.com/docs/4.x/directory-structure/app/components)
- Vue [`Async Components`](https://vuejs.org/guide/components/async)
- Vue [`KeepAlive`](https://vuejs.org/guide/built-ins/keep-alive)
