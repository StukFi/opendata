import { mount } from '@vue/test-utils'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import TimepickerListItem from './TimepickerListItem.vue'

const mockStore = {
  commit: vi.fn(),
  state: {
    datetime: { selectedTime: '000000' },
    settings: { settings: { timeFormat: '24h' } }
  }
}

function customMount(overrides = {}) {
  return mount(TimepickerListItem, {
    global: {
      mocks: {
        $store: mockStore
      },
      ...overrides
    }
  })
}

describe('TimepickerListItem.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = customMount()
  })

  it('renders a time', async () => {
    await wrapper.setProps({ time: '000000' })
    expect(wrapper.text()).toContain('00:00')
  })

  it('is highlighted when it contains the currently selected time', async () => {
    const time = '120000'
    mockStore.state.datetime.selectedTime = time
    wrapper = customMount()

    await wrapper.setProps({ time: '000000' })
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).not.toContain('selected')

    await wrapper.setProps({ time })
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('selected')
  })

  it('commits a mutation when clicked', async () => {
    const time = '240000'
    await wrapper.setProps({ time })
    await wrapper.trigger('click')
    expect(mockStore.commit).toHaveBeenCalledWith('setTime', time)
  })

  it('emits a click event when clicked', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted().click).toHaveLength(1)
  })
})
