Vue.component('time-series-graph', {
    template: `
        <div id="graph-container"></div>
    `,
    data: function() {
        return {
            dataset: "",
            timeSeriesData: [],
            sideId: 0,
            layout: {
                width: 400,
                height: 250,
                dragmode: 'pan',
                margin: {
                    t: 20,
                    r: 0,
                    b: 50,
                    l: 50,
                    pad: 15
                },
                yaxis: {
                    range: [0, 0.4]
                }
            },
            config: {
                scrollZoom: true,
                displayModeBar: false
            }
        };
    },
    methods: {
        onDatasetChanged(dataset) {
            this.dataset = dataset.split('T')[0] + '.json';
        },
        drawGraph(data) {
            var that = this;
            var file = "data/dose_rates/stations/" + data.siteId + "/" + that.dataset;
            this.$http.get(file).then(function(response) {
                that.timeSeriesData = response.data.data;

                var dates = [];
                var values = [];
                for (var i = 0; i < that.timeSeriesData.length; ++i) {
                    dates.push(new Date(that.timeSeriesData[i].e));
                    values.push(that.timeSeriesData[i].r);
                }

                var data = [
                    {
                        x: dates,
                        y: values,
                        type: 'scatter'
                    }
                ];

                // Deep copy the layout to another variable to avoid it being
                // modified by plotly. Otherwise the layout's zoom levels won't
                // reset when the popup is reopened.
                var layout = $.extend(true, {}, that.layout);

                Plotly.newPlot('graph-container', data, layout, that.config);
            });
        }
    },
    mounted: function() {
        var that = this;
        this.$root.$on('datasetChanged', this.onDatasetChanged);
        this.$root.$on('mapFeatureClicked', this.drawGraph);
    }
});
