<template>
    <div
        id="map"
    >
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
import DoseRateLayer from "./layers/DoseRateLayer"
import MapLegend from "@/components/map-legend/MapLegend"
import FeaturePopover from "@/components/feature-popover/FeaturePopover"
import FeaturePopup from "@/components/feature-popup/FeaturePopup"
import ButtonOpenSettings from "@/components/settings-panel/ButtonOpenSettings"
import ButtonOpenInfo from "@/components/info-panel/ButtonOpenInfo"
import SettingsPanel from "@/components/settings-panel/SettingsPanel"
import InfoPanel from "@/components/info-panel/InfoPanel"
import MediaController from "@/components/media-controller/MediaController"
import SearchBar from "@/components/search-bar/SearchBar"
import TheHeader from "@/components/header/TheHeader"
import TimepickerList from "@/components/header/time/timepicker/TimepickerList"
import DatepickerPopup from "@/components/header/date/DatepickerPopup"

import ControlZoom from "ol/control/Zoom"
import ControlZoomSlider from "ol/control/ZoomSlider"
import ControlScaleLine from "ol/control/ScaleLine"
import { fromLonLat } from "ol/proj"
import Map from "ol/Map"
import OSMSource from "ol/source/OSM"
import TileLayer from "ol/layer/Tile"
import View from "ol/View"

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
    data: function () {
        return {
            map: {}
        }
    },
    mounted: function () {
        this.map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSMSource({
                        url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    })
                })
            ],
            controls: [
                new ControlZoom(),
                new ControlZoomSlider(),
                new ControlScaleLine(),
            ],
            view: new View({
                center: fromLonLat([25.75, 65.75]),
                enableRotation: false,
                minZoom: 4,
                maxZoom: 10,
                zoom: 5
            })
        })

        this.map.on("click", this.onMapInteraction)
        this.map.on("pointermove", this.onMapInteraction)
        this.map.on("moveend", this.onZoomChange)
        this.$root.$on("featurePopupOpened", this.centerViewOnFeaturePopup)

        this.map.addOverlay(this.$refs.featurePopover.overlay)
        this.map.addOverlay(this.$refs.featurePopup.overlay)
        this.map.addLayer(this.$refs.doseRateLayer.vectorLayer)
    },
    methods: {
        onMapInteraction (evt) {
            var eventPixel = this.map.getEventPixel(evt.originalEvent)
            var features = this.map.getFeaturesAtPixel(eventPixel)
            if (features) {
                if (evt.type == "click") {
                    this.$root.$emit("featureClicked", features[0])
                }
                else if (evt.type == "pointermove") {
                    this.$root.$emit("featureHovered", features[0])
                }
            }
            else {
                if (evt.type == "click") {
                    this.$root.$emit("emptyMapLocationClicked")
                }
                else if (evt.type == "pointermove") {
                    this.$root.$emit("emptyMapLocationHovered")
                }
            }
        },
        onZoomChange () {
            let zoom = this.map.getView().getZoom()
            this.$refs.doseRateLayer.updateFeatureRadius(zoom)
        },
        centerViewOnFeaturePopup (feature) {
            var featureCoordinates = feature.getGeometry().getCoordinates()
            var featurePixel = this.map.getPixelFromCoordinate(featureCoordinates)

            // Adjust the y-coordinate so that the view is centered towards
            // the middle of the popup and not on the clicked feature itself.
            featurePixel[1] -= (this.$refs.featurePopup.$el.clientHeight * 0.65)

            var position = this.map.getCoordinateFromPixel(featurePixel)

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
