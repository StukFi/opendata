import http from "@/utils/http"

export default {
    /**
     * Get metadata file.
     */
    async getMetadata () {
        const response = await http.get("data/dose_rates/metadata.json")
        return response.body.available_data
    },
    /**
     * Get a time series file.
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
