import { mount } from "@vue/test-utils"
import SearchSuggestListItem from "./SearchSuggestListItem"

describe("SearchSuggestListItem.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(SearchSuggestListItem, {
            propsData: {
                suggestion: "Espoo"
            }
        })
    })

    it("renders a suggestion", async () => {
        const suggestion ="Helsinki"
        await wrapper.setProps({ suggestion: suggestion })
        expect(wrapper.text()).toContain(suggestion)
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})
