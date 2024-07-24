<template>
    <div ref="featurePopover" class="feature-popover">
        <site-name :feature="feature" disable-close-button />
        <site-dose-rate :feature="feature" v-show="isDoseRatesMode"/>
    </div>
</template>

<script>
import SiteName from "@/components/feature-popover/SiteName.vue"
import SiteDoseRate from "@/components/feature-popover/SiteDoseRate.vue"
import Overlay from "ol/Overlay"
import eventBus from '@/utils/eventBus'

export default {
    name: "FeaturePopover",
    components: {
        SiteName,
        SiteDoseRate
    },
    data() {
        return {
            isEnabled: true,
            overlay: undefined,
            feature: undefined,
            previousFeature: undefined
        }
    },
    computed: {
        mode() {
            return this.$store.state.settings.settings.mode
        },
        isDoseRatesMode() {
            return this.mode === "dose_rates"
        },
        isRadionuclideMode() {
            return this.mode === "air_radionuclides"
        },
    },
    mounted() {
        eventBus.$on("featureHovered", this.open)
        eventBus.$on("emptyMapLocationHovered", this.close)
        eventBus.$on("featurePopupOpened", this.disable)
        eventBus.$on("featurePopupClosed", this.enable)
        eventBus.$on("doseRateLayerChanged", this.update)
        eventBus.$on("radioNuclideLayerChanged", this.update)
        
        this.overlay = new Overlay({
            element: this.$refs.featurePopover,
            position: undefined
        })
    },
    methods: {
        enable() {
            this.isEnabled = true
        },
        disable() {
            this.isEnabled = false
            this.close()
        },
        open(feature) {
            if (this.isEnabled && feature !== this.previousFeature) {
                this.feature = feature
                this.overlay.setPosition(feature.getGeometry().getCoordinates())
                this.previousFeature = feature
            }
        },
        close() {
            this.overlay.setPosition(undefined)
            this.previousFeature = undefined
        },
        update(layer) {
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
    left: 8.5em;
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