<template>
    <the-map />
</template>

<script>
import TheMap from "./components/TheMap"

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
#app {
    height: 100%;
    width: 100%;
    font-family: $font-medium;
    color: $color-font-light;
}

:root {
    font-size: 1em;
}

@media (min-width: $breakpoint-md) {
    :root {
        font-size: 1.25em;
    }
}

@media (min-width: $breakpoint-lg) {
    :root {
        font-size: 1.5em;
    }
}
</style>
