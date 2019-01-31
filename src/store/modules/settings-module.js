import Vue from "vue"
import { i18n } from "../../main.js"

export default {
    state: {
        locale: "en",
        dateFormat: "fi",
        timeFormat: "24h",
        map: {
            tileServerUrl: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            minZoom: 4,
            maxZoom: 10
        },
        doseRateRanges: [
            { minValue: 0.00, maxValue: 0.10, color: "#1dafaf", enabled: true },
            { minValue: 0.10, maxValue: 0.20, color: "#1d8baf", enabled: true },
            { minValue: 0.20, maxValue: 0.30, color: "#1d66af", enabled: true },
            { minValue: 0.30, maxValue: 0.40, color: "#1d41af", enabled: true },
            { minValue: 0.40, maxValue: Number.MAX_VALUE, color: "#411daf", enabled: true }
        ]
    },
    mutations: {
        setLocale (state, locale) {
            i18n.locale = locale
            localStorage.setItem("locale", locale)
            state.locale = locale
        },
        setDateFormat (state, dateFormat) {
            localStorage.setItem("dateFormat", dateFormat)
            state.dateFormat = dateFormat
        },
        setTimeFormat (state, timeFormat) {
            localStorage.setItem("timeFormat", timeFormat)
            state.timeFormat = timeFormat
        },
        toggleDoseRateRange (state, index) {
            // The "enabled" property can't be changed directly with a single statement
            // because doing so won't trigger vue's reactivity.
            var doseRateRange = state.doseRateRanges[index]
            doseRateRange.enabled = !doseRateRange.enabled
            Vue.set(state.doseRateRanges, index, doseRateRange)
        }
    },
    actions: {
        initialize ({ state }) {
            for (var property in state) {
                if (state.hasOwnProperty(property)) {
                    var settingValue = localStorage.getItem(property)
                    if (settingValue) {
                        state[property] = settingValue
                    }
                }
            }

            i18n.locale = state.locale
        }
    }
}
