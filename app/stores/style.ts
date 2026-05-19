import { defineStore } from 'pinia'
import type { BackgroundMode, ShadowPreset, OutputFormat, ThemePreset } from '~/types/style'

const HEX_RE = /^#[0-9A-Fa-f]{6}$/

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Default',
    backgroundColor: '',
    textPrimaryColor: '',
    textSecondaryColor: '',
    textAccentColor: '',
    shadowPreset: 'none',
    logoY: 0
  },
  {
    name: 'Dark Night',
    backgroundColor: '#0d1117',
    textPrimaryColor: '#f0f6fc',
    textSecondaryColor: '#8b949e',
    textAccentColor: '#58a6ff',
    shadowPreset: 'soft',
    logoY: 0
  },
  {
    name: 'Sunset',
    backgroundColor: '#1a0a00',
    textPrimaryColor: '#ffffff',
    textSecondaryColor: '#ffd9a0',
    textAccentColor: '#ff6b35',
    shadowPreset: 'strong',
    logoY: 0
  },
  {
    name: 'Ocean',
    backgroundColor: '#0a192f',
    textPrimaryColor: '#ccd6f6',
    textSecondaryColor: '#8892b0',
    textAccentColor: '#64ffda',
    shadowPreset: 'soft',
    logoY: 0
  },
  {
    name: 'Light',
    backgroundColor: '#ffffff',
    textPrimaryColor: '#111111',
    textSecondaryColor: '#555555',
    textAccentColor: '#0066cc',
    shadowPreset: 'none',
    logoY: 0
  }
]

function isValidHex (value: string): boolean {
  return value === '' || HEX_RE.test(value)
}

function isSolidHex (value: string): boolean {
  return HEX_RE.test(value)
}

function canonicalHexParam (value: string): string {
  return value.replace('#', '').toLowerCase()
}

