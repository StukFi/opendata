import { shallowMount } from "@vue/test-utils"
import RadionuclideTables from "@/components/feature-popup/RadionuclideTables.vue"
import { describe, it, beforeEach, expect, vi } from "vitest"

vi.mock("@/api/air-radionuclides", () => ({
    getAvailableRadionuclides: vi.fn(),
    getTimeSeries: vi.fn()
}))

describe("RadionuclideTables.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(RadionuclideTables, {
            global: {
                mocks: {
                    $t: (key) => key,
                    $store: {
                        state: {
                            settings: {
                                settings: {
                                    mode: "air_radionuclides",
                                    dateFormat: "fi"
                                }
                            }
                        }
                    }
                }
            }
        })
    })

    it("displays tables when not loading and has data", async () => {
        wrapper.setData({
            isLoading: false,
            tablesData: [
                {
                    radionuclide: "Cs-137",
                    entries: [
                        { s: "2024-07-29T00:00:00Z", e: "2024-07-30T00:00:00Z", c: 10, u: 5 }
                    ]
                }
            ]
        })
        await wrapper.vm.$nextTick()
        expect(wrapper.find(".table-container").exists()).toBe(true)
        expect(wrapper.find("table").exists()).toBe(true)
    })

    it("displays no data message when not loading and has no data", async () => {
        wrapper.setData({
            isLoading: false,
            tablesData: []
        })
        await wrapper.vm.$nextTick()
        expect(wrapper.find(".table-container").exists()).toBe(false)
        expect(wrapper.text()).toContain("radionuclideMode.noData")
    })

    it("displays additional info message when helsinkiVantaa is true and has no data", async () => {
        wrapper.setData({
            isLoading: false,
            tablesData: [],
            helsinkiVantaa: true
        })
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain("radionuclideMode.noData")
        expect(wrapper.text()).toContain("radionuclideMode.info")
    })

    it("fetches data when feature changes", async () => {
        const mockFeature = { get: vi.fn().mockReturnValue("103428") }
        wrapper.setProps({ feature: mockFeature })
        wrapper.vm.fetchData = vi.fn()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.fetchData).toHaveBeenCalled()
    })

    it("sorts radionuclides by priority order", () => {
        wrapper.setData({
            tablesData: [
                { radionuclide: "Cs-137", entries: [] },
                { radionuclide: "Na-22", entries: [] },
                { radionuclide: "Pb-210", entries: [] },
                { radionuclide: "Be-7", entries: [] },
                { radionuclide: "Other", entries: [] }
            ]
        })
        const sorted = wrapper.vm.sortedTablesData
        expect(sorted.map(data => data.radionuclide)).toEqual([
            "Be-7", "Cs-137", "Pb-210", "Na-22", "Other"
        ])
    })

    it("removes duplicate entries", () => {
        const entries = [
            { s: "2024-07-29T00:00:00Z", e: "2024-07-30T00:00:00Z", c: 10, u: 5 },
            { s: "2024-07-29T00:00:00Z", e: "2024-07-30T00:00:00Z", c: 10, u: 5 },
            { s: "2024-07-30T00:00:00Z", e: "2024-07-31T00:00:00Z", c: 15, u: 7 }
        ]
        const uniqueEntries = wrapper.vm.removeDuplicates(entries)
        expect(uniqueEntries.length).toBe(2)
    })

    it("formats dates correctly according to settings", () => {
        const date = new Date("2024-07-29T00:00:00Z")
        expect(wrapper.vm.formatDates(date)).toBe("29.7.2024")
        wrapper.vm.$store.state.settings.settings.dateFormat = "iso"
        expect(wrapper.vm.formatDates(date)).toBe("2024-7-29")
    })

    it("identifies priority nuclides correctly", () => {
        expect(wrapper.vm.isPriorityNuclide("Cs-137")).toBe(true)
        expect(wrapper.vm.isPriorityNuclide("Other")).toBe(false)
    })
})
