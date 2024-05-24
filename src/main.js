import Vue from "vue"
import VueResource from "vue-resource"
import VueProgressBar from "vue-progressbar"
import i18n from "./i18n"
import "@/components/base/index"
import { createApp,h } from "vue"
import App from "./App.vue"
import store from './store'

import "ol/ol.css"
import "@/assets/styles/index.scss"

Vue.use(VueResource)
Vue.use(VueProgressBar, {
    color: "white",
    failedColor: "#e95024",
    thickness: "0.25em"
})

Vue.config.productionTip = false

createApp(App).use(store).use(i18n).mount('#app')

//app.mount("#app")

/*new Vue({
    el: "#app",
    store,
    i18n,
    render: h => h(App)
})
*/