import Vue from "vue"
import VueResource from "vue-resource"
import App from "./app"
import store from "../src/store"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/css/bootstrap-reboot.min.css"
import "ol/ol.css"
import "../dist/global.css"

Vue.use(VueResource)

Vue.config.productionTip = false

new Vue({
    el: "#app",
    store,
    render: h => h(App)
})
