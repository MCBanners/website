export type BannerKind = 'resource' | 'author' | 'server'

export type PlatformOption = {
  label: string
  value: string
  bannerType: string
}

export type SourcePlaceholder = {
  url?: string
  id: string
  helper: string
}

export const resourcePlatformOptions: PlatformOption[] = [
  { label: 'Spigot', value: 'spigot', bannerType: 'SPIGOT_RESOURCE' },
  { label: 'Hangar', value: 'hangar', bannerType: 'HANGAR_RESOURCE' },
  { label: 'Sponge', value: 'ore', bannerType: 'SPONGE_RESOURCE' },
  { label: 'CurseForge', value: 'curseforge', bannerType: 'CURSEFORGE_RESOURCE' },
  { label: 'Modrinth', value: 'modrinth', bannerType: 'MODRINTH_RESOURCE' },
  { label: 'BuiltByBit', value: 'builtbybit', bannerType: 'BUILTBYBIT_RESOURCE' },
  { label: 'Polymart', value: 'polymart', bannerType: 'POLYMART_RESOURCE' }
]

export const authorPlatformOptions: PlatformOption[] = [
  { label: 'Spigot', value: 'spigot', bannerType: 'SPIGOT_AUTHOR' },
  { label: 'Hangar', value: 'hangar', bannerType: 'HANGAR_AUTHOR' },
  { label: 'Sponge', value: 'ore', bannerType: 'SPONGE_AUTHOR' },
  { label: 'CurseForge', value: 'curseforge', bannerType: 'CURSEFORGE_AUTHOR' },
  { label: 'Modrinth', value: 'modrinth', bannerType: 'MODRINTH_AUTHOR' },
  { label: 'BuiltByBit', value: 'builtbybit', bannerType: 'BUILTBYBIT_AUTHOR' },
  { label: 'Polymart', value: 'polymart', bannerType: 'POLYMART_AUTHOR' }
]

export const resourcePlaceholders: Record<string, SourcePlaceholder> = {
  spigot: {
    url: 'https://www.spigotmc.org/resources/placeholderapi.6245/',
    id: '6245',
    helper: 'Spigot resources usually use the numeric ID from the resource URL.'
  },
  hangar: {
    url: 'https://hangar.papermc.io/HelpChat/PlaceholderAPI',
    id: 'HelpChat/PlaceholderAPI',
    helper: 'Hangar resources use owner/project.'
  },
  ore: {
    url: 'https://ore.spongepowered.org/author/project',
    id: 'author/project',
    helper: 'Sponge resources use author/project.'
  },
  curseforge: {
    url: 'https://www.curseforge.com/minecraft/mc-mods/example-mod',
    id: 'example-mod',
    helper: 'CurseForge resources can use the project slug.'
  },
  modrinth: {
    url: 'https://modrinth.com/plugin/placeholderapi',
    id: 'placeholderapi',
    helper: 'Modrinth resources can use the project slug.'
  },
  builtbybit: {
    url: 'https://builtbybit.com/resources/example-resource.12345/',
    id: '12345',
    helper: 'BuiltByBit resources usually use the numeric resource ID.'
  },
  polymart: {
    url: 'https://polymart.org/resource/example-resource.1234',
    id: '1234',
    helper: 'Polymart resources usually use the numeric resource ID.'
  }
}

export const authorPlaceholders: Record<string, SourcePlaceholder> = {
  spigot: { id: 'HelpChat', helper: 'Enter the Spigot author name or ID.' },
  hangar: { id: 'HelpChat', helper: 'Enter the Hangar owner name.' },
  ore: { id: 'lucko', helper: 'Enter the Sponge author name.' },
  curseforge: { id: 'Lecroq', helper: 'Enter the CurseForge author slug or ID.' },
  modrinth: { id: 'lucko', helper: 'Enter the Modrinth user or organization slug.' },
  builtbybit: { id: 'Lecroq', helper: 'Enter the BuiltByBit author name or ID.' },
  polymart: { id: 'Lecroq', helper: 'Enter the Polymart author name or ID.' }
}

export function getSingleQueryValue (value: unknown): string {
  if (Array.isArray(value)) {
    const firstString = value.find(item => typeof item === 'string')
    return firstString?.trim() || ''
  }

  return typeof value === 'string' ? value.trim() : ''
}

export function getSupportedPlatform (
  value: string,
  options: PlatformOption[],
  fallback = 'spigot'
): string {
  return options.some(option => option.value === value) ? value : fallback
}

export function extractResourceIdFromUrl (value: string, platform = 'spigot'): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  try {
    const url = new URL(trimmed)
    const segments = url.pathname.split('/').filter(Boolean)
    const lastSegment = decodeURIComponent(segments.at(-1) || '').trim()
    if (!lastSegment) {
      return ''
    }

    if (platform === 'hangar' || platform === 'ore') {
      if (segments.length < 2) {
        return ''
      }

      const owner = decodeURIComponent(segments.at(-2) || '').trim()
      const project = lastSegment
      return owner && project ? `${owner}/${project}` : ''
    }

    if (platform === 'spigot' || platform === 'builtbybit' || platform === 'polymart') {
      const numericSuffix = lastSegment.match(/\.([0-9]+)$/)
      if (numericSuffix?.[1]) {
        return numericSuffix[1]
      }

      return /^[0-9]+$/.test(lastSegment) ? lastSegment : ''
    }

    if (platform === 'curseforge' || platform === 'modrinth') {
      return lastSegment
    }

    return ''
  } catch {
    return ''
  }
}
