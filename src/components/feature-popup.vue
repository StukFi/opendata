<template>
    <div id="popup-basic" class="popup">
        <a href="#" id="popup-closer" class="popup-closer"></a>
        <div class="popup-content">
            <p style="text-align:center;"><b>{{site}}</b></p>
            <p style="text-align:center;font-size:2em;">{{doseRate}}</p>
            <time-series-graph v-if="isDetailed"></time-series-graph>
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
            site: "Location",
            doseRate: 0.0,
            isDetailed: false
        };
    },
    methods: {
        hide() {
            this.isDetailed = false;
            this.overlay.setPosition(undefined);
        },
        show(position) {
            this.overlay.setPosition(position);
        },
        getFeatures(evt) {
            var map = evt.map;
            var pixel = map.getEventPixel(evt.originalEvent);
            var features = map.getFeaturesAtPixel(pixel);
            return features ? features : undefined;
        },
        onMapHovered(evt) {
            if (this.isDetailed) {
                return;
            }

            var features = this.getFeatures(evt);
            if (!features) {
                this.hide();
                return;
            }

            var feature = features[0];
            this.site = feature.get("site");
            this.siteId = feature.get("id");
            this.doseRate = feature.get("doseRate");

            var position = feature.getGeometry().getCoordinates();
            this.show(position);

        },
        onMapClicked(evt) {
            var features = this.getFeatures(evt);
            if (!features) {
                this.hide();
                return;
            }

            this.isDetailed = true;

            var feature = features[0];
            var position = feature.getGeometry().getCoordinates();
            this.show(position);
        }
    },
    mounted: function() {
        this.$root.$on("mapHovered", this.onMapHovered);
        this.$root.$on("mapClicked", this.onMapClicked);

        var element = document.getElementById("popup-basic");
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
.popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -225px;
    width: 450px;
}

.popup:after, .popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 224px;
    margin-left: -10px;
}

.popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 224px;
    margin-left: -11px;
}

.popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}

.popup-closer:after {
    content: "\00274C";
}

#popup-basic {
    width: 280px;
    left: -140px;
}

#popup-basic:after,
#popup-basic:before {
    left: 139px;
}
</style>
