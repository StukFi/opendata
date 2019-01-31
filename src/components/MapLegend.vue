<template>
    <div class="map-legend">
        <div
            v-for="(item, index) in doseRateRanges"
            :key="index"
            :style="{backgroundColor: item.color}"
            :class="{'map-legend__bar--disabled': !item.enabled}"
            class="map-legend__bar"
            @click="toggleDoseRateRange(index)">{{ (index == doseRateRanges.length - 1) ? "&gt; " + item.minValue.toFixed(2) + " &#181;Sv/h" : item.minValue.toFixed(2) + " - " + item.maxValue.toFixed(2) }}</div>
    </div>
</template>

<script>
export default {
    name: "MapLegend",
    computed: {
        doseRateRanges () {
            return this.$store.state.settings.doseRateRanges
        }
    },
    methods: {
        toggleDoseRateRange (index) {
            this.$store.commit("toggleDoseRateRange", index)
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

.map-legend__bar {
    width: 20%;
    height: 100%;
    flex-basis: auto;
    flex-grow: 1;
    flex-shrink: 1;
    margin: 0px auto;
    color: white;
}

.map-legend__bar--disabled {
    color: rgba(255, 255, 255, 0.2);
    background-color: rgba(80, 80, 80) !important;
}

@media only screen and (min-width: 768px) {
    .map-legend {
        height: 30px;
        line-height: 30px;
        font-size: 0.9em;
    }
}
</style>
