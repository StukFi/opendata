<template>
    <div></div>
</template>

<script>
import CircleStyle from "ol/style/Circle"
import GeoJSON from "ol/format/GeoJSON"
import FillStyle from "ol/style/Fill"
import Style from "ol/style/Style"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"

export default {
    name: "DoseRateLayer",
    data: function() {
        return {
            vectorLayer: new VectorLayer({
                source: new VectorSource({
                    format: this.featureFormat
                }),
                style: this.styleFeature
            }),
            featureFormat: new GeoJSON({
                defaultDataProjection: "EPSG:4326"
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
            this.vectorLayer.setSource(new VectorSource({
                format: this.featureFormat,
                url: this.datasetFilePath
            }));
        },
        doseRateRanges: function() {
            this.vectorLayer.changed();
        }
    },
    methods: {
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
    }
}
</script>
