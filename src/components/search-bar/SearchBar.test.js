import { mount } from "@vue/test-utils"
import SearchBar from "./SearchBar"
import SearchSuggestList from "./SearchSuggestList"
import { vi, describe, beforeEach, it, expect } from "vitest"
import eventBus from "@/utils/eventBus"

describe("SearchBar.vue", () => {
    let wrapper
    const mockSite = "Helsinki"

    beforeEach(() => {
        wrapper = mount(SearchBar, {
            computed: {
                sites: () => [mockSite, "Espoo", "Vantaa"]
            }
        })
    })

    it("searches when the search icon is clicked", async () => {
        wrapper.vm.search = vi.fn()

        await wrapper.find(".search-bar__icon").trigger("click")

        expect(wrapper.vm.search).toHaveBeenCalled()
    })

    it("searches when the enter key is pressed", async () => {
        wrapper.vm.search = vi.fn()

        await wrapper.find("input").trigger("keyup.enter")

        expect(wrapper.vm.search).toHaveBeenCalled()
    })

    it("searches when a suggestion is selected", async () => {
        wrapper.vm.search = vi.fn()

        await wrapper.findComponent(SearchSuggestList).vm.$emit("select", mockSite)

        expect(wrapper.vm.search).toHaveBeenCalled()
    })

    it("enables suggestions when clicked", async () => {

        const inputWrapper = wrapper.find("input")
        await inputWrapper.setValue(mockSite)

        await inputWrapper.trigger("click")

        await wrapper.vm.$nextTick()

        expect(wrapper.find(".search-suggest-list").isVisible()).toBe(true)
    })


    it("enables suggestions when focused", async () => {

        await wrapper.find("input").setValue(mockSite)
        const inputEl = wrapper.find("input").element
        inputEl.dispatchEvent(new FocusEvent("focus"))

        await wrapper.vm.$nextTick()

        expect(wrapper.find(".search-suggest-list").isVisible()).toBe(true)
    })

    it("emits an event when a search is successful", async () => {
        const mockFeature = { get: () => mockSite }

        let emittedEvent = null
        eventBus.$emit = (eventName, payload) => {
            if (eventName === "featureSelectedViaSearch") {
                emittedEvent = payload
            }
        }

        await wrapper.setData({ features: [mockFeature] })
        await wrapper.find("input").setValue(mockSite)
        await wrapper.find("input").trigger("keyup.enter")

        expect(emittedEvent).toEqual(mockFeature)
    })
})
