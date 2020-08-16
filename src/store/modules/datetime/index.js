import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"

export default {
    state: {
        availableDatasets: [],
        selectedDate: undefined,
        selectedTime: undefined
    },
    mutations: mutations,
    actions: actions,
    getters: getters
}
