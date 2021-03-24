export default ({ app }, inject) => {
  inject('getSession', () => {
    const session = app.$cookies.get('session')
    if (!session) return {}
    else return session
  })

  inject('hasSession', () => {
    return Object.keys(app.$getSession()).length
  })

  inject('setSession', (session) => {
    app.$cookies.set('session', session, {
      domain: process.env.AUTH_COOKIE_DOMAIN,
    })
  })

  inject('killSession', (session) => {
    app.$cookies.remove('session', {
      domain: process.env.AUTH_COOKIE_DOMAIN,
    })
  })
}
