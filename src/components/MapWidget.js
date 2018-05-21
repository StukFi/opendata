Vue.component('map-widget', {
    template: '<div></div>',
    data() {
        return {
            map: {}
        };
    },
    mounted: function() {
        var that = this;

        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON({
                    defaultDataProjection: 'EPSG:4326'
                }),
                url: '../results/2018-05-11T110000.json'
            })
        });

        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                vectorLayer
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
                    layers: [vectorLayer]
                })
            ]),
            view: new ol.View({
                center: ol.proj.fromLonLat([25, 63]),
                zoom: 5
            })
        });

        var popup = new ol.Overlay({
            element: document.getElementById('map-feature-popup')
        });
        this.map.addOverlay(popup);

        this.map.on('click', function(e) {
            var element = popup.getElement();
            $(element).popover('dispose');

            var pixel = that.map.getEventPixel(e.originalEvent);
            var features = that.map.getFeaturesAtPixel(pixel);
            if (!features) {
                return;
            }

            var coordinate = features[0].getGeometry().getCoordinates();
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinate, 'EPSG:3857', 'EPSG:4326'));

            popup.setPosition(coordinate);
            $(element).popover({
                'placement': 'top',
                'animation': false,
                'html': true,
                'content': '<p>Position:</p><code>' + hdms + '</code>'
            });
            $(element).popover('show');
        });
    }
});
