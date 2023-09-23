import { defineStore } from 'pinia'
import { useConstantStore } from './constants'
import { Resource, Author, Server } from '~/types/banner'
import { BannerSaveResponse } from '~/types/misc'

export const useDefaultStore = defineStore('defaults', () => {
  const id = ref('0')
  const platform = ref('spigot')
  const template = ref('Moonlight Purple')
  const type = ref('resource')

  const host = ref('localhost')
  const port = ref(25565)

  const resource = ref<Resource>()
  const author = ref<Author>()
  const server = ref<Server>()

  const getDefaults = async () => {
    if (resource.value) { return }
    const defaults = await fetch(
      'https://api.mcbanners.com/banner/svc/defaults/all'
    )
    const defaultsJson = await defaults.json()
    resource.value = defaultsJson.resource
    author.value = defaultsJson.author
    server.value = defaultsJson.server
  }

  function convertToQueryParameters (): string {
    const queryParams: string[] = []

    let using: Record<string, any> = {}

    switch (type.value) {
      case 'resource':
        using = resource.value!
        break
      case 'author':
        using = author.value!
        break
      case 'server':
        using = server.value!
        break
    }

    for (const [key, value] of Object.entries(using)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (key !== 'background') {
            queryParams.push(`${key}__${subKey}=${subValue}`)
          } else if (key === 'background' && typeof subValue === 'string') {
            const constants = useConstantStore()
            queryParams.push(`${key}__${subKey}=${getTemplateKey(template.value, constants.templates)}`)
          }
        }
      } else {
        queryParams.push(`${key}=${value}`)
      }
    }

    return queryParams.join('&')
  }

  function generateBannerUrl (): string {
    const regularUrl = `https://api.mcbanners.com/banner/${type.value}/${platform.value}/${id.value}/banner.png?${convertToQueryParameters()}`
    const serverUrl = `https://api.mcbanners.com/banner/server/${host.value}/${port.value}/banner.png?${convertToQueryParameters()}`

    return type.value === 'server' ? serverUrl : regularUrl
  }

  async function save (bannerType: string): Promise<BannerSaveResponse> {
    const constants = useConstantStore()

    let using: Record<string, any> = {}

    switch (type.value) {
      case 'resource':
        using = resource.value!
        break
      case 'author':
        using = author.value!
        break
      case 'server':
        using = server.value!
        break
    }
    const data: {
      type: string;
      metadata: {
        resource_id?: string;
        author_id?: string;
        server_host?: string;
        server_port?: number;
      };
      settings: Record<string, any>;
    } = {
      type: bannerType,
      metadata: {},
      settings: {}
    }

    if (type.value === 'resource') {
      data.metadata.resource_id = id.value
    } else if (type.value === 'author') {
      data.metadata.author_id = id.value
    } else {
      data.metadata.server_host = host.value
      data.metadata.server_port = port.value
    }

    for (const [key, value] of Object.entries(using)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (key !== 'background') {
            data.settings[`${key}__${subKey}`] = subValue
          } else if (key === 'background' && typeof subValue === 'string') {
            data.settings[`${key}__${subKey}`] = getTemplateKey(template.value, constants.templates)
          }
        }
      } else {
        data.settings[key] = value
      }
    }

    const response = await fetch(
      'https://api.mcbanners.com/banner/saved/save',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )

    const responseJson = (await response.json()) as BannerSaveResponse

    return responseJson
  }

  return {
    id,
    platform,
    template,
    type,
    host,
    port,
    resource,
    author,
    server,
    getDefaults,
    convertToQueryParameters,
    generateBannerUrl,
    save
  }
})
