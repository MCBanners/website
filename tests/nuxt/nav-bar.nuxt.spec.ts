import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import NavBar from '~/components/NavBar.vue'

describe('NavBar', () => {
  it('renders the primary shell links', async () => {
    const wrapper = await mountSuspended(NavBar)

    expect(wrapper.find('nav[aria-label="Primary"]').exists()).toBe(true)

    expect(wrapper.find('a[aria-label="MCBanners home"]').text()).toContain(
      'MCBanners',
    )

    expect(wrapper.findComponent({ name: 'GitHubButton' }).exists()).toBe(true)
  })

  it('links the brand back to the guided entry route', async () => {
    const wrapper = await mountSuspended(NavBar)
    const brandLink = wrapper.get('a[aria-label="MCBanners home"]')

    expect(brandLink.attributes('href')).toBe('/')
  })
})
