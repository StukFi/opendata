<template>
    <div id="map" class="map">
        <datetime-picker></datetime-picker>
        <map-legend></map-legend>
        <feature-popup ref="featurePopup"></feature-popup>
    </div>
</template>

<script>
import DatetimePicker from "./datetime-picker"
import MapLegend from "./map-legend"
import FeaturePopup from "./feature-popup"
import Settings from "../mixins/settings"

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
        DatetimePicker,
        MapLegend,
        FeaturePopup
    },
    data: function() {
        return {
            map: {},
            url: "",
            file: "",
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
    methods: {
        onDatetimeChanged(datetime) {
            var datasetFilePath = "data/dose_rates/" + datetime + ".json";

            var source = new VectorSource({
                format: this.geoJsonFormat,
                url: datasetFilePath
            });

            this.vectorLayer.setSource(source);
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

        this.$root.$on("datetimeChanged", this.onDatetimeChanged);

        this.map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSMSource()
                }),
                this.vectorLayer
            ],
            controls: [
                new ControlZoom(),
                new ControlRotate(),
                new ControlZoomSlider(),
                new ControlScaleLine(),
                new ControlMousePosition({
                    coordinateFormat: coordinate.createStringXY(2),
                    projection: "EPSG:4326",
                })
            ],
            interactions: interaction.defaults().extend([
                new InteractionSelect({
                    layers: [this.vectorLayer]
                })
            ]),
            view: new View({
                center: proj.fromLonLat([25, 63]),
                zoom: 5
            })
        });

        this.map.addOverlay(this.$refs.featurePopup.overlay);

        this.map.on("pointermove", function(evt) {
            evt["map"] = that.map;
            that.$root.$emit("mapHovered", evt);
        });

        this.map.on("click", function(evt) {
            evt["map"] = that.map;
            that.$root.$emit("mapClicked", evt);
        });

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
