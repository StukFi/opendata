import Vue from "vue"

class MapLegend {
    constructor () {
        this.unit = "µSv/h"
        this.thresholds = [
            { value: 0.00, color: "#1dafaf", isEnabled: true },
            { value: 0.10, color: "#1d8baf", isEnabled: true },
            { value: 0.20, color: "#1d66af", isEnabled: true },
            { value: 0.30, color: "#1d41af", isEnabled: true },
            { value: 0.40, color: "#411daf", isEnabled: true }
        ]
    }

    toString () {
        return "map-legend-test"
    }

    /**
     * Toggle the state of a threshold.
     * @param {Number} index
     */
    toggleThreshold (index) {
        var doseRateRange = this.thresholds[index]
        doseRateRange.enabled = !doseRateRange.enabled
        Vue.set(this.thresholds, index, doseRateRange)
    }
}

export default MapLegend
