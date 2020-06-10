import { shallowMount, createLocalVue } from "@vue/test-utils"
import SearchSuggestListItem from "./SearchSuggestListItem"

const localVue = createLocalVue()

describe("SearchSuggestListItem.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SearchSuggestListItem, {
            localVue
        })
    })

    it("renders a suggestion", async () => {
    })

    it("searches for the suggestion when clicked", async () => {
    })
})
