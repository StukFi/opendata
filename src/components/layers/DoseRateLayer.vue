<template>
    <div />
</template>

<script>
import CircleStyle from "ol/style/Circle"
import GeoJSON from "ol/format/GeoJSON"
import FillStyle from "ol/style/Fill"
import Style from "ol/style/Style"
import VectorImage from "ol/layer/VectorImage"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { transform } from "ol/proj"
import api from "@/api/index"
import eventBus from "@/utils/eventBus"

export default {
    name: "DoseRateLayer",
    emits: ["doseRateLayerChanged"],
    data() {
        return {
            vectorLayer: new VectorImage({
                source: new VectorSource({
                    format: new GeoJSON({
                        defaultDataProjection: "EPSG:4326"
                    })
                }),
                renderMode: "vector",
                preload: 20,
                renderBuffer: 20,
                renderOrder: function (featureA, featureB) {
                    // Draw features with a higher dose rate on top.
                    return featureA.get("doseRate") < featureB.get("doseRate") ? -1 : 1
                },
                style: (feature) => {
                    let featureColor = "#0000"
                    const doseRate = feature.get("doseRate")

                    const doseRateRanges = this.$store.state.settings.settings.mapLegend.bars
                    for (let i = 0; i < doseRateRanges.length; ++i) {
                        const minValue = doseRateRanges[i].threshold
                        const maxValue = doseRateRanges[i + 1] ? doseRateRanges[i + 1].threshold : 1000000000
                        if (doseRate >= minValue && doseRate < maxValue) {
                            if (doseRateRanges[i].isEnabled) {
                                featureColor = doseRateRanges[i].color
                                break
                            } else {
                                return undefined
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
                    })

                    return [featureStyle]
                }
            }),
        }
    },
    computed: {
        mode() {
            return this.$store.state.settings.settings.mode
        },
        isDoseRateMode() {
            return this.mode === "dose_rates"
        },
        datasetFilePath() {
            if (!this.isDoseRateMode || !this.$store.state.datetime.selectedDate) {
                return ""
            }
            return (
                "data/dose_rates/datasets/" +
                this.$store.state.datetime.selectedDate.toISOString().split("T")[0] +
                "T" +
                this.$store.state.datetime.selectedTime +
                ".json"
            )
        },
        doseRateRanges() {
            return this.$store.state.settings.settings.mapLegend.bars
        }
    },
    watch: {
        datasetFilePath: async function () {
            if (!this.isDoseRateMode) {
                return "" // Do nothing if not in dose_rates mode
            }

            try {
                this.$Progress.start()
                const dataset = await api.doseRate.getDataset(this.datasetFilePath)
                const features = dataset.features.map((feature) => {
                    return new Feature({
                        geometry: new Point(
                            transform(feature.geometry.coordinates, "EPSG:4326", "EPSG:3857")
                        ),
                        id: feature.properties.id,
                        site: feature.properties.site,
                        doseRate: feature.properties.doseRate
                    })
                })

                this.vectorLayer.getSource().clear(true)
                this.vectorLayer.getSource().addFeatures(features)
                eventBus.$emit("doseRateLayerChanged", this.vectorLayer)
                this.$Progress.finish()
            } catch {
                this.$Progress.fail()
            }
        },
        doseRateRanges: {
            handler: function () {
                if (this.isDoseRateMode) {
                    this.redraw()
                }
            },
            deep: true
        }
    },
    mounted() {
        if (this.isDoseRateMode) {
            eventBus.$on("settingsChanged", this.redraw)
        }
    },
    methods: {
        redraw() {
            if (this.isDoseRateMode) {
                this.vectorLayer.changed()
            }
        },
        updateFeatureRadius(zoom) {
            if (this.isDoseRateMode) {
                const currentFeatureRadius = this.featureRadius
                const newFeatureRadius = zoom * 2
                if (newFeatureRadius !== currentFeatureRadius) {
                    this.featureRadius = newFeatureRadius
                    this.redraw()
                }
            }
        }
    }
}
</script>

<style scoped>
/* Add your styles here */
</style>