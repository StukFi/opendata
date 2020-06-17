import { mount } from "@vue/test-utils"
import SettingsPanelBackdrop from "./SettingsPanelBackdrop"

describe("SettingsPanelBackdrop.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(SettingsPanelBackdrop)
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
