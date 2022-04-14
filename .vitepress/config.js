import { defineConfig } from 'vitepress'

export default defineConfig({
  base:'/',
  title: 'Elone Hoo',
  description: "Hi, I'm Elone Hoo.",
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
