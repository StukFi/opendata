import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { nextTick } from "vue"
import { describe, it, expect, beforeEach, vi } from "vitest"
import SettingsPanel from "@/components/settings-panel/SettingsPanel.vue"
import Settings from "@/models/Settings"
import eventBus from "@/utils/eventBus"

const createVuexStore = (initialSettings) => {
    return createStore({
        state() {
            return {
                settings: {
                    settings: initialSettings
                }
            }
        },
        mutations: {
            setSettings(state, newSettings) {
                state.settings.settings = newSettings
            }
        }
    })
}

describe("SettingsPanel.vue", () => {
    let store
    let wrapper

    beforeEach(() => {
        store = createVuexStore(new Settings())
        wrapper = mount(SettingsPanel, {
            global: {
                mocks: {
                    $t: () => {}
                },
                plugins: [store]
            }
        })
    })

    it("should open the settings panel when event is emitted", async () => {
        eventBus.$emit("settings-panel-open")
        await nextTick()

        expect(wrapper.vm.isEnabled).toBe(true)
        expect(wrapper.find(".settings-panel").isVisible()).toBe(true)
    })

    it("should reset scrollbar to top when opened", async () => {
        eventBus.$emit("settings-panel-open")
        await nextTick()

        expect(wrapper.vm.$refs.panelBody.scrollTop).toBe(0)
    })

    it("should update Vuex store when settings change", async () => {
        eventBus.$emit("settings-panel-open")
        await nextTick()

        const newSettings = new Settings()
        newSettings.language = "fi"
        wrapper.vm.settings = newSettings
        await nextTick()

        expect(store.state.settings.settings.language).toBe("fi")
    })

    it("should emit settingsChanged event when settings change", async () => {
        const spy = vi.spyOn(eventBus, "$emit")
        eventBus.$emit("settings-panel-open")
        await nextTick()

        const newSettings = new Settings()
        newSettings.language = "fi"
        wrapper.vm.settings = newSettings
        await nextTick()

        expect(spy).toHaveBeenCalledWith("settingsChanged")
    })

    it("should close the settings panel when disable is called", async () => {
        eventBus.$emit("settings-panel-open")
        await nextTick()

        wrapper.vm.disable()
        await nextTick()

        expect(wrapper.vm.isEnabled).toBe(false)
        expect(wrapper.find(".settings-panel").isVisible()).toBe(false)
    })
})
