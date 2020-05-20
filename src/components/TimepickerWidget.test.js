import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import TimepickerWidget from "./TimepickerWidget.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("TimepickerWidget.vue", () => {
    let store
    let storeOptions
    let wrapper

    beforeEach(() => {
        storeOptions = {
            modules: {
                datetime: {
                    state: {
                        time: "1200",
                        validDatetimes: []
                    },
                    getters: {
                        validTimesForCurrentDate: jest.fn(() => { return []})
                    }
                },
                settings: {
                    state: {
                        timeFormat: "fi"
                    }
                }
            }
        }

        store = new Vuex.Store(storeOptions)
        wrapper = shallowMount(TimepickerWidget, { localVue, store })
    })

    it("dispatches incrementTime when the increment button is clicked", () => {
        const button = wrapper.find(".button__increment-time")
        store.dispatch = jest.fn()

        button.trigger("click")

        expect(store.dispatch).toHaveBeenCalledWith("incrementTime")
    })

    it("dispatches decrementTime when the decrement button is clicked", () => {
        const button = wrapper.find(".button__decrement-time")
        store.dispatch = jest.fn()

        button.trigger("click")

        expect(store.dispatch).toHaveBeenCalledWith("decrementTime")
    })
})
