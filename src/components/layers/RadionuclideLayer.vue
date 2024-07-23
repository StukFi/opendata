<template>
    <div></div>
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
                    const featureColor = "#1d66af"

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
        isAirRadionuclidesMode() {
            return this.mode === "air_radionuclides"
        },
        datasetFilePath() {
            if (!this.isAirRadionuclidesMode) {
                return ""
            } // Gets available sites and their coordinates
            return "data/air_radionuclides/time_series/sites.json"
        },
    },
    watch: {
        datasetFilePath: async function () {
            if (!this.isAirRadionuclidesMode) return // Do nothing if not in air_radionuclides mode

            try {
                this.$Progress.start()
                const dataset = await api.airRadionuclide.getDataset(this.datasetFilePath)
                const features = dataset.map((feature) => {
                    return new Feature({
                        geometry: new Point(
                            transform(feature.coordinates, "EPSG:4326", "EPSG:3857")
                        ),
                        id: feature.id,
                        site: feature.site,
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