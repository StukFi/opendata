import { mount, createLocalVue } from "@vue/test-utils"
import MediaControllerButton from "./MediaControllerButton"
import ButtonPlaybackState from "./ButtonPlaybackState.vue"
import MediaController from "@/models/MediaController"

const localVue = createLocalVue()

let mediaController = new MediaController()
mediaController.togglePlayback = jest.fn()

function customMount (computed = {}) {
    return mount(ButtonPlaybackState, {
        localVue,
        computed,
        propsData: {
            mediaController: mediaController
        },
        mocks: {
            $t: () => {}
        }
    })
}

describe("ButtonPlaybackState.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = customMount({ disabled: () => false })
    })

    it("toggles playback state when clicked", async () => {
        const spy = jest.spyOn(mediaController, "togglePlayback")
        await wrapper.findComponent(MediaControllerButton).trigger("click")
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it("is disabled when the end of playback is reached", () => {
        wrapper = customMount({ disabled: () => true })
        expect(wrapper.findComponent(MediaControllerButton).props().disabled).toBe(true)
    })
})
