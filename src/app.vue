<template>
    <map-widget></map-widget>
</template>

<script>
import MapWidget from "./components/map-widget"

export default {
    name: "App",
    components: {
        MapWidget
    },
    mounted() {
        this.$store.dispatch("initialize");
    }
}
</script>

<style>
#app {
    height: 100%;
    width: 100%;
}
</style>
