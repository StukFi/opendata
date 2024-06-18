import { describe, it, beforeEach, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteName from './SiteName.vue'

describe('SiteName.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(SiteName)
    })

    it('renders a site name', async () => {
        const site = 'Helsinki'
        await wrapper.setProps({ feature: { get: () => site }})
        expect(wrapper.text()).toContain(site)
    })

    it('renders a dash if no feature prop is given', async () => {
        await wrapper.setProps({ feature: undefined })
        expect(wrapper.text()).toContain('-')
    })
})