import { mount } from "@vue/test-utils"
import FieldAppVersion from "./FieldAppVersion"

describe("FieldAppVersion.vue", () => {
    let wrapper
    const appVersion = "1.0.0"

    beforeEach(() => {
        wrapper = mount(FieldAppVersion, {
            computed: {
                appVersion: () => appVersion
            }
        })
    })

    it("renders the app's version", () => {
        expect(wrapper.text()).toContain(appVersion)
    })
})
