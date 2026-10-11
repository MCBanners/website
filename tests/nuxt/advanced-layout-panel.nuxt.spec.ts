import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import AdvancedLayoutPanel from '~/components/generator/builder/AdvancedLayoutPanel.vue'
import {
  fixtureAuthor,
  fixtureResource,
  fixtureServer,
} from '../fixtures/banner-fixtures'
import { useDefaultStore } from '~/stores/defaults'

describe('AdvancedLayoutPanel', () => {
  it('keeps resource and server controls responsive and preserves settings across tabs', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const defaults = useDefaultStore()
    defaults.$patch({
      type: 'resource',
      resource: structuredClone(fixtureResource),
      author: structuredClone(fixtureAuthor),
      server: structuredClone(fixtureServer),
    })

    const wrapper = await mountSuspended(AdvancedLayoutPanel, {
      global: { plugins: [pinia], stubs: { UTooltip: true } },
      props: {
        items: [
          { value: 'resourceLogo', label: 'Logo', description: 'Logo' },
          { value: 'resourceName', label: 'Resource', description: 'Name' },
          { value: 'serverMotd', label: 'MOTD', description: 'MOTD' },
        ],
      },
    })

    expect(wrapper.find('[data-testid="logo-y-slider"]').exists()).toBe(true)

    await wrapper.get('[role="tab"]:nth-child(2)').trigger('click')
    await nextTick()
    expect(wrapper.get('[role="tabpanel"]').attributes('data-testid')).toBe(
      'configure-section-resourceName',
    )
    expect(wrapper.find('.advanced-control-inspector').exists()).toBe(true)
    defaults.resource!.resource_name.display = 'Customized resource'

    defaults.type = 'server'
    await wrapper.get('[role="tab"]:nth-child(3)').trigger('click')
    await nextTick()
    expect(wrapper.get('[role="tabpanel"]').attributes('data-testid')).toBe(
      'configure-section-serverMotd',
    )
    expect(wrapper.find('.advanced-control-inspector').exists()).toBe(true)

    await wrapper.get('[role="tab"]:nth-child(2)').trigger('click')
    await nextTick()
    expect(defaults.resource?.resource_name.display).toBe('Customized resource')
    expect(wrapper.find('[role="tabpanel"]').attributes('data-testid')).toBe(
      'configure-section-resourceName',
    )

    wrapper.unmount()
  })
})
