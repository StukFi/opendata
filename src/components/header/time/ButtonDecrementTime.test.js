import { describe, it, beforeEach, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonDateTime from '@/components/header/ButtonDateTime.vue'
import ButtonDecrementTime from './ButtonDecrementTime.vue'

describe('ButtonDecrementTime', () => {
  let wrapper
  let mockStore

  beforeEach(() => {
    mockStore = {
      state: {
        isOldestTimeSelected: false
      },
      getters: {
        isOldestTimeSelected: false
      },
      dispatch: vi.fn()
    }

    wrapper = mount(ButtonDecrementTime, {
      global: {
        mocks: {
          $store: mockStore
        }
      }
    })
  })

  it('should have ButtonDateTime initially not disabled', () => {
    expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeFalsy
  })

  it('should call decrementTime method when ButtonDateTime is clicked', async () => {
    await wrapper.findComponent(ButtonDateTime).trigger('click')
    expect(mockStore.dispatch).toHaveBeenCalledWith('decrementTime')
  })

  it('should have ButtonDateTime disabled when isOldestTimeSelected is true', async () => {
    mockStore.getters.isOldestTimeSelected = true
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(ButtonDateTime).props().disabled).toBeTruthy
  })
})
