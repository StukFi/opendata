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

<style>
.map-legend {
    display: flex;
    position: absolute;
    bottom: 0;
    z-index: 3;
    width: 100%;
    height: 25px;
    line-height: 25px;
    background-color: rgba(204, 229, 236, 1);
    text-align: center;
    font-size: 0.65em;
}

.map-legend:hover {
    cursor: pointer;
}

@media only screen and (min-width: 768px) {
    .map-legend {
        height: 30px;
        line-height: 30px;
        font-size: 0.9em;
    }
}
</style>
