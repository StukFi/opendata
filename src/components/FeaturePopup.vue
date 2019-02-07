<template>
    <div
        ref="featurePopup"
        class="feature-popup" >
        <a
            ref="featurePopupCloser"
            href="#"
            class="feature-popup__closer"
            @click="close()">&times;</a>
        <p class="feature-popup__site">{{ site }}</p>
        <div class="feature-popup__dose-rate">
            <span class="feature-popup__dose-rate-value">{{ doseRate }}<span class="feature-popup__dose-rate-unit"> &#181;sv/h</span></span>
        </div>
        <feature-popup-graph :site-id="siteId"/>
    </div>
</template>

<script>
import Overlay from "ol/Overlay"
import FeaturePopupGraph from "./FeaturePopupGraph"

export default {
    name: "FeaturePopup",
    components: {
        FeaturePopupGraph
    },
    data: function () {
        return {
            overlay: undefined,
            site: "",
            siteId: "",
            doseRate: 0.0
        }
    },
    mounted: function () {
        this.$root.$on("featureClicked", this.open)
        this.$root.$on("emptyMapLocationClicked", this.close)
        this.$root.$on("doseRateLayerChanged", this.update)

        this.overlay = new Overlay({
            element: this.$refs.featurePopup,
            position: undefined
        })
    },
    methods: {
        open (feature) {
            this.getSiteData(feature)
            this.overlay.setPosition(feature.getGeometry().getCoordinates())
            this.$root.$emit("featurePopupOpened")
            this.$root.$emit("centerViewOnFeaturePopup", feature)
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
                if (features[i].get("id") == this.siteId) {
                    this.getSiteData(features[i])
                    return
                }
            }

            this.doseRate = "-"
        },
        getSiteData (feature) {
            this.site = feature.get("site")
            this.siteId = feature.get("id")
            this.doseRate = feature.get("doseRate")
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

.feature-popup__site {
    text-align: center;
    font-weight: bold;
    font-size: 1.15em;
    margin: 0;
}

.feature-popup__dose-rate {
    text-align: center;
    font-size: 2.15em;
    margin: 0.5em 0;
}

.feature-popup__dose-rate-value {
    position: relative;
    line-height: 100%;
}

.feature-popup__dose-rate-unit {
    position: absolute;
    white-space: pre;
    font-size: 40%;
    bottom: 0;
}

.feature-popup__closer {
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 12px;
    color: black;
    font-size: 2em;
}

.feature-popup__closer:hover {
    color: black;
    text-decoration: none;
}

.feature-popup__closer:focus {
    outline: none;
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
