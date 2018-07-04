<template>
    <div ref="featurePopup" class="feature-popup" v-bind:class="{'feature-popup--large': isGraphVisible}" >
        <a href="#" ref="featurePopupCloser" class="feature-popup__closer" v-if="isGraphVisible" v-on:click="disable"></a>
        <div class="feature-popup__content">
            <p class="feature-popup__site">{{site}}</p>
            <p class="feature-popup__dose-rate">{{doseRate}}</p>
            <time-series-graph ref="graph" v-show="isGraphVisible" v-bind:site-id="siteId"></time-series-graph>
        </div>
    </div>
</template>

<script>
import Overlay from "ol/overlay"
import TimeSeriesGraph from "./time-series-graph"

export default {
    name: "Popup",
    components: {
        TimeSeriesGraph
    },
    data: function() {
        return {
            overlay: undefined,
            position: "",
            site: "",
            siteId: "",
            doseRate: 0.0,
            isGraphVisible: false
        };
    },
    methods: {
        enable() {
            this.overlay.setPosition(this.position);
        },
        disable() {
            this.isGraphVisible = false;
            this.overlay.setPosition(undefined);
        },
        getFeatureInformation(feature) {
            this.site = feature.get("site");
            this.siteId = feature.get("id");
            this.doseRate = feature.get("doseRate");
            this.position = feature.getGeometry().getCoordinates();
        },
        onMapInteraction(evt) {
            if (evt.type == "pointermove" && this.isGraphVisible) {
                return;
            }

            if (!evt.features) {
                this.disable();
                return;
            }

            this.getFeatureInformation(evt.features[0]);

            if (evt.type == "click") {
                // If the graph is drawn immediately, it will sometimes incorrectly
                // fetch data for the previously viewed site. This happens because
                // the siteId prop's value has not had time to propagate to the graph.
                // This problem is fixed by using vue.js' nextTick() function.
                this.$nextTick(() => {
                    this.$refs.graph.drawDefaultGraph();
                    this.isGraphVisible = true;
                });
            }

            this.enable();
        }
    },
    mounted: function() {
        this.$root.$on("mapInteraction", this.onMapInteraction);

        this.overlay = new Overlay({
            element: this.$refs.featurePopup,
            position: undefined
        });
    }
}
</script>

<style>
.feature-popup {
    position: absolute;
    width: 280px;
    left: -140px;
    bottom: 12px;
    padding: 15px;
    background-color: white;
    border: 1px solid #cccccc;

    /* A CSS variable for dynamically positioning the popup's
       pseudo-elements based on the popup's size. */
    --pseudo-left: 139px;
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

.feature-popup--large {
    left: -175px;
    width: 350px;
    --pseudo-left: 174px;
}

.feature-popup--large .feature-popup__dose-rate {
    margin-bottom: 0;
}

.feature-popup__site {
    text-align: center;
    font-weight: bold;
    font-size: 1.15em;
}

.feature-popup__dose-rate {
    text-align: center;
    font-size: 2.15em;
}

.feature-popup__closer {
    text-decoration: none;
    position: absolute;
    top: 10px;
    right: 12px;
}

.feature-popup__closer:after {
    content: "\00274C";
}

@media only screen and (min-width: 768px) {
    .feature-popup--large {
        width: 450px;
        height: 370px;
        left: -225px;
        --pseudo-left: 224px;
    }
}
</style>
