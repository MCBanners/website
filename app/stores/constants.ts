import { defineStore } from 'pinia'
import type { KeyValueMapping } from '~/types/misc'
import type { SVC } from '~/types/svc'

export const useConstantStore = defineStore('constants', () => {
  const templates = ref<KeyValueMapping[]>([])
  const alignments = ref<KeyValueMapping[]>([])
  const fontFaces = ref<KeyValueMapping[]>([])
  let constantsRequest: Promise<void> | undefined
  const getConstants = async () => {
    if (templates.value.length > 0) return
    constantsRequest ??= fetch(useMcbannersApiUrl('/banner/svc/constants'))
      .then((response) => response.json() as Promise<SVC>)
      .then((constants) => {
        templates.value = Object.entries(constants.templates).map(
          ([key, value]) => ({ key, value }),
        )
        alignments.value = Object.entries(constants.text_alignments).map(
          ([key, value]) => ({ key, value }),
        )
        fontFaces.value = Object.entries(constants.fonts).map(
          ([key, value]) => ({ key, value }),
        )
      })
      .finally(() => {
        constantsRequest = undefined
      })
    await constantsRequest
  }
  return {
    templates,
    alignments,
    fontFaces,
    getConstants,
  }
})
