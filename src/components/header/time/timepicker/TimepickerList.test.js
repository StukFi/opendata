import { shallowMount } from "@vue/test-utils"
import { describe, it, beforeEach, expect } from "vitest"
import TimepickerList from "./TimepickerList"
import TimepickerListItem from "./TimepickerListItem"

describe("TimepickerList.vue", () => {
    let wrapper
    const availableTimesForSelectedDate = ["000000", "060000", "120000"]

    beforeEach(() => {
        wrapper = shallowMount(TimepickerList, {
            computed: {
                availableTimesForSelectedDate: () => availableTimesForSelectedDate
            }
        })

        wrapper.setData({ isEnabled: true })
    })

    it("renders a list item for every available time of the selected date", () => {
        expect(wrapper.findAllComponents(TimepickerListItem)).toHaveLength(availableTimesForSelectedDate.length)
    })

    it("is visible only when enabled", async () => {
        await wrapper.setData({ isEnabled: false })
        expect(wrapper.attributes("style")).toContain("display: none;")
        await wrapper.setData({ isEnabled: true })
        expect(wrapper.attributes("style")).not.toContain("display: none;")
    })
})