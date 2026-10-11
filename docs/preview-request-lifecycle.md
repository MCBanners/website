# Preview request lifecycle measurements

Measurements were taken on 2026-10-11 with the local Nuxt app in the T3
collaborative Chromium browser. The browser loaded the homepage, entered the
builder using the Spigot resource `6245`, and changed a theme and a text color.
The API requests were made to `api.mcbanners.com`.

## Requests and responsiveness

| Flow                             |                                                    Before |                        After |
| -------------------------------- | --------------------------------------------------------: | ---------------------------: |
| Homepage example banners         |                                              3 image GETs |                 3 image GETs |
| Builder entry                    |          1 validation + 1 constants + 1 initial image GET |                         Same |
| Successful customization update  |                                             1 preview GET |                1 preview GET |
| Failed customization update      | Up to 2 GETs (failed `fetch`, then raw-URL `<img>` retry) | 1 failed GET; error UI shown |
| Repeated cached preview URL      |                               0 preview GETs while cached |  0 preview GETs while cached |
| Concurrent identical preview URL |                                        One GET per caller |                 1 shared GET |

The T3 browser recorded a successful preview GET with HTTP 200 after a theme
change. On the updated build, wrapping `fetch` in the browser recorded one
request for the theme change and one request for a text color edit. The text
input's `input` event to `fetch` start was **245 ms**. A preset still bypasses
the debounce and starts immediately. The update debounce is now **250 ms**, down
from **500 ms**; the validation and initial builder request flow is unchanged.

The browser's cross-origin Resource Timing entries do not expose response byte
sizes or complete API timings, so the request counts above use Chromium's
network log and a browser `fetch` wrapper. Component tests provide deterministic
counts for cancellation, cache hits, failures, and concurrent identical URLs.

## Blob URL and heap behavior

The old cache allowed 100 blob URLs. The updated per-component cache allows 20,
promotes hits to the newest position, revokes an evicted URL, and revokes the
remaining URLs on unmount. A focused test generated 21 distinct previews:

- Before: 21 URLs remained live until unmount, when all 21 were revoked.
- After: the oldest URL was revoked at entry 21; unmount revoked the 20 still
  cached URLs. No URLs were created after unmount when a request was aborted.

Chromium's `performance.memory.usedJSHeapSize` reported **50.4 MB** at both
browser sample points. That metric does not isolate blob backing memory, so the
object URL lifecycle counts are the useful comparison; heap size is recorded as
a coarse sanity check rather than evidence of a heap reduction.

## Cache choice

The initial preview continues to use a normal `<img src="…">`, which can use
the browser's native HTTP image cache. Customized previews still use an
abortable `fetch` and a bounded blob URL cache: the API response must be read as
a blob to display it without issuing a second image request, and the request
needs an `AbortSignal` so obsolete work can be cancelled. The browser cache can
serve repeat GETs underneath this flow, but replacing the small bounded cache
with a direct image URL would remove request cancellation and make explicit
in-flight deduplication unavailable.
