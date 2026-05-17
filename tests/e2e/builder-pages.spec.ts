import { test } from '@playwright/test'
import { BuilderPage, builders } from './pages/builder-page'

test.describe('banner builder pages', () => {
  test.describe.configure({ mode: 'serial' })
  for (const config of builders) {
    test.describe(config.path, () => {
      test('renders the details step by default and locks configuration', async ({ page }) => {
        const builder = new BuilderPage(page, config)

        await builder.goto()
        await builder.expectDetailsStep()
      })

      test('shows a validation error and keeps configuration locked for invalid input', async ({ page }) => {
        const builder = new BuilderPage(page, config)

        await builder.goto()
        await builder.fillDetails(config.invalidIdValue)
        await builder.fetchDetails()

        await builder.expectValidationError()
      })

      test('validates details, enables configuration, and defaults to Background', async ({ page }) => {
        const builder = new BuilderPage(page, config)

        await builder.goto()
        await builder.validateSuccessfully()
      })

      test('exposes the expected configuration sections after validation', async ({ page }) => {
        const builder = new BuilderPage(page, config)

        await builder.goto()
        await builder.validateSuccessfully()
        await builder.expectConfiguredSections()
      })

      test('saves the configured banner and displays reusable embed output', async ({ page }) => {
        const builder = new BuilderPage(page, config)

        await builder.goto()
        await builder.validateSuccessfully()
        await builder.saveBanner()
      })
    })
  }
})
