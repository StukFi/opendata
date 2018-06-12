<template>
    <div id="map-legend">
        <p>Dose rate [&#181;Sv/h]</p>
        <div class="map-legend-bar" v-bind:style="{backgroundColor: settings.doseRates.slice(-1)[0].color}">&gt; {{settings.doseRates.slice(-1)[0].minValue}}</div>
        <div class="map-legend-bar" v-for="item in settings.doseRates.slice(0, -1).reverse()" v-bind:style="{backgroundColor: item.color}">{{item.minValue | formatNumber}} - {{item.maxValue | formatNumber}}</div>
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
#map-legend {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 10000;
    width: 200px;
    height: auto;
    background-color: rgba(204, 229, 236, 1);
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 10px 10px 15px 10px;
    text-align: center;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.map-legend-bar {
    width: 90%;
    height: 25px;
    line-height: 25px;
    margin: 0px auto;
    color: white;
    font-size: 0.8em;
}
</style>
