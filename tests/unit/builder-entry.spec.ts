import { describe, expect, it } from 'vitest'
import {
  authorPlatformOptions,
  extractResourceIdFromUrl,
  getSingleQueryValue,
  getSupportedPlatform,
  resourcePlatformOptions,
} from '../../app/utils/builder-entry'

describe('builder-entry helpers', () => {
  it('normalizes supported query values from strings and arrays', () => {
    expect(getSingleQueryValue('  spigot  ')).toBe('spigot')
    expect(getSingleQueryValue(['  modrinth  ', 'ignored'])).toBe('modrinth')
    expect(getSingleQueryValue([123, false, '  hangar  '])).toBe('hangar')
    expect(getSingleQueryValue(['', '  modrinth  ', 'ignored'])).toBe('')
    expect(getSingleQueryValue(undefined)).toBe('')
  })

  it('falls back when a platform is unsupported', () => {
    expect(getSupportedPlatform('spigot', resourcePlatformOptions)).toBe(
      'spigot',
    )
    expect(getSupportedPlatform('not-real', resourcePlatformOptions)).toBe(
      'spigot',
    )
    expect(
      getSupportedPlatform('not-real', authorPlatformOptions, 'modrinth'),
    ).toBe('modrinth')
  })

  it('extracts numeric platform IDs from supported resource URLs', () => {
    expect(
      extractResourceIdFromUrl(
        'https://www.spigotmc.org/resources/placeholderapi.6245/',
        'spigot',
      ),
    ).toBe('6245')
    expect(
      extractResourceIdFromUrl(
        'https://builtbybit.com/resources/example-resource.12345/',
        'builtbybit',
      ),
    ).toBe('12345')
    expect(
      extractResourceIdFromUrl(
        'https://polymart.org/resource/example-resource.1234',
        'polymart',
      ),
    ).toBe('1234')
  })

  it('extracts owner/project IDs for two-segment platforms', () => {
    expect(
      extractResourceIdFromUrl(
        'https://hangar.papermc.io/HelpChat/PlaceholderAPI',
        'hangar',
      ),
    ).toBe('HelpChat/PlaceholderAPI')
    expect(
      extractResourceIdFromUrl(
        'https://ore.spongepowered.org/lucko/LuckPerms',
        'ore',
      ),
    ).toBe('lucko/LuckPerms')
  })

  it('extracts slug IDs for slug-based platforms', () => {
    expect(
      extractResourceIdFromUrl(
        'https://modrinth.com/plugin/placeholderapi',
        'modrinth',
      ),
    ).toBe('placeholderapi')
    expect(
      extractResourceIdFromUrl(
        'https://www.curseforge.com/minecraft/mc-mods/example-mod',
        'curseforge',
      ),
    ).toBe('example-mod')
  })

  it('rejects blank, invalid, and unsupported resource URLs', () => {
    expect(extractResourceIdFromUrl('', 'spigot')).toBe('')
    expect(extractResourceIdFromUrl('not a url', 'spigot')).toBe('')
    expect(
      extractResourceIdFromUrl(
        'https://www.spigotmc.org/resources/placeholderapi/',
        'spigot',
      ),
    ).toBe('')
  })
})
