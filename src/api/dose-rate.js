import http from "@/utils/http"

export default {
    /**
     * Query a list of available datasets. Each element consists of a date
     * and the times for which a dataset exists on that date.
     * @return {Array}
     */
    async queryAvailableDatasets () {
        const response = await http.get("data/dose_rates/metadata.json")
        let availableDatasets = response.body.available_data

        availableDatasets.forEach(element => {
            element.date = new Date(element.date)
            element.times.sort()
        })

        // Sort available datasets chronologically by date.
        availableDatasets.sort((elementA, elementB) => {
            return new Date(elementA.date) - new Date(elementB.date)
        })

        return availableDatasets
    },
    /**
     * Get a dose rate dataset file.
     * @param {String} filePath
     */
    async getDataset (datasetFilePath) {
        let response = await http.get(datasetFilePath)
        return response.data
    },
    /**
     * Get a time series file for a given site and date.
     * @param {String} siteId
     * @param {Date} date
     */
    async getTimeSeries (siteId, date) {
        const dateString = date.toISOString().split("T")[0]
        const url = "/data/dose_rates/time_series/" + siteId + "/" + dateString + ".json"
        const response = await http.get(url)
        return response.data.data
    }
}
