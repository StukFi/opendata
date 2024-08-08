import { mount } from "@vue/test-utils"
import ButtonOpenInfo from "./ButtonOpenInfo"
import eventBus from "@/utils/eventBus"
import { describe, beforeEach, it, expect } from "vitest"

describe("ButtonOpenInfo.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ButtonOpenInfo, {
            global: {
                mocks: {
                    $t: () => {}
                }
            }
        })
    })

    it("emits 'info-panel-open' event when clicked", async () => {
        let emittedEvent = null

        eventBus.$emit = (eventName) => {
            emittedEvent = eventName
        }

        await wrapper.find(".button-open-info").trigger("click")

        expect(emittedEvent).toBe("info-panel-open")
    })
})
