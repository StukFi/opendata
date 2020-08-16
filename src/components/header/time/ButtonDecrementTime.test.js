import { mount, createLocalVue } from "@vue/test-utils"
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"
import ButtonDecrementTime from "./ButtonDecrementTime.vue"

const localVue = createLocalVue()
const mockStore = { dispatch: jest.fn() }

function customMount (computed = {}) {
    return mount(ButtonDecrementTime, {
        localVue,
        computed,
        mocks: {
            $store: mockStore
        }
    })
}

describe("ButtonDecrementTime.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount({ isOldestTimeSelected: () => false })
    })

    it("is disabled when the first available time is selected", () => {
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(false)
        wrapper = customMount({ isOldestTimeSelected: () => true })
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(true)
    })

    it("dispatches an action when it is clicked", async () => {
        await wrapper.find("button").trigger("click")
        expect(mockStore.dispatch).toHaveBeenCalledWith("decrementTime")
    })
})
