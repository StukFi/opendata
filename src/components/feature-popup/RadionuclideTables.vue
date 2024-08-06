<template>
  <div class="radionuclide-tables">
    <loading-spinner :is-enabled="isLoading" />
    <div v-if="!isLoading">
      <div v-if="hasData">
        <div v-for="(data, index) in sortedTablesData" :key="index" class="table-container">
          <div v-if="data.entries.length > 0">
            <p :class="{'bold-header': !isPriorityNuclide(data.radionuclide)}">{{ data.radionuclide }}</p>
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
        <p>{{ $t('radionuclideMode.noData') }}</p>
        <p v-if="helsinkiVantaa">{{ $t('radionuclideMode.info') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/feature-popup/LoadingSpinner.vue"
import airRadionuclidesApi from "@/api/air-radionuclides"
import eventBus from "@/utils/eventBus"

export default {
  name: "RadionuclideTables",
  components: {
    LoadingSpinner
  },
  props: {
    feature: {
      type: Object,
      default: () => ({})
    },
    date: Date,
  },
  data() {
    return {
      tablesData: [],
      isLoading: false,
      helsinkiVantaa: false
    }
  },
  watch: {
  feature: {
    immediate: true,
    handler() {
      this.fetchData(new Date())
    }
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
    },
    mode() {
      return this.$store.state.settings.settings.mode
    },
    isAirRadionuclidesMode() {
      return this.mode === "air_radionuclides"
    },
     // Display these nuclides first, in this order
    sortedTablesData() {
      const priorityOrder = ["Be-7", "Cs-137", "Pb-210", "Na-22"]
      return this.tablesData.slice().sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.radionuclide)
        const indexB = priorityOrder.indexOf(b.radionuclide)
        if (indexA === -1 && indexB === -1) return 0
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
      })
    }
  },
  mounted() {
    eventBus.$on("dateChanged", this.fetchData)
  },
  methods: {
    async fetchData(date) {
      if (!this.feature || !this.feature.get) {
        return
      }

      const siteId = this.feature.get("id")
      if (!siteId) {
        return
      }

      // Display info message about moved measurement point if siteid is Helsinki or Vantaa
      if (siteId == 103428 || siteId == 107554) {
        this.helsinkiVantaa = true
      }
      else this.helsinkiVantaa = false

      if (this.isAirRadionuclidesMode) {
      try {
        this.isLoading = true // Set loading state to true

        // Fetch the list of radionuclides for the given siteId
        let radionuclides = await airRadionuclidesApi.getAvailableRadionuclides(siteId)
        radionuclides = radionuclides.filter(item => item !== 'air-volume') // Remove air-volume

        if (!radionuclides || radionuclides.length === 0) {
          return
        }

        // Fetch time series data for each radionuclide
        const promises = radionuclides.map(async (radio) => {
          try {
            const data = await airRadionuclidesApi.getTimeSeries(siteId, radio, date)

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
      } catch (error) {
        console.error("Error in fetching data:", error)
      } finally {
        this.isLoading = false // Set loading state to false after data fetching is done
      }
    }},
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
    },
    isPriorityNuclide(nuclide) {  // Display other nuclides with bold font
      return ["Be-7", "Cs-137", "Pb-210", "Na-22"].includes(nuclide)
    }
  }
}
</script>

<style scoped>
.table-container {
  margin-right: 0.5em;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  color: black;
  font-size: 0.68em;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  color: black;
  width: max-content;
}

th {
  background-color: #f2f2f2;
  color: black;
}
p {
  color: black;
  text-align: left;
}
.bold-header {
  font-weight: bold;
}
.radionuclide-tables {
  position: relative;
  height: 15em;
  overflow: auto;
}
</style>