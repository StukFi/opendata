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

<style>
#app {
    height: 100%;
    width: 100%;
}
</style>
