import { shallowMount, createLocalVue } from "@vue/test-utils"
import SearchSuggestList from "./SearchSuggestList"

const localVue = createLocalVue()

describe("SearchSuggestList.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SearchSuggestList, {
            localVue
        })
    })

    it("renders a list of suggestions", async () => {
    })
})
