import _ from 'lodash'
import { updatedDiff } from 'deep-object-diff'

export default {
  computed: {
    modifiedParams() {
      let copy = _.clone(this._data)
      copy = this.cleanupModifiedParams(copy)
      return updatedDiff(this.defaults, copy)
    },
    recompiledParams() {
      if (!Object.keys(this.modifiedParams).length) return {}

      const objs = [].concat.apply(
        [],
        Object.entries(this.modifiedParams).map((entry) => {
          const namespace = entry[0]

          const subObject = this.modifiedParams[namespace]
          if (subObject && typeof subObject.valueOf() === 'string') {
            const out = {}
            out[namespace] = subObject
            return out
          }

          const pieces = Object.entries(subObject).map((childEntry) => {
            const out = {}
            out[namespace + '__' + childEntry[0]] = childEntry[1]
            return out
          })

          return pieces
        })
      )

      return Object.assign({}, ...objs)
    },
    queryParams() {
      if (!Object.keys(this.recompiledParams).length) return ''
      return `?${Object.keys(this.recompiledParams)
        .map((key) => key + '=' + this.recompiledParams[key])
        .join('&')}`
    },
    bannerURL() {
      const base = this.baseURL
      if (!this.queryParams) return base
      return base + this.queryParams
    }
  }
}
