import Vue from "vue"
import VueResource from "vue-resource"
import BootstrapVue from "bootstrap-vue"
import VueI18n from "vue-i18n"

import App from "./app"
import store from "../src/store"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "ol/ol.css"
import "../dist/global.css"

Vue.use(VueResource)
Vue.use(BootstrapVue)
Vue.use(VueI18n)

Vue.config.productionTip = false

const i18n = new VueI18n({
    locale: "en"
})

new Vue({
    el: "#app",
    store,
    i18n,
    render: h => h(App)
})