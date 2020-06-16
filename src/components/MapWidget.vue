<template>
    <div
        id="map"
    >
        <dose-rate-layer ref="doseRateLayer" />
        <feature-popover ref="featurePopover" />
        <feature-popup ref="featurePopup" />
        <map-legend />
        <search-bar />
        <settings-panel />
        <media-controller />
        <the-header />
    </div>
</template>

<script>
import DoseRateLayer from "./DoseRateLayer"
import FeaturePopover from "./FeaturePopover"
import FeaturePopup from "./FeaturePopup"
import MapLegend from "./MapLegend"
import SettingsPanel from "@/components/settings-panel/SettingsPanel"
import MediaController from "@/components/media-controller/MediaController"
import SearchBar from "@/components/search-bar/SearchBar"
import TheHeader from "@/components/header/TheHeader"

import ControlZoom from "ol/control/Zoom"
import ControlZoomSlider from "ol/control/ZoomSlider"
import ControlScaleLine from "ol/control/ScaleLine"
import ControlMousePosition from "ol/control/MousePosition"
import { createStringXY } from "ol/coordinate"
import { fromLonLat } from "ol/proj"
import Map from "ol/Map"
import OSMSource from "ol/source/OSM"
import TileLayer from "ol/layer/Tile"
import View from "ol/View"

export default {
    name: "MapWidget",
    components: {
        DoseRateLayer,
        FeaturePopover,
        FeaturePopup,
        MapLegend,
        SearchBar,
        SettingsPanel,
        MediaController,
        TheHeader
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
                        // url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        url: ""
                    })
                })
            ],
            controls: [
                new ControlZoom(),
                new ControlZoomSlider(),
                new ControlScaleLine(),
                new ControlMousePosition({
                    coordinateFormat: createStringXY(2),
                    projection: "EPSG:4326"
                })
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
        this.$root.$on("featurePopupOpened", this.centerViewOnFeaturePopup)

        this.map.addOverlay(this.$refs.featurePopover.overlay)
        this.map.addOverlay(this.$refs.featurePopup.overlay)
        this.map.addLayer(this.$refs.doseRateLayer.vectorLayer)
        this.map.addLayer(this.$refs.doseRateLayer.bufferLayer)
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
        centerViewOnFeaturePopup (feature) {
            var featureCoordinates = feature.getGeometry().getCoordinates()
            var featurePixel = this.map.getPixelFromCoordinate(featureCoordinates)

            // Adjust the y-coordinate so that the view is centered towards
            // the middle of the popup and not on the clicked feature itself.
            featurePixel[1] -= (this.$refs.featurePopup.$el.clientHeight * 0.6)

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
