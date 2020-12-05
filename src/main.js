import Vue from "vue"
import VueResource from "vue-resource"
import BootstrapVue from "bootstrap-vue"
import i18n from "./i18n"

import App from "./App"
import store from "@/store"

// import "bootstrap/dist/css/bootstrap.css"
// import "bootstrap-vue/dist/bootstrap-vue.css"
import "ol/ol.css"
import "@/assets/styles/index.scss"

Vue.use(VueResource)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
    el: "#app",
    store,
    i18n,
    render: h => h(App)
})
