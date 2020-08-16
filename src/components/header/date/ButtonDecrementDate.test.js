import { mount, createLocalVue } from "@vue/test-utils"
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"
import ButtonDecrementDate from "./ButtonDecrementDate.vue"

const localVue = createLocalVue()
const mockStore = { dispatch: jest.fn() }

function customMount (computed = {}) {
    return mount(ButtonDecrementDate, {
        localVue,
        computed,
        mocks: {
            $store: mockStore
        }
    })
}

describe("ButtonDecrementDate.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount({ isOldestDateSelected: () => false })
    })

    it("is disabled when the first available date is selected", () => {
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(false)
        wrapper = customMount({ isOldestDateSelected: () => true })
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(true)
    })

    it("dispatches an action when it is clicked", async () => {
        await wrapper.find("button").trigger("click")
        expect(mockStore.dispatch).toHaveBeenCalledWith("decrementDate")
    })
})
