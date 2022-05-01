<template>
  <div class="divide-y divide-gray-200">
    
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="
          text-3xl
          leading-9
          font-extrabold
          text-gray-900
          tracking-tight
          sm:text-4xl sm:leading-10
          md:text-6xl md:leading-14
        "
      >
        {{ $frontmatter.title }}
      </h1>
      <p class="text-lg leading-7 text-gray-500">
        {{ $frontmatter.subtext }}
      </p>
    </div>

    <div>
      <template v-for="key in Object.keys($frontmatter.projects)" :key="key">
        <h4 class="mt-10 font-bold">
          {{ key }}
        </h4>
        <div class="project-grid py-2 -mx-3 gap-2">
          <a
            v-for="item, idx in $frontmatter.projects[key]"
            :key="idx"
            class="item relative flex items-center"
            :href="item.link"
            target="_blank"
            :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
          >
            <div v-if="item.icon" class="pt-2 pr-5">
              <Proskit v-if="item.icon === 'proskit'" class="text-4xl opacity-50" />
              <Venmo v-else-if="item.icon === 'venmoAdmin'" class="text-4xl opacity-50" />
              <Highlight v-else-if="item.icon === 'paragraphHighlight'" class="text-4xl opacity-50" />
              <Typing v-else-if="item.icon === 'typing'" class="text-4xl opacity-50" />
              <Jumper v-else-if="item.icon === 'jumper'" class="text-4xl opacity-50" />
              <TZFE v-else-if="item.icon === '2048'" class="text-4xl opacity-50" />
              <Sudoku v-else-if="item.icon === 'sudoku'" class="text-4xl opacity-50" />
              <Mathler v-else-if="item.icon === 'mathler'" class="text-4xl opacity-50" />
              <Dwen v-else-if="item.icon === 'dwen'" class="text-4xl opacity-50" />
              <Avatar v-else-if="item.icon === 'avatar'" class="text-4xl opacity-50" />
              <MiniSweeper v-else-if="item.icon === 'minisweeper'" class="text-4xl opacity-50" />
              <Looptap v-else-if="item.icon === 'looptap'" class="text-4xl opacity-50" />
              <Pacman v-else-if="item.icon === 'pacman'" class="text-4xl opacity-50" />
              <Tetris v-else-if="item.icon === 'tetris'" class="text-4xl opacity-50" />
              <Decolorization v-else-if="item.icon === 'decolorization'" class="text-4xl opacity-50" />
              <Vitetem v-else-if="item.icon === 'vitetem'" class="text-4xl opacity-50" />
              <Mini v-else-if="item.icon === 'mini'" class="text-4xl opacity-50" />
              <Life v-else-if="item.icon === 'life'" class="text-4xl opacity-50" />
              <Car v-else-if="item.icon === 'car'" class="text-4xl opacity-50" />
              <TetrisCli v-else-if="item.icon === 'tetrisCli'" class="text-4xl opacity-50" />
              <History v-else-if="item.icon === 'history'" class="text-4xl opacity-50" />
              <Axios v-else-if="item.icon === 'axios'" class="text-4xl opacity-50" />
              <XiaoTools v-else-if="item.icon === 'xiaoTools'" class="text-4xl opacity-50" />
              <Patterns v-else-if="item.icon === 'patterns'" class="text-4xl opacity-50" />
              <Algorithm v-else-if="item.icon === 'algorithm'" class="text-4xl opacity-50" />
              <RestfulReturn v-else-if="item.icon === 'restfulReturn'" class="text-4xl opacity-50" />
              <Simple v-else-if="item.icon === 'simple'" class="text-4xl opacity-50" />
              <Vitem_mini v-else-if="item.icon === 'vitem-mini'" class="text-4xl opacity-50" />
              <Ritem_mini v-else-if="item.icon === 'ritem-mini'" class="text-4xl opacity-50" />
              <Titem_mini v-else-if="item.icon === 'titem-mini'" class="text-4xl opacity-50" />
              <Trois v-else-if="item.icon === 'trois'" class="text-4xl opacity-50" />
              <Eslint v-else-if="item.icon === 'eslint'" class="text-4xl opacity-50" />
              <Titem v-else-if="item.icon === 'titem'" class="text-4xl opacity-50" />
              <Unknown v-else class="text-4xl opacity-50" />
            </div>
            <div class="flex-auto">
              <div cla ss="text-normal">{{ item.name }}</div>
              <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
            </div>
          </a>
        </div>
      </template>
    </div>

    <div>
      <br />
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<script setup>
import Proskit from './icon/Proskit.vue'
import Venmo from './icon/Venmo.vue'
import Highlight from './icon/Highlight.vue'
import Typing from './icon/Typing.vue'
import Unknown from './icon/Unknown.vue'
import Jumper from './icon/Jumper.vue'
import TZFE from './icon/TZFE.vue'
import Sudoku from "./icon/Sudoku.vue"
import Mathler from './icon/Mathler.vue'
import Dwen from './icon/Dwen.vue'
import Avatar from './icon/Avatar.vue'
import MiniSweeper from './icon/Minisweeper.vue'
import Looptap from './icon/Looptap.vue'
import Pacman from './icon/Pacman.vue'
import Tetris from './icon/Tetris.vue'
import Decolorization from './icon/Decolorization.vue'
import Vitetem from './icon/Vitetem.vue'
import Mini from './icon/Mini.vue'
import Life from './icon/Life.vue'
import Car from './icon/Car.vue'
import TetrisCli from './icon/TetrisCli.vue'
import History from './icon/History.vue'
import Axios from './icon/Axios.vue'
import XiaoTools from './icon/XiaoTools.vue'
import Patterns from './icon/Patterns.vue'
import Algorithm from './icon/Algorithm.vue'
import RestfulReturn from './icon/RestfulReturn.vue'
import Simple from './icon/Simple.vue'
import Vitem_mini from './icon/Vitem-mini.vue'
import Ritem_mini from './icon/Ritem-mini.vue'
import Titem_mini from './icon/Titem-mini.vue'
import Trois from './icon/Trois.vue'
import Titem from './icon/Titem.vue'
import Eslint from './icon/Eslint.vue'
</script>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
.project-grid a.item {
  padding: 0.8em 1em;
  background: transparent;
  font-size: 1.1rem;
}
.project-grid a.item:hover {
  background: #88888808;
}
</style>
