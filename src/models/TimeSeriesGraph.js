import api from "@/api"
import dateUtils from "@/utils/date"
import { wait } from "@/utils/promise"
import store from "@/store/index"

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
        this.isLoading = false
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

    /** Update state to match the configured timespan. */
    async update () {
        let datesToLoad = dateUtils.getDatesBetween(this.startDate, this.endDate)
        datesToLoad = datesToLoad.filter(date => {
            const isLoaded = this.datasets.some(dataset => dataset.date.getTime() == date.getTime())
            const isAvailable = store.state.datetime.validDatetimes.some(
                datetime => datetime.date.getTime() == date.getTime())
            return !isLoaded && isAvailable
        })

        if (datesToLoad.length > 0) {
            this.isLoading = true
            await Promise.allSettled(datesToLoad.map(async date => {
                let dataPoints = undefined
                try {
                    dataPoints = await api.doseRate.getTimeSeries(this.siteId, date)
                }
                finally {
                    this.datasets.push(new Dataset(date, dataPoints))
                }
            }))

            // Always wait a minimum amount of time. This prevents loading indicators
            // from flashing if loading finishes quickly.
            await wait(250)

            this.datasets.sort((a, b) => a.date < b.date ? -1 : 1)
            this.generateDataPoints()
            this.isLoading = false
        }

        this.onUpdate()
    }

    /**
     * Transform dataset data points into a single set of data points that Plotly.js can use.
     */
    generateDataPoints () {
        let dates = []
        let values = []
        for (var i = 0; i < this.datasets.length; ++i) {
            if (this.datasets[i].dataPoints) {
                for (var j = 0; j < this.datasets[i].dataPoints.length; ++j) {
                    const currentDataPoint = this.datasets[i].dataPoints[j]
                    dates.push(new Date(currentDataPoint.e).toISOString())
                    values.push(currentDataPoint.r)
                }
            }
        }

        this.dataPoints = [{ x: dates, y: values }]
    }
}

export default TimeSeriesGraph
