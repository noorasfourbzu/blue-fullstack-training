import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CreatePostView from '../views/CreatePostView.vue'
import { usePostsStore } from '../stores/posts'

describe ('CreatePostView - validation',() =>{

    beforeEach(()=>{
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('blocks submission and shows field errors when the form is empty', async ()=>{
        const wrapper = mount(CreatePostView)
        const store = usePostsStore()
        const createPostSpy = vi.spyOn(store,'createPost')
        await wrapper.find('#create-post-form').trigger('submit')

        // error message for every empty field
         expect(wrapper.find('#title-error').text()).toBe('Title is required.')
    expect(wrapper.find('#body-error').text()).toBe('Body is required.')
    expect(wrapper.find('#userId-error').text()).toBe('User ID is required.')
    // overall form status flips to error
    expect(wrapper.find('#form-status').text()).toContain(
      'Please check the highlighted fields above'    )

    // and no attempt was made to actually create the post
    expect(createPostSpy).not.toHaveBeenCalled()


    })

  it('shows a specific error when the title is too short', async () => {
    const wrapper = mount(CreatePostView)

    const titleInput = wrapper.find('#title')
    await titleInput.setValue('Hi')
    await titleInput.trigger('blur')

    expect(wrapper.find('#title-error').text()).toBe(
      'Title must be at least 5 characters'
    )
  })



     it('does not show an error before the user has touched a field', () => {
    const wrapper = mount(CreatePostView)

    // component just mounted user hasnt typed or blurred anything yet
    expect(wrapper.find('#title-error').text()).toBe('')
    expect(wrapper.find('#body-error').text()).toBe('')
    expect(wrapper.find('#userId-error').text()).toBe('')
  })
})
