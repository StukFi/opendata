import { mount } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"
import ButtonPlaybackMode from "./ButtonPlaybackMode.vue"
import MediaController from "@/models/MediaController"

let mediaController = new MediaController()

function customMount (computed = {}) {
    return mount(ButtonPlaybackMode, {
        computed,
        propsData: {
            mediaController: mediaController
        },
        mocks: {
            $t: () => {}
        }
    })
}

describe("ButtonPlaybackMode.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount()
    })

    it("changes playback mode when clicked", async () => {
        const originalPlaybackMode = mediaController.playbackMode
        await wrapper.findComponent(MediaControllerButton).trigger("click")
        expect(mediaController.playbackMode).not.toBe(originalPlaybackMode)
    })
})
