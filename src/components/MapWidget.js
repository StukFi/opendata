Vue.component('map-widget', {
    template: '<div></div>',
    data: function() {
        return {
            map: {},
            vectorLayer: {},
            url: "",
            file: "",
            geoJsonFormat: {}
        };
    },
    methods: {
        onDatasetChanged(dataset) {
            dataset = "data/dose_rates/" + dataset;
            var source = new ol.source.Vector({
                format: this.geoJsonFormat,
                url: dataset
            });
            this.vectorLayer.setSource(source);
        }
    },
    mounted: function() {
        var that = this;

        this.$root.$on('datasetChanged', this.onDatasetChanged);

        this.geoJsonFormat = new ol.format.GeoJSON({
            defaultDataProjection: 'EPSG:4326'
        });

        this.vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                format: this.geoJsonFormat
            })
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                this.vectorLayer
            ],
            controls: [
                new ol.control.Zoom(),
                new ol.control.Rotate(),
                new ol.control.ZoomSlider(),
                new ol.control.ScaleLine(),
                new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(2),
                    projection: "EPSG:4326",
                })
            ],
            interactions: ol.interaction.defaults().extend([
                new ol.interaction.Select({
                    layers: [this.vectorLayer]
                })
            ]),
            view: new ol.View({
                center: ol.proj.fromLonLat([25, 63]),
                zoom: 5
            })
        });

        var popupContainer = document.getElementById("popup");
        var popupContent = document.getElementById("popup-content");
        var popupCloser = document.getElementById("popup-closer");

        var overlay = new ol.Overlay({
            element: popupContainer,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        this.map.addOverlay(overlay);

        popupCloser.onclick = function() {
            overlay.setPosition(undefined);
            popupCloser.blur();
            return false;
        };

        this.map.on('click', function(e) {
            var pixel = that.map.getEventPixel(e.originalEvent);
            var features = that.map.getFeaturesAtPixel(pixel);
            if (!features) {
                overlay.setPosition(undefined);
                return;
            }

            var station = features[0];
            var coordinate = features[0].getGeometry().getCoordinates();
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                        coordinate, 'EPSG:3857', 'EPSG:4326'));
            popupContent.innerHTML = '<p><b>' + station.get("site") + "</b></p><hr/>" +
                "<p>Dose rate: " + station.get("doseRate") + " \u03bcSv/h</p>"
            overlay.setPosition(coordinate);
        });

        this.map.updateSize();
    }
});
