import { mount } from "@vue/test-utils"
import MediaController from "./MediaController"
import ButtonPlaybackMode from "./ButtonPlaybackMode"
import ButtonPlaybackSpeed from "./ButtonPlaybackSpeed"
import ButtonPlaybackState from "./ButtonPlaybackState"
import { describe, beforeEach, it, expect } from "vitest"

describe("MediaController.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(MediaController, {
            global: {
                mocks: {
                    $t: () => {}
                }
            }

        })
    })


    it("passes a media controller object to its subcomponents", () => {
        expect(wrapper.findComponent(ButtonPlaybackMode).props().mediaController).toBe(wrapper.vm.mediaController)
        expect(wrapper.findComponent(ButtonPlaybackSpeed).props().mediaController).toBe(wrapper.vm.mediaController)
        expect(wrapper.findComponent(ButtonPlaybackState).props().mediaController).toBe(wrapper.vm.mediaController)
    })
})
