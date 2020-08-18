<template>
    <div
        :style="{backgroundColor: this.mapLegend.thresholds[index].color}"
        :class="{'map-legend__bar--disabled': !this.mapLegend.thresholds[index].isEnabled}"
        class="map-legend__bar"
    >
        {{ label }}
    </div>
</template>

<script>
export default {
    name: "MapLegendBar",
    props: {
        mapLegend: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    computed: {
        label () {
            const isRightmost = this.index == this.mapLegend.thresholds.length - 1
            if (isRightmost) {
                return `> ${this.mapLegend.thresholds[this.index].value} ${this.unit}`
            }
            else {
                return `${this.mapLegend.thresholds[this.index].value} - ${this.mapLegend.thresholds[this.index + 1].value}`
            }
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
