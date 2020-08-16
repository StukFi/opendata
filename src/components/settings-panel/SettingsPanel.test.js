import { shallowMount } from "@vue/test-utils"
import SettingsPanel from "./SettingsPanel"
import Settings from "@/models/Settings"

describe("SettingsPanel.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SettingsPanel, {
            mocks: {
                $store: { state: { settings: { settings: new Settings()}}, commit: jest.fn()}
            }
        })
    })

    it("opens when an event is emitted", async () => {
        expect(wrapper.element).not.toBeVisible()
        await wrapper.vm.$root.$emit("settings-panel-open")
        expect(wrapper.element).toBeVisible()
    })
})
