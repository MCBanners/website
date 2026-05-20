import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import type { ServerGame } from '~/types/banner'
import type { BannerKind, PlatformOption } from '~/utils/builder-entry'

export type BannerValidationResult = {
  ok: boolean
  message?: string
}

export function useBannerEntryFlow () {
  const defaults = useDefaultStore()
  const { id, platform, type, host, port, serverGame } = storeToRefs(defaults)

  async function validateResource (
    platformName: string,
    bannerId: string
  ): Promise<BannerValidationResult> {
    const response = await fetch(useMcbannersApiUrl(`/banner/resource/${platformName}/${encodeURIComponent(bannerId)}/isValid`))
    const json = await response.json()

    if (!json.valid) {
      return {
        ok: false,
        message: 'Failed to fetch resource. Check that the resource ID is correct.'
      }
    }

    await defaults.getDefaults()
    type.value = 'resource'
    id.value = bannerId
    platform.value = platformName
    defaults.markSelectedSource()
    return { ok: true }
  }

  async function validateAuthor (
    platformName: string,
    bannerId: string
  ): Promise<BannerValidationResult> {
    const response = await fetch(useMcbannersApiUrl(`/banner/author/${platformName}/${encodeURIComponent(bannerId)}/isValid`))
    const json = await response.json()

    if (!json.valid) {
      return {
        ok: false,
        message: 'Failed to fetch author. Check that the author ID is correct.'
      }
    }

    await defaults.getDefaults()
    type.value = 'author'
    id.value = bannerId
    platform.value = platformName
    defaults.markSelectedSource()
    return { ok: true }
  }

  async function validateServer (
    selectedGame: ServerGame,
    serverHost: string,
    serverPort: number
  ): Promise<BannerValidationResult> {
    const response = await fetch(useMcbannersApiUrl(`/banner/server/${selectedGame}/${encodeURIComponent(serverHost)}/${serverPort}/isValid`))
    const json = await response.json()

    if (!json.valid) {
      return {
        ok: false,
        message: selectedGame === 'hytale'
          ? 'Could not query that Hytale server. Check the host and port, and make sure the server has OneQuery or Minecraft-compatible PingProtocol enabled.'
          : 'Failed to ping that server. Please make sure the IP and port are correct.'
      }
    }

    await defaults.getDefaults()
    type.value = 'server'
    host.value = serverHost
    port.value = serverPort
    serverGame.value = selectedGame
    defaults.markSelectedSource()
    return { ok: true }
  }

  function getPlatformBannerType (
    kind: Exclude<BannerKind, 'server'>,
    platformName: string,
    platforms: PlatformOption[]
  ): string | undefined {
    const option = platforms.find(platformOption => platformOption.value === platformName)
    if (!option) {
      return undefined
    }

    if (kind === 'resource' && option.bannerType.endsWith('_RESOURCE')) {
      return option.bannerType
    }

    if (kind === 'author' && option.bannerType.endsWith('_AUTHOR')) {
      return option.bannerType
    }

    return undefined
  }

  return {
    validateResource,
    validateAuthor,
    validateServer,
    getPlatformBannerType
  }
}
