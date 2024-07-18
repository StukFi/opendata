<template>
    <div></div>
</template>

<script>
import RegularShape from "ol/style/RegularShape"
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
    name: "RadionuclideLayer",
    emits: ['radionuclideLayerChanged'],
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
                style: () => {
                    const featureColor = "#f7c028"

                    const featureStyle = new Style({
                        image: new RegularShape({
                            fill: new FillStyle({
                                color: featureColor
                            }),
                            points: 3,
                            radius: this.featureRadius,
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
        isAirRadionuclidesMode() {
            return this.mode === "air_radionuclides"
        },
        datasetFilePath() {
            if (!this.isAirRadionuclidesMode || !this.$store.state.datetime.selectedDate) {
                return ""
            }
            return "data/air_radionuclides/datasets/2024-03-11T084200.json"
        },
    },
    watch: {
        datasetFilePath: async function () {
            if (!this.isAirRadionuclidesMode) return // Do nothing if not in air_radionuclides mode

            try {
                this.$Progress.start()
                const dataset = await api.airRadionuclide.getDataset(this.datasetFilePath)
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
                eventBus.$emit("radionuclideLayerChanged", this.vectorLayer)
                this.$Progress.finish()
            } catch {
                this.$Progress.fail()
            }
        }
    },
    mounted() {
        if (this.isAirRadionuclidesMode) {
            eventBus.$on("settingsChanged", this.redraw)
        }
    },
    methods: {
        redraw() {
            if (this.isAirRadionuclidesMode) {
                this.vectorLayer.changed()
            }
        },
        updateFeatureRadius(zoom) {
            if (this.isAirRadionuclidesMode) {
                const currentFeatureRadius = this.featureRadius
                const newFeatureRadius = zoom * 3
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