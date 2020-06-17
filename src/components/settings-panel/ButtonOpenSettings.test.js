import { mount, createWrapper } from "@vue/test-utils"
import ButtonOpenSettings from "./ButtonOpenSettings"

describe("ButtonOpenSettings.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ButtonOpenSettings, {
            mocks: {
                $t: () => {}
            }
        })
    })

    it("emits an event when clicked", () => {
        const rootWrapper = createWrapper(wrapper.vm.$root)
        wrapper.trigger("click")
        expect(rootWrapper.emitted("settings-panel-open")).toHaveLength(1)
    })
})
