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
}

:root {
    font-size: 0.75em;
}

@media (min-width: $breakpoint-md) {
    :root {
        color: red !important;
        font-size: 1em;
    }
}

@media (min-width: $breakpoint-lg) {
    :root {
        font-size: 1.5em;
    }
}
</style>
