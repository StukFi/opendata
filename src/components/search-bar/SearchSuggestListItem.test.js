import { mount } from "@vue/test-utils"
import { describe, it, beforeEach, expect } from "vitest"
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
        const suggestion = "Helsinki"
        await wrapper.setProps({ suggestion })
        expect(wrapper.text()).toContain(suggestion)
    })

    it("emits a click event when clicked", () => {
        wrapper.trigger("click")
        expect(wrapper.emitted().click).toHaveLength(1)
    })
})