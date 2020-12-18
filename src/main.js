import Vue from "vue"
import VueResource from "vue-resource"
import i18n from "./i18n"
import "@/components/base/index"

import App from "./App"
import store from "@/store"

import "ol/ol.css"
import "@/assets/styles/index.scss"

Vue.use(VueResource)

Vue.config.productionTip = false

new Vue({
    el: "#app",
    store,
    i18n,
    render: h => h(App)
})
