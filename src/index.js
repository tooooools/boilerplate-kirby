import { bootstrap } from '/core/Barba'
import mediaReady from '/utils/media-ready'

;(async () => {
  bootstrap({
    views: [
      await import('/views/default')
    ],

    components: {
      // Outside barba wrapper
      global: [],

      // Inside barba wrapper
      local: [
        await import('/components/Hello'),
      ]
    },

    afterEnter: async next => {
      // Update manually as Barba payload does not include <header>
      document.title = next.container.dataset.title

      // Flag native lazy loading so that we can animate in CSS
      Promise.all(Array.from(next.container.querySelectorAll('video, [loading="lazy"]')).map(async el => {
        await mediaReady(el)
        el.classList.add('is-loaded')
      }))
    },

    after: next => {
      // Reset scroll position, handling url hash
      if (next?.url.hash) next.container.querySelector('#' + next.url.hash)?.scrollIntoView()
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  })
})()
