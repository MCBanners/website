# Browser API request and payload measurements

Measured with the production-generated site served locally in Chromium at
1280×800. A successful Spigot resource selection used ID `6245`. The browser
started on the prerendered home page; builder time runs from the Continue
button click to `[data-testid="builder-route-state"]` appearing. Counts below
include MCBanners data requests, and call out image requests separately.

## Browser requests

| Flow                                               | Before | After |
| -------------------------------------------------- | ------ | ----- |
| Home page data fetches                             | 0      | 0     |
| Home page saved-banner images                      | 3      | 3     |
| Validation and defaults on successful selection    | 2      | 2     |
| Constants fetched during builder entry             | 0      | 1     |
| Builder preview image                              | 1      | 1     |
| **Total MCBanners requests, home through builder** | **6**  | **7** |

Nuxt's prerender payload already contained constants before this change, so
they caused no browser request. After this change, constants are fetched only
when entering the builder. That request is required to populate customization
options; it is not an extra fetch on the home page.

## Payload and builder timing

| Measurement                               |   Before |    After |            Change |
| ----------------------------------------- | -------: | -------: | ----------------: |
| Prerendered home HTML (`encodedBodySize`) | 30,886 B | 29,665 B |  −1,221 B (−4.0%) |
| Serialized Nuxt state (`#__NUXT_DATA__`)  |  1,925 B |    632 B | −1,293 B (−67.2%) |
| Warm builder entry, click to ready        |   345 ms |   352 ms |             +7 ms |

One additional baseline run with a cold API cache took 449 ms. A first changed
branch run, with validation and defaults already warm but constants cold, took
376 ms. Those two runs have different cache states, so the warm 345/352 ms
pair is the useful comparison; it shows no material builder-entry change in
this sample. The changed branch adds a constants request of about 65–67 ms,
which overlaps route navigation and does not add the full request duration to
the measured click-to-ready time.

These are browser observations from a local static build and live API, not a
multi-run benchmark. The payload comparison is deterministic for these builds;
builder timing varies with the API and browser cache.
