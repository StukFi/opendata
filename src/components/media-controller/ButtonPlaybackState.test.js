import { mount } from "@vue/test-utils"
import ButtonPlaybackState from "@/components/media-controller/ButtonPlaybackState.vue"
import MediaControllerButton from "@/components/media-controller/MediaControllerButton.vue"
import { vi, describe, expect, it, beforeEach } from "vitest"

describe("ButtonPlaybackState", () => {
    let wrapper
    let mediaControllerMock

    beforeEach(() => {
        mediaControllerMock = {
            state: {
                isPlaybackEnabled: true,
                playbackMode: "time"
            },
            isPlaybackFinished: vi.fn().mockReturnValue(false),
            togglePlayback: vi.fn()
        }

        wrapper = mount(ButtonPlaybackState, {
            props: {
                mediaController: mediaControllerMock
            },
            global: {
                components: {
                    MediaControllerButton
                },
                mocks: {
                    $t: () => {}
                }
            }
        })
    })

    it("toggles playback state when clicked", async () => {
        await wrapper.getComponent({ name: "MediaControllerButton" }).trigger("click")
        expect(mediaControllerMock.togglePlayback).toHaveBeenCalled()
    })

    it("is disabled when the end of playback is reached", async () => {
        mediaControllerMock.isPlaybackFinished.mockReturnValue(true)

        await wrapper.setProps({ mediaController: { ...mediaControllerMock } })
        await wrapper.vm.$nextTick()

        const button = wrapper.getComponent(MediaControllerButton)
        expect(button.props("disabled")).toBe(true)
    })
})