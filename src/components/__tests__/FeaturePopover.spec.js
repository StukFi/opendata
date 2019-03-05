import { shallowMount, createLocalVue } from "@vue/test-utils"
import FeaturePopover from "components/FeaturePopover.vue"

const localVue = createLocalVue()

describe("FeaturePopover.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(FeaturePopover, { localVue })
    })

    test("opens when a map feature is hovered", () => {
        wrapper.vm.overlay.setPosition(undefined)
        wrapper.vm.getSiteData = jest.fn()

        wrapper.vm.$root.$emit("featureHovered", {
            getGeometry: jest.fn().mockReturnValue({
                getCoordinates: jest.fn().mockReturnValue([0, 0])
            })
        })

        expect(wrapper.vm.overlay.getPosition()).not.toEqual(undefined)
    })

    test("closes when an empty map location is hovered", () => {
        wrapper.vm.overlay.setPosition([0, 0])

        wrapper.vm.$root.$emit("emptyMapLocationHovered")

        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    test("is closed and disabled when a feature popup opens", () => {
        wrapper.vm.isEnabled = true
        wrapper.vm.overlay.setPosition([0, 0])

        wrapper.vm.$root.$emit("featurePopupOpened")

        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
        expect(wrapper.vm.isEnabled).toBe(false)
    })

    test("is enabled when a feature popup closes", () => {
        wrapper.vm.isEnabled = false

        wrapper.vm.$root.$emit("featurePopupClosed")

        expect(wrapper.vm.isEnabled).toBe(true)
    })

    test("renders a site's name and dose rate", () => {
        wrapper.vm.site = "test"
        wrapper.vm.doseRate = "1.0"

        var site = wrapper.find(".feature-popover__site")
        var doseRate = wrapper.find(".feature-popover__dose-rate-value")

        expect(site.text()).toContain(wrapper.vm.site)
        expect(doseRate.text()).toContain(wrapper.vm.doseRate)
    })
})
