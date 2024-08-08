import mutations from "./mutations"
import actions from "./actions"
import Settings from "@/models/Settings"

export default {
    state: {
        settings: new Settings()
    },
    mutations: mutations,
    actions: actions
}
