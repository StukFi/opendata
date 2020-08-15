export default {
    validTimesForCurrentDate (state) {
        if (!state.date) {
            return []
        }

        var times = []
        for (var i = 0; i < state.availableDatasets.length; ++i) {
            if (state.availableDatasets[i].date.toDateString() == state.date.toDateString()) {
                times = state.availableDatasets[i].times
                break
            }
        }

        return times
    },
    isFirstDateSelected (state) {
        if (state.availableDatasets.length == 0 || !state.date) {
            return false
        }

        var firstDate = state.availableDatasets[0].date.toDateString()
        return (state.date.toDateString() == firstDate)
    },
    isLastDateSelected (state) {
        if (state.availableDatasets.length == 0 || !state.date) {
            return false
        }

        var lastDate = state.availableDatasets[state.availableDatasets.length - 1].date.toDateString()
        return (state.date.toDateString() == lastDate)
    },
    isFirstTimeSelected (state, getters) {
        if (getters.isFirstDateSelected) {
            return state.time == getters.validTimesForCurrentDate[0]
        }

        return false
    },
    isLastTimeSelected (state, getters) {
        if (getters.isLastDateSelected) {
            return state.time == getters.validTimesForCurrentDate.slice(-1)[0]
        }

        return false
    }
}
