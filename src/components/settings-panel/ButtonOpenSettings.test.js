import { mount } from "@vue/test-utils"
import ButtonOpenSettings from "./ButtonOpenSettings"
import eventBus from "@/utils/eventBus"
import { describe, beforeEach, it, expect } from "vitest"

describe("ButtonOpenSettings.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ButtonOpenSettings, {
            global: {
                mocks: {
                    $t: () => {}
                }
            }
        })
    })

    it("emits 'settings-panel-open' event when clicked", async () => {
        let emittedEvent = null

        eventBus.$emit = (eventName) => {
            emittedEvent = eventName
        }

        await wrapper.find(".button-open-settings").trigger("click")

        expect(emittedEvent).toBe("settings-panel-open")
    })
})
