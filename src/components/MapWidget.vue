<template>
    <div 
        id="map" 
        class="map">
        <datepicker-widget/>
        <timepicker-widget/>
        <settings-widget/>
        <media-controls/>
        <map-legend/>
        <dose-rate-popup ref="doseRatePopup"/>
        <dose-rate-layer ref="doseRateLayer"/>
    </div>
</template>

<script>
import DatepickerWidget from "./DatepickerWidget"
import DoseRateLayer from "./DoseRateLayer"
import DoseRatePopup from "./DoseRatePopup"
import MapLegend from "./MapLegend"
import MediaControls from "./MediaControls"
import SettingsWidget from "./SettingsWidget"
import TimepickerWidget from "./TimepickerWidget"

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
        DatepickerWidget,
        DoseRateLayer,
        DoseRatePopup,
        MapLegend,
        MediaControls,
        SettingsWidget,
        TimepickerWidget
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
                        url: this.$store.state.settings.map.tileServerUrl
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
                minZoom: this.$store.state.settings.map.minZoom,
                maxZoom: this.$store.state.settings.map.maxZoom,
                zoom: 5
            })
        })

        this.map.on("pointermove", this.onMapInteraction)
        this.map.on("click", this.onMapInteraction)

        this.map.addOverlay(this.$refs.doseRatePopup.overlay)
        this.map.addLayer(this.$refs.doseRateLayer.vectorLayer)
        this.map.addLayer(this.$refs.doseRateLayer.bufferLayer)
    },
    methods: {
        onMapInteraction (evt) {
            var that = this

            var pixel = this.map.getEventPixel(evt.originalEvent)
            evt["features"] = this.map.getFeaturesAtPixel(pixel)

            this.$root.$emit("mapInteraction", evt)

            if (evt.features && evt.type == "click") {
                // The timeout ensures that the popup's size has had time to change
                // from the smaller mouseover-version to the one with the graph.
                // The map's view is centered on the popup based on the popup's size.
                // Without the timeout, the calculations sometimes end up using
                // the popup's smaller on-mouseover dimensions.
                setTimeout(function () {
                    var featureCoordinates = evt.features[0].getGeometry().getCoordinates()
                    var featurePixel = that.map.getPixelFromCoordinate(featureCoordinates)

                    // Adjust the y-axis so that the view is centered on the middle
                    // of the popup and not on the clicked feature itself.
                    featurePixel[1] -= (that.$refs.doseRatePopup.$el.clientHeight / 2)

                    var position = that.map.getCoordinateFromPixel(featurePixel)
                    that.centerViewOnPosition(position)
                }, 25)
            }
        },
        centerViewOnPosition (position) {
            this.map.getView().animate({
                center: position,
                duration: 750
            })
        }
    }
}
</script>

<style>
.map {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
