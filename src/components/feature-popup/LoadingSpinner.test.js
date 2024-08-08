import { mount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import LoadingSpinner from "./LoadingSpinner.vue"

describe("LoadingSpinner", () => {
    it("is visible when isEnabled is true", () => {
        const wrapper = mount(LoadingSpinner, {
            props: {
                isEnabled: true,
            },
        })
        expect(wrapper.isVisible()).toBe(true)
    })

    it("is not visible when isEnabled is false", () => {
        const wrapper = mount(LoadingSpinner, {
            props: {
                isEnabled: false,
            },
        })
        expect(wrapper.isVisible()).toBe(false)
    })
})
