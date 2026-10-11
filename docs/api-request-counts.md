# API request counts

Counts below are API fetches for a fresh home-page visit, one successful
source validation, and entry to the builder. The before count is traced from
the prior `app.vue`, home-page reset, and validation flow; after counts are
asserted by the Nuxt store and entry-flow tests.

| Endpoint                   | Before | After | Reason                                                                  |
| -------------------------- | -----: | ----: | ----------------------------------------------------------------------- |
| `/banner/svc/constants`    |      1 |     1 | Loaded on builder entry instead of every page visit                     |
| `/banner/svc/defaults/all` |      2 |     1 | Eager app fetch plus a refetch after home reset became one cached fetch |
| Selected source `/isValid` |      1 |     1 | Validation behavior is unchanged                                        |
| **Total**                  |  **4** | **3** | **One fewer request on a successful first visit**                       |

After initialization, selecting another source reuses the cached defaults and
clones that source's configuration. Resetting the selected source also keeps
the cache. Two validations with a reset between them therefore make three
requests total: two validation requests and one defaults request.

The defaults store shares an in-flight request between concurrent builder
initializations. Its test initializes resource, author, and server together
and asserts one `/banner/svc/defaults/all` request. The entry-flow test covers
two successful selections with a reset and asserts one defaults request across
both selections.
