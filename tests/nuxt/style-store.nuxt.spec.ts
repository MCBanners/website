import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { THEME_PRESETS, useStyleStore } from '~/stores/style'

describe('style store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('turns a valid background color into solid-mode style params', () => {
    const style = useStyleStore()

    style.setBackgroundColor('#ABCDEF')

    expect(style.backgroundMode).toBe('solid')
    expect(style.hasV1Fields()).toBe(true)
    expect(style.buildStyleParams()).toMatchObject({
      background__mode: 'solid',
      background__color: 'abcdef',
      style__version: 1,
    })
  })

  it('tracks and clears HEX validation errors', () => {
    const style = useStyleStore()

    style.setTextPrimaryColor('blue')

    expect(style.hasErrors).toBe(true)
    expect(style.errors.textPrimaryColor).toContain('HEX')

    style.setTextPrimaryColor('#112233')

    expect(style.hasErrors).toBe(false)
    expect(style.errors.textPrimaryColor).toBeUndefined()
    expect(style.buildStyleParams()).toMatchObject({
      text__primary_color: '112233',
      style__version: 1,
    })
  })

  it('clamps logo offset params to the supported range', () => {
    const style = useStyleStore()

    style.setLogoY(999)
    expect(style.logoY).toBe(50)
    expect(style.buildStyleParams()).toMatchObject({ logo__y: 50 })

    style.setLogoY(-999)
    expect(style.logoY).toBe(-50)
    expect(style.buildStyleParams()).toMatchObject({ logo__y: -50 })
  })

  it('applies a theme preset and resets back to default values', () => {
    const style = useStyleStore()
    const preset = THEME_PRESETS.find((item) => item.name === 'Ocean')!

    style.applyThemePreset(preset)

    expect(style.activeThemePreset).toBe('Ocean')
    expect(style.backgroundMode).toBe('solid')
    expect(style.shadowPreset).toBe('soft')
    expect(style.buildStyleParams()).toMatchObject({
      background__color: '0a192f',
      text__primary_color: 'ccd6f6',
      text__secondary_color: '8892b0',
      text__accent_color: '64ffda',
      shadow__preset: 'soft',
      style__version: 1,
    })

    style.resetAll()

    expect(style.backgroundMode).toBe('template')
    expect(style.backgroundColor).toBe('')
    expect(style.shadowPreset).toBe('none')
    expect(style.outputFormat).toBe('png')
    expect(style.hasV1Fields()).toBe(false)
    expect(style.buildStyleParams()).toEqual({})
  })
})
