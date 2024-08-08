import datetime from "./modules/datetime/index"
import settings from "./modules/settings/index"

import { createStore } from "vuex"

const store = createStore({
    modules: {
        datetime,
        settings
    }
})
export default store