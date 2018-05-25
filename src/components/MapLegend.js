Vue.component('map-legend', {
    mixins: [settings],
    filters: {
        formatNumber: function(value) {
            return value.toFixed(2);
        }
    },
    template: `
    <div id="map-legend">
        <p>Dose rate [\u03bcSv/h]</p>
        <div class="map-legend-bar" v-bind:style="{backgroundColor: settings.doseRates.slice(-1)[0].color}">&gt; {{settings.doseRates.slice(-1)[0].minValue}}</div>
        <div class="map-legend-bar" v-for="item in settings.doseRates.slice(0, -1).reverse()" v-bind:style="{backgroundColor: item.color}">{{item.minValue | formatNumber}} - {{item.maxValue | formatNumber}}</div>
    </div>
    `
});
