<script lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue';

import { go, go_outwards } from './scripts/routing';

export default {
  components: {
    AppNavbar,
    RouterView
  },
  setup() {
    return {
      go, go_outwards
    }
  }
}
</script>

<template>
  <AppNavbar class="jc-sb">
    <div class="dp-flex gap-4">
      <span @click="go('/')" clickable shadow underlined>Trackmania Archive</span>
      <div class="dp-flex gap-2">
        <span @click="go('/users')" clickable shadow underlined>Users</span>
        <span @click="go('/skins')" clickable shadow underlined>Skins</span>
      </div>
    </div>
    <div class="dp-flex gap-3">
      <span @click="go_outwards('https://github.com/Fysheep')" clickable underlined shadow> GitHub </span>
    </div>
  </AppNavbar>
  <RouterView />
</template>
