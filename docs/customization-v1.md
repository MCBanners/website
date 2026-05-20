# Customization v1

Customization v1 is the current website-side banner styling layer. It is additive: default/template banner behavior remains the baseline, and non-default style fields are serialized only when selected.

## Design Controls

- Theme presets apply a coordinated background color, text colors, shadow preset, and logo Y value.
- Background mode supports Template or Custom Color.
- Template mode uses the selected API template.
- Custom Color mode serializes `background__mode=solid` and a lowercase hex `background__color` without `#`.
- Text colors support primary, secondary, and accent color fields.
- Shadow preset supports `none`, `soft`, and `strong`.
- Logo Y is controlled from the advanced logo controls and clamps to the supported range.
- Output format supports PNG and JPG for generated preview/output URLs.

## Serialization

`useStyleStore().buildStyleParams()` is the serialization choke point for Customization v1.

Non-default style fields are appended to preview query strings and saved banner settings. When any v1 visual field is active, `style__version=1` is included.

Current v1 keys include:

```text
background__mode
background__color
text__primary_color
text__secondary_color
text__accent_color
shadow__preset
logo__y
output__format
style__version
```

## Preview Behavior

`GeneratorPreview` builds the current API URL from the defaults store, fetches the image, and caches successful responses as session `blob:` URLs.

Preview changes use cache-first behavior with a 500 ms debounce on cache misses. Explicit flushes are used for actions such as blur, Enter, preset selection, and reset. Reset All clears the session preview cache.

## Save Behavior

Save uses `POST /banner/saved/save`. The defaults store builds the saved payload from the current source metadata, source settings, and non-default Customization v1 style params.

Saved URLs use `/banner/saved/{mnemonic}.png`. Embed output supports Markdown, BBCode, and HTML snippets from the saved URL.

## Validation Behavior

Color fields accept empty values or six-digit hex colors. Invalid color values set style-store errors and disable save while errors are present.

Reset Background clears custom background mode/color errors. Reset Text Colors clears text color errors. Reset All clears all style errors and restores defaults.
