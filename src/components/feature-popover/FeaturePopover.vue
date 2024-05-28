<template>
    <div
        ref="featurePopover"
        class="feature-popover"
    >
        <site-name
            :feature="feature"
            disable-close-button
        />
        <site-dose-rate :feature="feature" />
    </div>
</template>

<script>
import SiteName from "./SiteName"
import SiteDoseRate from "./SiteDoseRate"
import Overlay from "ol/Overlay"
import eventBus from '@/utils/eventBus'

export default {
    name: "FeaturePopover",
    components: {
        SiteName,
        SiteDoseRate
    },
    data: function () {
        return {
            isEnabled: true,
            overlay: undefined,
            feature: undefined
        }
    },
    mounted: function () {
        eventBus.$on("featureHovered", this.open)
        eventBus.$on("emptyMapLocationHovered", this.close)
        eventBus.$on("featurePopupOpened", this.disable)
        eventBus.$on("featurePopupClosed", this.enable)
        eventBus.$on("doseRateLayerChanged", this.update)

        this.overlay = new Overlay({
            element: this.$refs.featurePopover,
            position: undefined
        })
    },
    methods: {
        enable () {
            this.isEnabled = true
        },
        disable () {
            this.isEnabled = false
            this.close()
        },
        open (feature) {
            if (this.isEnabled) {
                this.feature = feature
                this.overlay.setPosition(feature.getGeometry().getCoordinates())
            }
        },
        close () {
            this.overlay.setPosition(undefined)
        },
        update (layer) {
            var features = layer.getSource().getFeatures()
            if (features.length == 0) {
                return
            }

            for (var i = 0; i < features.length; ++i) {
                if (features[i].get("id") == this.siteId) {
                    this.feature = features[i]
                    return
                }
            }

            this.feature = undefined
        }
    }
}
</script>

<style lang="scss">
.feature-popover {
    position: absolute;
    width: 17em;
    left: -8.5em;
    bottom: 0.5em;
    padding: 1em;
    background-color: white;
    border: 1px solid #cccccc;
    font-family: $font-medium;
    border-radius: $border-radius-md;
}

.feature-popover:after,
.feature-popover:before {
    left: 8.75em;
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
    margin-left: -0.625em;
}

.feature-popover:before {
    border-top-color: #cccccc;
    border-width: 11px;
    margin-left: -0.625em;
}
</style>
