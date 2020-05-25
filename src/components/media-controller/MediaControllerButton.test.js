import { mount } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"


describe("MediaControllerButton.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(MediaControllerButton)
    })

    it("renders an icon prop", async () => {
    })

    it("renders a text prop", async () => {
        const text = "test"
        await wrapper.setProps({ text: text })
        expect(wrapper.text()).toBe(text)
    })

    it("is disabled with a disabled prop", async () => {
    })

    it("emits a click event when clicked", async () => {
    })
})
