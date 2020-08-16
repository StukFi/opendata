import Vue from "vue"
import Vuex from "vuex"

import datetime from "./modules/datetime/index"
import settings from "./modules/settings/index"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        datetime,
        settings
    }
})
