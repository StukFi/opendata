import { mount } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"


describe("MediaControllerButton.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(MediaControllerButton)
    })

    it("renders an icon prop", async () => {
        // The icon file must exist for the test to pass.
        await wrapper.setProps({ icon: "cog" })
        expect(wrapper.element).toHaveStyle("background-image: url()")
    })

    it("renders a text prop", async () => {
        const text = "test"
        await wrapper.setProps({ text: text })
        expect(wrapper.text()).toBe(text)
    })

    it("is disabled with a disabled prop", async () => {
        await wrapper.setProps({ disabled: false })
        expect(wrapper.attributes().disabled).toBeUndefined()
        await wrapper.setProps({ disabled: true })
        expect(wrapper.attributes().disabled).toBe("disabled")
    })

    it("emits a click event when clicked", async () => {
        wrapper.find("button").trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
