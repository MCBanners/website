export default ({ app }, inject) => {
  inject('getSession', () => {
    const token = app.$cookies.get('token')
    if (!token) return {}
    else return { token }
  })

  inject('hasSession', () => {
    return !!app.$getSession().token
  })

  inject('setSession', (token) => {
    app.$cookies.set('token', token, {
      domain: process.env.AUTH_COOKIE_DOMAIN
    })
  })

  inject('killSession', (token) => {
    app.$cookies.remove('token', {
      domain: process.env.AUTH_COOKIE_DOMAIN
    })
  })
}
