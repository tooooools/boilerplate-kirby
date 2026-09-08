import { networkInterfaces } from 'os'
import { globSync } from 'glob'
import { resolve } from 'path'
import kirby from 'vite-plugin-kirby'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

const input = globSync([
  'src/index.{js,css,scss}',
  'src/*.{js,css,scss}'
]).map(path => resolve(process.cwd(), path))

const ips = (() => {
  const nets = networkInterfaces()
  const results = {}
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
        results[name] ??= []
        results[name].push(net.address)
      }
    }
  }
  return results
})()

export default ({ mode }) => ({
  root: 'src',
  base: mode === 'development' ? '/' : '/dist/',

  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },

  build: {
    outDir: resolve(process.cwd(), 'public/dist'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: { input }
  },

  server: {
    // Dynamic host so that external browsersync can correctly handle vite assets
    host: (ips.en0 ?? [])[0] ?? '0.0.0.0',
    cors: true
  },

  plugins: [
    kirby({
      watch: [
        '../site/blueprints/**/*.yml',
        '../site/(templates|snippets|controllers|config|models|languages|layouts)/**/*.php',
        // '../content/**/*.txt'
        // '!../content/**/_changes/**'
      ]
    }),
    VitePluginBrowserSync({
      dev: {
        bs: {
          port: 8080,
          proxy: 'localhost:8888',
          notify: false,
          codeSync: true,
          ghostMode: false
        }
      }
    })
  ],

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['mixed-decls'],
        additionalData: `
          @use '/style/_helpers' as *;
          @use '/style/_devices' as *;
          $env: ${mode};
        `
      }
    }
  }
})
