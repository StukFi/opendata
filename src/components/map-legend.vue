<template>
    <div class="map-legend">
        <div class="map-legend__bar" v-for="item in settings.doseRates.slice(0, -1)" v-bind:style="{backgroundColor: item.color}">{{item.minValue | formatNumber}} - {{item.maxValue | formatNumber}}</div>
        <div class="map-legend__bar" v-bind:style="{backgroundColor: settings.doseRates.slice(-1)[0].color}">&gt; {{settings.doseRates.slice(-1)[0].minValue}} &#181;Sv</div>
    </div>
</template>

<script>
import Settings from "../mixins/settings"

export default {
    name: "MapLegend",
    mixins: [Settings],
    filters: {
        formatNumber: function(value) {
            return value.toFixed(2);
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
