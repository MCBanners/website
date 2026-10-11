import { defineStore } from 'pinia'
import type { KeyValueMapping } from '~/types/misc'
import type { SVC } from '~/types/svc'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringMap(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.keys(value).length > 0 &&
    Object.values(value).every((entry) => typeof entry === 'string')
  )
}

function isSVC(value: unknown): value is SVC {
  return (
    isRecord(value) &&
    isStringMap(value.templates) &&
    isStringMap(value.text_alignments) &&
    isStringMap(value.fonts)
  )
}

export const useConstantStore = defineStore('constants', () => {
  const templates = ref<KeyValueMapping[]>([])
  const alignments = ref<KeyValueMapping[]>([])
  const fontFaces = ref<KeyValueMapping[]>([])
  let constantsRequest: Promise<void> | undefined
  const getConstants = async () => {
    if (templates.value.length > 0) return
    constantsRequest ??= fetch(useMcbannersApiUrl('/banner/svc/constants'))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Constants request failed: ${response.status}`)
        }
        return response.json() as Promise<unknown>
      })
      .then((constants) => {
        if (!isSVC(constants)) {
          throw new Error('Invalid constants response')
        }
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
