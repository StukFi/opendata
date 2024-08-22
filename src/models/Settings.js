import i18n from "@/i18n.js"
import MapLegend, { MapLegendBar } from "./MapLegend"

// Local storage keys.
const keyLocale = "locale"
const keyDateFormat = "dateFormat"
const keyTimeFormat = "timeFormat"
const keyMapLegend = "mapLegend"
const keyBackgroundMap = "backgroundMap"
const keyMode = "mode"

/** Class representing the application's settings. */
class Settings {
    constructor () {
        this.locale = "en",
        this.dateFormat = "fi",
        this.timeFormat = "24h",
        this.mapLegend = new MapLegend()
        this.backgroundMap = "default"
        this.mode = "dose_rates"
    }

    /**
     * Save the application's settings.
     */
    save () {
        i18n.global.locale.value = this.locale
        localStorage.setItem(keyLocale, this.locale)
        localStorage.setItem(keyDateFormat, this.dateFormat)
        localStorage.setItem(keyTimeFormat, this.timeFormat)
        localStorage.setItem(keyMapLegend, this.mapLegend)
        localStorage.setItem(keyBackgroundMap, this.backgroundMap)
        localStorage.setItem(keyMode, this.mode)
    }

    /**
     * Load the application's settings.
     */
    load () {
        this.locale = localStorage.getItem(keyLocale) || this.locale
        i18n.global.locale.value = this.locale

        this.dateFormat = localStorage.getItem(keyDateFormat) || this.dateFormat
        this.timeFormat = localStorage.getItem(keyTimeFormat) || this.timeFormat

        this.backgroundMap = localStorage.getItem(keyBackgroundMap) || this.backgroundMap

        this.mode = localStorage.getItem(keyMode) || this.mode

        let savedMapLegend = localStorage.getItem(keyMapLegend)
        if (savedMapLegend) {
            try {
                savedMapLegend = JSON.parse(savedMapLegend)
                const savedBars = savedMapLegend.map(savedBar => JSON.parse(savedBar))
                if (savedBars.length > 0) {
                    this.mapLegend.clear()
                    savedBars.forEach(savedBar => {
                        this.mapLegend.addBar(new MapLegendBar(savedBar.threshold, savedBar.color))
                    })
                }
            }
            catch {
                localStorage.removeItem(keyMapLegend)
            }
        }
    }
}

export default Settings
