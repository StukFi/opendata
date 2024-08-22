import { describe, it, beforeEach, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import ButtonDateTime from "@/components/header/ButtonDateTime.vue"
import ButtonIncrementTime from "./ButtonIncrementTime.vue"

describe("ButtonIncrementTime", () => {
    let wrapper
    let mockStore

    beforeEach(() => {
        mockStore = {
            state: {
                isNewestTimeSelected: false
            },
            getters: {
                isNewestTimeSelected: false
            },
            dispatch: vi.fn()
        }

        wrapper = mount(ButtonIncrementTime, {
            global: {
                mocks: {
                    $store: mockStore
                }
            }
        })
    })

    it("should have ButtonDateTime initially not disabled", () => {
        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeFalsy
    })

    it("should call incrementTime method when ButtonDateTime is clicked", async () => {
        await wrapper.findComponent(ButtonDateTime).trigger("click")
        expect(mockStore.dispatch).toHaveBeenCalledWith("incrementTime")
    })

    it("should have ButtonDateTime disabled when isNewestTimeSelected is true", async () => {
        mockStore.getters.isNewestTimeSelected = true
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeTruthy
    })
})
