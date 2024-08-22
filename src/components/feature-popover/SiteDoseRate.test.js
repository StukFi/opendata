import { describe, it, beforeEach, expect } from "vitest"
import { mount } from "@vue/test-utils"
import SiteDoseRate from "./SiteDoseRate.vue"

describe("SiteDoseRate.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(SiteDoseRate)
    })

    it("renders a site's dose rate", async () => {
        const doseRate = "1.15"
        await wrapper.setProps({ feature: { get: () => doseRate } })
        expect(wrapper.text()).toContain(doseRate)
    })

    it("renders a dash if no feature prop is given", async () => {
        await wrapper.setProps({ feature: undefined })
        expect(wrapper.text()).toContain("-")
    })
})