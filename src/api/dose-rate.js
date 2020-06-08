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
     * @param {String} url
     */
    async getTimeSeries (url) {
        const response = await http.get(url)
        return response.data.data
    }
}
