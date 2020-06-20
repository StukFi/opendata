import { mount } from "@vue/test-utils"
import ButtonClosePopup from "./ButtonClosePopup.vue"

describe("ButtonClosePopup.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ButtonClosePopup)
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
