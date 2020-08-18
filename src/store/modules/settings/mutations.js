export default {
    setSettings (state, settings) {
        state.settings = settings
        state.settings.save()
    },
    toggleMapLegendBar (state, index) {
        state.settings.mapLegend.toggleThreshold(index)
    }
}
