import { shallowMount } from "@vue/test-utils"
import SettingsPanel from "./SettingsPanel"
import ButtonOpenSettings from "./ButtonOpenSettings"

describe("SettingsPanel.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SettingsPanel, {
            mocks: {
                $store: {},
                $t: () => {}
            }
        })
    })

    it("is opened when the settings button is clicked", async () => {
    })

    it("is closed when the close button is clicked", () => {
    })
})
