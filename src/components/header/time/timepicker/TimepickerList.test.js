import { shallowMount } from "@vue/test-utils"
import TimepickerList from "./TimepickerList"
import TimepickerListItem from "./TimepickerListItem"

describe("TimepickerList.vue", () => {
    let wrapper
    const validTimesForCurrentDate = ["000000", "060000", "120000"]

    beforeEach(() => {
        wrapper = shallowMount(TimepickerList, {
            computed: {
                validTimesForCurrentDate: () => validTimesForCurrentDate
            }
        })

        wrapper.setData({ isEnabled: true })
    })

    it("renders a list item for every available time of the selected date", () => {
        expect(wrapper.findAllComponents(TimepickerListItem)).toHaveLength(validTimesForCurrentDate.length)
    })

    it("is visible only when enabled", async () => {
        await wrapper.setData({ isEnabled: false })
        expect(wrapper.element).not.toBeVisible()
        await wrapper.setData({ isEnabled: true })
        expect(wrapper.element).toBeVisible()
    })
})
