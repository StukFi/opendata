import i18n from "./i18n"
import base from "./components/base/index"
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

const app = createApp(App)
app.use(store)
app.use(i18n)
app.use(VueProgressBar, options)
app.use(VueClickAway)
app.use(base)
app.mount('#app')