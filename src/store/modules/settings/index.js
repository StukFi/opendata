import mutations from "./mutations"
import actions from "./actions"

export default {
    state: {
        locale: "en",
        dateFormat: "fi",
        timeFormat: "24h",
        doseRateRanges: [
            { minValue: 0.00, color: "#1dafaf", enabled: true },
            { minValue: 0.10, color: "#1d8baf", enabled: true },
            { minValue: 0.20, color: "#1d66af", enabled: true },
            { minValue: 0.30, color: "#1d41af", enabled: true },
            { minValue: 0.40, color: "#411daf", enabled: true }
        ]
    },
    mutations: mutations,
    actions: actions
}

export function formatDoseRateRanges (doseRateRanges) {
    doseRateRanges.forEach((range) => {
        try {
            range.minValue = parseFloat(range.minValue)
            if (range.minValue < 10) {
                range.minValue = range.minValue.toFixed(2)
            }
        }
        catch (TypeError) { /* Ignore. */ }
    });
}
