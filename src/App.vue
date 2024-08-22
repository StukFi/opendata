<template>
    <the-map />
</template>

<script>
import TheMap from "@/components/TheMap.vue"

export default {
    name: "App",
    components: {
        TheMap
    },
    mounted () {
        this.$store.dispatch("initialize")
    }
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";

#app {
    height: 100%;
    width: 100%;
    font-family: $font-medium;
    color: $color-font-light;
}

:root {
    font-size: 0.875em;
}

@media (min-width: $breakpoint-sm) {
    :root {
        font-size: $font-sm;
    }
}

@media (min-width: $breakpoint-md) {
    :root {
        font-size: $font-md;
    }
}

@media (min-width: $breakpoint-lg) {
    :root {
        font-size: $font-lg;
    }
}

@media (min-width: $breakpoint-xl) {
    :root {
        font-size: $font-xl;
    }
}
</style>
