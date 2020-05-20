import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import DatepickerWidget from "./DatepickerWidget.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("DatepickerWidget.vue", () => {
    let store
    let storeOptions
    let wrapper

    beforeEach(() => {
        storeOptions = {
            modules: {
                datetime: {
                    state: {
                        validDatetimes: []
                    }
                },
                settings: {
                    state: {
                        locale: "en"
                    }
                }
            }
        }

        store = new Vuex.Store(storeOptions)
        wrapper = shallowMount(DatepickerWidget, { localVue, store })
    })

    it("dispatches incrementDate when the increment button is clicked", () => {
        const button = wrapper.find(".button__increment-date")
        store.dispatch = jest.fn()

        button.trigger("click")

        expect(store.dispatch).toHaveBeenCalledWith("incrementDate")
    })

    it("dispatches decrementDate when the decrement button is clicked", () => {
        const button = wrapper.find(".button__decrement-date")
        store.dispatch = jest.fn()

        button.trigger("click")

        expect(store.dispatch).toHaveBeenCalledWith("decrementDate")
    })
})
