Vue.component('time-series-graph', {
    mixins: [utils],
    template: `
        <div id="graph-container"></div>
    `,
    data: function() {
        return {
            siteId: "",
            datasets: [],
            defaultDataset: {},
            startDate: undefined,
            endDate: undefined,
            baseFilePath: "data/dose_rates/stations/",
            graphEventsRegistered: false,
            graphData: [],
            graphLayout: {},
            defaultGraphLayout: {
                width: 400,
                height: 250,
                dragmode: 'pan',
                margin: { t: 20, r: 0, b: 50, l: 50, pad: 15 },
                yaxis: { range: [0, 0.4] }
            },
            graphConfig: {
                scrollZoom: true,
                connectGaps: true,
                displayModeBar: false
            }
        };
    },
    mounted: function() {
        this.$root.$on('datetimeChanged', this.onDatetimeChanged);
        this.$root.$on('mapFeatureClicked', this.onSiteClicked);
    },
    methods: {
        onDatetimeChanged(datetime) {
            this.datasets = [];
            this.graphData = [];

            var date = datetime.split("T")[0];
            this.startDate = new Date(date);
            this.endDate = new Date(this.startDate);
            this.endDate = this.endDate.setDate(this.endDate.getDate() + 1);

            this.defaultDataset = {
                filename: date + ".json",
                date: new Date(date)
            };
        },
        onSiteClicked(data) {
            var that = this;

            this.datasets = [];
            this.graphData = [];
            this.siteId = data.siteId;
            this.defaultDataset.filePath = this.getDatasetFilePath(this.defaultDataset.filename);

            this.loadDataset(this.defaultDataset).then(function() {
                that.createGraphData();
                that.drawGraph(true);
            });
        },
        getDatasetFilePath(filename) {
            return this.baseFilePath + this.siteId + "/" + filename;
        },
        addDataset(dataset) {
            for (var i = 0; i < this.datasets.length; ++i) {
                if (dataset.date < this.datasets[i].date) {
                    this.datasets.splice(i, 0, dataset);
                    return;
                }
            }

            this.datasets.push(dataset);
        },
        createGraphData() {
            var dates = [];
            var values = [];
            for (var i = 0; i < this.datasets.length; ++i) {
                for (var j = 0; j < this.datasets[i].data.length; ++j) {
                    dates.push(new Date(this.datasets[i].data[j].e));
                    values.push(this.datasets[i].data[j].r);
                }
            }

            this.graphData = [{
                x: dates,
                y: values,
                type: 'scatter'
            }];
        },
        loadDataset(dataset) {
            function duplicateExists(existingDataset) {
                return existingDataset.filePath == dataset.filePath;
            }

            if (this.datasets.some(duplicateExists)) {
                return Promise.resolve();
            }

            return this.$http.get(dataset.filePath).then(function(response) {
                dataset["data"] = response.data.data;
                this.addDataset(dataset);
            }).catch(function() {
            });
        },
        drawGraph(resetLayout) {
            if (resetLayout) {
                this.graphLayout = $.extend(true, {}, this.defaultGraphLayout);
            }

            Plotly.react('graph-container', this.graphData, this.graphLayout, this.graphConfig);

            // Registering plotly.js' own events must be done here after the first plot.
            // Doing it in e.g. the component's mounted() function caused weird behavior
            // such as being unable to reset the graph's zoom with a double click.
            if (!this.graphEventsRegistered) {
                this.registerGraphEvents();
            }
        },
        registerGraphEvents() {
            var that = this;
            var graphContainer = document.getElementById('graph-container');
            graphContainer.on('plotly_relayout', updateGraph);
            this.graphEventsRegistered = true;

            function updateGraph(evt) {
                if (!evt || !evt["xaxis.range[0]"] || !evt["xaxis.range[1]"]) {
                    return;
                }

                var datasets = [];
                var newDates = [], pastDates = [], futureDates = [];
                var startDate = new Date(evt["xaxis.range[0]"].split(" ")[0]);
                var endDate = new Date(evt["xaxis.range[1]"].split(" ")[0]);

                pastDates = that.getDatesBetween(startDate, that.startDate);
                futureDates = that.getDatesBetween(that.endDate, endDate);

                that.startDate = startDate;
                that.endDate = endDate;

                // Reverse the past dates to get more recent datasets first.
                pastDates.reverse();

                newDates = pastDates.concat(futureDates);
                if (newDates.length == 0) {
                    return;
                }

                for (var i = 0; i < newDates.length; ++i) {
                    var filename = newDates[i].toISOString().split("T")[0] + ".json";
                    var dataset = {
                        filePath: that.getDatasetFilePath(filename),
                        date: newDates[i]
                    };
                    datasets.push(dataset);
                }

                datasets.reduce(function callback(promise, dataset) {
                    return promise.then(function() {
                        return that.loadDataset(dataset).then(function() {
                            that.createGraphData();
                            that.drawGraph();
                        });
                    });
                }, Promise.resolve());
            }
        }
    }
});
