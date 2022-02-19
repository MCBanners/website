import isEmpty from 'lodash.isempty'

export default ({ app }, inject) => {
  inject('handleReqRes', (req) => {
    return req
      .then((resp) => {
        return resp
      })
      .catch((resp) => {
        if (resp.response) {
          return resp.response
        } else {
          return {
            status: 503,
            data: resp.message,
          }
        }
      })
  })

  inject('addAuthHeader', () => {
    const session = app.$getSession()

    const headers = {
      headers: {
        Authorization: '',
      },
    }

    if (!isEmpty(session)) {
      headers.headers.Authorization = `Bearer ${session.token}`
    }

    return headers
  })
}
