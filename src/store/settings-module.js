import Vue from "vue"

export default {
    state: {
        map: {
            minZoom: 4,
            maxZoom: 10
        },
        doseRateRanges: [
            {minValue: 0.00, maxValue: 0.10, color: "#1dafaf", enabled: true},
            {minValue: 0.10, maxValue: 0.20, color: "#1d8baf", enabled: true},
            {minValue: 0.20, maxValue: 0.30, color: "#1d66af", enabled: true},
            {minValue: 0.30, maxValue: 0.40, color: "#1d41af", enabled: true},
            {minValue: 0.40, maxValue: Number.MAX_VALUE, color: "#411daf", enabled: true}
        ]
    },
    mutations: {
        toggleDoseRateRange(state, index) {
            // The "enabled" property can't be changed directly with a single statement
            // because doing so won't trigger vue's reactivity.
            var doseRateRange = state.doseRateRanges[index];
            doseRateRange.enabled = !doseRateRange.enabled;
            Vue.set(state.doseRateRanges, index, doseRateRange);
        }
    }
}
