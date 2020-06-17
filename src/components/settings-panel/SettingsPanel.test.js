import { shallowMount } from "@vue/test-utils"
import SettingsPanel from "./SettingsPanel"

describe("SettingsPanel.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SettingsPanel, {
            mocks: {
                $store: {}
            }
        })
    })

    it("opens when an event is emitted", async () => {
        expect(wrapper.element).not.toBeVisible()
        await wrapper.vm.$root.$emit("settings-panel-open")
        expect(wrapper.element).toBeVisible()
    })
})
