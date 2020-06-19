<template>
    <div
        ref="featurePopup"
        class="feature-popup"
    >
        <button-close-popup @click="close" />
        <site-name :feature="feature" />
        <site-dose-rate :feature="feature" />
        <time-series-graph :feature="feature" />
    </div>
</template>

<script>
import Overlay from "ol/Overlay"
import ButtonClosePopup from "./ButtonClosePopup"
import SiteName from "./SiteName"
import SiteDoseRate from "./SiteDoseRate"
import TimeSeriesGraph from "./TimeSeriesGraph"

export default {
    name: "FeaturePopup",
    components: {
        ButtonClosePopup,
        SiteName,
        SiteDoseRate,
        TimeSeriesGraph
    },
    data: function () {
        return {
            overlay: undefined,
            feature: undefined
        }
    },
    mounted: function () {
        this.overlay = new Overlay({
            element: this.$refs.featurePopup,
            position: undefined
        })

        this.$root.$on("featureClicked", this.open)
        this.$root.$on("featureSelectedViaSearch", this.open)
        this.$root.$on("emptyMapLocationClicked", this.close)
        this.$root.$on("doseRateLayerChanged", this.update)
    },
    methods: {
        open (feature) {
            this.feature = feature
            this.overlay.setPosition(feature.getGeometry().getCoordinates())
            this.$root.$emit("featurePopupOpened", feature)
        },
        close () {
            this.overlay.setPosition(undefined)
            this.$root.$emit("featurePopupClosed")
        },
        update (layer) {
            var features = layer.getSource().getFeatures()
            if (features.length == 0) {
                return
            }

            for (var i = 0; i < features.length; ++i) {
                if (!this.feature || features[i].get("id") == this.feature.get("id")) {
                    this.feature = features[i]
                    return
                }
            }

            this.feature = undefined
        }
    }
}
</script>

<style>
.feature-popup {
    position: absolute;
    left: -175px;
    width: 350px;
    bottom: 12px;
    padding: 15px;
    background-color: white;
    border: 1px solid #cccccc;

    /* The minimum height ensures that the view is centered correctly on an opened popup.
       When the popup is opened for the first time, the graph inside it has not been rendered.
       The element's height is thus less than with the graph.
       This causes the view to be incorrectly centered, because the popup's height is used in the calculation. */
    min-height: 345px;

    /* A CSS variable for dynamically positioning the popup's
       pseudo-elements based on the popup's size. */
    --pseudo-left: 174px;
}

.feature-popup:after, .feature-popup:before {
    left: var(--pseudo-left);
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.feature-popup:after {
    border-top-color: white;
    border-width: 10px;
    margin-left: -10px;
}

.feature-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    margin-left: -11px;
}

@media only screen and (min-width: 768px) {
    .feature-popup {
        width: 450px;
        min-height: 385px;
        left: -225px;
        --pseudo-left: 224px;
    }
}
</style>
