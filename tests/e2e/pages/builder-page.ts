import { expect, type Page } from '@playwright/test'

export type BuilderKind = 'resource' | 'author' | 'server'

export type BuilderConfig = {
  kind: BuilderKind
  path: string
  detailsTab: string
  idInputTestId: string
  idValue: string
  invalidIdValue: string
  validationPathPart: string
  saveButtonTestId: string
  fetchButtonTestId: string
  expectedSections: string[]
  portValue?: string
}

export const builders: BuilderConfig[] = [
  {
    kind: 'resource',
    path: '/resources',
    detailsTab: 'Resource Details',
    idInputTestId: 'resource-id-input',
    idValue: '12345',
    invalidIdValue: 'invalid-resource',
    validationPathPart: '/banner/resource/',
    fetchButtonTestId: 'resource-fetch-button',
    saveButtonTestId: 'resource-save-button',
    expectedSections: [
      'Background',
      'Resource Logo',
      'Resource Name',
      'Author Name',
      'Review Count',
      'Stars',
      'Download Count',
      'Price'
    ]
  },
  {
    kind: 'author',
    path: '/authors',
    detailsTab: 'Author Details',
    idInputTestId: 'author-id-input',
    idValue: 'example-author',
    invalidIdValue: 'invalid-author',
    validationPathPart: '/banner/author/',
    fetchButtonTestId: 'author-fetch-button',
    saveButtonTestId: 'author-save-button',
    expectedSections: [
      'Background',
      'Author Logo',
      'Author Name',
      'Resource Count',
      'Like Count',
      'Review Count',
      'Download Count'
    ]
  },
  {
    kind: 'server',
    path: '/servers',
    detailsTab: 'Server Details',
    idInputTestId: 'server-host-input',
    idValue: 'play.example.test',
    invalidIdValue: 'invalid.example.test',
    validationPathPart: '/banner/server/',
    fetchButtonTestId: 'server-fetch-button',
    saveButtonTestId: 'server-save-button',
    portValue: '25565',
    expectedSections: [
      'Background',
      'Server Logo',
      'Server Name',
      'Server Version',
      'MOTD',
      'Player Count'
    ]
  }
]

export class BuilderPage {
  constructor (
    readonly page: Page,
    readonly config: BuilderConfig
  ) {}

  detailsTab () {
    return this.page.getByRole('tab', { name: this.config.detailsTab })
  }

  configureTab () {
    return this.page.getByRole('tab', { name: 'Configure Banner' })
  }

  inputByTestId (testId: string) {
    return this.page.locator(`input[data-testid="${testId}"], textarea[data-testid="${testId}"], [data-testid="${testId}"] input, [data-testid="${testId}"] textarea`).first()
  }

  async setInputValue (testId: string, value: string) {
    const input = this.inputByTestId(testId)

    await expect(input).toBeVisible()
    await input.scrollIntoViewIfNeeded()
    await input.click({ force: true })
    await input.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A')
    await input.press('Backspace')
    await input.type(value)

    if (await input.inputValue() !== value) {
      await input.evaluate((element, newValue) => {
        const inputElement = element as HTMLInputElement | HTMLTextAreaElement
        const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inputElement), 'value')?.set
        valueSetter?.call(inputElement, newValue)
        inputElement.dispatchEvent(new Event('input', { bubbles: true }))
        inputElement.dispatchEvent(new Event('change', { bubbles: true }))
      }, value)
    }

    await expect(input).toHaveValue(value)
    return input
  }

  async goto () {
    await this.page.goto(this.config.path)
    await this.waitForHydration()
    await expect(this.page.getByTestId(`${this.config.kind}-builder-page`)).toBeVisible()
  }

  async waitForHydration () {
    await this.page.waitForFunction(() => {
      return (window as unknown as { __MCBANNERS_E2E_READY__?: boolean }).__MCBANNERS_E2E_READY__ === true
        || document.documentElement.dataset.e2eReady === 'true'
    })
  }

  async expectDetailsStep () {
    await expect(this.detailsTab()).toHaveAttribute('data-state', 'active')
    await expect(this.configureTab()).toBeDisabled()
    await expect(this.page.getByTestId('details-step')).toBeVisible()
    await expect(this.inputByTestId(this.config.idInputTestId)).toBeVisible()
  }

  async fillDetails (value = this.config.idValue) {
    await this.setInputValue(this.config.idInputTestId, value)

    if (this.config.portValue) {
      await this.setInputValue('server-port-input', this.config.portValue)
    }
  }

  async fetchDetails () {
    const validationResponse = this.page.waitForResponse((response) => {
      const url = new URL(response.url())
      return url.pathname.includes(this.config.validationPathPart) && url.pathname.endsWith('/isValid')
    })

    await this.page.getByTestId(this.config.fetchButtonTestId).click()

    const response = await validationResponse
    expect(response.status()).toBe(200)
    return response
  }


  async expectValidationError () {
    await expect(this.detailsTab()).toHaveAttribute('data-state', 'active')
    await expect(this.configureTab()).toBeDisabled()
    await expect(this.page.locator('[data-slot="title"]').filter({ hasText: /^Error!$/ }).first()).toBeVisible()
  }

  async validateSuccessfully () {
    await this.fillDetails()
    await this.fetchDetails()
    await this.expectConfigureStep()
  }

  async expectConfigureStep () {
    await expect(this.configureTab()).toBeEnabled()
    await expect(this.configureTab()).toHaveAttribute('data-state', 'active')
    await expect(this.page.getByTestId('configure-step')).toBeVisible()
    await expect(this.page.getByTestId('configure-section-background')).toBeVisible()
    await expect(this.page.getByText('Background Configuration')).toBeVisible()
    await expect(this.page.getByText('Template', { exact: true })).toBeVisible()
  }

  async expectConfiguredSections () {
    for (const section of this.config.expectedSections) {
      await expect(this.page.getByRole('tab', { name: section })).toBeVisible()
    }
  }

  async saveBanner () {
    const saveResponse = this.page.waitForResponse((response) => {
      return response.url().endsWith('/banner/saved/save') && response.request().method() === 'POST'
    })

    await this.page.getByTestId(this.config.saveButtonTestId).click()

    const response = await saveResponse
    expect(response.status()).toBe(200)
    await expect(this.page.getByTestId('save-result-modal')).toBeVisible()
    await expect(this.page.getByText('Your banner was successfully saved!')).toBeVisible()
    await expect(this.page.getByTestId('saved-banner-image')).toBeVisible()
    await expect(this.inputByTestId('saved-banner-url')).toHaveValue(/e2e-banner\.png/)
  }
}
