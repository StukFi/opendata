import { mount, createLocalVue } from "@vue/test-utils"
import TimepickerListItem from "./TimepickerListItem"

const localVue = createLocalVue()
const mockStore = {
    dispatch: jest.fn(),
    state: { settings: { timeFormat: "24h" }} }

function customMount (computed = {}) {
    return mount(TimepickerListItem, {
        localVue,
        computed,
        mocks: {
            $store: mockStore
        }
    })
}

describe("TimepickerListItem.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount({ selectedTime: () => "000000" })
    })

    it("renders a time", async () => {
        await wrapper.setProps({ time: "000000" })
        expect(wrapper.text()).toContain("00:00")
    })

    it("is highlighted when it contains the currently selected time", async () => {
        const time = "120000"
        wrapper = customMount({ selectedTime: () => time })

        expect(wrapper.classes()).not.toContain("selected")
        await wrapper.setProps({ time: time })
        expect(wrapper.classes()).toContain("selected")
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
