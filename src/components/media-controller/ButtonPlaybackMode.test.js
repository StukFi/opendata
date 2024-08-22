import { describe, it, beforeEach, expect } from "vitest"
import { mount } from "@vue/test-utils"
import ButtonPlaybackMode from "./ButtonPlaybackMode.vue"
import MediaController from "@/models/MediaController"
import { createStore } from "vuex"

describe("ButtonPlaybackMode.vue", () => {
    let mediaController
    let wrapper

    const store = createStore({
        state: {
            time: 0,
            date: 0,
        }
    })

    beforeEach(() => {
        mediaController = new MediaController()

        wrapper = mount(ButtonPlaybackMode, {
            props: {
                mediaController: mediaController
            },
            global: {
                mocks: {
                    $t: () => {}
                },
                plugins: [store]
            }
        })
    })

    it("changes playback mode when clicked", async () => {
        const originalPlaybackMode = mediaController.state.playbackMode
        await wrapper.findComponent({ name: "MediaControllerButton" }).trigger("click")
        expect(mediaController.state.playbackMode).not.toBe(originalPlaybackMode)
    })
})
