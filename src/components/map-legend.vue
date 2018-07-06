<template>
    <div class="map-legend">
        <div class="map-legend__bar" v-for="(item, index) in doseRateRanges" v-bind:style="{backgroundColor: item.color}">{{(index == doseRateRanges.length - 1) ? "&gt; " + item.minValue.toFixed(2) + " &#181;Sv" : item.minValue.toFixed(2) + " - " + item.maxValue.toFixed(2)}}</div>
    </div>
</template>

<script>
export default {
    name: "MapLegend",
    computed: {
        doseRateRanges() {
            return this.$store.state.settings.doseRateRanges;
        }
    }
}
</script>

<style>
.map-legend {
    position: absolute;
    bottom: 0;
    z-index: 10000;
    width: 100%;
    height: 25px;
    line-height: 25px;
    background-color: rgba(204, 229, 236, 1);
    text-align: center;
    font-size: 0.65em;
    user-select: none;
}

.map-legend__bar {
    display: inline-block;
    float: left;
    width: 20%;
    height: 100%;
    margin: 0px auto;
    color: white;
}

@media only screen and (min-width: 768px) {
    .map-legend {
        height: 30px;
        line-height: 30px;
        font-size: 0.9em;
    }
}
</style>
