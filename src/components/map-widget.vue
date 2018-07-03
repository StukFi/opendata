<template>
    <div id="map" class="map">
        <datepicker-widget></datepicker-widget>
        <timepicker-widget></timepicker-widget>
        <map-legend></map-legend>
        <feature-popup ref="featurePopup"></feature-popup>
    </div>
</template>

<script>
import DatepickerWidget from "./datepicker-widget"
import FeaturePopup from "./feature-popup"
import MapLegend from "./map-legend"
import Settings from "../mixins/settings"
import TimepickerWidget from "./timepicker-widget"

import CircleStyle from "ol/style/circle"
import ControlZoom from "ol/control/zoom"
import ControlZoomSlider from "ol/control/zoomslider"
import ControlRotate from "ol/control/rotate"
import ControlScaleLine from "ol/control/scaleline"
import ControlMousePosition from "ol/control/mouseposition"
import coordinate from "ol/coordinate"
import FillStyle from "ol/style/fill"
import GeoJSON from "ol/format/geojson"
import interaction from "ol/interaction"
import InteractionSelect from "ol/interaction/select"
import Map from "ol/map"
import OSMSource from "ol/source/osm"
import proj from "ol/proj"
import Style from "ol/style/style"
import TileLayer from "ol/layer/tile"
import VectorLayer from "ol/layer/vector"
import VectorSource from "ol/source/vector"
import View from "ol/view"

export default {
    name: "MapWidget",
    mixins: [Settings],
    components: {
        DatepickerWidget,
        TimepickerWidget,
        MapLegend,
        FeaturePopup
    },
    data: function() {
        return {
            map: {},
            url: "",
            geoJsonFormat: new GeoJSON({
                defaultDataProjection: "EPSG:4326"
            }),
            vectorLayer: new VectorLayer({
                source: new VectorSource({
                    format: this.geoJsonFormat
                }),
                style: this.styleFeature
            })
        };
    },
    computed: {
        datasetFilePath() {
            if (!this.$store.state.date) {
                return "";
            }

            return "data/dose_rates/" +
                this.$store.state.date.toISOString().split("T")[0] + "T" +
                this.$store.state.time + ".json";
        }
    },
    watch: {
        datasetFilePath: function() {
            var vectorSource = new VectorSource({
                format: this.geoJsonFormat,
                url: this.datasetFilePath
            });

            this.vectorLayer.setSource(vectorSource);
        }
    },
    methods: {
        onMapInteraction(evt) {
            var that = this;

            var pixel = this.map.getEventPixel(evt.originalEvent);
            evt["features"] = this.map.getFeaturesAtPixel(pixel);

            this.$root.$emit("mapInteraction", evt);

            if (evt.features && evt.type == "click") {
                // The timeout ensures that the popup's size has had time to change
                // from the smaller mouseover-version to the one with the graph.
                // The map's view is centered on the popup based on the popup's size.
                // Without the timeout, the calculations sometimes end up using
                // the popup's smaller on-mouseover dimensions.
                setTimeout(function() {
                    pixel[1] -= (that.$refs.featurePopup.$el.clientHeight / 2);
                    var position = that.map.getCoordinateFromPixel(pixel);
                    that.centerViewOnPosition(position);
                }, 25);
            }
        },
        centerViewOnPosition(position) {
            this.map.getView().animate({
                center: position,
                duration: 750
            });
        },
        styleFeature(feature) {
            var featureColor = "#000";
            var doseRate = feature.get("doseRate");

            for (var i = 0; i < this.settings.doseRates.length; ++i) {
                if (doseRate < this.settings.doseRates[i].maxValue) {
                    featureColor = this.settings.doseRates[i].color;
                    break;
                }
            }

            var featureStyle = new Style({
                image: new CircleStyle({
                    radius: 10,
                    fill: new FillStyle({
                        color: featureColor
                    })
                })
            });

            return [featureStyle];
        }
    },
    mounted: function() {
        var that = this;

        this.map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSMSource()
                }),
                this.vectorLayer
            ],
            controls: [
            ],
            view: new View({
                center: proj.fromLonLat([25, 63]),
                zoom: 5
            })
        });

        this.map.on("pointermove", this.onMapInteraction);
        this.map.on("click", this.onMapInteraction);

        this.map.addOverlay(this.$refs.featurePopup.overlay);

        this.map.updateSize();
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
