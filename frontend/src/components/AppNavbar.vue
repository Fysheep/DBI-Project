<script lang="ts">
export default {

}
</script>

<template>
    <nav class="dp-flex gap-1">
        <div id="navbar-border" class="fgr-1">
            <div id="navbar" class="dp-flex ai-c fgr-1" :class="$attrs.class">
                <slot />

            </div>
        </div>
    </nav>
    <div id="nav-spacer" />
</template>

<style scoped>
nav {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
}

#navbar-border {
    --padding: .4rem;

    background: var(--nav-border);
    margin: .5rem .5rem 0 .5rem;
    padding: var(--padding);
    border-radius: calc(var(--nav-radius) + var(--padding));
}

#navbar {
    background: var(--nav-bg);
    border-radius: var(--nav-radius);

    height: var(--nav-height);

    padding: .5rem 1rem;
}

#nav-spacer {
    height: var(--nav-height-outer);
}
</style>