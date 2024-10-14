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
    <span @click="go('/')" clickable shadow>Sample Project</span>
    <div class="dp-flex gap-3">
      <span @click="go_outwards('https://github.com/Fysheep')" clickable underlined shadow> GitHub </span>
    </div>
  </AppNavbar>
  <RouterView />
</template>
