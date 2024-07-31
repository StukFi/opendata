<template>
    <div class="wrapper">
        <div ref="graphContainer">
            <loading-spinner :is-enabled="isLoading" />
        </div>
    </div>
</template>

<script>
import TimeSeriesGraph from "@/models/TimeSeriesGraph"
import LoadingSpinner from "@/components/feature-popup/LoadingSpinner.vue"
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
                yaxis: { range: [0, 0.4] },
                font: { size: 12, family: "RedHatText-Medium" }
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
        },
        mode() {
            return this.$store.state.settings.settings.mode
        },
        isAirRadionuclidesMode() {
            return this.mode === "air_radionuclides"
        },
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
        this.updateSize(true)
        this.$refs.graphContainer.on("plotly_relayout", this.onPlotlyRelayout)
        window.onresize = this.updateSize
    },
    methods: {
        draw () {
            if (!this.isAirRadionuclidesMode) {
            // New font sizes don't apply for some reason unless this function
            // is called before every draw of the graph. The font size does change when you
            // resize the window on desktop but not when the app is opened normally.
            this.updateSize()
            Plotly.react(
                this.$refs.graphContainer,
                this.timeSeriesGraph.dataPoints,
                this.plotlyLayout,
                this.plotlyConfig
            )
            }
        },
        async onPlotlyRelayout (evt) {
            if (!this.isAirRadionuclidesMode) {
            if (!evt || !evt["xaxis.range[0]"] || !evt["xaxis.range[1]"]) {
                return
            }

            const startDate = new Date(evt["xaxis.range[0]"].split(" ")[0])
            const endDate = new Date(evt["xaxis.range[1]"].split(" ")[0])
            await this.timeSeriesGraph.loadTimespan(startDate, endDate)
        }
        },
        updateSize (redraw = false) {
            if (!this.isAirRadionuclidesMode) {
            // I was unable to get the Plotly.js graph to resize and render properly
            // in a responsive container (the feature popup) using relative units. Because
            // of this the sizing uses pixels and is done here instead of in CSS.
            const breakpointMd = 768
            const breakpointLg = 1024
            if (window.innerWidth >= breakpointLg) {
                this.plotlyLayout.width = 475
                this.plotlyLayout.height = 400
                this.plotlyLayout.font = { size: 14 }
            }
            else if (window.innerWidth >= breakpointMd) {
                this.plotlyLayout.width = 300
                this.plotlyLayout.height = 220
                this.plotlyLayout.font = { size: 12 }
            }
            else {
                this.plotlyLayout.width = 300
                this.plotlyLayout.height = 180
                this.plotlyLayout.font = { size: 10 }
            }

            if (redraw) {
                this.draw()
            }
        }
        },
        reset () {
            if (!this.isAirRadionuclidesMode) {
            this.plotlyLayout = JSON.parse(JSON.stringify(this.defaultPlotlyLayout))
            this.timeSeriesGraph = new TimeSeriesGraph(this.featureId)
            this.timeSeriesGraph.onUpdate = this.draw.bind(this) 
            this.timeSeriesGraph.loadTimespan(this.selectedDate, this.selectedDate)
            }
        }
    }
}
</script>

<style scoped>
.wrapper {
    position: relative;
}
</style>
