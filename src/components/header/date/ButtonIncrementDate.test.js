import { mount, createLocalVue } from "@vue/test-utils"
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"
import ButtonIncrementDate from "./ButtonIncrementDate.vue"

const localVue = createLocalVue()
const mockStore = { dispatch: jest.fn() }

function customMount (computed = {}) {
    return mount(ButtonIncrementDate, {
        localVue,
        computed,
        mocks: {
            $store: mockStore
        }
    })
}

describe("ButtonIncrementDate.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount({ isNewestDateSelected: () => false })
    })

    it("is disabled when the last available date is selected", () => {
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(false)
        wrapper = customMount({ isNewestDateSelected: () => true })
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(true)
    })

    it("dispatches an action when it is clicked", async () => {
        await wrapper.find("button").trigger("click")
        expect(mockStore.dispatch).toHaveBeenCalledWith("incrementDate")
    })
})
