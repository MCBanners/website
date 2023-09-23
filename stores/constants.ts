import { defineStore } from 'pinia'
import { KeyValueMapping } from '~/types/misc'
import { SVC } from '~/types/svc'

export const useConstantStore = defineStore('constants', () => {
  const templates = ref<KeyValueMapping[]>([])
  const alignments = ref<KeyValueMapping[]>([])
  const fontFaces = ref<KeyValueMapping[]>([])
  const getConstants = async () => {
    if (templates.value.length > 0) { return }
    const constants = await fetch(
      'https://api.mcbanners.com/banner/svc/constants'
    )
    const constantsJson = (await constants.json()) as SVC
    templates.value = Object.entries(constantsJson.templates).map(
      ([key, value]) => ({ key, value })
    )
    alignments.value = Object.entries(constantsJson.text_alignments).map(
      ([key, value]) => ({ key, value })
    )
    fontFaces.value = Object.entries(constantsJson.fonts).map(
      ([key, value]) => ({ key, value })
    )
  }
  return {
    templates,
    alignments,
    fontFaces,
    getConstants
  }
})
