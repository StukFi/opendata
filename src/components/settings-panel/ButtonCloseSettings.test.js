import { mount } from "@vue/test-utils"
import ButtonCloseSettings from "./ButtonCloseSettings"

describe("ButtonCloseSettings.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ButtonCloseSettings, {
            mocks: {
                $t: () => {}
            }
        })
    })

    it("emits a click event when clicked", () => {
        wrapper.find("button").trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
