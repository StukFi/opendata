import Vue from "vue"
import i18n from "@/i18n.js"

/** Class representing the application's settings. */
class Settings {
    constructor () {
        this.locale = "en",
        this.dateFormat = "fi",
        this.timeFormat = "24h",
        this.doseRateRanges = [
            { minValue: 0.00, color: "#1dafaf", enabled: true },
            { minValue: 0.10, color: "#1d8baf", enabled: true },
            { minValue: 0.20, color: "#1d66af", enabled: true },
            { minValue: 0.30, color: "#1d41af", enabled: true },
            { minValue: 0.40, color: "#411daf", enabled: true }
        ]
    }

    /**
     * Save the application's settings.
     */
    save () {
        i18n.locale = this.locale

        localStorage.setItem("locale", this.locale)
        localStorage.setItem("dateFormat", this.dateFormat)
        localStorage.setItem("timeFormat", this.timeFormat)

        formatDoseRateRanges(this.doseRateRanges)
        localStorage.setItem("doseRateRanges", JSON.stringify(this.doseRateRanges))
    }

    /**
     * Load the application's settings.
     */
    load () {
        this.locale = localStorage.getItem("locale") || this.locale
        this.dateFormat = localStorage.getItem("dateFormat") || this.dateFormat
        this.timeFormat = localStorage.getItem("timeFormat") || this.timeFormat

        const doseRateRanges = localStorage.getItem("doseRateRanges")
        if (doseRateRanges) {
            this.doseRateRanges = JSON.parse(doseRateRanges)
            formatDoseRateRanges(this.doseRateRanges)
            this.doseRateRanges.forEach(range => range.enabled = true)
        }

        i18n.locale = this.locale
    }

    /**
     * Toggle the state of a dose rate range.
     * @param {Number} index
     */
    toggleDoseRateRange (index) {
        var doseRateRange = this.doseRateRanges[index]
        doseRateRange.enabled = !doseRateRange.enabled
        Vue.set(this.doseRateRanges, index, doseRateRange)
    }
}

/**
 * Format dose rate ranges to have the correct number of digits after the decimal point.
 * @param {Array} doseRateRanges
 */
function formatDoseRateRanges (doseRateRanges) {
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


export default Settings
