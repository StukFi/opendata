import { shallowMount, createLocalVue, createWrapper } from "@vue/test-utils"
import FeaturePopup from "components/FeaturePopup.vue"

const localVue = createLocalVue()

describe("FeaturePopup.vue", () => {
    let wrapper
    let mockMapFeature = {
        getGeometry: jest.fn().mockReturnValue({
            getCoordinates: jest.fn().mockReturnValue([0, 0])
        })
    }

    beforeEach(() => {
        wrapper = shallowMount(FeaturePopup, { localVue })
    })

    test("opens when a map feature is clicked", () => {
        wrapper.vm.overlay.setPosition(undefined)
        wrapper.vm.getSiteData = jest.fn()

        wrapper.vm.$root.$emit("featureClicked", mockMapFeature)

        expect(wrapper.vm.overlay.getPosition()).not.toEqual(undefined)
    })

    test("opens when a map feature is selected via the search bar", () => {
        wrapper.vm.overlay.setPosition(undefined)
        wrapper.vm.getSiteData = jest.fn()

        wrapper.vm.$root.$emit("featureSelectedViaSearch", mockMapFeature)

        expect(wrapper.vm.overlay.getPosition()).not.toEqual(undefined)
    })

    test("closes when an empty map location is clicked", () => {
        wrapper.vm.overlay.setPosition([0, 0])

        wrapper.vm.$root.$emit("emptyMapLocationClicked")

        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    test("closes when the close button is clicked", () => {
        wrapper.vm.overlay.setPosition([0, 0])
        const closeButton = wrapper.find(".feature-popup__closer")

        closeButton.trigger("click")

        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    test("renders a site's name and dose rate", () => {
        wrapper.vm.site = "test"
        wrapper.vm.doseRate = "1.0"

        var site = wrapper.find(".feature-popup__site")
        var doseRate = wrapper.find(".feature-popup__dose-rate-value")

        expect(site.text()).toContain(wrapper.vm.site)
        expect(doseRate.text()).toContain(wrapper.vm.doseRate)
    })

    test("emits featurePopupOpened event when opened", () => {
        wrapper.vm.getSiteData = jest.fn()
        const rootWrapper = createWrapper(wrapper.vm.$root)

        wrapper.vm.open(mockMapFeature)

        expect(rootWrapper.emitted("featurePopupOpened")).toHaveLength(1)
    })

    test("emits centerViewOnFeaturePopup event when opened", () => {
        wrapper.vm.getSiteData = jest.fn()
        const rootWrapper = createWrapper(wrapper.vm.$root)

        wrapper.vm.open(mockMapFeature)

        expect(rootWrapper.emitted("centerViewOnFeaturePopup")).toHaveLength(1)
    })

    test("emits featurePopupClosed event when closed", () => {
        const rootWrapper = createWrapper(wrapper.vm.$root)

        wrapper.vm.close()

        expect(rootWrapper.emitted("featurePopupClosed")).toHaveLength(1)
    })
})
