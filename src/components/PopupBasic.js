Vue.component("popup-basic", {
    mixins: [popup],
    template: `
        <div id="popup-basic" class="popup">
            <div class="popup-content">
                <p style="text-align:center;"><b>{{site}}</b></p>
                <p style="text-align:center;font-size:2em;">{{doseRate}}</p>
            </div>
        </div>
    `
});
