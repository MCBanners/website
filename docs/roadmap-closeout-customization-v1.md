# Customization v1 Closeout

## Completed

- Homepage is the guided entry flow for Resource, Author, and Server banners.
- `/builder` is guarded by a real validated active source.
- Header is reduced to MCBanners and GitHub.
- Dark-only shell is intentional and documented.
- Static OG metadata uses `public/og/mcbanners-og.png`.
- Customization v1 serializes non-default style fields for preview and save.
- Session preview cache supports debounced preview updates and reset clearing.

## Known Limitations

- Customization v1 is intentionally narrow: solid background color, text colors, shadow preset, logo Y, and output format.
- Saved-banner editing is not implemented.
- No account/auth flow exists.
- Gradients, transparency, WebP controls, and deeper style features are not part of this iteration.

## Deferred Work

- Rebuild Playwright around the `/` to `/builder` flow.
- Do deeper mobile polish after the product flow stabilizes.
- Refine builder UI density and advanced-control ergonomics.
- Expand platform-specific URL parsing only when the API contract supports it.
- Add future styling features as separate, contract-backed slices.

## Manual QA Status

Use `docs/manual-qa.md` for the manual pass. Automated required checks remain `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
