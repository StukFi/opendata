import { describe, it, beforeEach, expect } from "vitest"
import { shallowMount } from "@vue/test-utils"
import ButtonDateTime from "./ButtonDateTime.vue"

describe("ButtonDateTime.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(ButtonDateTime, {
            props: {
                icon: "caret-left"
            }
        })
    })

    it("emits a click event when clicked", async () => {
        await wrapper.find("button").trigger("click")
        expect(wrapper.emitted().click).toBeTruthy()
        expect(wrapper.emitted().click).toHaveLength(1)
    })

    it("is disabled with a disabled prop", async () => {
        expect(wrapper.props("disabled")).toBe(false)
        await wrapper.setProps({ disabled: true })
        expect(wrapper.props("disabled")).toBe(true)
        await wrapper.setProps({ disabled: false })
        expect(wrapper.props("disabled")).toBe(false)
    })

    it("hides its icon when disabled", async () => {
        expect(wrapper.find("button").element.style.backgroundImage).toContain(
            "caret-left.svg"
        )
        await wrapper.setProps({ disabled: true })
        expect(wrapper.find("button").element.style.backgroundImage).toBe("none")
        await wrapper.setProps({ disabled: false })
        expect(wrapper.find("button").element.style.backgroundImage).toContain(
            "caret-left.svg"
        )
    })
})