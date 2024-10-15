<script lang="ts">
import { X } from 'lucide-vue-next';

export default {
    components: {
        X
    }
}
</script>

<template>
    <div class="popup dp-flex jc-c ai-c">
        <div class="popup-container">
            <slot />
            <X class="close-icon" clickable @click="$emit('close')" color="red" />
        </div>
    </div>
</template>

<style scoped>
.popup {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    backdrop-filter: blur(4px);
}

.popup-container {
    background-color: var(--body-bg);
    padding: 2rem;
    filter: drop-shadow(0 0 10px white);
    border-radius: .5rem;
    position: relative;
}

.close-icon {
    translate: calc(-25%) calc(25%);
    position: absolute;
    top: 0;
    right: 0
}
</style>