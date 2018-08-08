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
import TimepickerWidget from "./timepicker-widget"

import CircleStyle from "ol/style/Circle"
import ControlZoom from "ol/control/Zoom"
import ControlZoomSlider from "ol/control/Zoomslider"
import ControlScaleLine from "ol/control/Scaleline"
import ControlMousePosition from "ol/control/Mouseposition"
import {createStringXY} from "ol/coordinate"
import FillStyle from "ol/style/Fill"
import {fromLonLat} from "ol/proj"
import GeoJSON from "ol/format/GeoJSON"
import Map from "ol/Map"
import OSMSource from "ol/source/OSM"
import Style from "ol/style/Style"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import View from "ol/View"

export default {
    name: "MapWidget",
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
            if (!this.$store.state.datetime.date) {
                return "";
            }

            return "data/dose_rates/datasets/" +
                this.$store.state.datetime.date.toISOString().split("T")[0] + "T" +
                this.$store.state.datetime.time + ".json";
        },
        doseRateRanges() {
            return this.$store.state.settings.doseRateRanges;
        }
    },
    watch: {
        datasetFilePath: function() {
            var vectorSource = new VectorSource({
                format: this.geoJsonFormat,
                url: this.datasetFilePath
            });

            this.vectorLayer.setSource(vectorSource);
        },
        doseRateRanges: function() {
            this.vectorLayer.changed();
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
                    var featureCoordinates = evt.features[0].getGeometry().getCoordinates();
                    var featurePixel = that.map.getPixelFromCoordinate(featureCoordinates);

                    // Adjust the y-axis so that the view is centered on the middle
                    // of the popup and not on the clicked feature itself.
                    featurePixel[1] -= (that.$refs.featurePopup.$el.clientHeight / 2);

                    var position = that.map.getCoordinateFromPixel(featurePixel);
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

            var doseRateRanges = this.$store.state.settings.doseRateRanges;
            for (var i = 0; i < doseRateRanges.length; ++i) {
                if (doseRate < doseRateRanges[i].maxValue) {
                    if (doseRateRanges[i].enabled) {
                        featureColor = doseRateRanges[i].color;
                        break;
                    }
                    else {
                        return undefined;
                    }
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
                    source: new OSMSource({
                        url: this.$store.state.settings.map.tileServerUrl
                    })
                }),
                this.vectorLayer
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
                minZoom: this.$store.state.settings.map.minZoom,
                maxZoom: this.$store.state.settings.map.maxZoom,
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
