export default {
    setTime (state, time) {
        state.selectedTime = time
    },
    setDate (state, date) {
        state.selectedDate = date
    },
    setAvailableDatasets (state, availableDatasets) {
        state.availableDatasets = availableDatasets
    }
}
