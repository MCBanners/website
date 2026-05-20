export type ShadowPreset = 'none' | 'soft' | 'strong'

export type OutputFormat = 'png' | 'jpg'

export type BackgroundMode = 'template' | 'solid'

export type ThemePreset = {
  name: string
  backgroundColor: string
  textPrimaryColor: string
  textSecondaryColor: string
  textAccentColor: string
  shadowPreset: ShadowPreset
  logoY: number
}
