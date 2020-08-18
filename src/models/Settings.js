import i18n from "@/i18n.js"
import MapLegend from "./MapLegend"

/** Class representing the application's settings. */
class Settings {
    constructor () {
        this.locale = "en",
        this.dateFormat = "fi",
        this.timeFormat = "24h",
        this.mapLegend = new MapLegend()
    }

    /**
     * Save the application's settings.
     */
    save () {
        i18n.locale = this.locale

        localStorage.setItem("locale", this.locale)
        localStorage.setItem("dateFormat", this.dateFormat)
        localStorage.setItem("timeFormat", this.timeFormat)
        localStorage.setItem("mapLegend", JSON.mapLegend)
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
