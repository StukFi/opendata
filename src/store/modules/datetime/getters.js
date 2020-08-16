export default {
    availableTimesForSelectedDate (state) {
        if (!state.selectedDate) {
            return []
        }

        for (let i = 0; i < state.availableDatasets.length; ++i) {
            if (state.availableDatasets[i].date.toDateString() == state.selectedDate.toDateString()) {
                return state.availableDatasets[i].times
            }
        }

        return []
    },
    isOldestDateSelected (state) {
        if (state.availableDatasets.length == 0 || !state.selectedDate) {
            return false
        }

        const firstDate = state.availableDatasets[0].date
        return state.selectedDate.toDateString() == firstDate.toDateString()
    },
    isNewestDateSelected (state) {
        if (state.availableDatasets.length == 0 || !state.selectedDate) {
            return false
        }

        const lastDate = state.availableDatasets.slice(-1)[0].date
        return state.selectedDate.toDateString() == lastDate.toDateString()
    },
    isOldestTimeSelected (state, getters) {
        if (getters.isOldestDateSelected) {
            const firstTime = getters.availableTimesForSelectedDate[0]
            return state.selectedTime == firstTime
        }

        return false
    },
    isNewestTimeSelected (state, getters) {
        if (getters.isNewestDateSelected) {
            const lastTime = getters.availableTimesForSelectedDate.slice(-1)[0]
            return state.selectedTime == lastTime

        }

        return false
    }
}
