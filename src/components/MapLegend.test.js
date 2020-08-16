import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import MapLegend from "./MapLegend.vue"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("MapLegend.vue", () => {
    let store
    let storeOptions
    let wrapper
    let bars
    let ranges

    beforeEach(() => {
        storeOptions = {
            modules: {
                settings: {
                    state: {
                        settings: {
                            doseRateRanges: [
                                { minValue: 0, color: "rgb(29, 175, 175)", enabled: true },
                                { minValue: 0.1, color: "rgb(29, 139, 175)", enabled: true },
                                { minValue: 0.2, color: "rgb(29, 102, 175)", enabled: true }
                            ]
                        }
                    }
                }
            }
        }

        store = new Vuex.Store(storeOptions)
        wrapper = shallowMount(MapLegend, { localVue, store })
        bars = wrapper.findAll(".map-legend__bar")
        ranges = store.state.settings.settings.doseRateRanges
    })

    test("renders the amount of bars specified in settings", () => {
        expect(bars).toHaveLength(ranges.length)
    })

    test("renders the bars with the colors specified in settings", () => {
        bars.wrappers.forEach((bar, i) => {
            expect(bar.element.style.backgroundColor).toBe(ranges[i].color)
        })
    })

    test("renders the bars with the dose rate ranges specified in settings", () => {
        bars.wrappers.forEach((bar, i) => {
            if (i < bars.wrappers.length - 1) {
                const expectedText = ranges[i].minValue +
                    " - " + ranges[i + 1].minValue

                expect(bar.text()).toBe(expectedText)
            }
            else {
                const expectedText = "> " + ranges[i].minValue + " µSv/h"
                expect(bar.text()).toBe(expectedText)
            }
        })
    })

    test("changes the style of disabled bars", async () => {
        const style = "map-legend__bar--disabled"
        expect(bars.wrappers[0].classes()).not.toContain(style)

        ranges[0].enabled = false

        await Vue.nextTick()
        expect(bars.wrappers[0].classes()).toContain(style)
    })

    test("commits toggleDoseRateRange with index of clicked bar", () => {
        const barIndex = 1
        store.commit = jest.fn()

        bars.wrappers[barIndex].trigger("click")

        expect(store.commit).toHaveBeenCalledWith("toggleDoseRateRange", barIndex)
    })
})
