<template>
    <div id="map" class="map">
        <datetime-picker></datetime-picker>
        <map-legend></map-legend>
        <popup-basic></popup-basic>
        <popup-detailed></popup-detailed>
    </div>
</template>

<script>

import Map from "ol/map"
import View from "ol/view"
import TileLayer from "ol/layer/tile"
import Overlay from "ol/overlay"
import GeoJSON from "ol/format/geojson"
import SourceVector from "ol/source/vector"
import SourceOSM from "ol/source/osm"
import LayerVector from "ol/layer/vector"
import Style from "ol/style/style"
import StyleCircle from "ol/style/circle"
import StyleFill from "ol/style/fill"
import ControlZoom from "ol/control/zoom"
import ControlZoomSlider from "ol/control/zoomslider"
import ControlRotate from "ol/control/rotate"
import ControlScaleLine from "ol/control/scaleline"
import ControlMousePosition from "ol/control/mouseposition"
import coordinate from "ol/coordinate"
import interaction from "ol/interaction"
import proj from "ol/proj"
import InteractionSelect from "ol/interaction/select"

import Settings from "../mixins/settings.vue"
import DatetimePicker from "./datetime-picker.vue"
import MapLegend from "./map-legend.vue"
import PopupBasic from "./popup-basic.vue"
import PopupDetailed from "./popup-detailed.vue"

export default {
    name: "MapWidget",
    mixins: [Settings],
    components: {
        DatetimePicker,
        MapLegend,
        PopupBasic,
        PopupDetailed
    },
    data: function() {
        return {
            map: {},
            vectorLayer: {},
            url: "",
            file: "",
            geoJsonFormat: {}
        };
    },
    methods: {
        onDatetimeChanged(datetime) {
            var filePath = "data/dose_rates/" + datetime + ".json";
            var source = new SourceVector({
                format: this.geoJsonFormat,
                url: filePath
            });
            this.vectorLayer.setSource(source);
        }
    },
    mounted: function() {
        var that = this;

        this.$root.$on("datetimeChanged", this.onDatetimeChanged);

        this.geoJsonFormat = new GeoJSON({
            defaultDataProjection: "EPSG:4326"
        });

        var styleFunction = function(feature) {
            var doseRate = feature.get("doseRate");
            var color;
            for (var i = 0; i < that.settings.doseRates.length; ++i) {
                if (doseRate < that.settings.doseRates[i].maxValue) {
                    color = that.settings.doseRates[i].color;
                    break;
                }
            }

            var style = new Style({
                image: new StyleCircle({
                    radius: 10,
                    fill: new StyleFill({
                        color: color
                    })
                })
            });

            return [style];
        };

        this.vectorLayer = new LayerVector({
            source: new SourceVector({
                format: this.geoJsonFormat
            }),
            style: styleFunction
        });

        this.map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new SourceOSM()
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

        var popupBasic = document.getElementById("popup-basic");
        var popupDetailed = document.getElementById("popup-detailed");

        var overlayPopupBasic = new Overlay({
            element: popupBasic,
            position: undefined,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        var overlayPopupDetailed = new Overlay({
            element: popupDetailed,
            position: undefined,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map.addOverlay(overlayPopupBasic);
        this.map.addOverlay(overlayPopupDetailed);

        var popupCloser = document.getElementById("popup-closer");
        popupCloser.onclick = function() {
            overlayPopupDetailed.setPosition(undefined);
            popupCloser.blur();
            return false;
        };

        this.map.on("pointermove", controlBasicPopup);
        this.map.on("click", controlDetailedPopup);

        function controlBasicPopup(evt) {
            if (overlayPopupDetailed.getPosition()) {
                return;
            }

            var pixel = that.map.getEventPixel(evt.originalEvent);
            var features = that.map.getFeaturesAtPixel(pixel);
            if (!features) {
                overlayPopupBasic.setPosition(undefined);
                return;
            }

            var feature = features[0];
            var featureCoordinate = feature.getGeometry().getCoordinates();
            overlayPopupBasic.setPosition(featureCoordinate);

            var data = {
                site: feature.get("site"),
                siteId: feature.get("id"),
                doseRate: feature.get("doseRate")
            };

            that.$root.$emit("mapFeatureFocused", data);
        }

        function controlDetailedPopup(evt) {
            var pixel = that.map.getEventPixel(evt.originalEvent);
            var features = that.map.getFeaturesAtPixel(pixel);
            if (!features) {
                overlayPopupDetailed.setPosition(undefined);
                return;
            }

            if (overlayPopupBasic.getPosition()) {
                overlayPopupBasic.setPosition(undefined);
            }

            var feature = features[0];
            var featureCoordinate = feature.getGeometry().getCoordinates();
            overlayPopupDetailed.setPosition(featureCoordinate);

            var data = {
                site: feature.get("site"),
                siteId: feature.get("id"),
                doseRate: feature.get("doseRate")
            };

            that.$root.$emit("mapFeatureFocused", data);
            that.$root.$emit("mapFeatureClicked", data);
        };

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
