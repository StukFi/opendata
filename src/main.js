import Vue from "vue"
import i18n from "./i18n"
import "@/components/base/index"
import { createApp,h } from "vue"
import App from "./App.vue"
import store from './store'
import "ol/ol.css"
import "@/assets/styles/index.scss"
import VueProgressBar from "@aacassandra/vue3-progressbar"

const options = {
    color: "white",
    failedColor: "#e95024",
    thickness: "0.25em"
}

Vue.config.productionTip = false

createApp(App).use(store).use(i18n).use(VueProgressBar, options).mount('#app')