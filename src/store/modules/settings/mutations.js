import Vue from "vue"
import i18n from "@/i18n.js"
import { formatDoseRateRanges } from "./index"

export default {
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
    },
    saveDoseRateRanges (state) {
        formatDoseRateRanges(state.doseRateRanges)
        localStorage.setItem("doseRateRanges", JSON.stringify(state.doseRateRanges))
    }
}
