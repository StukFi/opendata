import api from "@/api"
import dateUtils from "@/utils/date"

/** Class representing time series data for a single date. */
class Dataset {
    constructor (date, dataPoints) {
        this.date = date
        this.dataPoints = dataPoints
    }
}

/** Class representing a time series graph. */
class TimeSeriesGraph {
    /**
     * Create a time series graph.
     * @param {String} siteId
     */
    constructor (siteId) {
        this.siteId = siteId
        this.dataPoints = []
        this.datasets = []
        this.startDate = undefined
        this.endDate = undefined
        this.onUpdate = () => {}
    }

    /**
     * Load time series data for a given timespan.
     * @param {Date} startDate
     * @param {Date} endDate
     */
    loadTimespan (startDate, endDate) {
        this.startDate = startDate
        this.endDate = endDate

        if (this.startDate && this.endDate) {
            this.update()
        }
    }

    /** Internal function for updating state to match the configured timespan. */
    async update () {
        try {
            let datesToLoad = dateUtils.getDatesBetween(this.startDate, this.endDate)
            datesToLoad = datesToLoad.filter(date => {
                return !this.datasets.some(dataset => dataset.date.getTime() == date.getTime())
            })

            await Promise.all(datesToLoad.map(async date => {
                const dataPoints = await api.doseRate.getTimeSeries(this.siteId, date)
                this.datasets.push(new Dataset(date, dataPoints))
            }))

            this.datasets.sort((a, b) => a.date < b.date ? -1 : 1)
            this.generateDataPoints()
            this.onUpdate()
        }
        catch (error) {
            console.log(error)
        }
    }

    /**
     * Transform dataset data points into a single set of data points that Plotly.js can use.
     */
    generateDataPoints () {
        let dates = []
        let values = []
        for (var i = 0; i < this.datasets.length; ++i) {
            for (var j = 0; j < this.datasets[i].dataPoints.length; ++j) {
                const currentDataPoint = this.datasets[i].dataPoints[j]
                dates.push(new Date(currentDataPoint.e).toISOString())
                values.push(currentDataPoint.r)
            }
        }

        this.dataPoints = [{ x: dates, y: values }]
    }
}

export default TimeSeriesGraph
