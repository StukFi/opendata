<template>
    <div class="wrapper">
        <div ref="graphContainer">
            <loading-spinner :is-enabled="isLoading" />
        </div>
    </div>
</template>

<script>
import TimeSeriesGraph from "@/models/TimeSeriesGraph"
import LoadingSpinner from "./LoadingSpinner"
import Plotly from "plotly.js/lib/core"
import localeFI from "plotly.js/lib/locales/fi"
Plotly.register(localeFI)

export default {
    name: "TimeSeriesGraph",
    components: {
        LoadingSpinner
    },
    props: {
        feature: {
            type: Object,
            default: undefined
        }
    },
    data: function () {
        return {
            timeSeriesGraph: new TimeSeriesGraph(),
            plotlyLayout: {},
            defaultPlotlyLayout: {
                width: 0,
                height: 0,
                dragmode: "pan",
                margin: { t: 20, r: 0, b: 50, l: 50, pad: 15 },
                yaxis: { range: [0, 0.4] }
            },
            plotlyConfig: {
                scrollZoom: true,
                connectGaps: true,
                displayModeBar: false,
                locale: "en"
            }
        }
    },
    computed: {
        selectedDate () {
            return this.$store.state.datetime.selectedDate
        },
        locale () {
            return this.$store.state.settings.settings.locale
        },
        isLoading () {
            return this.timeSeriesGraph.isLoading
        },
        featureId () {
            return this.feature ? this.feature.get("id") : undefined
        }
    },
    watch: {
        featureId: function () {
            this.reset()
        },
        selectedDate: function () {
            this.reset()
        },
        locale: function (locale) {
            this.plotlyConfig.locale = locale
            this.draw()
        },
    },
    mounted () {
        this.updateSize()
        this.$refs.graphContainer.on("plotly_relayout", this.onPlotlyRelayout)
        window.onresize = this.updateSize
    },
    methods: {
        draw () {
            Plotly.react(
                this.$refs.graphContainer,
                this.timeSeriesGraph.dataPoints,
                this.plotlyLayout,
                this.plotlyConfig
            )
        },
        async onPlotlyRelayout (evt) {
            if (!evt || !evt["xaxis.range[0]"] || !evt["xaxis.range[1]"]) {
                return
            }

            const startDate = new Date(evt["xaxis.range[0]"].split(" ")[0])
            const endDate = new Date(evt["xaxis.range[1]"].split(" ")[0])
            await this.timeSeriesGraph.loadTimespan(startDate, endDate)
        },
        updateSize () {
            const breakpoint = 767
            if (window.innerWidth > breakpoint) {
                this.plotlyLayout.width = 400
                this.plotlyLayout.height = 240
            }
            else {
                this.plotlyLayout.width = 300
                this.plotlyLayout.height = 200
            }

            this.draw()
        },
        reset () {
            this.plotlyLayout = JSON.parse(JSON.stringify(this.defaultPlotlyLayout))
            this.timeSeriesGraph = new TimeSeriesGraph(this.featureId)
            this.timeSeriesGraph.onUpdate = this.draw.bind(this)
            this.timeSeriesGraph.loadTimespan(this.selectedDate, this.selectedDate)
        }
    }
}
</script>

<style scoped>
.wrapper {
    position: relative;
}
</style>
