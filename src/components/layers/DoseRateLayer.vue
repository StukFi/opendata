<template>
    <div></div>
</template>

<script>
import CircleStyle from "ol/style/Circle";
import GeoJSON from "ol/format/GeoJSON";
import FillStyle from "ol/style/Fill";
import Style from "ol/style/Style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { transform } from "ol/proj";
import api from "@/api/index";

export default {
    name: "DoseRateLayer",
    compatConfig: {
    MODE: 3,
    INSTANCE_EVENT_EMITTER: false
  },
    data() {
        return {
            vectorLayer: new VectorLayer({
                source: new VectorSource({
                    format: new GeoJSON({
                        defaultDataProjection: "EPSG:4326"
                    })
                }),
                renderMode: "image",
                renderOrder: function (featureA, featureB) {
                    // Draw features with a higher dose rate on top.
                    return featureA.get("doseRate") < featureB.get("doseRate") ? -1 : 1;
                },
                style: (feature) => {
                    let featureColor = "#0000";
                    const doseRate = feature.get("doseRate");

                    const doseRateRanges = this.$store.state.settings.settings.mapLegend.bars;
                    for (let i = 0; i < doseRateRanges.length; ++i) {
                        const minValue = doseRateRanges[i].threshold;
                        const maxValue = doseRateRanges[i + 1] ? doseRateRanges[i + 1].threshold : 1000000000;
                        if (doseRate >= minValue && doseRate < maxValue) {
                            if (doseRateRanges[i].isEnabled) {
                                featureColor = doseRateRanges[i].color;
                                break;
                            } else {
                                return undefined;
                            }
                        }
                    }

                    const featureStyle = new Style({
                        image: new CircleStyle({
                            radius: this.featureRadius,
                            fill: new FillStyle({
                                color: featureColor
                            })
                        })
                    });

                    return [featureStyle];
                }
            })
        };
    },
    computed: {
        datasetFilePath() {
            if (!this.$store.state.datetime.selectedDate) {
                return "";
            }

            return (
                "data/dose_rates/datasets/" +
                this.$store.state.datetime.selectedDate.toISOString().split("T")[0] +
                "T" +
                this.$store.state.datetime.selectedTime +
                ".json"
            );
        },
        doseRateRanges() {
            return this.$store.state.settings.settings.mapLegend.bars;
        }
    },
    watch: {
        datasetFilePath: async function () {
            try {
                this.$Progress.start();
                const dataset = await api.doseRate.getDataset(this.datasetFilePath);
                const features = dataset.features.map((feature) => {
                    return new Feature({
                        geometry: new Point(
                            transform(feature.geometry.coordinates, "EPSG:4326", "EPSG:3857")
                        ),
                        id: feature.properties.id,
                        site: feature.properties.site,
                        doseRate: feature.properties.doseRate
                    });
                });

                this.vectorLayer.getSource().clear(true);
                this.vectorLayer.getSource().addFeatures(features);
                this.$root.$emit("doseRateLayerChanged", this.vectorLayer);
                this.$Progress.finish();
            } catch {
                this.$Progress.fail();
            }
        },
        doseRateRanges: function () {
            this.redraw();
        }
    },
    mounted() {
        this.$root.$on("settingsChanged", this.redraw);
    },
    methods: {
        redraw() {
            this.vectorLayer.changed();
        },
        updateFeatureRadius(zoom) {
            const currentFeatureRadius = this.featureRadius;
            const newFeatureRadius = zoom * 2.5;
            if (newFeatureRadius !== currentFeatureRadius) {
                this.featureRadius = newFeatureRadius;
                this.redraw();
            }
        }
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>
