<template>
    <div id="map">
        <dose-rate-layer ref="doseRateLayer" />
        <radionuclide-layer ref="radionuclideLayer" />
        <feature-popover ref="featurePopover" />
        <feature-popup ref="featurePopup" />
        <map-legend v-if="isDoseRatesMode"/>
        <search-bar />
        <button-open-settings />
        <button-open-info />
        <button-change-mode />
        <settings-panel />
        <info-panel />
        <media-controller v-if="isDoseRatesMode"/>
        <the-header  v-if="isDoseRatesMode"/>
        <timepicker-list />
        <datepicker-popup />
        <vue-progress-bar />
    </div>
</template>

<script>
import DoseRateLayer from "@/components/layers/DoseRateLayer.vue"
import RadionuclideLayer from "@/components/layers/RadionuclideLayer.vue"
import MapLegend from "@/components/map-legend/MapLegend.vue"
import FeaturePopover from "@/components/feature-popover/FeaturePopover.vue"
import FeaturePopup from "@/components/feature-popup/FeaturePopup.vue"
import ButtonOpenSettings from "@/components/settings-panel/ButtonOpenSettings.vue"
import ButtonOpenInfo from "@/components/info-panel/ButtonOpenInfo.vue"
import ButtonChangeMode from "@/components/change-mode/ButtonChangeMode.vue"
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
import eventBus from "@/utils/eventBus"
import { defaultLayer, customLayer, applyCustomStyle } from "@/utils/mapSettings"

export default {
    name: "TheMap",
    components: {
        DoseRateLayer,
        RadionuclideLayer,
        FeaturePopover,
        FeaturePopup,
        MapLegend,
        SearchBar,
        ButtonOpenSettings,
        ButtonOpenInfo,
        ButtonChangeMode,
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
        mode() {
            return this.$store.state.settings.settings.mode
        },
        isDoseRatesMode() {
            return this.mode === "dose_rates"
        },
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
        },
        mode(newMode) {
            this.switchLayers(newMode === "dose_rates")
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

        if (this.$refs.featurePopover && this.$refs.featurePopover.overlay) {
            this.map.addOverlay(this.$refs.featurePopover.overlay)
        }
        if (this.$refs.featurePopup && this.$refs.featurePopup.overlay) {
            this.map.addOverlay(this.$refs.featurePopup.overlay)
        }
        this.switchLayers(this.mode === "dose_rates")
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
        switchLayers(isDoseRatesMode) {
            if (this.map) {
                const doseRateLayer = this.$refs.doseRateLayer ? this.$refs.doseRateLayer.vectorLayer : null
                const radionuclideLayer = this.$refs.radionuclideLayer ? this.$refs.radionuclideLayer.vectorLayer : null

                if (isDoseRatesMode) {
                    if (radionuclideLayer) {
                        this.map.removeLayer(radionuclideLayer)
                    }
                    if (doseRateLayer) {
                        this.map.addLayer(doseRateLayer)
                        this.onZoomChange()
                    }
                } else {
                    if (doseRateLayer) {
                        this.map.removeLayer(doseRateLayer)
                    }
                    if (radionuclideLayer) {
                        this.map.addLayer(radionuclideLayer)
                        this.onZoomChange()
                    }
                }
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
            this.$refs.radionuclideLayer.updateFeatureRadius(zoom)
        },
        centerViewOnFeaturePopup(feature) {
            if (this.map && this.$refs.featurePopup && this.$refs.featurePopup.$el) {
                const featureCoordinates = feature.getGeometry().getCoordinates()
                const featurePixel = this.map.getPixelFromCoordinate(featureCoordinates)

                featurePixel[1] -= (this.$refs.featurePopup.$el.clientHeight * 0.58)

                const position = this.map.getCoordinateFromPixel(featurePixel)

                this.map.getView().animate({
                    center: position,
                    duration: 750
                })
            }
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