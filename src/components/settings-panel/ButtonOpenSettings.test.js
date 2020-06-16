import { mount } from "@vue/test-utils"
import ButtonOpenSettings from "./ButtonOpenSettings"

describe("ButtonOpenSettings.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ButtonOpenSettings)
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
