<template>
    <div class="map-legend">
        <map-legend-bar
            v-for="(mapLegendBar, index) in mapLegendBars"
            :key="index"
            :map-legend-bar="mapLegendBar"
            @click="toggle(index)"
        />
    </div>
</template>

<script>
import MapLegendBar from "./MapLegendBar"

export default {
    name: "MapLegend",
    components: {
        MapLegendBar
    },
    computed: {
        mapLegendBars () {
            return this.$store.state.settings.settings.mapLegend.bars
        }
    },
    methods: {
        toggle (index) {
            this.$store.state.settings.settings.mapLegend.toggleBar(index)
        }
    }
}
</script>

<style lang="scss">
.map-legend {
    display: flex;
    position: absolute;
    bottom: 0;
    z-index: $z-index-map-legend;
    width: 100%;
    height: 3em;
    line-height: 3em;
    background-color: rgba(204, 229, 236, 1);
    text-align: center;
    font-size: $font-sm;
    font-family: $font-medium;
}

.map-legend:hover {
    cursor: pointer;
}
</style>
