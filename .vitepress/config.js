import { defineConfig } from 'vitepress'

export default defineConfig({
  base:'/',
  title: 'The Elone Hoo Blog',
  description: "show Elhone Hoo's blog",
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/logo.svg'
      }
    ]
  ],
  vite: {
    build: {
      minify: 'terser'
    }
  }
})
