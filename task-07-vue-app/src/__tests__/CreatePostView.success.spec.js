import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CreatePostView from '../views/CreatePostView.vue'


import { createPost as createPostMock } from '../services/postsApi'

vi.mock('../services/postsApi', () => ({
  createPost: vi.fn(),
  getPosts: vi.fn(),
}))


describe ('CreatePostView - success path (mocked API)', () =>{


    beforeEach(() =>{
        setActivePinia(createPinia())
        localStorage.clear()
        createPostMock.mockReset()
    })

    it('submits valid data, calls the mocked API, and shows a success message', async()=>{
        createPostMock.mockResolvedValue({
            id: 101, 
            title: 'A Valid Title',
            body:'A sufficiently long body for validation to pass.'
            , userId: 1,

        })

 const wrapper = mount(CreatePostView)

    await wrapper.find('#title').setValue('A Valid Title')
    await wrapper.find('#body').setValue('A sufficiently long body for validation to pass.')
    await wrapper.find('#userId').setValue('1')

    await wrapper.find('#create-post-form').trigger('submit')
    // wait for the awaited createPost() promise inside handleSubmit to resolve
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()


 // the mocked service was called with the trimmed, correctly-typed payload
    expect(createPostMock).toHaveBeenCalledWith({
      title: 'A Valid Title',
      body: 'A sufficiently long body for validation to pass.',
      userId: 1,
    })

    // success UI is shown with the id returned by the (mocked) API
    expect(wrapper.find('#form-status').text()).toContain('Post created successfully')
    expect(wrapper.find('#form-status').text()).toContain('101')

    // form resets after a successful submission
    expect(wrapper.find('#title').element.value).toBe('')
    expect(wrapper.find('#body').element.value).toBe('')
    expect(wrapper.find('#userId').element.value).toBe('')
    })
})

