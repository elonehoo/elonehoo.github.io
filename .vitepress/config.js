import { defineConfig } from 'vitepress'

export default defineConfig({
  base:'/blog/',
  srcDir:'src',
  title: 'The Elone Hoo Point',
  description: "show Elhone Hoo's blog",
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  ],
  vite: {
    build: {
      minify: 'terser'
    }
  }
})
