import { shallowMount, createLocalVue } from "@vue/test-utils"
import SearchBar from "./SearchBar"

const localVue = createLocalVue()

describe("SearchBar.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(SearchBar, {
            localVue
        })
    })

    it("renders a list of suggestions", async () => {
    })
})
