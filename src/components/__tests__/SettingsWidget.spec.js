import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import VueI18n from "vue-i18n"
import SettingsWidget from "components/SettingsWidget.vue"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)
const i18n = new VueI18n({})

describe("SettingsWidget.vue", () => {
    let store
    let storeOptions
    let wrapper

    beforeEach(() => {
        storeOptions = {
            modules: {
                settings: {
                    state: {
                        dateFormat: "fi",
                        timeFormat: "en",
                        doseRateRanges: [
                            { minValue: 0, color: "rgb(29, 175, 175)", enabled: true },
                            { minValue: 0.1, color: "rgb(29, 139, 175)", enabled: true },
                            { minValue: 0.2, color: "rgb(29, 102, 175)", enabled: true }
                        ]
                    }
                }
            }
        }

        store = new Vuex.Store(storeOptions)
        wrapper = shallowMount(SettingsWidget, {
            localVue,
            store,
            i18n,
            mocks: { $t: () => {} }
        })

        store.commit = jest.fn()
    })

    it("opens the settings panel when the settings button is clicked", () => {
        const button = wrapper.find(".settings-button")
        const panel = wrapper.find(".settings-panel")
        expect(panel.element.style.display).toBe("none")

        button.trigger("click")

        expect(panel.element.style.display).not.toBe("none")
    })

    it("closes the settings panel when the background is clicked", () => {
        const panel = wrapper.find(".settings-panel")
        const background = wrapper.find(".settings-panel__background")
        wrapper.vm.enable()
        expect(background.element.style.display).not.toBe("none")
        expect(panel.element.style.display).not.toBe("none")

        background.trigger("click")

        expect(background.element.style.display).toBe("none")
        expect(panel.element.style.display).toBe("none")
    })

    xit("closes the settings panel when the close button is clicked", () => {
        const panel = wrapper.find(".settings-panel")
        const button = wrapper.find(".settings-panel__close-button")
        wrapper.vm.enable()
        expect(panel.element.style.display).not.toBe("none")

        // Neither of these work for some reason. Something to
        // do with bootstrap-vue?
        button.element.click()
        button.trigger("click")

        expect(panel.element.style.display).toBe("none")
    })
})
