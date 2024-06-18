import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import InfoPanel from '@/components/info-panel/InfoPanel.vue'
import eventBus from '@/utils/eventBus'

describe('InfoPanel.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(InfoPanel, {
      global: {
        mocks: {
            $t: () => {}
        }
      }
    })
  })

  it('should open the info panel when event is emitted', async () => {
    eventBus.$emit('info-panel-open')
    await nextTick()

    expect(wrapper.vm.isEnabled).toBe(true)
    expect(wrapper.find('.info-panel').isVisible()).toBe(true)
  })

  it('should close the info panel when disable is called', async () => {
    eventBus.$emit('info-panel-open')
    await nextTick()

    wrapper.vm.disable()
    await nextTick()

    expect(wrapper.vm.isEnabled).toBe(false)
    expect(wrapper.find('.info-panel').isVisible()).toBe(false)
  })
})