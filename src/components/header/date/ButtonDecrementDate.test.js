import { mount } from "@vue/test-utils"
import { describe, it, beforeEach, expect, vi } from "vitest"
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"
import ButtonDecrementDate from "./ButtonDecrementDate.vue"

describe("ButtonDecrementDate.vue", () => {
    let wrapper
    let mockStore

    beforeEach(() => {
        mockStore = {
            dispatch: vi.fn(),
            getters: {
                isOldestDateSelected: false
            }
        }

        wrapper = mount(ButtonDecrementDate, {
            global: {
                mocks: {
                    $store: mockStore
                }
            }
        })
    })

    it("is disabled when the first available date is selected", async () => {
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeFalsy

        mockStore.getters.isOldestDateSelected = true
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeTruthy
    })

    it("dispatches an action when it is clicked", async () => {
        await wrapper.find("button").trigger("click")
        expect(mockStore.dispatch).toHaveBeenCalledWith("decrementDate")
    })
})
