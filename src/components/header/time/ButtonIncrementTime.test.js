import { mount, createLocalVue } from "@vue/test-utils"
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"
import ButtonIncrementTime from "./ButtonIncrementTime.vue"

const localVue = createLocalVue()
const mockStore = { dispatch: jest.fn() }

function customMount (computed = {}) {
    return mount(ButtonIncrementTime, {
        localVue,
        computed,
        mocks: {
            $store: mockStore
        }
    })
}

describe("ButtonIncrementTime.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount({ isLastTimeSelected: () => false })
    })

    it("is disabled when the last available time is selected", () => {
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(false)
        wrapper = customMount({ isLastTimeSelected: () => true })
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBe(true)
    })

    it("dispatches an action when it is clicked", async () => {
        await wrapper.find("button").trigger("click")
        expect(mockStore.dispatch).toHaveBeenCalledWith("incrementTime")
    })
})
