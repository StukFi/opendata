import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vue from "vue"
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

    it("opens the settings panel when the settings button is clicked", async () => {
        const button = wrapper.find(".settings-button")
        const panel = wrapper.find(".settings-panel")
        expect(panel.element).not.toBeVisible()

        await button.trigger("click")

        expect(panel.element).toBeVisible()
    })

    it("closes the settings panel when the background is clicked", async () => {
        const panel = wrapper.find(".settings-panel")
        const background = wrapper.find(".settings-panel__background")
        wrapper.vm.enable()
        await Vue.nextTick()
        expect(background.element).toBeVisible()
        expect(panel.element).toBeVisible()

        await background.trigger("click")

        expect(background.element.style.display).toBe("none")
        expect(panel.element.style.display).toBe("none")
    })
})
