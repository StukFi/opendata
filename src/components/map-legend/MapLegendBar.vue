<template>
    <div
        :style="{backgroundColor: mapLegendBar.color}"
        :class="{'map-legend__bar--disabled': !mapLegendBar.isEnabled}"
        class="map-legend__bar"
        @click="$emit('click')"
    >
        {{ mapLegendBar.label }}
    </div>
</template>

<script>
export default {
    name: "MapLegendBar",
    props: {
        mapLegendBar: {
            type: Object,
            required: true
        }
    },
    emits: ['click']
}
</script>

<style lang="scss">
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
</style>
