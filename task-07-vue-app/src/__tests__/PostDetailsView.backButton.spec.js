import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostDetailsView from '../views/PostDetailsView.vue'
import router from '../router'

// Fixed ** covers the bug: Favorites -> Read More -> Back used to always
// send the user to /posts. It should send them back to wherever they
// actually came from (Favorites in this case), and fall back to /posts
// when there is no known previous route.

function mockFetchPostOnce(post) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => post,
    })
  )
}

describe('PostDetailsView - back navigation target', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()
    // reset the router to a neutral starting point before each test so
    // "previousRouteName" reflects only the navigation this test performs
    await router.push('/')
    await router.isReady()
  })

  it('goes back to Favorites when the user navigated here from the Favorites page', async () => {
    // simulate: user is on /favorites, then opens a post's "Read More"
    await router.push('/favorites')
    mockFetchPostOnce({ id: 1, title: 'Post 1', body: 'Body 1' })
    await router.push('/posts/1')

    const wrapper = mount(PostDetailsView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    const backButton = wrapper.find('.back-to-posts')
    expect(backButton.text()).toContain('Back to Favorites')

    await backButton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/favorites')
  })

  it('falls back to Posts when the user did not come from Favorites', async () => {
    // simulate: user is on /posts (or landed directly via URL), then opens a post
    await router.push('/posts')
    mockFetchPostOnce({ id: 2, title: 'Post 2', body: 'Body 2' })
    await router.push('/posts/2')

    const wrapper = mount(PostDetailsView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    const backButton = wrapper.find('.back-to-posts')
    expect(backButton.text()).toContain('Back to Posts')

    await backButton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/posts')
  })
})