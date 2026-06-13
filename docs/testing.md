# Testing

The website uses Nuxt's recommended Vitest setup through `@nuxt/test-utils`.

`pnpm run test` now means all tests: the Node unit project and the Nuxt-runtime project.

## Commands

```bash
pnpm run test        # all Vitest projects
pnpm run test:watch  # all Vitest projects in watch mode
pnpm run test:unit   # Node-only Vitest project
pnpm run test:nuxt   # Nuxt-runtime Vitest project
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run check       # lint + format:check + typecheck + test
pnpm run build
```

## Structure

```txt
tests/
  unit/      # Fast Node tests for framework-independent helpers
  nuxt/      # Vitest tests that need Nuxt runtime, Pinia, or mountSuspended
  fixtures/  # Shared deterministic test fixtures
```

## Coverage split

Vitest owns the application logic and Nuxt-runtime coverage:

- builder entry URL parsing and platform fallback behavior
- banner validation composable success/failure behavior
- Pinia store state transitions
- preview URL and save payload construction
- style-store color, shadow, preset, and output params
- shell component rendering that needs Nuxt context
