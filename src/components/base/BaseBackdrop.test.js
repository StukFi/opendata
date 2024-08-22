import { mount } from "@vue/test-utils"
import { describe, it, beforeEach, expect } from "vitest"
import BaseBackdrop from "./BaseBackdrop.vue"

describe("BaseBackdrop.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(BaseBackdrop)
    })

    it("emits a click event when clicked", async () => {
        await wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})