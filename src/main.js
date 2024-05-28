import i18n from "./i18n"
import "@/components/base/index"
import { createApp } from "vue"
import App from "./App.vue"
import store from './store'
import "ol/ol.css"
import "@/assets/styles/index.scss"
import VueProgressBar from "@aacassandra/vue3-progressbar"
import VueClickAway from "vue3-click-away";

const options = {
    color: "white",
    failedColor: "#e95024",
    thickness: "0.25em"
}

createApp(App).use(store).use(i18n).use(VueProgressBar, options).use(VueClickAway).mount('#app')