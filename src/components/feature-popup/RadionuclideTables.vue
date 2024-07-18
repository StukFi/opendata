<template>
    <div class="radionuclide-tables">
      <loading-spinner :is-enabled="isLoading" />
      <div v-if="!isLoading">
        <div v-if="hasData">
          <div v-for="(data, index) in tablesData" :key="index" class="table-container">
            <div v-if="data.entries.length > 0">
              <h3>{{ data.radionuclide }}</h3>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('radionuclideMode.date') }}</th>
                    <th>{{ $t('radionuclideMode.concentration') }} µBq/m3</th>
                    <th>{{ $t('radionuclideMode.uncertainty') }}-%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in data.entries" :key="entry.s">
                    <td>{{ formatDates(new Date(entry.s)) }} - {{ formatDates(new Date(entry.e)) }}</td>
                    <td>{{ entry.c }}</td>
                    <td>{{ entry.u }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="!hasData">
          <h3>{{ $t('radionuclideMode.noData') }}</h3>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import LoadingSpinner from "@/components/feature-popup/LoadingSpinner.vue"
  import airRadionuclidesApi from "@/api/air-radionuclides"
  
  export default {
    name: "RadionuclideTables",
    components: {
      LoadingSpinner
    },
    props: {
      feature: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        tablesData: [],
        isLoading: false
      }
    },
    watch: {
      feature: {
        immediate: true,
        handler: "fetchData"
      }
    },
    computed: {
      formatDates() {
        return (date) => {
          switch (this.$store.state.settings.settings.dateFormat) {
            case "fi":
            default:
              return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  
            case "iso":
              return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          }
        }
      },
      hasData() {
        return this.tablesData.some(data => data.entries.length > 0)
      }
    },
    methods: {
      async fetchData() {
        if (!this.feature || !this.feature.get) {
          return
        }
  
        const siteId = this.feature.get("id")
        if (!siteId) {
          return
        }
  
        try {
          this.isLoading = true // Set loading state to true
  
          // Fetch the list of radionuclides for the given siteId
          let radionuclides = await airRadionuclidesApi.getAvailableRadionuclides(siteId)
          radionuclides = radionuclides.filter(item => item !== 'air-volume') // Remove air-volume
  
          if (!radionuclides || radionuclides.length === 0) {
            return
          }
  
          console.log(`Fetching data for site: ${siteId}, radionuclides: ${radionuclides.join(", ")}`)
  
          // Fetch time series data for each radionuclide
          const promises = radionuclides.map(async (radio) => {
            try {
              const data = await airRadionuclidesApi.getTimeSeries(siteId, radio)
              console.log(`Data fetched for radionuclide ${radio}:`, data)
  
              // Sort entries by date in descending order
              const sortedEntries = this.removeDuplicates(data || []).sort((a, b) => new Date(b.s) - new Date(a.s))
  
              return {
                radionuclide: radio,
                entries: sortedEntries
              }
            } catch (error) {
              console.error(`Error fetching data for radionuclide ${radio}:`, error)
              return {
                radionuclide: radio,
                entries: []
              }
            }
          })
  
          this.tablesData = await Promise.all(promises)
          console.log("All data fetched successfully:", this.tablesData)
        } catch (error) {
          console.error("Error in fetching data:", error)
        } finally {
          this.isLoading = false // Set loading state to false after data fetching is done
        }
      },
      removeDuplicates(entries) {
        const seen = new Set()
        return entries.filter(entry => {
          const identifier = `${entry.s}-${entry.e}-${entry.c}-${entry.u}`
          if (seen.has(identifier)) {
            return false
          }
          seen.add(identifier)
          return true
        })
      }
    }
  }
  </script>
  
  
  <style scoped>
  .table-container {
    margin-bottom: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    color: black;
    font-size: 0.7em;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    color: black;
  }
  th {
    background-color: #f2f2f2;
    color: black;
  }
  h3 {
    color: black;
  }
  .radionuclide-tables {
    position: relative;
    height: 15em;
    overflow: auto;
}
  </style>
  