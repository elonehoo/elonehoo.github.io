<template>
  <div class="antialiased">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <nav class="flex justify-between items-center py-10 font-bold">
        <a class="text-xl" href="/" aria-label="The Vue Point">
          <img
            class="inline-block mr-2"
            style="width: 36px; height: 31px"
            alt="logo"
            src="../../public/logo.svg"
          />
          <span v-if="!isIndex" class="hidden md:inline">The Elone Hoo Point</span>
        </a>
        <div class="text-sm text-gray-500 leading-5">
          <a
            class="hover:text-gray-700"
            href="https://elonehoo.xyz"
            target="_blank"
            rel="noopener"
            ><span class="hidden sm:inline">me </span></a
          >
          <span class="mr-2 ml-2">·</span>
          <a class="hover:text-gray-700" href="/">bl<span class="hidden sm:inline">og</span></a>
          <span class="mr-2 ml-2">·</span>
          <a
            class="hover:text-gray-700"
            href="https://github.com/xiaoxunyao"
            target="_blank"
            rel="noopener"
            >GitHub →</a
          >
        </div>
      </nav>
    </div>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <Home v-if="isIndex" />
      <Article v-else />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import Home from './Home.vue'
import Article from './Article.vue'

const route = useRoute()
const isIndex = computed(() => route.path.replace(/index.html$/, '') === '/')
</script>
