import i18n from "@/i18n.js"
import { formatDoseRateRanges } from "./index"

export default {
    initialize ({ state }) {
        for (var property in state) {
            if (Object.hasOwnProperty.call(state, property)) {
                var settingValue = localStorage.getItem(property)
                if (settingValue) {
                    try {
                        settingValue = JSON.parse(settingValue)
                    }
                    catch (SyntaxError) {
                        // Setting value was not a serialized object.
                    }
                    finally {
                        state[property] = settingValue
                    }
                }
            }
        }

        formatDoseRateRanges(state.doseRateRanges)
        state.doseRateRanges.forEach((range) => { range.enabled = true })

        i18n.locale = state.locale
    }
}
