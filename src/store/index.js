import Vue from "vue"
import Vuex from "vuex"

import datetime from "./modules/datetime-module.js"
import settings from "./modules/settings-module.js"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        datetime,
        settings
    }
})
