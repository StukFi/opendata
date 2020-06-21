export default {
    /**
     * Get dates between two dates, including the argument dates.
     * @param {Date} startDate
     * @param {Date} endDate
     * @return {Array}
     */
    getDatesBetween (startDate, endDate) {
        var dates = []
        var currentDate = new Date(startDate)
        var lastDate = new Date(endDate)

        while (currentDate <= lastDate) {
            dates.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + 1)
        }

        return dates
    },
    convertTimeTo12HourClock (time) {
        var hours24h = +time.substr(0, 2)
        var hours12h = (hours24h % 12) || 12
        var extension = hours24h < 12 ? "am" : "pm"
        return hours12h + time.substr(2, 3) + " " + extension
    }
}
