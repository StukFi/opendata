import { mount } from "@vue/test-utils"
import BaseBackdrop from "./BaseBackdrop"

describe("BaseBackdrop.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(BaseBackdrop)
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
