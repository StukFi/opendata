import { mount } from "@vue/test-utils"
import MediaControllerButton from "@/components/media-controller/MediaControllerButton.vue"
import ButtonPlaybackSpeed from "@/components/media-controller/ButtonPlaybackSpeed.vue"
import MediaController from "@/models/MediaController"
import { describe, beforeEach, it, expect } from "vitest"

describe("ButtonPlaybackSpeed.vue", () => {
    let wrapper
    let mediaController

    beforeEach(() => {
        mediaController = new MediaController()
        wrapper = mount(ButtonPlaybackSpeed, {
            props: {
                mediaController: mediaController
            },
            global: {
                mocks: {
                    $t: () => {}
                }
            }
        })
    })

    it("changes playback speed when clicked", async () => {
        const originalPlaybackSpeed = mediaController.state.playbackSpeed
        await wrapper.findComponent(MediaControllerButton).trigger("click")
        expect(mediaController.state.playbackSpeed).not.toBe(originalPlaybackSpeed)
    })

    it("renders the current playback speed", () => {
        const playbackSpeedText = mediaController.state.playbackSpeed / 1000.0 + " s"
        expect(wrapper.text()).toContain(playbackSpeedText)
    })
})
