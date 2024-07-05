<template>
    <div id="map">
        <dose-rate-layer ref="doseRateLayer" />
        <feature-popover ref="featurePopover" />
        <feature-popup ref="featurePopup" />
        <map-legend />
        <search-bar />
        <button-open-settings />
        <button-open-info />
        <settings-panel />
        <info-panel />
        <media-controller />
        <the-header />
        <timepicker-list />
        <datepicker-popup />
        <vue-progress-bar />
    </div>
</template>

<script>
import DoseRateLayer from "@/components/layers/DoseRateLayer.vue"
import MapLegend from "@/components/map-legend/MapLegend.vue"
import FeaturePopover from "@/components/feature-popover/FeaturePopover.vue"
import FeaturePopup from "@/components/feature-popup/FeaturePopup.vue"
import ButtonOpenSettings from "@/components/settings-panel/ButtonOpenSettings.vue"
import ButtonOpenInfo from "@/components/info-panel/ButtonOpenInfo.vue"
import SettingsPanel from "@/components/settings-panel/SettingsPanel.vue"
import InfoPanel from "@/components/info-panel/InfoPanel.vue"
import MediaController from "@/components/media-controller/MediaController.vue"
import SearchBar from "@/components/search-bar/SearchBar.vue"
import TheHeader from "@/components/header/TheHeader.vue"
import TimepickerList from "@/components/header/time/timepicker/TimepickerList.vue"
import DatepickerPopup from "@/components/header/date/DatepickerPopup.vue"

import { Zoom, ZoomSlider, ScaleLine } from "ol/control"
import { fromLonLat } from "ol/proj"
import { Map, View } from "ol"
import { OSM, VectorTile } from "ol/source"
import TileLayer from "ol/layer/Tile"
import VectorTileLayer from "ol/layer/VectorTile"
import MVT from "ol/format/MVT"
import eventBus from "@/utils/eventBus"
import { defaultLayer, customLayer, applyCustomStyle } from "@/utils/mapSettings"

export default {
    name: "TheMap",
    components: {
        DoseRateLayer,
        FeaturePopover,
        FeaturePopup,
        MapLegend,
        SearchBar,
        ButtonOpenSettings,
        ButtonOpenInfo,
        SettingsPanel,
        InfoPanel,
        MediaController,
        TheHeader,
        TimepickerList,
        DatepickerPopup
    },
    emits: ['featureClicked', 'featureHovered', 'emptyMapLocationClicked', 'emptyMapLocationHovered'],
    data() {
        return {
            map: null,
            baseLayer: null,
            default: defaultLayer,
            custom: customLayer,
            customStyle: applyCustomStyle
        }
    },
    computed: {
        selectedBaseLayer() {
            return this.getBaseLayer()
        }
    },
    watch: {
        selectedBaseLayer(newLayer) {
            if (this.map) {
                const layers = this.map.getLayers()
                layers.setAt(0, newLayer)
            }
        }
    },
    mounted() {
        this.baseLayer = this.selectedBaseLayer

        this.map = new Map({
            target: "map",
            layers: [this.baseLayer],
            controls: [
                new Zoom(),
                new ZoomSlider(),
                new ScaleLine(),
            ],
            view: new View({
                center: fromLonLat([25.75, 65.75]),
                enableRotation: false,
                minZoom: 4,
                maxZoom: 16,
                zoom: 5,
            })
        })

        // Make const customLayer default layer, if no customLayer defined in mapSettings.js
        // Only apply style if a style is defined
        if (this.custom === undefined) {
            this.custom = this.default
        }
        else if (this.customStyle !== undefined) {
            this.customStyle(this.custom)
        }

        this.map.on("click", this.onMapInteraction)
        this.map.on("pointermove", this.onMapInteraction)
        this.map.on("moveend", this.onZoomChange)
        eventBus.$on("featurePopupOpened", this.centerViewOnFeaturePopup)

        this.map.addOverlay(this.$refs.featurePopover.overlay)
        this.map.addOverlay(this.$refs.featurePopup.overlay)
        this.map.addLayer(this.$refs.doseRateLayer.vectorLayer)
    },
    methods: {
        getBaseLayer() {
            switch (this.$store.state.settings.settings.backgroundMap) {
                case "custom":
                    return this.custom
                case "default":
                    return this.default
                default:
                    return this.default
            }
        },
        onMapInteraction(evt) {
            var eventPixel = this.map.getEventPixel(evt.originalEvent)
            var features = this.map.getFeaturesAtPixel(eventPixel, {
                layerFilter: (layer) => layer !== this.custom
            })
            if (features.length > 0) {
                if (evt.type == "click") {
                    eventBus.$emit("featureClicked", features[0])
                } else if (evt.type == "pointermove") {
                    eventBus.$emit("featureHovered", features[0])
                }
            } else {
                if (evt.type == "click") {
                    eventBus.$emit("emptyMapLocationClicked")
                } else if (evt.type == "pointermove") {
                    eventBus.$emit("emptyMapLocationHovered")
                }
            }
        },
        onZoomChange() {
            const zoom = this.map.getView().getZoom()
            this.$refs.doseRateLayer.updateFeatureRadius(zoom)
        },
        centerViewOnFeaturePopup(feature) {
            const featureCoordinates = feature.getGeometry().getCoordinates()
            const featurePixel = this.map.getPixelFromCoordinate(featureCoordinates)

            // Adjust the y-coordinate so that the view is centered towards
            // the middle of the popup and not on the clicked feature itself.
            featurePixel[1] -= (this.$refs.featurePopup.$el.clientHeight * 0.65)

            const position = this.map.getCoordinateFromPixel(featurePixel)

            this.map.getView().animate({
                center: position,
                duration: 750
            })
        }
    }
}
</script>

<style>
#map {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>