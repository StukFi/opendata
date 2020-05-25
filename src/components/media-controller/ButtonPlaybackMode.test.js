import { mount } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"
import ButtonPlaybackMode from "./ButtonPlaybackMode.vue"
import MediaController from "@/models/MediaController"

let mediaController = new MediaController()
mediaController.toggleMode = jest.fn()

function customMount (computed = {}) {
    return mount(ButtonPlaybackMode, {
        computed,
        propsData: {
            mediaController: mediaController
        }
    })
}

describe("ButtonPlaybackMode.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount()
    })

    it("changes playback mode when clicked", async () => {
        const spy = jest.spyOn(wrapper.vm.mediaController, "toggleMode")
        await wrapper.findComponent(MediaControllerButton).trigger("click")
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it("renders an icon based on playback mode", async () => {
        const iconModeTime = "clock"
        const iconModeDate = "calendar"

        wrapper = customMount({ icon: () => iconModeDate })
        expect(wrapper.findComponent(MediaControllerButton).props().icon).toBe(iconModeDate)
        wrapper = customMount({ icon: () => iconModeTime })
        expect(wrapper.findComponent(MediaControllerButton).props().icon).toBe(iconModeTime)
    })
})
