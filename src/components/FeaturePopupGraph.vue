<template>
    <div ref="graphContainer" />
</template>

<script>
import dateUtils from "@/utils/date"
import api from "@/api"

import Plotly from "plotly.js/lib/core"
import localeFI from "plotly.js/lib/locales/fi"
Plotly.register(localeFI)

export default {
    name: "FeaturePopupGraph",
    props: {
        siteId: {
            default: "",
            type: String
        }
    },
    data: function () {
        return {
            graphData: [],
            datasets: [],
            selectedDate: undefined,
            startDate: undefined,
            endDate: undefined,
            baseFilePath: "data/dose_rates/time_series/",
            eventsRegistered: false,
            layout: {},
            defaultLayout: {
                // Dimensions are set in created() based on window size.
                width: 0,
                height: 0,
                dragmode: "pan",
                margin: { t: 20, r: 0, b: 50, l: 50, pad: 15 },
                yaxis: { range: [0, 0.4] }
            },
            config: {
                scrollZoom: true,
                connectGaps: true,
                displayModeBar: false,
                locale: "en"
            }
        }
    },
    computed: {
        date () {
            return this.$store.state.datetime.date
        },
        locale () {
            return this.$store.state.settings.locale
        }
    },
    watch: {
        date: function (newDate) {
            this.reset()

            this.selectedDate = new Date(newDate.toISOString().split("T")[0])
            this.startDate = new Date(this.selectedDate)
            this.endDate = new Date(this.selectedDate)

            if (this.siteId) {
                this.drawDefaultGraph()
            }
        },
        locale: function (locale) {
            this.config.locale = locale
            this.draw()
        },
        siteId: function () {
            this.drawDefaultGraph()
        }
    },
    created () {
        var that = this

        function setGraphDimensions () {
            if (window.innerWidth > 767) {
                that.defaultLayout.width = 400
                that.defaultLayout.height = 240
            } else {
                that.defaultLayout.width = 300
                that.defaultLayout.height = 200
            }
        }

        setGraphDimensions()
        window.onresize = setGraphDimensions
    },
    methods: {
        reset () {
            this.datasets = []
            this.graphData = []

            this.startDate = new Date(this.selectedDate)
            this.endDate = new Date(this.selectedDate)

            this.resetLayout()
        },
        resetLayout () {
            this.layout = JSON.parse(JSON.stringify(this.defaultLayout))
        },
        getDatasetFilePath (date) {
            var filename = date.toISOString().split("T")[0] + ".json"
            return this.baseFilePath + this.siteId + "/" + filename
        },
        duplicateDatasetExists (dataset) {
            return this.datasets.some(function (existingDataset) {
                return existingDataset.filePath == dataset.filePath
            })
        },
        draw () {
            this.generateGraphData()

            Plotly.react(this.$refs.graphContainer, this.graphData,
                this.layout, this.config)

            // Registering plotly.js' own events must be done here after the first plot.
            // Doing it in e.g. the component's mounted() function causes weird behavior
            // such as being unable to reset the graph's zoom with a double click.
            if (!this.eventsRegistered) {
                this.registerEvents()
            }
        },
        drawDefaultGraph () {
            var that = this

            this.reset()

            var dataset = {
                filePath: this.getDatasetFilePath(this.selectedDate),
                date: new Date(this.selectedDate),
                data: undefined
            }

            this.loadDataset(dataset).then(function () {
                that.resetLayout()
                that.draw()
            })
        },
        async loadDataset (dataset) {
            try {
                dataset["data"] = await api.doseRate.getTimeSeries(dataset.filePath)
                this.addDataset(dataset)
            }
            catch {() => {}}
        },
        loadDatasets (datasets) {
            var that = this
            return datasets.reduce(function callback (promise, dataset) {
                return promise.then(function () {
                    return that.loadDataset(dataset)
                })
            }, Promise.resolve())
        },
        addDataset (dataset) {
            for (var i = 0; i < this.datasets.length; ++i) {
                if (dataset.date < this.datasets[i].date) {
                    this.datasets.splice(i, 0, dataset)
                    return
                }
            }

            this.datasets.push(dataset)
        },
        generateGraphData () {
            var dates = []
            var values = []

            for (var i = 0; i < this.datasets.length; ++i) {
                for (var j = 0; j < this.datasets[i].data.length; ++j) {
                    dates.push(new Date(this.datasets[i].data[j].e).toISOString())
                    values.push(this.datasets[i].data[j].r)
                }
            }

            this.graphData = [{
                x: dates,
                y: values,
                type: "scatter"
            }]
        },
        registerEvents () {
            if (this.eventsRegistered) {
                return
            }

            this.$refs.graphContainer.on("plotly_relayout", this.onPlotlyRelayout)
            this.eventsRegistered = true
        },
        onPlotlyRelayout (evt) {
            var that = this

            if (!evt || !evt["xaxis.range[0]"] || !evt["xaxis.range[1]"]) {
                return
            }

            // Get the dates for which a dataset has not been loaded.
            var newDates = [], pastDates = [], futureDates = []
            var startDate = new Date(evt["xaxis.range[0]"].split(" ")[0])
            var endDate = new Date(evt["xaxis.range[1]"].split(" ")[0])

            if (startDate < that.startDate) {
                pastDates = dateUtils.getDatesBetween(startDate, that.startDate, true, false)
                pastDates.reverse()
                that.startDate = startDate
            }
            if (endDate > that.endDate) {
                futureDates = dateUtils.getDatesBetween(that.endDate, endDate, false, true)
                that.endDate = endDate
            }

            newDates = pastDates.concat(futureDates)
            if (newDates.length == 0) {
                return
            }

            // Create a list of datasets to be loaded from the new dates.
            var datasets = []
            for (var i = 0; i < newDates.length; ++i) {
                var dataset = {
                    filePath: that.getDatasetFilePath(newDates[i]),
                    date: new Date(newDates[i]),
                    data: undefined
                }

                if (that.duplicateDatasetExists(dataset)) {
                    continue
                }

                datasets.push(dataset)
            }

            that.loadDatasets(datasets).then(function () {
                that.draw()
            })
        }
    }
}
</script>
