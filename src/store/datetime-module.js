import http from "../utils/http"

export default {
    state: {
        validDatetimes: [],
        date: undefined,
        time: undefined
    },
    getters: {
        validTimesForCurrentDate(state) {
            if (!state.date) {
                return [];
            }

            var times = [];
            for (var i = 0; i < state.validDatetimes.length; ++i) {
                if (state.validDatetimes[i].date.toDateString() == state.date.toDateString()) {
                    times = state.validDatetimes[i].times;
                    break;
                }
            }

            return times;
        }
    },
    mutations: {
        setTime(state, time) {
            state.time = time;
        },
        setDate(state, date) {
            state.date = date;
        },
        setValidDatetimes(state, datetimes) {
            for (var i = 0; i < datetimes.length; ++i) {
                datetimes[i].date = new Date(datetimes[i].date);
                datetimes[i].times.sort();
            }

            datetimes.sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            });

            state.validDatetimes = datetimes;
        }
    },
    actions: {
        setDate({state, commit, dispatch, getters}, date) {
            commit("setDate", date);

            if (!getters.validTimesForCurrentDate.includes(state.time)) {
                dispatch("selectMostRecentTime");
            }
        },
        initialize({dispatch}) {
            dispatch("updateAvailableDatetimes").then(function() {
                dispatch("selectMostRecentDate");
                dispatch("selectMostRecentTime");
            });
        },
        updateAvailableDatetimes({commit}) {
            return http.get("data/dose_rates/metadata.json").then(function(response) {
                commit("setValidDatetimes", response.body.available_data);
            });
        },
        selectMostRecentDate({state, dispatch}) {
            if (state.validDatetimes.length == 0) {
                return;
            }

            var mostRecentDate = state.validDatetimes[0].date;
            for (var i = 0; i < state.validDatetimes.length; ++i) {
                if (state.validDatetimes[i].date > mostRecentDate) {
                    mostRecentDate = state.validDatetimes[i].date;
                }
            }

            dispatch("setDate", mostRecentDate);
        },
        selectMostRecentTime({state, getters, commit}) {
            var validTimes = getters.validTimesForCurrentDate;
            if (validTimes.length == 0) {
                return;
            }

            var mostRecentTime = validTimes[validTimes.length - 1];
            commit("setTime", mostRecentTime);
        },
        decrementTime({commit, getters, state}) {
            var index = getters.validTimesForCurrentDate.indexOf(state.time);
            if (index > 0) {
                commit("setTime", getters.validTimesForCurrentDate[--index]);
            }
        },
        incrementTime({commit, getters, state}) {
            var index = getters.validTimesForCurrentDate.indexOf(state.time);
            if (index >= 0 && index < getters.validTimesForCurrentDate.length - 1) {
                commit("setTime", getters.validTimesForCurrentDate[++index]);
            }
        },
        decrementDate({dispatch, state}) {
            var dates = state.validDatetimes.map(function(datetime) { return datetime.date.toDateString(); });
            var index = dates.indexOf(state.date.toDateString());
            if (index > 0) {
                dispatch("setDate", state.validDatetimes[--index].date);
            }
        },
        incrementDate({dispatch, state}) {
            var dates = state.validDatetimes.map(function(datetime) { return datetime.date.toDateString(); });
            var index = dates.indexOf(state.date.toDateString());
            if (index >= 0 && index < state.validDatetimes.length - 1) {
                dispatch("setDate", state.validDatetimes[++index].date);
            }
        }
    }
}
