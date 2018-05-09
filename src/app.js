var app = new Vue({
    el: '#app'
});

var map = new ol.Map({
    target: 'map-container',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 3
    })
});
