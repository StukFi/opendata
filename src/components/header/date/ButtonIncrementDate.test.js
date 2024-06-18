import { mount } from '@vue/test-utils'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import ButtonDateTime from '@/components/header/ButtonDateTime.vue'
import ButtonIncrementDate from './ButtonIncrementDate.vue'

describe('ButtonIncrementDate.vue', () => {
  let wrapper
  let mockStore

  function customMount(computed = {}) {
    return mount(ButtonIncrementDate, {
      global: {
        mocks: {
          $store: {
            ...mockStore,
            getters: {
              isNewestDateSelected: false
            }
          }
        }
      }
    })
  }

  beforeEach(() => {
    mockStore = {
      dispatch: vi.fn()
    }
    wrapper = customMount({ isNewestDateSelected: () => false })
  })

  it('is disabled when the last available date is selected', async () => {
    expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeFalsy
    wrapper = customMount({ isNewestDateSelected: () => true })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeTruthy
  })

  it('dispatches an action when it is clicked', async () => {
    await wrapper.find('button').trigger('click')
    expect(mockStore.dispatch).toHaveBeenCalledWith('incrementDate')
  })
})