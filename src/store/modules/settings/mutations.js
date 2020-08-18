export default {
    setSettings (state, settings) {
        state.settings = settings
        state.settings.save()
    }
}
