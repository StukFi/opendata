Vue.component('map-legend', {
    template: `
    <div id="map-legend">
        <p>Dose rate [\u03bcSv/h]</p>
        <div class="map-legend-bar" style="background-color:#411daf;">&gt 0,40</div>
        <div class="map-legend-bar" style="background-color:#1d41af;">0,30 - 0,40</div>
        <div class="map-legend-bar" style="background-color:#1d66af;">0,20 - 0,30</div>
        <div class="map-legend-bar" style="background-color:#1d8baf;">0,10 - 0,20</div>
        <div class="map-legend-bar" style="background-color:#1dafaf;">0,00 - 0,10</div>
    </div>
    `
});
