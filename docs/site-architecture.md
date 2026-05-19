# Site Architecture

MCBanners is currently a two-route banner builder.

## Routes

```text
/         Guided entry flow
/builder  Validated builder
```

The old setup pages (`/resources`, `/authors`, and `/servers`) are gone as user-facing pages. Nuxt route rules redirect those URLs to `/` so stale links land safely at the current entry flow.

## Entry Flow

The homepage lets a user choose Resource, Author, or Server. Resource and Author entries include a platform selector; Server entries use host and port fields.

Continue validates immediately through the existing API validation endpoints:

- Resource: `/banner/resource/{platform}/{id}/isValid`
- Author: `/banner/author/{platform}/{id}/isValid`
- Server: `/banner/server/{host}/{port}/isValid`

On success, `useBannerEntryFlow` loads default banner data, writes the selected source into the defaults store, marks the source as selected, and navigates to `/builder`.

## Builder Guard

`/builder` requires `hasActiveBuilderSource` from the defaults store. Direct visits without a validated source redirect to `/`.

The guard intentionally depends on both a selected source flag and loaded source data. This keeps stale default IDs from opening the builder without a real Resource, Author, or Server validation result.

## Store Handoff

The defaults store owns the selected source, loaded source defaults, URL generation, and save payload generation. The style store owns Customization v1 controls and serializes non-default style fields through `buildStyleParams()`.

Preview URLs and save payloads both flow through these stores, so customization behavior remains consistent between preview, save, and copied output.

## Reset Behavior

The MCBanners brand link resets the selected source and returns to `/`. The builder `Change Resource`, `Change Author`, or `Change Server` action also resets the selected source and returns to `/`.

Design resets live in the style store. Reset All returns Customization v1 fields to defaults, clears validation errors, clears the session preview cache, and flushes the preview.

## App Shell

The app is dark-only. The header contains the MCBanners brand link and GitHub link only. There are no Home, Resources, Authors, Servers, or theme-toggle controls.

Nuxt UI color mode remains pinned to dark in `nuxt.config.ts` because Nuxt UI still reads color-mode state internally.

## Static OG Image

Open Graph and Twitter metadata are declared with `useSeoMeta` in `app/app.vue` and point to:

```text
/og/mcbanners-og.png
```

The site does not use build-time OG screenshot generation.
