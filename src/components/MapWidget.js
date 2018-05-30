Vue.component("map-widget", {
    mixins: [settings],
    template: `
        <div id="map" class="map">
            <map-legend></map-legend>
            <popup-basic></popup-basic>
            <popup-detailed></popup-detailed>
        </div>
    `,
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

        this.$root.$on("datasetChanged", this.onDatasetChanged);

        this.geoJsonFormat = new ol.format.GeoJSON({
            defaultDataProjection: "EPSG:4326"
        });

        var styleFunction = function(feature) {
            var doseRate = feature.get("doseRate");
            var color;
            for (var i = 0; i < that.settings.doseRates.length; ++i) {
                if (doseRate < that.settings.doseRates[i].maxValue) {
                    color = that.settings.doseRates[i].color;
                    break;
                }
            }

            var style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            });

            return [style];
        };

        this.vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                format: this.geoJsonFormat
            }),
            style: styleFunction
        });

        this.map = new ol.Map({
            target: "map",
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

        var popupBasic = document.getElementById("popup-basic");
        var popupDetailed = document.getElementById("popup-detailed");

        var overlayPopupBasic = new ol.Overlay({
            element: popupBasic,
            position: undefined,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        var overlayPopupDetailed = new ol.Overlay({
            element: popupDetailed,
            position: undefined,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map.addOverlay(overlayPopupBasic);
        this.map.addOverlay(overlayPopupDetailed);

        var popupCloser = document.getElementById("popup-closer");
        popupCloser.onclick = function() {
            overlayPopupDetailed.setPosition(undefined);
            popupCloser.blur();
            return false;
        };

        this.map.on("pointermove", controlBasicPopup);
        this.map.on("click", controlDetailedPopup);

        function controlBasicPopup(evt) {
            if (overlayPopupDetailed.getPosition()) {
                return;
            }

            var pixel = that.map.getEventPixel(evt.originalEvent);
            var features = that.map.getFeaturesAtPixel(pixel);
            if (!features) {
                overlayPopupBasic.setPosition(undefined);
                return;
            }

            var feature = features[0];
            var coordinate = feature.getGeometry().getCoordinates();
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                        coordinate, "EPSG:3857", "EPSG:4326"));
            overlayPopupBasic.setPosition(coordinate);

            var data = {
                site: feature.get("site"),
                siteId: feature.get("id"),
                doseRate: feature.get("doseRate")
            };

            that.$root.$emit("mapFeatureFocused", data);
        }

        function controlDetailedPopup(evt) {
            var pixel = that.map.getEventPixel(evt.originalEvent);
            var features = that.map.getFeaturesAtPixel(pixel);
            if (!features) {
                overlayPopupDetailed.setPosition(undefined);
                return;
            }

            if (overlayPopupBasic.getPosition()) {
                overlayPopupBasic.setPosition(undefined);
            }

            var feature = features[0];
            var coordinate = feature.getGeometry().getCoordinates();
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                        coordinate, "EPSG:3857", "EPSG:4326"));
            overlayPopupDetailed.setPosition(coordinate);

            var data = {
                site: feature.get("site"),
                siteId: feature.get("id"),
                doseRate: feature.get("doseRate")
            };

            that.$root.$emit("mapFeatureFocused", data);
            that.$root.$emit("mapFeatureClicked", data);
        };

        this.map.updateSize();
    }
});
