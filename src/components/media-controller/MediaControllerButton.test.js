import { mount } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"
import { describe, beforeEach, it, expect } from "vitest"

describe("MediaControllerButton.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(MediaControllerButton)
    })

    it("renders an icon prop", async () => {
        await wrapper.setProps({ icon: "cog" })
        expect(wrapper.element.style.backgroundImage).toBe("url(/icons/cog.svg)")
    })

    it("renders a text prop", async () => {
        const text = "test"
        await wrapper.setProps({ text })
        expect(wrapper.text()).toBe(text)
    })

    it("is disabled with a disabled prop", async () => {
        await wrapper.setProps({ disabled: false })
        expect(wrapper.props("disabled")).toBe(false)

        await wrapper.setProps({ disabled: true })
        expect(wrapper.props("disabled")).toBe(true)
    })

    it("emits a click event when clicked", async () => {
        await wrapper.trigger("click")
        expect(wrapper.emitted("click")).toHaveLength(1)
    })
})
