export default {
    setTime (state, time) {
        state.time = time
    },
    setDate (state, date) {
        state.date = date
    },
    setValidDatetimes (state, datetimes) {
        for (var i = 0; i < datetimes.length; ++i) {
            datetimes[i].date = new Date(datetimes[i].date)
            datetimes[i].times.sort()
        }

        datetimes.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date)
        })

        state.validDatetimes = datetimes
    }
}