export const useStyleStore = defineStore('style', () => {
  const backgroundMode = ref<BackgroundMode>('template')
  const backgroundColor = ref('')
  const textPrimaryColor = ref('')
  const textSecondaryColor = ref('')
  const textAccentColor = ref('')
  const shadowPreset = ref<ShadowPreset>('none')
  const logoY = ref(0)
  const outputFormat = ref<OutputFormat>('png')
  const activeThemePreset = ref('')

  // Increment to immediately flush the preview image (bypass debounce)
  const previewFlushTick = ref(0)

  // Increment to clear the session preview cache (e.g. on Reset All)
  const cacheResetTick = ref(0)

  const errors = ref<Record<string, string>>({})

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  function _setError (field: string, message: string) {
    errors.value = { ...errors.value, [field]: message }
  }

  function _clearError (field: string) {
    if (!(field in errors.value)) return
    const { [field]: _removed, ...rest } = errors.value
    errors.value = rest
  }

  function _validateHex (field: string, value: string) {
    if (!isValidHex(value)) {
      _setError(field, 'Must be a valid HEX color (e.g. #FF0000)')
    } else {
      _clearError(field)
    }
  }

  function setBackgroundColor (value: string) {
    _validateHex('backgroundColor', value)
    backgroundColor.value = value
    if (isSolidHex(value)) {
      backgroundMode.value = 'solid'
    }
    activeThemePreset.value = ''
  }

  function setBackgroundMode (value: BackgroundMode) {
    backgroundMode.value = value
    if (value === 'template') {
      backgroundColor.value = ''
      _clearError('backgroundColor')
      activeThemePreset.value = ''
      flushPreview()
    }
  }

  function setTextPrimaryColor (value: string) {
    _validateHex('textPrimaryColor', value)
    textPrimaryColor.value = value
    activeThemePreset.value = ''
  }

  function setTextSecondaryColor (value: string) {
    _validateHex('textSecondaryColor', value)
    textSecondaryColor.value = value
    activeThemePreset.value = ''
  }

  function setTextAccentColor (value: string) {
    _validateHex('textAccentColor', value)
    textAccentColor.value = value
    activeThemePreset.value = ''
  }

  function setShadowPreset (value: ShadowPreset) {
    shadowPreset.value = value
    activeThemePreset.value = ''
  }

  function setLogoY (value: number) {
    const clamped = Math.max(-50, Math.min(50, Math.round(value)))
    if (!Number.isFinite(clamped)) {
      _setError('logoY', 'Must be a number between -50 and 50')
      return
    }
    _clearError('logoY')
    logoY.value = clamped
  }

  function flushPreview () {
    previewFlushTick.value++
  }

  function resetBackground () {
    backgroundMode.value = 'template'
    backgroundColor.value = ''
    _clearError('backgroundColor')
    activeThemePreset.value = ''
    flushPreview()
  }

  function resetTextColors () {
    textPrimaryColor.value = ''
    textSecondaryColor.value = ''
    textAccentColor.value = ''
    _clearError('textPrimaryColor')
    _clearError('textSecondaryColor')
    _clearError('textAccentColor')
    activeThemePreset.value = ''
    flushPreview()
  }

  function resetLogoY () {
    logoY.value = 0
    _clearError('logoY')
    flushPreview()
  }

  function resetAll () {
    backgroundMode.value = 'template'
    backgroundColor.value = ''
    textPrimaryColor.value = ''
    textSecondaryColor.value = ''
    textAccentColor.value = ''
    shadowPreset.value = 'none'
    logoY.value = 0
    outputFormat.value = 'png'
    activeThemePreset.value = ''
    errors.value = {}
    cacheResetTick.value++
    flushPreview()
  }

  function applyThemePreset (preset: ThemePreset) {
    backgroundMode.value = isSolidHex(preset.backgroundColor) ? 'solid' : 'template'
    backgroundColor.value = preset.backgroundColor
    textPrimaryColor.value = preset.textPrimaryColor
    textSecondaryColor.value = preset.textSecondaryColor
    textAccentColor.value = preset.textAccentColor
    shadowPreset.value = preset.shadowPreset
    logoY.value = preset.logoY
    activeThemePreset.value = preset.name
    // Theme presets always set valid values; clear any stale color errors
    for (const key of ['backgroundColor', 'textPrimaryColor', 'textSecondaryColor', 'textAccentColor']) {
      _clearError(key)
    }
    flushPreview()
  }

  function hasV1Fields (): boolean {
    return !!(
      (backgroundMode.value === 'solid' && isSolidHex(backgroundColor.value))
      || textPrimaryColor.value
      || textSecondaryColor.value
      || textAccentColor.value
      || shadowPreset.value !== 'none'
      || logoY.value !== 0
    )
  }

  /**
   * Returns query-param key/value pairs for all non-default v1 style fields.
   * HEX values are returned without the leading `#`.
   */
  function buildStyleParams (): Record<string, string | number> {
    const params: Record<string, string | number> = {}
    if (backgroundMode.value === 'solid' && isSolidHex(backgroundColor.value)) {
      params['background__mode'] = 'solid'
      params['background__color'] = canonicalHexParam(backgroundColor.value)
    }
    if (textPrimaryColor.value && isValidHex(textPrimaryColor.value)) {
      params['text__primary_color'] = canonicalHexParam(textPrimaryColor.value)
    }
    if (textSecondaryColor.value && isValidHex(textSecondaryColor.value)) {
      params['text__secondary_color'] = canonicalHexParam(textSecondaryColor.value)
    }
    if (textAccentColor.value && isValidHex(textAccentColor.value)) {
      params['text__accent_color'] = canonicalHexParam(textAccentColor.value)
    }
    if (shadowPreset.value !== 'none') {
      params['shadow__preset'] = shadowPreset.value
    }
    if (logoY.value !== 0) {
      params['logo__y'] = logoY.value
    }
    // TODO: confirm output format save param with API
    if (outputFormat.value !== 'png') {
      params['output__format'] = outputFormat.value
    }
    if (hasV1Fields()) {
      params['style__version'] = 1
    }
    return params
  }

  return {
    backgroundMode,
    backgroundColor,
    textPrimaryColor,
    textSecondaryColor,
    textAccentColor,
    shadowPreset,
    logoY,
    outputFormat,
    activeThemePreset,
    previewFlushTick,
    cacheResetTick,
    errors,
    hasErrors,
    setBackgroundColor,
    setBackgroundMode,
    setTextPrimaryColor,
    setTextSecondaryColor,
    setTextAccentColor,
    setShadowPreset,
    setLogoY,
    flushPreview,
    resetBackground,
    resetTextColors,
    resetLogoY,
    resetAll,
    applyThemePreset,
    hasV1Fields,
    buildStyleParams
  }
})
