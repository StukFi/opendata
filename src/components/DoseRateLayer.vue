<template>
    <div/>
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
    data: function () {
        return {
            vectorLayer: new VectorLayer({
                source: new VectorSource({
                    format: this.featureFormat
                }),
                style: this.styleFeature,
                renderOrder: this.orderFeatures
            }),
            // A buffer layer is used to load in new datasets. Features from the buffer
            // layer are added to the visible vector layer. Features are not loaded into
            // the visible layer directly by changing its source, because doing so results
            // in the map being momentarily empty as the new dataset is being loaded.
            // Using a buffer layer results in a smooth transition from one dataset to another.
            // The buffer layer is added to the map because it won't otherwise be updated.
            bufferLayer: new VectorLayer({
                source: new VectorSource({
                    format: this.featureFormat
                }),
                style: this.styleFeature,
                // Setting "visible" to false causes the layer to not be updated or drawn.
                // This disables the buffer layer when a new dataset is not being loaded.
                // Likewise visiblity is set to true when loading a new dataset.
                visible: false
            }),
            featureFormat: new GeoJSON({
                defaultDataProjection: "EPSG:4326"
            })
        }
    },
    computed: {
        datasetFilePath () {
            if (!this.$store.state.datetime.date) {
                return ""
            }

            return "data/dose_rates/datasets/" +
                this.$store.state.datetime.date.toISOString().split("T")[0] + "T" +
                this.$store.state.datetime.time + ".json"
        },
        doseRateRanges () {
            return this.$store.state.settings.doseRateRanges
        }
    },
    watch: {
        datasetFilePath: function () {
            // A new dataset is loaded into the buffer layer by changing its source.
            this.bufferLayer.setVisible(true)
            this.bufferLayer.setSource(new VectorSource({
                format: this.featureFormat,
                url: this.datasetFilePath
            }))
        },
        doseRateRanges: function () {
            this.vectorLayer.changed()
        }
    },
    mounted () {
        var that = this
        // A generic change event is fired when a layer's source's state changes.
        // The buffer layer's source is considered 'ready' when it contains features.
        this.bufferLayer.on("change", function () {
            var loadedFeatures = that.bufferLayer.getSource().getFeatures()
            if (loadedFeatures.length == 0) {
                return
            }

            that.bufferLayer.setVisible(false)
            that.vectorLayer.getSource().clear(true)
            that.vectorLayer.getSource().addFeatures(loadedFeatures)

            that.$root.$emit("doseRateLayerChanged", that.vectorLayer)
        })
    },
    methods: {
        styleFeature (feature) {
            var featureColor = "#0000"
            var doseRate = feature.get("doseRate")

            var doseRateRanges = this.$store.state.settings.doseRateRanges
            for (var i = 0; i < doseRateRanges.length; ++i) {
                if (doseRate >= doseRateRanges[i].minValue &&
                    doseRate < doseRateRanges[i + 1].minValue) {
                    if (doseRateRanges[i].enabled) {
                        featureColor = doseRateRanges[i].color
                        break
                    } else {
                        return undefined
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
            })

            return [featureStyle]
        },
        orderFeatures (featureA, featureB) {
            // Draw features with a higher dose rate on top.
            return featureA.get("doseRate") < featureB.get("doseRate") ? -1 : 1
        }
    }
}
</script>
