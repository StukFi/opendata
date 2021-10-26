import { mount } from "@vue/test-utils"
import BaseRadioButton from "./BaseRadioButton"

describe("BaseRadioButton.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(BaseRadioButton, {
            propsData: {
                label: "",
                ownValue: "",
                modelValue: ""
            }
        })
    })

    it("renders a label prop", async () => {
        const label = "this is a test"
        await wrapper.setProps({ label: label })
        expect(wrapper.text()).toContain(label)
    })

    it("emits an input event when its state changes", async () => {
        const radio = wrapper.find("input[type='radio']")
        radio.element.selected = true
        radio.trigger("change")
        expect(wrapper.emitted().input).toHaveLength(1)
    })
})
