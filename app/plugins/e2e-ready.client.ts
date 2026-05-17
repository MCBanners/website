export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    await nextTick()

    ;(window as unknown as { __MCBANNERS_E2E_READY__?: boolean }).__MCBANNERS_E2E_READY__ = true
    document.documentElement.dataset.e2eReady = 'true'
  })
})
