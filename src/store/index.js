import Vue from "vue"
import Vuex from "vuex"

import datetime from "./datetime-module.js"
import settings from "./settings-module.js"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        datetime,
        settings
    }
})
