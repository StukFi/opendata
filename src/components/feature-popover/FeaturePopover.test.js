import { shallowMount } from "@vue/test-utils"
import FeaturePopover from "./FeaturePopover.vue"

describe("FeaturePopover.vue", () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(FeaturePopover)
    })

    it("opens when a map feature is hovered", () => {
        wrapper.vm.overlay.setPosition(undefined)
        wrapper.vm.$root.$emit("featureHovered", {
            getGeometry: jest.fn().mockReturnValue({
                getCoordinates: jest.fn().mockReturnValue([0, 0])
            })
        })
        expect(wrapper.vm.overlay.getPosition()).not.toEqual(undefined)
    })

    it("closes when an empty map location is hovered", () => {
        wrapper.vm.overlay.setPosition([0, 0])
        wrapper.vm.$root.$emit("emptyMapLocationHovered")
        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    it("closes when the feature popup opens", () => {
        wrapper.vm.overlay.setPosition([0, 0])
        wrapper.vm.$root.$emit("featurePopupOpened")
        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    it("is enabled when the feature popup closes", () => {
        wrapper.vm.disable()
        wrapper.vm.$root.$emit("featurePopupClosed")
        expect(wrapper.vm.isEnabled).toBe(true)
    })

    it("is disabled when the feature popup opens", () => {
        wrapper.vm.enable()
        wrapper.vm.$root.$emit("featurePopupOpened")
        expect(wrapper.vm.isEnabled).toBe(false)
    })
})
