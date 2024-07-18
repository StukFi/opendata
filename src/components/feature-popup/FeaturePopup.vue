<template>
  <div ref="featurePopup" class="feature-popup">
    <site-name :feature="feature" @close="close" />
    <site-dose-rate :feature="feature" v-show="isDoseRatesMode" />
    <time-series-graph :feature="feature" v-show="isDoseRatesMode" />
    <date-picker v-if="isRadionuclideMode" :initialDate="selectedDate" @monthChanged="handleMonthChange" />
    <radionuclide-tables :feature="feature" :selectedMonth="selectedMonth" v-show="isRadionuclideMode" />
  </div>
</template>

<script>
import Overlay from "ol/Overlay"
import SiteName from "@/components/feature-popover/SiteName.vue"
import SiteDoseRate from "@/components/feature-popover/SiteDoseRate.vue"
import TimeSeriesGraph from "@/components/feature-popup/TimeSeriesGraph.vue"
import RadionuclideTables from "@/components/feature-popup/RadionuclideTables.vue"
import DatePicker from "@/components/feature-popup/DatePicker.vue"
import eventBus from "@/utils/eventBus"

export default {
  name: "FeaturePopup",
  emits: ["featurepopupOpened", "featurepopupClosed"],
  components: {
    SiteName,
    SiteDoseRate,
    TimeSeriesGraph,
    RadionuclideTables,
    DatePicker,
  },
  data() {
    return {
      overlay: undefined,
      feature: undefined,
      selectedMonth: new Date(),
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
    selectedDate() {
      return this.selectedMonth
    },
  },
  mounted() {
    eventBus.$on("featureClicked", this.open)
    eventBus.$on("emptyMapLocationClicked", this.close)

    this.overlay = new Overlay({
      element: this.$refs.featurePopup,
      position: undefined,
    })

    eventBus.$on("featureClicked", this.open)
    eventBus.$on("featureSelectedViaSearch", this.open)
    eventBus.$on("emptyMapLocationClicked", this.close)
    eventBus.$on("doseRateLayerChanged", this.update)
  },
  methods: {
    open(feature) {
      this.feature = feature
      this.overlay.setPosition(feature.getGeometry().getCoordinates())
      eventBus.$emit("featurePopupOpened", feature)
      this.$nextTick(() => {
        if (this.$refs.panelBody) {
          this.$refs.panelBody.scrollTop = 0
        }
      })
    },
    close() {
      this.feature = undefined
      this.overlay.setPosition(undefined)
      eventBus.$emit("featurePopupClosed")
    },
    update(layer) {
      var features = layer.getSource().getFeatures()
      if (features.length == 0 || !this.feature) {
        return
      }

      for (var i = 0; i < features.length; ++i) {
        if (features[i].get("id") == this.feature.get("id")) {
          this.feature = features[i]
          return
        }
      }

      this.feature.set("doseRate", "-")
    },
    handleMonthChange(month) {
      this.selectedMonth = month
    },
  },
}
</script>
  
<style lang="scss" scoped>
.feature-popup {
  position: absolute;
  left: -175px;
  width: 350px;
  bottom: 19px;
  padding: 30px 10px 10px 10px;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: $border-radius-md;
  font-family: $font-medium;

  /* The minimum height ensures that the view is centered correctly on an opened popup.
       When the popup is opened for the first time, the graph inside it has not been rendered.
       The element's height is thus less than with the graph.
       This causes the view to be incorrectly centered, because the popup's height is used in the calculation. */
  min-height: 325px;

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
    border-width: 19px;
    margin-left: -19px;
}
.feature-popup:before {
    border-top-color: #cccccc;
    border-width: 20px;
    margin-left: -20px;
}
  
@media only screen and (min-width: $breakpoint-md) {
  .feature-popup {
    width: 450px;
    left: -225px;
    --pseudo-left: 224px;
    padding: 40px 20px 20px 20px;
  }
}
  
@media only screen and (min-width: $breakpoint-lg) {
  .feature-popup {
    width: 650px;
    left: -325px;
    --pseudo-left: 324px;
    padding: 50px 45px 45px 45px;
  }
}
</style>  