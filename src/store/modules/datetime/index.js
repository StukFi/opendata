import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"

export default {
    state: {
        validDatetimes: [],
        date: undefined,
        time: undefined
    },
    mutations: mutations,
    actions: actions,
    getters: getters
}
