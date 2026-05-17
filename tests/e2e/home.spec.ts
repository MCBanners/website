import { expect, test, type Page } from '@playwright/test'

async function waitForHydration (page: Page) {
  await page.waitForFunction(() => {
    return (window as unknown as { __MCBANNERS_E2E_READY__?: boolean }).__MCBANNERS_E2E_READY__ === true
      || document.documentElement.dataset.e2eReady === 'true'
  })
}

test.describe('home and shell', () => {
  test('renders branded landing content and primary navigation', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)

    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Resources' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Authors' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Servers' })).toBeVisible()
    await expect(page.getByAltText('logo')).toBeVisible()
    await expect(page.getByText(/backend statistics into beautiful front-end images/i)).toBeVisible()
  })

  test('navigates through all public builder routes from the nav', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)

    await page.getByRole('link', { name: 'Resources' }).click()
    await expect(page).toHaveURL(/\/resources$/)
    await expect(page.getByRole('tab', { name: 'Resource Details' })).toBeVisible()

    await page.getByRole('link', { name: 'Authors' }).click()
    await expect(page).toHaveURL(/\/authors$/)
    await expect(page.getByRole('tab', { name: 'Author Details' })).toBeVisible()

    await page.getByRole('link', { name: 'Servers' }).click()
    await expect(page).toHaveURL(/\/servers$/)
    await expect(page.getByRole('tab', { name: 'Server Details' })).toBeVisible()
  })
})
