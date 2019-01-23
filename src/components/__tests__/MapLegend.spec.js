import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import MapLegend from "components/MapLegend.vue"

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
                        doseRateRanges: [
                            { minValue: 0.00, maxValue: 0.10, color: "rgb(29, 175, 175)", enabled: true },
                            { minValue: 0.10, maxValue: 0.20, color: "rgb(29, 139, 175)", enabled: true },
                            { minValue: 0.20, maxValue: 0.30, color: "rgb(29, 102, 175)", enabled: true }
                        ]
                    }
                }
            }
        }

        store = new Vuex.Store(storeOptions)
        wrapper = shallowMount(MapLegend, { localVue, store })
        bars = wrapper.findAll(".map-legend__bar")
        ranges = store.state.settings.doseRateRanges
    })

    test("renders the correct amount of bars", () => {
        expect(bars.length).toBe(ranges.length)
    })

    test("renders the bars with the correct color", () => {
        bars.wrappers.forEach((bar, i) => {
            expect(bar.element.style.backgroundColor).toBe(ranges[i].color)
        })
    })

    test("renders the bars with the correct text", () => {
        bars.wrappers.forEach((bar, i) => {
            if (i < bars.wrappers.length - 1) {
                const expectedText = ranges[i].minValue.toFixed(2) +
                    " - " + ranges[i].maxValue.toFixed(2)

                expect(bar.text()).toBe(expectedText)
            }
            else {
                const expectedText = "> " +
                    ranges[i].minValue.toFixed(2) + " µSv/h"

                expect(bar.text()).toBe(expectedText)
            }
        })
    })

    test("applies the correct CSS class to disabled bars", () => {
        ranges[0].enabled = false

        expect(bars.wrappers[0].classes()).toContain("map-legend__bar--disabled")
    })

    test("commits toggleDoseRateRange with index of clicked bar", () => {
        const barIndex = 1
        store.commit = jest.fn()

        bars.wrappers[barIndex].trigger("click")

        expect(store.commit).toHaveBeenCalledWith("toggleDoseRateRange", barIndex)
    })
})
