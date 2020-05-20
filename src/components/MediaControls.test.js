import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import MediaControls from "./MediaControls.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("MediaControls.vue", () => {
    let store
    let storeOptions
    let wrapper

    beforeEach(() => {
        storeOptions = {
            modules: {
                datetime: {
                    getters: {
                        isLastDateSelected: jest.fn(() => false),
                        isLastTimeSelected: jest.fn(() => false)
                    }
                }
            }
        }

        store = new Vuex.Store(storeOptions)
        store.dispatch = jest.fn()
        wrapper = shallowMount(MediaControls, { localVue, store })
        jest.useFakeTimers()
    })

    test("starts and stops playback", () => {
        const button = wrapper.find(".media-controls__button-playback")
        wrapper.vm.playbackEnabled = false

        button.trigger("click")
        expect(wrapper.vm.playbackEnabled).toBe(true)
        button.trigger("click")
        expect(wrapper.vm.playbackEnabled).toBe(false)
    })

    test("increments date and time", () => {
        const button = wrapper.find(".media-controls__button-playback")
        wrapper.vm.playbackEnabled = false
        wrapper.vm.playbackSpeed = 1000
        wrapper.vm.playbackMode = "time"

        button.trigger("click")
        // The first increment happens immediately to prevent the UI
        // from feeling unresponsive.
        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith("incrementTime")

        jest.advanceTimersByTime(wrapper.vm.playbackSpeed)
        expect(store.dispatch).toHaveBeenCalledTimes(2)
        expect(store.dispatch).toHaveBeenCalledWith("incrementTime")
        wrapper.vm.playbackMode = "date"
        jest.advanceTimersByTime(wrapper.vm.playbackSpeed)
        expect(store.dispatch).toHaveBeenCalledTimes(3)
        expect(store.dispatch).toHaveBeenCalledWith("incrementDate")
    })

    test("toggles playback mode between date and time", () => {
        const button = wrapper.find(".media-controls__button-datetime")
        wrapper.vm.playbackMode = "time"

        button.trigger("click")
        expect(wrapper.vm.playbackMode).toBe("date")
        button.trigger("click")
        expect(wrapper.vm.playbackMode).toBe("time")
    })

    test("toggles playback speed between multiple values", () => {
        const button = wrapper.find(".media-controls__button-speed")
        wrapper.vm.playbackSpeeds = [500, 1000, 1500]
        const playbackSpeeds = wrapper.vm.playbackSpeeds;
        wrapper.vm.playbackSpeed = playbackSpeeds[0];

        button.trigger("click")
        expect(wrapper.vm.playbackSpeed).toBe(playbackSpeeds[1])
        button.trigger("click")
        expect(wrapper.vm.playbackSpeed).toBe(playbackSpeeds[2])
        button.trigger("click")
        expect(wrapper.vm.playbackSpeed).toBe(playbackSpeeds[0])
    })

    test("displays a date or time icon based on playback mode", async () => {
        const button = wrapper.find(".media-controls__button-datetime")
        wrapper.vm.playbackMode = "time"

        await button.trigger("click")
        expect(button.classes()).toContain("media-controls__button-date")
        await button.trigger("click")
        expect(button.classes()).toContain("media-controls__button-time")
    })

    test("displays playback speed in seconds using a filter", async () => {
        const button = wrapper.find(".media-controls__button-speed")

        wrapper.vm.playbackSpeed = 500
        await Vue.nextTick()
        expect(button.text()).toBe("0.5 s")
        wrapper.vm.playbackSpeed = 1000
        await Vue.nextTick()
        expect(button.text()).toBe("1 s")
        wrapper.vm.playbackSpeed = 1500
        await Vue.nextTick()
        expect(button.text()).toBe("1.5 s")
    })
})
