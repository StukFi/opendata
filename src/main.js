import Vue from "vue"
import VueResource from "vue-resource"
import App from "./app.vue"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "ol/ol.css"
import "../dist/global.css"

Vue.use(VueResource);

Vue.config.productionTip = false

new Vue({
    el: "#app",
    render: h => h(App)
})
