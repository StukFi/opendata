import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"

export default {
    state: {
        availableDatasets: [],
        date: undefined,
        time: undefined
    },
    mutations: mutations,
    actions: actions,
    getters: getters
}
