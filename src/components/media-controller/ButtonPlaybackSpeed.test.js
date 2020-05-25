import { mount } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"
import ButtonPlaybackSpeed from "./ButtonPlaybackSpeed.vue"
import MediaController from "@/models/MediaController"

describe("ButtonPlaybackSpeed.vue", () => {
    let wrapper
    let mediaController = new MediaController()

    beforeEach(() => {
        wrapper = mount(ButtonPlaybackSpeed, {
            propsData: {
                mediaController: mediaController
            }
        })
    })

    it("changes playback speed when clicked", async () => {
        const spy = jest.spyOn(mediaController, "toggleSpeed")
        await wrapper.findComponent(MediaControllerButton).trigger("click")
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it("renders the current playback speed", async () => {
        const playbackSpeed = mediaController.playbackSpeed / 1000.0 + " s"
        expect(wrapper.text()).toBe(playbackSpeed)
    })
})
