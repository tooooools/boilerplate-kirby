import Barba from '@barba/core'
import prefetch from '@barba/prefetch'
import noop from '/utils/noop'

// Init the Barba wrapper
export function bootstrap ({
  views = [],
  components = { global: [], local: [] },
  afterEnter = noop,
  after = noop
} = {}) {
  Barba.use(prefetch)
  Barba.init({
    debug: import.meta.env.DEV,
    prevent: ({ el }) => el?.classList?.contains('no-barba'),
    views: views.map(view => view.default),
    transitions: [{
      sync: false,
      once: data => {
        try {
          // Find and hydrate all global components
          for (const { selector, hydrate } of components.global) {
            Array.from(document.querySelectorAll(selector)).map(hydrate)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }]
  })

  const refs = new Set()

  Barba.hooks.afterEnter(({ next }) => {
    try {
      // Hydrate all possible components, keeping a ref
      for (const { selector, hydrate } of components.local) {
        for (const el of next.container.querySelectorAll(selector)) {
          refs.add(hydrate(el))
        }
      }

      // Clear selection
      window.getSelection()?.empty?.() ?? window.getSelection()?.removeAllRanges?.() ?? document.selection?.empty()

      // Callback
      afterEnter(next)

      // Flag document as ready
      document.body.classList.add('is-ready')
    } catch (e) {
      console.error(e)
    }
  })

  Barba.hooks.after(({ next }) => {
    try {
      after(next)
    } catch (e) {
      console.error(e)
    }
  })

  Barba.hooks.afterLeave(() => {
    try {
      // Destroy previous components refs if any
      for (const ref of refs) ref?.destroy?.()
      refs.clear()
    } catch (e) {
      console.error(e)
    }
  })
}

// Describe a BarbaView used in Barba.bootstrap
export class BarbaView {
  constructor (namespace, hooks) {
    this.namespace = namespace
    this.hooks = hooks
  }

  _callHook (hookName, data) {
    if (!this.hooks[hookName]) return
    this.hooks[hookName].call(this, data)
  }

  // SEE https://barba.js.org/docs/advanced/hooks/#Base-hooks
  beforeEnter (data) {
    this.refs = {}
    this.state = {}

    this._callHook('beforeEnter', data)
  }

  afterEnter (data) {
    this._callHook('afterEnter', data)
  }

  beforeLeave (data) {
    this._callHook('beforeLeave', data)
  }

  afterLeave (data) {
    this._callHook('afterLeave', data)

    for (const k in this.refs) {
      this.refs[k]?.destroy?.()
      delete this.refs[k]
    }

    for (const k in this.state) delete this.state[k]

    this.refs = {}
    this.state = {}
  }
}

export default { bootstrap, BarbaView }
