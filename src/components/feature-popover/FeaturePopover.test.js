import { describe, it, beforeEach, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FeaturePopover from './FeaturePopover.vue'
import eventBus from '@/utils/eventBus'
import Overlay from 'ol/Overlay'

describe('FeaturePopover.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(FeaturePopover);
        wrapper.vm.overlay = new Overlay({
            element: document.createElement('div'),
            position: undefined
        })
    })

    it('opens when a map feature is hovered', () => {
        wrapper.vm.overlay.setPosition(undefined)
        eventBus.$emit('featureHovered', {
            getGeometry: vi.fn().mockReturnValue({
                getCoordinates: vi.fn().mockReturnValue([0, 0])
            })
        })
        expect(wrapper.vm.overlay.getPosition()).not.toEqual(undefined)
    })

    it('closes when an empty map location is hovered', () => {
        wrapper.vm.overlay.setPosition([0, 0])
        eventBus.$emit('emptyMapLocationHovered')
        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    it('closes when the feature popup opens', () => {
        wrapper.vm.overlay.setPosition([0, 0])
        eventBus.$emit('featurePopupOpened')
        expect(wrapper.vm.overlay.getPosition()).toEqual(undefined)
    })

    it('is enabled when the feature popup closes', () => {
        wrapper.vm.disable()
        eventBus.$emit('featurePopupClosed')
        expect(wrapper.vm.isEnabled).toBe(true)
    })

    it('is disabled when the feature popup opens', () => {
        wrapper.vm.enable()
        eventBus.$emit('featurePopupOpened')
        expect(wrapper.vm.isEnabled).toBe(false)
    })
})
