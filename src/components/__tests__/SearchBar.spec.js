import { shallowMount, createLocalVue, createWrapper } from "@vue/test-utils"
import Vue from "vue"
import SearchBar from "components/SearchBar.vue"

const localVue = createLocalVue()

describe("SearchBar.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SearchBar, { localVue })
    })

    test("performs a search when the search icon is clicked", () => {
        wrapper.vm.search = jest.fn()
        const searchIcon = wrapper.find(".search-bar__icon")

        searchIcon.trigger("click")

        expect(wrapper.vm.search).toHaveBeenCalledTimes(1)
    })

    test("performs a search when a suggestion is clicked", async () => {
        wrapper.vm.search = jest.fn()
        wrapper.vm.suggestions.push("test")
        await Vue.nextTick()
        const suggestion = wrapper.find(".search-bar__suggestions-item")

        suggestion.trigger("click")

        expect(wrapper.vm.search).toHaveBeenCalledTimes(1)
    })

    test("displays suggestions when the input field is focused or clicked", async () => {
        wrapper.vm.suggestions.push("test")
        wrapper.vm.updateSuggestions = jest.fn()
        const searchBarInput = wrapper.find(".search-bar__input")
        const suggestions = wrapper.find(".search-bar__suggestions")

        wrapper.vm.displaySuggestions = false
        expect(suggestions.element.style.display).toBe("none")
        searchBarInput.element.focus()
        await Vue.nextTick()
        expect(suggestions.element).toBeVisible()

        wrapper.vm.displaySuggestions = false
        await Vue.nextTick()
        expect(suggestions.element).not.toBeVisible()
        await searchBarInput.trigger("click")
        expect(suggestions.element).toBeVisible()
    })

    test("emits a featureSelectedViaSearch event on a successful search", () => {
        const rootWrapper = createWrapper(wrapper.vm.$root)
        wrapper.vm.searchTerm = "Helsinki"
        wrapper.vm.features.push({
            get: jest.fn(() => { return "Helsinki" })
        })

        wrapper.vm.search()

        expect(rootWrapper.emitted("featureSelectedViaSearch")).toHaveLength(1)
    })
})
