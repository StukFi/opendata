import http from "@/utils/http"

export default {
    /**
     * Get a radionuclide dataset file.
     * @param {String} datasetFilePath
     */
    async getDataset(datasetFilePath) {
        let response = await http.get(datasetFilePath)
        return response.data
    },
    /**
     * Get a time series file for a given site, given radionuclide and date.
     * Fetches data for the entire month of the given date.
     * @param {String} siteId
     * @param {String} radionuclide
     * @param {Date} date
     */
    async getTimeSeries(siteId, radionuclide, date) {
        const results = []
        const selectedDate = new Date(date)
        const msInADay = 24 * 60 * 60 * 1000
        const startDate = new Date(selectedDate.getTime() - 30 * msInADay)

        // Get the available files
        const availableFilesUrl = `data/air_radionuclides/time_series/${siteId}/${radionuclide}/available_filenames.json`

        try {
            const response = await http.get(availableFilesUrl)
            const availableFiles = response.data

            // Filter the available files based on the date range
            for (const filename of availableFiles) {
                const dateRange = filename.replace(".json", "").split("TO")
                if (dateRange.length === 2) {
                    const fileStartDate = new Date(dateRange[0])
                    const fileEndDate = new Date(dateRange[1])

                    // Check if the date range of the file overlaps with the last 30 days
                    if ((fileStartDate <= selectedDate && fileStartDate >= startDate) ||
                        (fileEndDate <= selectedDate && fileEndDate >= startDate) ||
                        (fileStartDate <= startDate && fileEndDate >= selectedDate)) {

                        const fileUrl = `data/air_radionuclides/time_series/${siteId}/${radionuclide}/${filename}`

                        try {
                            const fileResponse = await http.get(fileUrl)
                            if (fileResponse.data && fileResponse.data.data) {
                                results.push(...fileResponse.data.data)
                            }
                        } catch {
                            console.log(`Data not found for file ${filename}`)
                        }
                    }
                }
            }

        } catch (error) {
            console.error(`Error fetching available files: ${error}`)
        }

        return results
    },
    /**
     * Get the list of available radionuclides for a given site by listing directories.
     */
    async getAvailableRadionuclides(siteId) {
        const url = `/data/air_radionuclides/time_series/${siteId}/available_radionuclides.json`
        try {
            const response = await http.get(url)
            if (response && response.data && Array.isArray(response.data)) {
                return response.data
            } else {
                console.error("Invalid response format for available radionuclides:", response)
                return []
            }
        } catch (error) {
            console.error(`Error fetching available radionuclides for site ${siteId}:`, error)
            return []
        }
    },
}