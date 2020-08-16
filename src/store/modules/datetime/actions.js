import api from "@/api"

export default {
    async initialize ({ dispatch }) {
        await dispatch("queryAvailableDatasets")
        await dispatch("selectNewestDate")
        await dispatch("selectNewestTime")

        // Update available datasets every 10 minutes.
        setInterval(() => { dispatch("queryAvailableDatasets") }, 600000)
    },
    async queryAvailableDatasets({ commit }) {
        const availableDatasets = await api.doseRate.queryAvailableDatasets()
        commit("setAvailableDatasets", availableDatasets)
    },
    selectNewestDate ({ state, dispatch }) {
        if (state.availableDatasets.length == 0) {
            return
        }

        const newestDate = state.availableDatasets.slice(-1)[0].date
        dispatch("setDate", newestDate)
    },
    selectNewestTime ({getters, commit }) {
        const availableTimesForSelectedDate = getters.availableTimesForSelectedDate
        if (availableTimesForSelectedDate.length == 0) {
            return
        }

        var newestTime = availableTimesForSelectedDate.slice(-1)[0]
        commit("setTime", newestTime)
    },
    decrementTime ({ commit, dispatch, getters, state }) {
        if (getters.isOldestDateSelected && getters.isOldestTimeSelected) {
            return
        }

        const indexOfSelectedTime = getters.availableTimesForSelectedDate.indexOf(state.selectedTime)
        const isOldestTimeSelected = indexOfSelectedTime == 0
        if (isOldestTimeSelected) {
            dispatch("decrementDate")
            dispatch("selectNewestTime")
        }
        else {
            const previousTime = getters.availableTimesForSelectedDate[indexOfSelectedTime - 1]
            commit("setTime", previousTime)
        }
    },
    incrementTime ({ commit, dispatch, getters, state }) {
        if (getters.isNewestDateSelected && getters.isNewestTimeSelected) {
            return
        }

        const indexOfSelectedTime = getters.availableTimesForSelectedDate.indexOf(state.selectedTime)
        const isNewestTimeSelected = indexOfSelectedTime == getters.availableTimesForSelectedDate.length - 1
        if (isNewestTimeSelected) {
            dispatch("incrementDate")
            commit("setTime", getters.availableTimesForSelectedDate[0])
        }
        else {
            const nextTime = getters.availableTimesForSelectedDate[indexOfSelectedTime + 1]
            commit("setTime", nextTime)
        }
    },
    decrementDate ({ dispatch, getters, state }) {
        if (!getters.isOldestDateSelected) {
            const availableDates = state.availableDatasets.map(element => element.date.toDateString())
            const indexOfSelectedDate = availableDates.indexOf(state.selectedDate.toDateString())
            const previousDate = state.availableDatasets[indexOfSelectedDate - 1].date
            dispatch("setDate", previousDate)
        }
    },
    incrementDate ({ dispatch, getters, state }) {
        if (!getters.isNewestDateSelected) {
            const availableDates = state.availableDatasets.map(element => element.date.toDateString())
            const indexOfSelectedDate = availableDates.indexOf(state.selectedDate.toDateString())
            const nextDate = state.availableDatasets[indexOfSelectedDate + 1].date
            dispatch("setDate", nextDate)
        }
    },
    setDate ({ state, commit, dispatch, getters }, date) {
        commit("setDate", date)
        if (!getters.availableTimesForSelectedDate.includes(state.selectedTime)) {
            dispatch("selectNewestTime")
        }
    }
}
