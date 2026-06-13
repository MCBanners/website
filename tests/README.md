# Testing layout

This project follows Nuxt's recommended Vitest setup through `@nuxt/test-utils`.

- `tests/unit/` contains fast Node/Vitest tests for framework-independent helpers.
- `tests/nuxt/` contains Vitest tests that need the Nuxt runtime, Pinia stores, auto-imports, or `mountSuspended`.
- `tests/fixtures/` contains deterministic shared fixtures.

Commands:

```bash
pnpm run test        # all Vitest projects
pnpm run test:watch  # all Vitest projects in watch mode
pnpm run test:unit   # Node-only Vitest project
pnpm run test:nuxt   # Nuxt-runtime Vitest project
```
