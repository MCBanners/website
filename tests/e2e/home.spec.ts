import { expect, test, type Page, type Request } from '@playwright/test'

async function waitForHydration (page: Page) {
  await page.waitForFunction(() => {
    return (window as unknown as { __MCBANNERS_E2E_READY__?: boolean }).__MCBANNERS_E2E_READY__ === true
      || document.documentElement.dataset.e2eReady === 'true'
  })
}

async function chooseServerBanner (page: Page, label: 'Minecraft Server Banner' | 'Hytale Server Banner') {
  await page.getByRole('button', { name: new RegExp(label, 'i') }).click()
}

async function fillServerDetails (page: Page, host: string, port?: string) {
  await page.locator('input[name="server-host"]').fill(host)
  if (port !== undefined) {
    await page.locator('input[name="server-port"]').fill(port)
  }
}

async function continueToBuilderAndCaptureValidation (page: Page, game: 'minecraft' | 'hytale') {
  const validationResponse = page.waitForResponse((response) => {
    const url = new URL(response.url())
    return url.pathname.includes(`/banner/server/${game}/`) && url.pathname.endsWith('/isValid')
  })

  await page.getByRole('button', { name: /continue to builder/i }).click()
  const response = await validationResponse
  expect(response.status()).toBe(200)
  return response
}

async function startServerBuilder (
  page: Page,
  game: 'minecraft' | 'hytale',
  host: string,
  port?: string
) {
  await page.goto('/')
  await waitForHydration(page)
  await chooseServerBanner(page, game === 'hytale' ? 'Hytale Server Banner' : 'Minecraft Server Banner')
  await fillServerDetails(page, host, port)

  const previewResponse = page.waitForResponse((response) => {
    const url = new URL(response.url())
    return url.pathname === `/banner/server/${game}/${host}/${port || (game === 'hytale' ? '5520' : '25565')}/banner.png`
  })

  await continueToBuilderAndCaptureValidation(page, game)
  await expect(page).toHaveURL(/\/builder$/)
  await expect(page.getByText(`Configure ${game === 'hytale' ? 'Hytale Server' : 'Minecraft Server'} Banner`)).toBeVisible()
  expect((await previewResponse).status()).toBe(200)
}

async function saveAndGetRequest (page: Page): Promise<Request> {
  const saveResponse = page.waitForResponse((response) => {
    return response.url().endsWith('/banner/saved/save') && response.request().method() === 'POST'
  })

  await page.getByTestId('builder-save-button').click()
  const response = await saveResponse
  expect(response.status()).toBe(200)
  return response.request()
}

test.describe('home server banner entry', () => {
  test('shows distinct Minecraft and Hytale server banner cards', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)

    await expect(page.getByRole('button', { name: /Resource Banner/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Author Banner/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Minecraft Server Banner/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Hytale Server Banner/i })).toBeVisible()
  })

  test('choosing Minecraft and Hytale sets the expected default ports', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)

    await chooseServerBanner(page, 'Minecraft Server Banner')
    await expect(page.locator('input[name="server-port"]')).toHaveValue('25565')

    await chooseServerBanner(page, 'Hytale Server Banner')
    await expect(page.locator('input[name="server-port"]')).toHaveValue('5520')
    await expect(page.getByText(/We recommend OneQuery/i)).toBeVisible()

    await chooseServerBanner(page, 'Minecraft Server Banner')
    await expect(page.locator('input[name="server-port"]')).toHaveValue('25565')
  })

  test('Minecraft validation and preview use explicit minecraft server routes', async ({ page }) => {
    await startServerBuilder(page, 'minecraft', 'play.example.test', '25565')
  })

  test('Hytale validation and preview use explicit hytale server routes', async ({ page }) => {
    await startServerBuilder(page, 'hytale', 'play.hytale.test', '5520')
  })

  test('save payload includes minecraft server_game metadata', async ({ page }) => {
    await startServerBuilder(page, 'minecraft', 'play.example.test', '25565')

    const body = await saveAndGetRequest(page).then(request => request.postDataJSON() as {
      metadata: Record<string, unknown>
      type: string
    })

    expect(body.type).toBe('MINECRAFT_SERVER')
    expect(body.metadata.server_host).toBe('play.example.test')
    expect(body.metadata.server_port).toBe(25565)
    expect(body.metadata.server_game).toBe('minecraft')
  })

  test('save payload includes hytale server_game metadata', async ({ page }) => {
    await startServerBuilder(page, 'hytale', 'play.hytale.test', '5520')

    const body = await saveAndGetRequest(page).then(request => request.postDataJSON() as {
      metadata: Record<string, unknown>
      type: string
    })

    expect(body.type).toBe('MINECRAFT_SERVER')
    expect(body.metadata.server_host).toBe('play.hytale.test')
    expect(body.metadata.server_port).toBe(5520)
    expect(body.metadata.server_game).toBe('hytale')
  })

  test('Hytale validation failure mentions OneQuery or PingProtocol', async ({ page }) => {
    await page.goto('/')
    await waitForHydration(page)
    await chooseServerBanner(page, 'Hytale Server Banner')
    await fillServerDetails(page, 'invalid.example.test', '5520')
    await continueToBuilderAndCaptureValidation(page, 'hytale')

    await expect(page.getByText(/OneQuery or Minecraft-compatible PingProtocol/i)).toBeVisible()
    await expect(page).toHaveURL('/')
  })
})
