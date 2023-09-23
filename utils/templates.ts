import { KeyValueMapping } from '~/types/misc'

export function getTemplateKey (
  source: string,
  templates: KeyValueMapping[]
): string | undefined {
  return templates.find(template => template.value === source)?.key
}
