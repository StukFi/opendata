import api from "@/api"

export default {
    setDate ({ state, commit, dispatch, getters }, date) {
        commit("setDate", date)

        if (!getters.validTimesForCurrentDate.includes(state.time)) {
            dispatch("selectMostRecentTime")
        }
    },
    initialize ({ dispatch }) {
        dispatch("updateAvailableDatetimes").then(function () {
            dispatch("selectMostRecentDate")
            dispatch("selectMostRecentTime")
        })

        // Update available data every 10 minutes.
        setInterval(() => { dispatch("updateAvailableDatetimes") }, 600000)
    },
    async updateAvailableDatetimes ({ commit }) {
        const availableData = await api.doseRate.getMetadata()
        commit("setValidDatetimes", availableData)
    },
    selectMostRecentDate ({ state, dispatch }) {
        if (state.validDatetimes.length == 0) {
            return
        }

        var mostRecentDate = state.validDatetimes[0].date
        for (var i = 0; i < state.validDatetimes.length; ++i) {
            if (state.validDatetimes[i].date > mostRecentDate) {
                mostRecentDate = state.validDatetimes[i].date
            }
        }

        dispatch("setDate", mostRecentDate)
    },
    selectMostRecentTime ({getters, commit }) {
        var validTimes = getters.validTimesForCurrentDate
        if (validTimes.length == 0) {
            return
        }

        var mostRecentTime = validTimes[validTimes.length - 1]
        commit("setTime", mostRecentTime)
    },
    decrementTime ({ commit, dispatch, getters, state }) {
        if (getters.isFirstDateSelected && getters.isFirstTimeSelected) {
            return
        }

        var index = getters.validTimesForCurrentDate.indexOf(state.time)
        if (index == 0) {
            dispatch("decrementDate")
            dispatch("selectMostRecentTime")
        } else if (index > 0) {
            commit("setTime", getters.validTimesForCurrentDate[--index])
        }
    },
    incrementTime ({ commit, dispatch, getters, state }) {
        if (getters.isLastDateSelected && getters.isLastTimeSelected) {
            return
        }

        var index = getters.validTimesForCurrentDate.indexOf(state.time)
        if (index == getters.validTimesForCurrentDate.length - 1) {
            dispatch("incrementDate")
            commit("setTime", getters.validTimesForCurrentDate[0])
        } else if (index >= 0 && index < getters.validTimesForCurrentDate.length - 1) {
            commit("setTime", getters.validTimesForCurrentDate[++index])
        }
    },
    decrementDate ({ dispatch, state }) {
        var dates = state.validDatetimes.map(function (datetime) { return datetime.date.toDateString() })
        var index = dates.indexOf(state.date.toDateString())
        if (index > 0) {
            dispatch("setDate", state.validDatetimes[--index].date)
        }
    },
    incrementDate ({ dispatch, state }) {
        var dates = state.validDatetimes.map(function (datetime) { return datetime.date.toDateString() })
        var index = dates.indexOf(state.date.toDateString())
        if (index >= 0 && index < state.validDatetimes.length - 1) {
            dispatch("setDate", state.validDatetimes[++index].date)
        }
    }
}
