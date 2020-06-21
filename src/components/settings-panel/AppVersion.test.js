import { mount } from "@vue/test-utils"
import AppVersion from "./AppVersion"

describe("AppVersion.vue", () => {
    let wrapper
    const appVersion = "1.0.0"

    beforeEach(() => {
        wrapper = mount(AppVersion, {
            computed: {
                appVersion: () => appVersion
            }
        })
    })

    it("renders the app's version", () => {
        expect(wrapper.text()).toContain(appVersion)
    })
})
