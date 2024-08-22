import { mount } from "@vue/test-utils"
import { describe, beforeEach, it, expect } from "vitest"
import SearchSuggestList from "./SearchSuggestList"
import SearchSuggestListItem from "./SearchSuggestListItem"

describe("SearchSuggestList.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(SearchSuggestList, {
            propsData: {
                searchTerm: "hel",
                sites: ["Espoo", "Helsinki Kallio", "Helsinki Roihupelto", "Vantaa"]
            }
        })
    })

    it("renders a list of suggestions", async () => {
        expect(wrapper.findAllComponents(SearchSuggestListItem)).toHaveLength(2)
    })

    it("renders suggestions in alphabetical order", async () => {
        expect(wrapper.vm.suggestions).toEqual(wrapper.vm.suggestions.sort())
    })

    it("is visible when enabled and suggestions exist", async () => {
        await wrapper.setData({ isEnabled: true })
        expect(wrapper.find(".search-suggest-list").isVisible()).toBe(true)
    })

    it("is invisible when disabled", async () => {
        await wrapper.setData({ isEnabled: false })
        expect(wrapper.find(".search-suggest-list").isVisible()).toBe(false)
    })

    it("emits an event when a suggestion is clicked", async () => {
        wrapper.findComponent(SearchSuggestListItem).trigger("click")
        expect(wrapper.emitted().select).toHaveLength(1)
        expect(wrapper.emitted().select[0]).toEqual(["Helsinki Kallio"])
    })
})
