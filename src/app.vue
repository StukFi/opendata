<template>
    <map-widget></map-widget>
</template>

<script>
import MapWidget from "./components/map-widget.vue"

export default {
    name: "App",
    components: {
        MapWidget
    }
}
</script>

<style>
#app {
    height: 100%;
    width: 100%;
}
</style>
