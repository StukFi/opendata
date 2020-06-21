import { mount } from "@vue/test-utils"
import LoadingSpinner from "./LoadingSpinner.vue"

describe("LoadingSpinner.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(LoadingSpinner)
    })

    it("is visible when enabled", async () => {
        expect(wrapper.element).not.toBeVisible()
        await wrapper.setProps({ isEnabled: true })
        expect(wrapper.element).toBeVisible()
    })
})
