<template>
    <map-widget></map-widget>
</template>

<script>
import MapWidget from "./components/MapWidget"

export default {
    name: "App",
    components: {
        MapWidget
    },
    mounted() {
        this.$store.dispatch("initialize");

        // Update available dates and times periodically by getting
        // the latest metadata from the server every 10 minutes.
        var that = this;
        setInterval(function() {
            that.$store.dispatch("updateAvailableDatetimes");
        }, 600000);
    }
}
</script>

<style>
#app {
    height: 100%;
    width: 100%;
}
</style>