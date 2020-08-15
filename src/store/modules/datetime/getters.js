export default {
    validTimesForCurrentDate (state) {
        if (!state.date) {
            return []
        }

        var times = []
        for (var i = 0; i < state.validDatetimes.length; ++i) {
            if (state.validDatetimes[i].date.toDateString() == state.date.toDateString()) {
                times = state.validDatetimes[i].times
                break
            }
        }

        return times
    },
    isFirstDateSelected (state) {
        if (state.validDatetimes.length == 0 || !state.date) {
            return false
        }

        var firstDate = state.validDatetimes[0].date.toDateString()
        return (state.date.toDateString() == firstDate)
    },
    isLastDateSelected (state) {
        if (state.validDatetimes.length == 0 || !state.date) {
            return false
        }

        var lastDate = state.validDatetimes[state.validDatetimes.length - 1].date.toDateString()
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
