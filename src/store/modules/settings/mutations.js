export default {
    setSettings (state, settings) {
        state.settings = settings
        state.settings.save()
    },
    toggleDoseRateRange (state, index) {
        state.settings.toggleDoseRateRange(index)
    }
}
