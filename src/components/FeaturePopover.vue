<template>
    <div
        ref="featurePopover"
        class="feature-popover" >
        <p class="feature-popover__site">{{ site }}</p>
        <div class="feature-popover__dose-rate">
            <span class="feature-popover__dose-rate-value">{{ doseRate }}<span class="feature-popover__dose-rate-unit"> &#181;sv/h</span></span>
        </div>
    </div>
</template>

<script>
import Overlay from "ol/Overlay"

export default {
    name: "FeaturePopover",
    data: function () {
        return {
            isEnabled: true,
            overlay: undefined,
            site: "",
            siteId: "",
            doseRate: 0.0
        }
    },
    mounted: function () {
        this.$root.$on("featureHovered", this.open)
        this.$root.$on("emptyMapLocationHovered", this.close)
        this.$root.$on("featurePopupOpened", this.disable)
        this.$root.$on("featurePopupClosed", this.enable)
        this.$root.$on("doseRateLayerChanged", this.update)

        this.overlay = new Overlay({
            element: this.$refs.featurePopover,
            position: undefined
        })
    },
    methods: {
        open (feature) {
            if (this.isEnabled) {
                this.getSiteData(feature)
                this.overlay.setPosition(feature.getGeometry().getCoordinates())
            }
        },
        close () {
            this.overlay.setPosition(undefined)
        },
        enable () {
            this.isEnabled = true
        },
        disable () {
            this.isEnabled = false
            this.close()
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
.feature-popover {
    position: absolute;
    width: 280px;
    left: -140px;
    bottom: 12px;
    padding: 15px;
    background-color: white;
    border: 1px solid #cccccc;
}

.feature-popover:after, .feature-popover:before {
    left: 139px;
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.feature-popover:after {
    border-top-color: white;
    border-width: 10px;
    margin-left: -10px;
}

.feature-popover:before {
    border-top-color: #cccccc;
    border-width: 11px;
    margin-left: -11px;
}

.feature-popover__site {
    text-align: center;
    font-weight: bold;
    font-size: 1.15em;
    margin: 0;
}

.feature-popover__dose-rate {
    text-align: center;
    font-size: 2.15em;
    margin: 0.5em 0;
}

.feature-popover__dose-rate-value {
    position: relative;
    line-height: 100%;
}

.feature-popover__dose-rate-unit {
    position: absolute;
    white-space: pre;
    font-size: 40%;
    bottom: 0;
}
</style>
