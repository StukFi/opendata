import { mount } from "@vue/test-utils"
import ButtonChangeMode from "./ButtonChangeMode"
import eventBus from "@/utils/eventBus"
import { describe, beforeEach, it, expect } from "vitest"

describe("ButtonChangeMode.vue", () => {
    let wrapper
    let storeMock

    beforeEach(() => {
        storeMock = {
            state: {
                settings: {
                    settings: {
                        mode: "dose_rates"
                    }
                }
            }
        }

        wrapper = mount(ButtonChangeMode, {
            global: {
                mocks: {
                    $t: () => {},
                    $store: storeMock
                }
            }
        })
    })

    it("emits 'mode-changed' event with the correct new mode when clicked", async () => {
        let emittedEvent = null
        let emittedPayload = null

        eventBus.$emit = (eventName, payload) => {
            emittedEvent = eventName
            emittedPayload = payload
        }

        await wrapper.find(".button-change-mode").trigger("click")

        expect(emittedEvent).toBe("mode-changed")
        expect(emittedPayload).toBe("air_radionuclides")
    })

    it("emits 'mode-changed' event with 'dose_rates' when the mode is 'air_radionuclides'", async () => {
        // Update the mode state before mounting the component
        storeMock.state.settings.settings.mode = "air_radionuclides"

        // Remount the component to reflect the updated state
        wrapper = mount(ButtonChangeMode, {
            global: {
                mocks: {
                    $t: () => {},
                    $store: storeMock
                }
            }
        })

        let emittedEvent = null
        let emittedPayload = null

        eventBus.$emit = (eventName, payload) => {
            emittedEvent = eventName
            emittedPayload = payload
        }

        await wrapper.find(".button-change-mode").trigger("click")

        expect(emittedEvent).toBe("mode-changed")
        expect(emittedPayload).toBe("dose_rates")
    })
})