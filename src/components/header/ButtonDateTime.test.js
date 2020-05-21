import { shallowMount, createLocalVue } from "@vue/test-utils"
import ButtonDateTime from "./ButtonDateTime.vue"

const localVue = createLocalVue()

describe("ButtonDateTime.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(ButtonDateTime, {
            localVue,
            propsData: {
                // The icon file must exist for the tests to pass.
                icon: "caret-left"
            }
        })
    })

    it("emits a click event when clicked", () => {
        wrapper.find("button").trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })

    it("is disabled with a disabled prop", async () => {
        await wrapper.setProps({ disabled: false })
        expect(wrapper.attributes().disabled).toBeUndefined()
        await wrapper.setProps({ disabled: true })
        expect(wrapper.attributes().disabled).toBe("disabled")
    })

    it("hides its icon when disabled", async () => {
        await wrapper.setProps({ disabled: false })
        expect(wrapper.element).toHaveStyle("background-image: url()")
        await wrapper.setProps({ disabled: true })
        expect(wrapper.element).toHaveStyle("background-image: none")
    })
})
