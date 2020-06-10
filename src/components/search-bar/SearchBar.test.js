import { mount, createWrapper } from "@vue/test-utils"
import SearchBar from "./SearchBar"
import SearchSuggestList from "./SearchSuggestList"

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

    it("searches when the search icon is clicked", () => {
        wrapper.vm.search = jest.fn()
        wrapper.find(".search-bar__icon").trigger("click")
        expect(wrapper.vm.search).toHaveBeenCalledTimes(1)
    })

    it("searches when the enter key is pressed", () => {
        wrapper.vm.search = jest.fn()
        wrapper.find("input").trigger("keyup.enter")
        expect(wrapper.vm.search).toHaveBeenCalledTimes(1)
    })

    it("searches when a suggestion is selected", async () => {
        wrapper.vm.search = jest.fn()
        await wrapper.vm.$refs.searchSuggestList.$emit("select", mockSite)
        expect(wrapper.vm.search).toHaveBeenCalledTimes(1)
    })

    it("enables suggestions when clicked", async () => {
        const searchSuggestList = wrapper.findComponent(SearchSuggestList)
        expect(searchSuggestList.element).not.toBeVisible()
        wrapper.find("input").setValue(mockSite)
        await wrapper.find("input").trigger("click")
        expect(searchSuggestList.element).toBeVisible()
    })

    it("enables suggestions when focused", async () => {
        const searchSuggestList = wrapper.findComponent(SearchSuggestList)
        expect(searchSuggestList.element).not.toBeVisible()
        wrapper.find("input").setValue(mockSite)
        await wrapper.find("input").element.focus()
        expect(searchSuggestList.element).toBeVisible()
    })

    it("emits an event when a search is successful", () => {
        const rootWrapper = createWrapper(wrapper.vm.$root)
        const mockFeature = { get: () => mockSite }
        wrapper.setData({ features: [mockFeature]})

        wrapper.find("input").setValue(mockSite)
        wrapper.find("input").trigger("keyup.enter")

        expect(rootWrapper.emitted().featureSelectedViaSearch).toHaveLength(1)
        expect(rootWrapper.emitted().featureSelectedViaSearch[0]).toEqual([mockFeature])
    })
})
