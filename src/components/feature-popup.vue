<template>
    <div id="feature-popup" class="feature-popup" v-bind:class="{'feature-popup--large': isGraphVisible}">
        <a href="#" id="feature-popup__closer" class="feature-popup__closer"></a>
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
                this.isGraphVisible = true;
                this.$refs.graph.onSiteClicked();
            }

            this.enable();
        }
    },
    mounted: function() {
        this.$root.$on("mapInteraction", this.onMapInteraction);

        var element = document.getElementById("feature-popup");
        this.overlay = new Overlay({
            element: element,
            position: undefined,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        var popupCloser = document.getElementById("popup-closer");
        if (!popupCloser) return;
        popupCloser.onclick = function() {
            overlayPopupDetailed.setPosition(undefined);
            popupCloser.blur();
            return false;
        };
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
    border-radius: 10px;
    border: 1px solid #cccccc;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
}

.feature-popup:after, .feature-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.feature-popup:after,
.feature-popup:before {
    left: 139px;
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
    left: -225px;
    width: 450px;
}

.feature-popup--large:after,
.feature-popup--large:before, {
    left: 224px;
    border-top-color: red;
}

.feature-popup__site {
    text-align: center;
    font-weight: bold;
}

.feature-popup__dose-rate {
    text-align: center;
    font-size: 2em;
}

.feature-popup__closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}

.feature-popup__closer:after {
    content: "\00274C";
}
</style>
